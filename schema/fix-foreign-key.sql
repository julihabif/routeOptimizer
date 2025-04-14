-- Verificar la estructura actual de la tabla users
SELECT 
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
JOIN pg_class t ON t.oid = c.conrelid
WHERE t.relname = 'users' AND n.nspname = 'public';

-- Eliminar la restricción de clave foránea existente
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Recrear la restricción de clave foránea con la opción DEFERRABLE INITIALLY DEFERRED
-- Esto permite que la restricción se verifique al final de la transacción, no inmediatamente
ALTER TABLE public.users 
ADD CONSTRAINT users_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) 
DEFERRABLE INITIALLY DEFERRED;

-- Verificar que la restricción se ha creado correctamente
SELECT 
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
JOIN pg_class t ON t.oid = c.conrelid
WHERE t.relname = 'users' AND n.nspname = 'public';

