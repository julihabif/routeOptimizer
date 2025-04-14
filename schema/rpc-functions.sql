-- Función para crear un perfil de usuario desde el servidor
-- Esta función puede ser llamada con la clave de servicio para eludir las restricciones RLS
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_name TEXT
) RETURNS void AS $$
BEGIN
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (user_id, user_email, user_name, now(), now());
EXCEPTION
  WHEN unique_violation THEN
    -- Si ya existe, no hacer nada
    NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

