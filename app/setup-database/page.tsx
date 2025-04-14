"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { CheckCircle, XCircle, AlertTriangle, Database } from "lucide-react"

// Obtener el script SQL del archivo schema.sql
const schemaSQL = `
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
CREATE INDEX idx_saved_routes_user_id ON public.saved_routes(user_id);
CREATE INDEX idx_saved_locations_user_id ON public.saved_locations(user_id);
CREATE INDEX idx_custom_vehicles_user_id ON public.custom_vehicles(user_id);

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
`

export default function SetupDatabasePage() {
  const [isCreating, setIsCreating] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)
  const [tablesStatus, setTablesStatus] = useState<Record<string, boolean>>({
    users: false,
    saved_routes: false,
    saved_locations: false,
    custom_vehicles: false,
  })

  const checkTables = async () => {
    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        setMessage("No se pudo crear el cliente de Supabase")
        return
      }

      const tables = ["users", "saved_routes", "saved_locations", "custom_vehicles"]
      const newStatus: Record<string, boolean> = {}

      for (const table of tables) {
        const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })

        newStatus[table] = !error
      }

      setTablesStatus(newStatus)

      const allTablesExist = Object.values(newStatus).every((exists) => exists)
      if (allTablesExist) {
        setStatus("success")
        setMessage("Todas las tablas ya existen en la base de datos")
      } else {
        const missingTables = Object.entries(newStatus)
          .filter(([_, exists]) => !exists)
          .map(([table]) => table)
          .join(", ")

        setMessage(`Las siguientes tablas no existen: ${missingTables}`)
      }
    } catch (error) {
      console.error("Error al verificar tablas:", error)
      setMessage(`Error al verificar tablas: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const createTables = async () => {
    setIsCreating(true)
    setMessage(null)

    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        setStatus("error")
        setMessage("No se pudo crear el cliente de Supabase")
        setIsCreating(false)
        return
      }

      // Ejecutar el script SQL
      const { error } = await supabase.rpc("exec_sql", { sql: schemaSQL })

      if (error) {
        console.error("Error al crear tablas:", error)
        setStatus("error")
        setMessage(`Error al crear tablas: ${error.message}`)
      } else {
        setStatus("success")
        setMessage("Tablas creadas correctamente")

        // Verificar que las tablas se crearon
        await checkTables()
      }
    } catch (error) {
      console.error("Error al crear tablas:", error)
      setStatus("error")
      setMessage(`Error al crear tablas: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsCreating(false)
    }
  }

  // Verificar tablas al cargar la página
  useState(() => {
    checkTables()
  })

  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Configuración de la Base de Datos</h1>
        <p className="text-muted-foreground">Crea las tablas necesarias para la aplicación</p>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configuración de Tablas
          </CardTitle>
          <CardDescription>
            Verifica y crea las tablas necesarias para la aplicación en tu base de datos Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Estado de las Tablas</h3>
            <div className="space-y-2">
              {Object.entries(tablesStatus).map(([table, exists]) => (
                <div key={table} className="flex items-center justify-between p-2 border rounded-md">
                  <span className="font-medium">{table}</span>
                  {exists ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Existe</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      <span>No existe</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {message && (
            <Alert variant={status === "error" ? "destructive" : status === "success" ? "default" : "default"}>
              {status === "error" ? (
                <AlertTriangle className="h-4 w-4" />
              ) : status === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertTitle>{status === "error" ? "Error" : status === "success" ? "Éxito" : "Información"}</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Nota Importante</h3>
            <p className="text-sm text-muted-foreground">
              Este proceso creará las tablas necesarias en tu base de datos Supabase. Si las tablas ya existen, no se
              modificarán. Este script utiliza la función <code>CREATE TABLE IF NOT EXISTS</code> para evitar errores si
              las tablas ya existen.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={checkTables}>
            Verificar Tablas
          </Button>
          <Button onClick={createTables} disabled={isCreating || status === "success"}>
            {isCreating ? "Creando Tablas..." : "Crear Tablas"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

