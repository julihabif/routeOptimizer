-- Políticas de seguridad para la tabla users

-- Asegurarse de que RLS está habilitado
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.users;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.users;
DROP POLICY IF EXISTS "Los usuarios autenticados pueden insertar su propio perfil" ON public.users;
DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.users;

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
-- Esta es la política clave que faltaba
CREATE POLICY "Los usuarios pueden insertar su propio perfil" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Política para permitir al servicio insertar perfiles (usando service_role)
CREATE POLICY "El servicio puede gestionar todos los perfiles" 
ON public.users 
USING (true);

