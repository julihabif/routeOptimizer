"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { CheckCircle, Copy, AlertCircle, ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SetupRlsCorrectlyPage() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("policies")

  // SQL para configurar políticas RLS correctamente
  const policiesSQL = `
-- Asegurarse de que RLS está habilitado
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.users;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.users;
DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.users;
DROP POLICY IF EXISTS "El servicio puede gestionar todos los perfiles" ON public.users;
DROP POLICY IF EXISTS "Usuarios no autenticados pueden insertar perfiles" ON public.users;

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
WITH CHECK (true);
`.trim()

  // SQL para crear funciones de servicio
  const serviceSQL = `
-- Función con privilegios elevados para crear perfiles de usuario
-- Esta función usa SECURITY DEFINER para ejecutarse con los privilegios del creador
CREATE OR REPLACE FUNCTION public.create_user_profile_service(
  user_id UUID,
  user_email TEXT,
  user_name TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER -- Esto es crucial para eludir RLS
SET search_path = public
AS $$
BEGIN
  -- Insertar el usuario directamente, omitiendo las políticas RLS
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (
    user_id,
    user_email,
    COALESCE(user_name, split_part(user_email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
END;
$$;

-- Otorgar permisos para ejecutar esta función
GRANT EXECUTE ON FUNCTION public.create_user_profile_service TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_profile_service TO anon;
GRANT EXECUTE ON FUNCTION public.create_user_profile_service TO service_role;
`.trim()

  const executeSQL = async () => {
    setIsExecuting(true)
    setResult(null)

    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        throw new Error("No se pudo crear el cliente de Supabase")
      }

      // Ejecutar el SQL según la pestaña activa
      const sqlToExecute = activeTab === "policies" ? policiesSQL : serviceSQL

      // Intentar ejecutar el SQL usando la función exec_sql
      const { error } = await supabase.rpc("exec_sql", { sql: sqlToExecute })

      if (error) {
        console.error("Error al ejecutar SQL:", error)

        // Si el error es por falta de permisos, proporcionar instrucciones alternativas
        if (error.message.includes("permission denied") || error.message.includes("insufficient privilege")) {
          throw new Error(
            "No tienes permisos suficientes para ejecutar este comando. Por favor, usa el Panel de Supabase para ejecutar el SQL manualmente.",
          )
        }

        throw new Error(`Error al ejecutar SQL: ${error.message}`)
      }

      setResult({
        success: true,
        message:
          activeTab === "policies"
            ? "Políticas RLS configuradas correctamente. Ahora deberías poder registrarte sin problemas."
            : "Función de servicio creada correctamente. Ahora puedes usar esta función para crear perfiles de usuario sin restricciones de RLS.",
      })
    } catch (error) {
      console.error("Error al ejecutar SQL:", error)
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const copyToClipboard = () => {
    const textToCopy = activeTab === "policies" ? policiesSQL : serviceSQL
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Configuración Permanente de RLS</CardTitle>
          <CardDescription>
            Configura correctamente las políticas RLS y funciones de servicio para evitar problemas de registro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Solución permanente para problemas de RLS</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Esta configuración proporciona una solución permanente para los problemas de RLS, eliminando la
                necesidad de desactivar y activar RLS constantemente. Incluye políticas RLS correctas y funciones de
                servicio para manejar la creación de perfiles de usuario.
              </p>
            </AlertDescription>
          </Alert>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="policies">Políticas RLS</TabsTrigger>
              <TabsTrigger value="service">Funciones de Servicio</TabsTrigger>
            </TabsList>

            <TabsContent value="policies" className="space-y-4 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Políticas RLS Correctas</h3>
                <p>
                  Estas políticas permiten a los usuarios ver y actualizar su propio perfil, y también permiten a
                  usuarios no autenticados insertar perfiles durante el registro inicial.
                </p>

                <div className="relative">
                  <Textarea value={policiesSQL} readOnly className="font-mono text-xs h-[350px] resize-none" />
                  <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={copyToClipboard}>
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar SQL
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="service" className="space-y-4 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Funciones de Servicio</h3>
                <p>
                  Estas funciones permiten crear perfiles de usuario con privilegios elevados, omitiendo las
                  restricciones de RLS. Puedes usar estas funciones desde tu código para crear perfiles de usuario sin
                  preocuparte por las políticas de seguridad.
                </p>

                <div className="relative">
                  <Textarea value={serviceSQL} readOnly className="font-mono text-xs h-[350px] resize-none" />
                  <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={copyToClipboard}>
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar SQL
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className="mt-4">
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Éxito" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Instrucciones de Implementación</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Copia el SQL de la pestaña activa</li>
              <li>
                Ve al{" "}
                <a
                  href="https://app.supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Panel de Supabase
                </a>
              </li>
              <li>Selecciona tu proyecto</li>
              <li>Ve a la sección "SQL Editor" o "Editor SQL"</li>
              <li>Crea un nuevo script</li>
              <li>Pega y ejecuta el SQL</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={executeSQL} disabled={isExecuting}>
            {isExecuting ? "Ejecutando..." : "Ejecutar SQL"}
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/signup")}>
            Volver al Registro <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

