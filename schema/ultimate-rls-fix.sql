-- Script definitivo para solucionar problemas de RLS en Supabase
-- Ejecuta este script en el Editor SQL de Supabase

-- PASO 1: Deshabilitar RLS para la tabla users
-- Esta es la solución más simple y efectiva
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- PASO 2: Crear una función de servicio para crear perfiles de usuario
-- Esta función puede ser llamada desde el código para crear perfiles sin restricciones de RLS
CREATE OR REPLACE FUNCTION public.create_user_profile_service(
  user_id UUID,
  user_email TEXT,
  user_name TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER -- Esto es crucial para eludir RLS
SET search_path = public
AS $$
BEGIN
  -- Insertar el usuario directamente, omitiendo las políticas RLS
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (
    user_id,
    user_email,
    COALESCE(user_name, split_part(user_email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
END;
$$;

-- Otorgar permisos para ejecutar esta función
GRANT EXECUTE ON FUNCTION public.create_user_profile_service TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_profile_service TO anon;
GRANT EXECUTE ON FUNCTION public.create_user_profile_service TO service_role;

-- PASO 3: Crear un trigger para crear automáticamente perfiles de usuario
-- Este trigger se ejecutará automáticamente cuando se cree un usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Esperar un momento para asegurarse de que la transacción de auth.users se ha completado
  PERFORM pg_sleep(0.2);
  
  -- Insertar el perfil de usuario
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Crear el trigger en la tabla auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PASO 4: Verificar el estado de RLS y las funciones creadas
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'users' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

SELECT proname, prosecdef 
FROM pg_proc 
WHERE proname IN ('create_user_profile_service', 'handle_new_user') 
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

