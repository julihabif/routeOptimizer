-- Asegurarse de que RLS está habilitado
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.users;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.users;
DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.users;
DROP POLICY IF EXISTS "El servicio puede gestionar todos los perfiles" ON public.users;

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

-- Política para permitir a usuarios no autenticados insertar perfiles
-- Esta es crucial para el registro inicial
CREATE POLICY "Usuarios no autenticados pueden insertar perfiles" 
ON public.users FOR INSERT 
WITH CHECK (auth.jwt() IS NULL);

-- Política para permitir al servicio gestionar todos los perfiles
CREATE POLICY "El servicio puede gestionar todos los perfiles" 
ON public.users USING (
  (SELECT current_setting('role', true) = 'service_role')
);

