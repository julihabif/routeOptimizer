"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { CheckCircle, AlertTriangle, Shield, ShieldOff } from "lucide-react"
import { useRouter } from "next/navigation"

export function RlsStatusChecker() {
  const [isChecking, setIsChecking] = useState(false)
  const [rlsEnabled, setRlsEnabled] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const checkRlsStatus = async () => {
    setIsChecking(true)
    setError(null)

    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        throw new Error("No se pudo crear el cliente de Supabase")
      }

      // Verificar si RLS está habilitado para la tabla users
      const { data, error: queryError } = await supabase.rpc("exec_sql", {
        sql: `
          SELECT relrowsecurity 
          FROM pg_class 
          WHERE relname = 'users' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
        `,
      })

      if (queryError) {
        console.error("Error al verificar estado RLS:", queryError)
        throw new Error(`Error al verificar estado RLS: ${queryError.message}`)
      }

      // Interpretar el resultado
      if (data && data.length > 0) {
        setRlsEnabled(data[0].relrowsecurity)
      } else {
        setError("No se pudo determinar el estado de RLS")
      }
    } catch (error) {
      console.error("Error al verificar estado RLS:", error)
      setError(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsChecking(false)
    }
  }

  // Verificar automáticamente al montar el componente
  useEffect(() => {
    checkRlsStatus()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Estado de Row Level Security
        </CardTitle>
        <CardDescription>Verifica si RLS está habilitado para la tabla users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 border rounded-md">
          <span className="font-medium">RLS para tabla users</span>
          {isChecking ? (
            <span className="text-gray-500">Verificando...</span>
          ) : rlsEnabled === null ? (
            <span className="text-gray-500">Desconocido</span>
          ) : rlsEnabled ? (
            <div className="flex items-center text-green-500">
              <Shield className="h-4 w-4 mr-1" />
              <span>Habilitado</span>
            </div>
          ) : (
            <div className="flex items-center text-amber-500">
              <ShieldOff className="h-4 w-4 mr-1" />
              <span>Deshabilitado</span>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {rlsEnabled === false && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">RLS está deshabilitado</AlertTitle>
            <AlertDescription className="text-amber-700">
              <p>
                RLS está actualmente deshabilitado para la tabla users. Esto permite registrar usuarios sin
                restricciones, pero es recomendable habilitarlo después para mantener la seguridad de tu base de datos.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
                onClick={() => router.push("/disable-rls")}
              >
                Gestionar RLS
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {rlsEnabled === true && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">RLS está habilitado</AlertTitle>
            <AlertDescription className="text-green-700">
              <p>
                RLS está habilitado para la tabla users. Si tienes problemas para registrar usuarios, es posible que
                necesites configurar las políticas RLS correctamente o deshabilitarlo temporalmente.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                onClick={() => router.push("/disable-rls")}
              >
                Gestionar RLS
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkRlsStatus} disabled={isChecking} className="w-full">
          {isChecking ? "Verificando..." : "Verificar de nuevo"}
        </Button>
      </CardFooter>
    </Card>
  )
}

