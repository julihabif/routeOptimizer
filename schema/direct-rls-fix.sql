-- Script para solucionar definitivamente el problema de RLS en Supabase
-- Ejecuta este script en el Editor SQL de Supabase

-- SOLUCIÓN 1: Deshabilitar RLS (más simple y efectiva)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- SOLUCIÓN 2: Si prefieres mantener RLS habilitado, descomenta y ejecuta lo siguiente:
/*
-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.users;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.users;
DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.users;
DROP POLICY IF EXISTS "El servicio puede gestionar todos los perfiles" ON public.users;
DROP POLICY IF EXISTS "Usuarios no autenticados pueden insertar perfiles" ON public.users;
DROP POLICY IF EXISTS "allow_all" ON public.users;

-- Crear política que permite todas las operaciones (más permisiva)
CREATE POLICY "allow_all" ON public.users USING (true) WITH CHECK (true);

-- Alternativamente, puedes crear políticas más específicas:
CREATE POLICY "Los usuarios pueden ver su propio perfil" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden insertar su propio perfil" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuarios no autenticados pueden insertar perfiles" 
ON public.users FOR INSERT 
WITH CHECK (true);
*/

-- Verificar el estado de RLS después de los cambios
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'users' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Verificar las políticas existentes
SELECT polname, polcmd, polpermissive
FROM pg_policy
WHERE polrelid = 'public.users'::regclass;

