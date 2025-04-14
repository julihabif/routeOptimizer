-- Tablas para la aplicación de optimización de rutas

-- Tabla de usuarios (se integra con la autenticación de Supabase)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Crear políticas para users
CREATE POLICY "Los usuarios pueden ver su propio perfil" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

-- Tabla para rutas guardadas
CREATE TABLE IF NOT EXISTS public.saved_routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  route_data JSONB NOT NULL,
  vehicle_profile JSONB NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS para saved_routes
ALTER TABLE public.saved_routes ENABLE ROW LEVEL SECURITY;

-- Crear políticas para saved_routes
CREATE POLICY "Los usuarios pueden ver sus propias rutas" 
ON public.saved_routes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propias rutas" 
ON public.saved_routes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias rutas" 
ON public.saved_routes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias rutas" 
ON public.saved_routes FOR DELETE 
USING (auth.uid() = user_id);

-- Tabla para ubicaciones guardadas
CREATE TABLE IF NOT EXISTS public.saved_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  name TEXT NOT NULL,
  coordinates NUMERIC[] NOT NULL,
  address TEXT NOT NULL,
  location_type TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS para saved_locations
ALTER TABLE public.saved_locations ENABLE ROW LEVEL SECURITY;

-- Crear políticas para saved_locations
CREATE POLICY "Los usuarios pueden ver sus propias ubicaciones" 
ON public.saved_locations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propias ubicaciones" 
ON public.saved_locations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias ubicaciones" 
ON public.saved_locations FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias ubicaciones" 
ON public.saved_locations FOR DELETE 
USING (auth.uid() = user_id);

-- Tabla para vehículos personalizados
CREATE TABLE IF NOT EXISTS public.custom_vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  properties JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS para custom_vehicles
ALTER TABLE public.custom_vehicles ENABLE ROW LEVEL SECURITY;

-- Crear políticas para custom_vehicles
CREATE POLICY "Los usuarios pueden ver sus propios vehículos" 
ON public.custom_vehicles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propios vehículos" 
ON public.custom_vehicles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios vehículos" 
ON public.custom_vehicles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios vehículos" 
ON public.custom_vehicles FOR DELETE 
USING (auth.uid() = user_id);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_saved_routes_user_id ON public.saved_routes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_locations_user_id ON public.saved_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_vehicles_user_id ON public.custom_vehicles(user_id);

-- Trigger para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_saved_routes_updated_at
BEFORE UPDATE ON public.saved_routes
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_saved_locations_updated_at
BEFORE UPDATE ON public.saved_locations
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_custom_vehicles_updated_at
BEFORE UPDATE ON public.custom_vehicles
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

