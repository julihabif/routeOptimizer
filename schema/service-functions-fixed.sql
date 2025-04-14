-- Función con privilegios elevados para crear perfiles de usuario
-- Esta función usa SECURITY DEFINER para ejecutarse con los privilegios del creador
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
  -- Verificar si el usuario existe en auth.users antes de insertar
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
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
  ELSE
    -- Esperar un momento y volver a intentar (para dar tiempo a que se complete la transacción de auth)
    PERFORM pg_sleep(0.5);
    IF EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
      INSERT INTO public.users (id, email, name, created_at, updated_at)
      VALUES (
        user_id,
        user_email,
        COALESCE(user_name, split_part(user_email, '@', 1)),
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END IF;
END;
$$;

-- Otorgar permisos para ejecutar esta función
GRANT EXECUTE ON FUNCTION public.create_user_profile_service TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_profile_service TO anon;
GRANT EXECUTE ON FUNCTION public.create_user_profile_service TO service_role;

-- Trigger para crear automáticamente perfiles de usuario cuando se registran
-- Este trigger se ejecuta DESPUÉS de que el usuario se haya creado completamente en auth.users
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

