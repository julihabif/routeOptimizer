"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Key } from "lucide-react"

export default function CheckEnvPage() {
  const [envVars, setEnvVars] = useState<{
    [key: string]: {
      value: string | null
      status: "valid" | "invalid" | "masked"
    }
  }>({
    NEXT_PUBLIC_SUPABASE_URL: { value: null, status: "invalid" },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: { value: null, status: "invalid" },
  })

  useEffect(() => {
    // Verificar variables de entorno
    const checkEnvVars = () => {
      const newEnvVars = { ...envVars }

      // Verificar URL de Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (supabaseUrl) {
        try {
          // Asegurarse de que la URL tenga el protocolo https://
          const url = supabaseUrl.startsWith("http") ? supabaseUrl : `https://${supabaseUrl}`
          new URL(url) // Esto lanzará un error si la URL no es válida
          newEnvVars.NEXT_PUBLIC_SUPABASE_URL = {
            value: supabaseUrl,
            status: "valid",
          }
        } catch (error) {
          newEnvVars.NEXT_PUBLIC_SUPABASE_URL = {
            value: supabaseUrl,
            status: "invalid",
          }
        }
      }

      // Verificar clave anónima
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (supabaseAnonKey) {
        // Mostrar solo los primeros y últimos 4 caracteres por seguridad
        const maskedKey =
          supabaseAnonKey.length > 8
            ? `${supabaseAnonKey.substring(0, 4)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 4)}`
            : "****"

        newEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY = {
          value: maskedKey,
          status: "masked",
        }
      }

      setEnvVars(newEnvVars)
    }

    checkEnvVars()
  }, [])

  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Verificación de Variables de Entorno</h1>
        <p className="text-muted-foreground">
          Comprueba que las variables de entorno necesarias estén configuradas correctamente
        </p>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Variables de Entorno
          </CardTitle>
          <CardDescription>
            Verifica que las variables de entorno necesarias para conectar con Supabase estén configuradas correctamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Estado de las Variables</h3>
            <div className="space-y-2">
              {Object.entries(envVars).map(([key, { value, status }]) => (
                <div key={key} className="flex flex-col p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{key}</span>
                    {status === "valid" ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Válida</span>
                      </div>
                    ) : status === "masked" ? (
                      <div className="flex items-center text-yellow-500">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span>Presente (valor oculto)</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <XCircle className="h-4 w-4 mr-1" />
                        <span>No configurada o inválida</span>
                      </div>
                    )}
                  </div>
                  {value && <div className="mt-1 text-sm text-muted-foreground break-all">{value}</div>}
                </div>
              ))}
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Información Importante</AlertTitle>
            <AlertDescription>
              Para que la aplicación funcione correctamente, necesitas configurar las variables de entorno
              NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY. Estas variables deben estar disponibles tanto en
              desarrollo como en producción.
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">¿Cómo configurar las variables de entorno?</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                1. Crea un archivo <code>.env.local</code> en la raíz de tu proyecto (si no existe).
              </p>
              <p>2. Añade las siguientes líneas al archivo:</p>
              <pre className="bg-background p-2 rounded-md overflow-x-auto">
                NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
                <br />
                NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
              </pre>
              <p>3. Reemplaza los valores con los de tu proyecto Supabase.</p>
              <p>4. Reinicia el servidor de desarrollo.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()} className="w-full">
            Verificar de Nuevo
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

