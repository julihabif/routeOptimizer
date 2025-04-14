"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function SupabaseDebugPage() {
  const [urlStatus, setUrlStatus] = useState<string>("Verificando...")
  const [keyStatus, setKeyStatus] = useState<string>("Verificando...")
  const [connectionStatus, setConnectionStatus] = useState<string>("No probado")
  const [error, setError] = useState<string | null>(null)
  const [urlValue, setUrlValue] = useState<string>("")
  const [keyValue, setKeyValue] = useState<string>("")

  useEffect(() => {
    // Verificar la configuración de Supabase
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setUrlStatus(url ? "Configurada" : "No configurada")
    setKeyStatus(key ? `Configurada (longitud: ${key.length})` : "No configurada")

    if (url) {
      setUrlValue(url)
    }
    if (key) {
      // Solo mostrar los primeros y últimos caracteres por seguridad
      const maskedKey = key.length > 10 ? `${key.substring(0, 5)}...${key.substring(key.length - 5)}` : "***********"
      setKeyValue(maskedKey)
    }
  }, [])

  const testConnection = async () => {
    setConnectionStatus("Probando...")
    setError(null)

    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        throw new Error("No se pudo crear el cliente de Supabase")
      }

      // Intentar obtener la sesión actual
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      // Intentar una consulta simple a la base de datos
      const { error: queryError } = await supabase.from("users").select("count").limit(1)

      if (queryError) {
        setConnectionStatus("Parcial - Auth OK, DB Error")
        setError(`Error en la consulta a la base de datos: ${queryError.message}`)
        return
      }

      setConnectionStatus("Exitosa")
    } catch (err) {
      setConnectionStatus("Fallida")
      setError(`Error de conexión: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico de Supabase</CardTitle>
          <CardDescription>Verifica la configuración y conexión de Supabase en tu aplicación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">URL de Supabase:</span>
              <span className={urlStatus === "Configurada" ? "text-green-500" : "text-red-500"}>{urlStatus}</span>
            </div>
            {urlValue && (
              <Alert>
                <AlertDescription className="break-all">{urlValue}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between">
              <span className="font-medium">Clave API de Supabase:</span>
              <span className={keyStatus.includes("Configurada") ? "text-green-500" : "text-red-500"}>{keyStatus}</span>
            </div>
            {keyValue && (
              <Alert>
                <AlertDescription>{keyValue}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between">
              <span className="font-medium">Estado de la conexión:</span>
              <span
                className={
                  connectionStatus === "Exitosa"
                    ? "text-green-500"
                    : connectionStatus === "Fallida"
                      ? "text-red-500"
                      : connectionStatus === "Probando..."
                        ? "text-yellow-500"
                        : "text-gray-500"
                }
              >
                {connectionStatus}
              </span>
            </div>

            <Button onClick={testConnection} disabled={connectionStatus === "Probando..."}>
              Probar conexión
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {connectionStatus === "Exitosa" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">Conexión exitosa</AlertTitle>
                <AlertDescription className="text-green-600">
                  La conexión a Supabase se ha establecido correctamente.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Solución de problemas comunes</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Invalid API key</strong>: Verifica que la clave API no tenga espacios en blanco o caracteres no
                válidos.
              </li>
              <li>
                <strong>URL incorrecta</strong>: Asegúrate de que la URL de Supabase sea correcta y comience con
                https://.
              </li>
              <li>
                <strong>Variables de entorno</strong>: Verifica que las variables de entorno estén correctamente
                configuradas en tu archivo .env.local.
              </li>
              <li>
                <strong>Reinicio del servidor</strong>: A veces, reiniciar el servidor de desarrollo puede resolver
                problemas de carga de variables de entorno.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

