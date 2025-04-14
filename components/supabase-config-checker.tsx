"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Database, AlertCircle } from "lucide-react"
import { getBrowserClient } from "@/lib/supabase/client"

export function SupabaseConfigChecker() {
  const [isChecking, setIsChecking] = useState(false)
  const [urlStatus, setUrlStatus] = useState<"unchecked" | "valid" | "invalid">("unchecked")
  const [keyStatus, setKeyStatus] = useState<"unchecked" | "valid" | "invalid">("unchecked")
  const [connectionStatus, setConnectionStatus] = useState<"unchecked" | "success" | "error">("unchecked")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [supabaseUrl, setSupabaseUrl] = useState<string | null>(null)
  const [supabaseKey, setSupabaseKey] = useState<string | null>(null)
  const [dbStatus, setDbStatus] = useState<"unchecked" | "success" | "error">("unchecked")

  const checkSupabaseConfig = async () => {
    setIsChecking(true)
    setErrorMessage(null)

    try {
      // Verificar URL
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      setSupabaseUrl(url || null)

      if (!url) {
        setUrlStatus("invalid")
        setErrorMessage("La URL de Supabase no está definida en las variables de entorno")
        setIsChecking(false)
        return
      }

      try {
        new URL(url.startsWith("http") ? url : `https://${url}`)
        setUrlStatus("valid")
      } catch (error) {
        setUrlStatus("invalid")
        setErrorMessage(`URL inválida: ${url}`)
        setIsChecking(false)
        return
      }

      // Verificar clave
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!key) {
        setKeyStatus("invalid")
        setErrorMessage("La clave anónima de Supabase no está definida en las variables de entorno")
        setIsChecking(false)
        return
      }

      // Verificar formato de la clave y mostrar versión enmascarada
      if (key.length < 20) {
        setKeyStatus("invalid")
        setErrorMessage(`La clave API parece ser demasiado corta: ${key.length} caracteres`)
        setIsChecking(false)
        return
      }
      setSupabaseKey(`${key.substring(0, 3)}...${key.substring(key.length - 3)}`)
      setKeyStatus("valid")

      // Intentar crear el cliente y hacer una consulta simple
      try {
        const supabase = getBrowserClient()
        if (!supabase) {
          setConnectionStatus("error")
          setErrorMessage("No se pudo crear el cliente de Supabase")
          setIsChecking(false)
          return
        }

        // Verificar autenticación
        const { error: authError } = await supabase.auth.getSession()
        if (authError) {
          console.error("Error al verificar la sesión:", authError)
          setConnectionStatus("error")
          setErrorMessage(`Error de autenticación: ${authError.message}`)
          return
        }
        setConnectionStatus("success")

        // Verificar acceso a la base de datos
        const { error: dbError } = await supabase.from("users").select("count", { count: "exact", head: true })
        if (dbError) {
          console.error("Error al verificar la base de datos:", dbError)
          setDbStatus("error")
          setErrorMessage(`Error de base de datos: ${dbError.message}`)
        } else {
          setDbStatus("success")
        }
      } catch (e) {
        console.error("Error inesperado al verificar la conexión:", e)
        setConnectionStatus("error")
        setErrorMessage(`Error inesperado: ${e instanceof Error ? e.message : String(e)}`)
      }
    } catch (error) {
      setConnectionStatus("error")
      setErrorMessage(`Error inesperado: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkSupabaseConfig()
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Diagnóstico de Supabase
        </CardTitle>
        <CardDescription>Verifica la configuración y conexión con Supabase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">URL de Supabase:</span>
            {urlStatus === "valid" ? (
              <div className="flex items-center text-green-500">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Válida</span>
              </div>
            ) : urlStatus === "invalid" ? (
              <div className="flex items-center text-red-500">
                <XCircle className="h-4 w-4 mr-1" />
                <span>Inválida</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Verificando...</span>
            )}
          </div>
          {supabaseUrl && <div className="text-sm text-muted-foreground break-all">{supabaseUrl}</div>}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Clave API:</span>
          {keyStatus === "valid" ? (
            <div className="flex items-center text-green-500">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Válida {supabaseKey && `(${supabaseKey})`}</span>
            </div>
          ) : keyStatus === "invalid" ? (
            <div className="flex items-center text-red-500">
              <XCircle className="h-4 w-4 mr-1" />
              <span>Inválida</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Verificando...</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Autenticación:</span>
          {connectionStatus === "success" ? (
            <div className="flex items-center text-green-500">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Conectado</span>
            </div>
          ) : connectionStatus === "error" ? (
            <div className="flex items-center text-red-500">
              <XCircle className="h-4 w-4 mr-1" />
              <span>Error</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Verificando...</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Base de datos:</span>
          {dbStatus === "success" ? (
            <div className="flex items-center text-green-500">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Accesible</span>
            </div>
          ) : dbStatus === "error" ? (
            <div className="flex items-center text-red-500">
              <XCircle className="h-4 w-4 mr-1" />
              <span>Error</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Verificando...</span>
          )}
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="bg-muted p-4 rounded-md">
          <h3 className="text-sm font-medium mb-2">Solución de problemas</h3>
          <p className="text-sm text-muted-foreground">
            Si estás experimentando problemas con la conexión a Supabase, verifica lo siguiente:
          </p>
          <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside space-y-1">
            <li>
              Asegúrate de que las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY estén
              configuradas correctamente en tu archivo .env.local
            </li>
            <li>Verifica que la clave API sea la correcta (clave anónima, no la clave de servicio)</li>
            <li>Comprueba que la URL de Supabase sea válida y accesible</li>
            <li>Asegúrate de que el proyecto de Supabase esté activo y funcionando</li>
            <li>Verifica que las políticas de RLS (Row Level Security) estén configuradas correctamente</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={checkSupabaseConfig} disabled={isChecking} className="w-full">
          {isChecking ? "Verificando..." : "Verificar configuración"}
        </Button>
      </CardFooter>
    </Card>
  )
}

