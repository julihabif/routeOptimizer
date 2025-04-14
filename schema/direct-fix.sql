-- Script para solucionar problemas de RLS en Supabase

-- Asegurarse de que RLS está habilitado
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.users;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.users;
DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.users;
DROP POLICY IF EXISTS "El servicio puede gestionar todos los perfiles" ON public.users;

-- Crear políticas actualizadas
-- Política para permitir a los usuarios ver su propio perfil
CREATE POLICY "Los usuarios pueden ver su propio perfil" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- Política para permitir a los usuarios actualizar su propio perfil
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

-- Política para permitir a los usuarios insertar su propio perfil
CREATE POLICY "Los usuarios pueden insertar su propio perfil" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Política para permitir al servicio gestionar todos los perfiles
CREATE POLICY "El servicio puede gestionar todos los perfiles" 
ON public.users 
USING (true);

-- Crear una función para insertar usuarios directamente (opcional)
CREATE OR REPLACE FUNCTION insert_user_profile(
  user_id UUID,
  user_email TEXT,
  user_name TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (user_id, user_email, user_name, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

