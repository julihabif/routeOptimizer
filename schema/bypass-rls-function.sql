-- Función para crear un perfil de usuario con privilegios elevados
-- Esta función usa SECURITY DEFINER para ejecutarse con los privilegios del creador (no del llamador)
CREATE OR REPLACE FUNCTION public.create_user_profile_bypass_rls(
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
GRANT EXECUTE ON FUNCTION public.create_user_profile_bypass_rls TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_profile_bypass_rls TO anon;
GRANT EXECUTE ON FUNCTION public.create_user_profile_bypass_rls TO service_role;

