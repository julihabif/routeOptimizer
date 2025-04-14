"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertTriangle, Database, Copy, ExternalLink } from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase"

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
`

export default function SetupDatabaseManualPage() {
  const [isChecking, setIsChecking] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)
  const [tablesStatus, setTablesStatus] = useState<Record<string, boolean>>({
    users: false,
    saved_routes: false,
    saved_locations: false,
    custom_vehicles: false,
  })
  const [activeTab, setActiveTab] = useState("check")
  const [copied, setCopied] = useState(false)

  const checkTables = async () => {
    setIsChecking(true)
    setMessage(null)
    setStatus("idle")

    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        setStatus("error")
        setMessage("No se pudo crear el cliente de Supabase. Verifica tus variables de entorno.")
        setIsChecking(false)
        return
      }

      const tables = ["users", "saved_routes", "saved_locations", "custom_vehicles"]
      const newStatus: Record<string, boolean> = {}

      for (const table of tables) {
        try {
          console.log(`Verificando tabla ${table}...`)
          // Usar una consulta más simple y directa
          const { data, error } = await supabase.from(table).select("*", { count: "exact", head: true }).limit(1)

          if (error) {
            console.error(`Error al verificar tabla ${table}:`, error)
            newStatus[table] = false
          } else {
            console.log(`Tabla ${table} verificada correctamente`)
            newStatus[table] = true
          }
        } catch (error) {
          console.error(`Error al verificar tabla ${table}:`, error)
          newStatus[table] = false
        }
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

        setStatus("error")
        setMessage(
          `Las siguientes tablas no existen: ${missingTables}. Usa la pestaña "Script SQL" para crearlas manualmente.`,
        )
      }
    } catch (error) {
      console.error("Error al verificar tablas:", error)
      setStatus("error")
      setMessage(`Error al verificar tablas: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsChecking(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(schemaSQL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Configuración Manual de la Base de Datos</h1>
        <p className="text-muted-foreground">
          Verifica y configura manualmente las tablas necesarias para la aplicación
        </p>
      </div>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configuración de Tablas
          </CardTitle>
          <CardDescription>
            Verifica el estado de las tablas y obtén el script SQL para crearlas manualmente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="check">Verificar Tablas</TabsTrigger>
              <TabsTrigger value="script">Script SQL</TabsTrigger>
            </TabsList>

            <TabsContent value="check" className="space-y-4 pt-4">
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
                  <AlertTitle>
                    {status === "error" ? "Error" : status === "success" ? "Éxito" : "Información"}
                  </AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <Button onClick={checkTables} disabled={isChecking} className="w-full">
                {isChecking ? "Verificando..." : "Verificar Tablas"}
              </Button>
            </TabsContent>

            <TabsContent value="script" className="space-y-4 pt-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Instrucciones</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">
                    Copia el siguiente script SQL y ejecútalo en el Editor SQL de Supabase para crear las tablas
                    necesarias.
                  </p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Copia el script SQL haciendo clic en el botón "Copiar Script"</li>
                    <li>
                      Accede al{" "}
                      <a
                        href="https://app.supabase.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        Panel de Control de Supabase
                      </a>
                    </li>
                    <li>Selecciona tu proyecto</li>
                    <li>Ve a la sección "SQL Editor" o "Editor SQL"</li>
                    <li>Crea un nuevo script</li>
                    <li>Pega el script SQL</li>
                    <li>Ejecuta el script</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="relative">
                <Textarea value={schemaSQL} readOnly className="font-mono text-xs h-[300px] resize-none" />
                <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copiar Script
                    </>
                  )}
                </Button>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("check")}>
                  Volver a Verificar
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => window.open("https://app.supabase.com", "_blank")}
                >
                  Abrir Supabase
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

