"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, Map } from "lucide-react"

export function MapboxDiagnostics() {
  const [isChecking, setIsChecking] = useState(false)
  const [publicTokenStatus, setPublicTokenStatus] = useState<boolean | null>(null)
  const [mapboxGlStatus, setMapboxGlStatus] = useState<boolean | null>(null)
  const [browserSupport, setBrowserSupport] = useState<boolean | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const checkMapboxStatus = async () => {
    setIsChecking(true)
    setErrorMessage(null)

    try {
      // Verificar el token público
      const publicToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      setPublicTokenStatus(!!publicToken && publicToken.length > 0)

      // Verificar si mapbox-gl está disponible
      try {
        // Importar dinámicamente mapbox-gl
        const mapboxgl = await import("mapbox-gl")
        setMapboxGlStatus(true)

        // Verificar soporte del navegador
        if (typeof window !== "undefined") {
          setBrowserSupport(!mapboxgl.default.supported || mapboxgl.default.supported())
        }
      } catch (error) {
        console.error("Error al cargar mapbox-gl:", error)
        setMapboxGlStatus(false)
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
            <span className="font-medium">Token público de Mapbox:</span>
            {isChecking ? (
              <span className="text-gray-500">Verificando...</span>
            ) : publicTokenStatus === true ? (
              <div className="flex items-center text-green-500">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Configurado</span>
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <XCircle className="h-4 w-4 mr-1" />
                <span>No configurado</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Biblioteca mapbox-gl:</span>
            {isChecking ? (
              <span className="text-gray-500">Verificando...</span>
            ) : mapboxGlStatus === true ? (
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

          <div className="flex items-center justify-between">
            <span className="font-medium">Soporte del navegador:</span>
            {isChecking || browserSupport === null ? (
              <span className="text-gray-500">Verificando...</span>
            ) : browserSupport === true ? (
              <div className="flex items-center text-green-500">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Compatible</span>
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <XCircle className="h-4 w-4 mr-1" />
                <span>No compatible</span>
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

        {!publicTokenStatus && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Token de Mapbox no configurado</AlertTitle>
            <AlertDescription className="text-amber-700">
              <p className="mb-2">
                Para que los mapas funcionen, necesitas configurar la variable de entorno
                NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN.
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>
                  Crea una cuenta en{" "}
                  <a
                    href="https://www.mapbox.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Mapbox
                  </a>
                </li>
                <li>Obtén un token de acceso público</li>
                <li>Añade el token a tu archivo .env.local como NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</li>
                <li>Reinicia la aplicación</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        {!browserSupport && browserSupport !== null && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Navegador no compatible</AlertTitle>
            <AlertDescription className="text-amber-700">
              <p>
                Tu navegador no es compatible con Mapbox GL. Prueba con un navegador más reciente como Chrome, Firefox,
                Safari o Edge.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkMapboxStatus} disabled={isChecking} className="w-full">
          {isChecking ? "Verificando..." : "Verificar de nuevo"}
        </Button>
      </CardFooter>
    </Card>
  )
}

