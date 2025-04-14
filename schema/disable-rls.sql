-- Script para deshabilitar RLS en la tabla users
-- Ejecuta este script en el Editor SQL de Supabase

-- Deshabilitar RLS en la tabla users
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Verificar que RLS está deshabilitado
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'users' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

