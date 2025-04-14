-- Función para verificar si un usuario existe en auth.users
CREATE OR REPLACE FUNCTION public.check_user_exists(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = user_id) INTO user_exists;
  RETURN user_exists;
END;
$$;

-- Otorgar permisos para ejecutar esta función
GRANT EXECUTE ON FUNCTION public.check_user_exists TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_exists TO anon;
GRANT EXECUTE ON FUNCTION public.check_user_exists TO service_role;

-- Función segura para crear perfiles de usuario que verifica la existencia previa
CREATE OR REPLACE FUNCTION public.create_user_profile_safe(
  user_id UUID,
  user_email TEXT,
  user_name TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
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
    RAISE EXCEPTION 'Usuario con ID % no existe en auth.users', user_id;
  END IF;
END;
$$;

-- Otorgar permisos para ejecutar esta función
GRANT EXECUTE ON FUNCTION public.create_user_profile_safe TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_profile_safe TO anon;
GRANT EXECUTE ON FUNCTION public.create_user_profile_safe TO service_role;

