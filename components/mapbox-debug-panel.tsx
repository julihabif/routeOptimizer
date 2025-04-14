"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, Map, Loader2 } from "lucide-react"

export function MapboxDebugPanel() {
  const [isChecking, setIsChecking] = useState(false)
  const [tokenStatus, setTokenStatus] = useState<"checking" | "valid" | "invalid" | "not-found">("checking")
  const [mapboxGlStatus, setMapboxGlStatus] = useState<"checking" | "available" | "unavailable">("checking")
  const [webglStatus, setWebglStatus] = useState<"checking" | "supported" | "unsupported" | "unknown">("checking")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [tokenValue, setTokenValue] = useState<string | null>(null)

  // Función para verificar el estado de Mapbox
  const checkMapboxStatus = async () => {
    setIsChecking(true)
    setErrorMessage(null)

    try {
      // 1. Verificar el token de Mapbox
      const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      setTokenValue(token || null)

      if (!token) {
        setTokenStatus("not-found")
      } else if (token.startsWith("pk.")) {
        setTokenStatus("valid")
      } else {
        setTokenStatus("invalid")
      }

      // 2. Verificar si mapbox-gl está disponible
      try {
        const mapboxgl = await import("mapbox-gl")
        setMapboxGlStatus("available")

        // 3. Verificar soporte de WebGL
        if (typeof window !== "undefined") {
          try {
            // Intentar crear un contexto WebGL
            const canvas = document.createElement("canvas")
            const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

            if (gl) {
              setWebglStatus("supported")
            } else {
              setWebglStatus("unsupported")
            }
          } catch (e) {
            console.error("Error al verificar WebGL:", e)
            setWebglStatus("unknown")
          }
        }
      } catch (error) {
        console.error("Error al cargar mapbox-gl:", error)
        setMapboxGlStatus("unavailable")
        setErrorMessage("No se pudo cargar la biblioteca mapbox-gl")
      }
    } catch (error) {
      console.error("Error al verificar estado de Mapbox:", error)
      setErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsChecking(false)
    }
  }

  // Verificar automáticamente al montar el componente
  useEffect(() => {
    checkMapboxStatus()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Estado de Mapbox
        </CardTitle>
        <CardDescription>Verifica la configuración y disponibilidad de Mapbox</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Token de Mapbox:</span>
            {tokenStatus === "checking" ? (
              <div className="flex items-center text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                <span>Verificando...</span>
              </div>
            ) : tokenStatus === "valid" ? (
              <div className="flex items-center text-green-500">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Válido</span>
              </div>
            ) : tokenStatus === "invalid" ? (
              <div className="flex items-center text-red-500">
                <XCircle className="h-4 w-4 mr-1" />
                <span>Inválido</span>
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <XCircle className="h-4 w-4 mr-1" />
                <span>No encontrado</span>
              </div>
            )}
          </div>

          {tokenValue && (
            <div className="text-sm text-muted-foreground break-all bg-muted p-2 rounded-md">
              {tokenValue.substring(0, 8)}...{tokenValue.substring(tokenValue.length - 8)}
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <span className="font-medium">Biblioteca mapbox-gl:</span>
            {mapboxGlStatus === "checking" ? (
              <div className="flex items-center text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                <span>Verificando...</span>
              </div>
            ) : mapboxGlStatus === "available" ? (
              <div className="flex items-center text-green-500">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Disponible</span>
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <XCircle className="h-4 w-4 mr-1" />
                <span>No disponible</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="font-medium">Soporte de WebGL:</span>
            {webglStatus === "checking" ? (
              <div className="flex items-center text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                <span>Verificando...</span>
              </div>
            ) : webglStatus === "supported" ? (
              <div className="flex items-center text-green-500">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Soportado</span>
              </div>
            ) : webglStatus === "unsupported" ? (
              <div className="flex items-center text-red-500">
                <XCircle className="h-4 w-4 mr-1" />
                <span>No soportado</span>
              </div>
            ) : (
              <div className="flex items-center text-yellow-500">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>Desconocido</span>
              </div>
            )}
          </div>
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {tokenStatus !== "valid" && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Token de Mapbox no configurado correctamente</AlertTitle>
            <AlertDescription className="text-amber-700">
              <p className="mb-2">
                Para que los mapas funcionen, necesitas configurar la variable de entorno
                NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN con un token válido que comience con "pk.".
              </p>
            </AlertDescription>
          </Alert>
        )}

        {webglStatus === "unsupported" && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">WebGL no soportado</AlertTitle>
            <AlertDescription className="text-amber-700">
              <p>
                Tu navegador no soporta WebGL, que es necesario para que Mapbox funcione. Intenta con un navegador más
                reciente como Chrome, Firefox, Safari o Edge.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkMapboxStatus} disabled={isChecking} className="w-full">
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            "Verificar de nuevo"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

