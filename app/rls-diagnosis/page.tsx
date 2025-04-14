"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { CheckCircle, Copy, AlertCircle, ArrowRight, ShieldOff } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RlsDiagnosisPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [rlsStatus, setRlsStatus] = useState<{ enabled: boolean; policies: any[] }>({ enabled: false, policies: [] })
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("diagnosis")
  const [executeResult, setExecuteResult] = useState<{ success: boolean; message: string } | null>(null)

  // SQL para verificar el estado de RLS
  const diagnosisSQL = `
-- Verificar si RLS está habilitado para la tabla users
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'users' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Verificar las políticas existentes para la tabla users
SELECT polname, polcmd, polpermissive, polroles, polqual, polwithcheck
FROM pg_policy
WHERE polrelid = 'public.users'::regclass;
`.trim()

  // SQL para solucionar el problema de RLS
  const fixRlsSQL = `
-- Deshabilitar RLS para la tabla users (solución inmediata)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Alternativamente, si prefieres mantener RLS habilitado, 
-- puedes crear una política que permita todas las operaciones
-- (descomenta las siguientes líneas)

/*
-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "allow_all" ON public.users;

-- Crear política que permite todas las operaciones
CREATE POLICY "allow_all" ON public.users USING (true) WITH CHECK (true);
*/
`.trim()

  // Función para verificar el estado de RLS
  const checkRlsStatus = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        throw new Error("No se pudo crear el cliente de Supabase")
      }

      // Verificar si RLS está habilitado
      const { data: rlsData, error: rlsError } = await supabase.rpc("exec_sql", {
        sql: "SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'users' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');",
      })

      if (rlsError) {
        console.error("Error al verificar RLS:", rlsError)
        throw new Error(`Error al verificar RLS: ${rlsError.message}`)
      }

      const rlsEnabled = rlsData && rlsData.length > 0 ? rlsData[0].relrowsecurity : false

      // Verificar políticas existentes
      const { data: policiesData, error: policiesError } = await supabase.rpc("exec_sql", {
        sql: "SELECT polname, polcmd, polpermissive FROM pg_policy WHERE polrelid = 'public.users'::regclass;",
      })

      if (policiesError) {
        console.error("Error al verificar políticas:", policiesError)
        throw new Error(`Error al verificar políticas: ${policiesError.message}`)
      }

      setRlsStatus({
        enabled: rlsEnabled,
        policies: policiesData || [],
      })
    } catch (error) {
      console.error("Error al verificar estado de RLS:", error)
      setError(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Ejecutar SQL para solucionar el problema
  const executeFixSQL = async () => {
    setIsLoading(true)
    setExecuteResult(null)

    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        throw new Error("No se pudo crear el cliente de Supabase")
      }

      // Ejecutar SQL para deshabilitar RLS
      const { error } = await supabase.rpc("exec_sql", { sql: "ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;" })

      if (error) {
        console.error("Error al ejecutar SQL:", error)
        throw new Error(`Error al ejecutar SQL: ${error.message}`)
      }

      setExecuteResult({
        success: true,
        message: "RLS deshabilitado correctamente. Ahora deberías poder registrarte sin problemas.",
      })

      // Actualizar el estado de RLS
      await checkRlsStatus()
    } catch (error) {
      console.error("Error al solucionar RLS:", error)
      setExecuteResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    const textToCopy = activeTab === "diagnosis" ? diagnosisSQL : fixRlsSQL
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Verificar el estado de RLS al cargar la página
  useEffect(() => {
    checkRlsStatus()
  }, [])

  return (
    <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Diagnóstico de Row Level Security (RLS)</CardTitle>
          <CardDescription>Verifica y soluciona problemas de RLS que impiden el registro de usuarios</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Problema detectado: Restricciones RLS</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                El error "new row violates row-level security policy for table users" ocurre porque las políticas de
                seguridad de Supabase (RLS) están impidiendo la creación de perfiles de usuario.
              </p>
              <p>Esta página te ayudará a diagnosticar y solucionar el problema directamente.</p>
            </AlertDescription>
          </Alert>

          {/* Estado actual de RLS */}
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">Estado actual de RLS</h3>
            {isLoading ? (
              <p>Verificando estado de RLS...</p>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">RLS habilitado:</span>
                  <span className={rlsStatus.enabled ? "text-red-500" : "text-green-500"}>
                    {rlsStatus.enabled ? "Sí (problema potencial)" : "No (correcto)"}
                  </span>
                </div>

                <div>
                  <span className="font-medium">Políticas existentes:</span>
                  {rlsStatus.policies.length === 0 ? (
                    <p className="mt-1 text-amber-600">
                      No hay políticas definidas. Esto puede causar problemas si RLS está habilitado.
                    </p>
                  ) : (
                    <ul className="mt-1 list-disc list-inside">
                      {rlsStatus.policies.map((policy: any, index: number) => (
                        <li key={index}>
                          {policy.polname} ({policy.polcmd})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-2">
                  <span className="font-medium">Diagnóstico:</span>
                  {rlsStatus.enabled && rlsStatus.policies.length === 0 ? (
                    <p className="mt-1 text-red-600">
                      RLS está habilitado pero no hay políticas definidas. Esto impide cualquier operación en la tabla.
                    </p>
                  ) : rlsStatus.enabled ? (
                    <p className="mt-1 text-amber-600">
                      RLS está habilitado. Verifica que las políticas permitan la inserción de nuevos usuarios.
                    </p>
                  ) : (
                    <p className="mt-1 text-green-600">
                      RLS está deshabilitado. No deberías tener problemas para registrarte.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="diagnosis">SQL de Diagnóstico</TabsTrigger>
              <TabsTrigger value="fix">SQL de Solución</TabsTrigger>
            </TabsList>

            <TabsContent value="diagnosis" className="space-y-4 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">SQL para diagnosticar RLS</h3>
                <p>
                  Este SQL te permite verificar el estado de RLS y las políticas existentes en la tabla users. Puedes
                  ejecutarlo en el Editor SQL de Supabase.
                </p>

                <div className="relative">
                  <Textarea value={diagnosisSQL} readOnly className="font-mono text-xs h-[200px] resize-none" />
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

            <TabsContent value="fix" className="space-y-4 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">SQL para solucionar RLS</h3>
                <p>
                  Este SQL deshabilita RLS para la tabla users, lo que permite el registro de usuarios sin
                  restricciones. También incluye una alternativa comentada para mantener RLS habilitado con una política
                  permisiva.
                </p>

                <div className="relative">
                  <Textarea value={fixRlsSQL} readOnly className="font-mono text-xs h-[200px] resize-none" />
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

          {executeResult && (
            <Alert variant={executeResult.success ? "default" : "destructive"} className="mt-4">
              {executeResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{executeResult.success ? "Éxito" : "Error"}</AlertTitle>
              <AlertDescription>{executeResult.message}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Instrucciones</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Si RLS está habilitado, puedes deshabilitarlo haciendo clic en el botón "Deshabilitar RLS"</li>
              <li>Si el botón no funciona, copia el SQL de la pestaña "SQL de Solución"</li>
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
              <li>Vuelve a la página de registro e intenta registrarte nuevamente</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={executeFixSQL}
            disabled={isLoading || !rlsStatus.enabled}
            variant={rlsStatus.enabled ? "destructive" : "outline"}
          >
            <ShieldOff className="mr-2 h-4 w-4" />
            {isLoading ? "Procesando..." : "Deshabilitar RLS"}
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/signup")}>
            Volver al Registro <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

