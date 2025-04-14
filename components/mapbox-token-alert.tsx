"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import { isMapboxTokenConfigured } from "@/lib/api/mapbox-token"

export function MapboxTokenAlert() {
  const [isTokenMissing, setIsTokenMissing] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkToken = async () => {
      try {
        const isConfigured = await isMapboxTokenConfigured()
        setIsTokenMissing(!isConfigured)
      } catch (error) {
        console.error("Error al verificar el token de Mapbox:", error)
        setIsTokenMissing(true)
      } finally {
        setIsChecking(false)
      }
    }

    checkToken()
  }, [])

  if (isChecking || !isTokenMissing) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Falta el token de Mapbox</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          Para utilizar las funcionalidades de mapas y búsqueda de ubicaciones, necesitas configurar un token de acceso
          de Mapbox.
        </p>
        <ol className="list-decimal list-inside space-y-1 mb-2">
          <li>
            Crea una cuenta en{" "}
            <a
              href="https://www.mapbox.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 underline"
            >
              Mapbox
            </a>
          </li>
          <li>Genera un token de acceso público en tu panel de control</li>
          <li>
            Añade el token a tus variables de entorno como <code>MAPBOX_ACCESS_TOKEN</code> y{" "}
            <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code>
          </li>
        </ol>
        <div className="flex justify-end mt-2">
          <Button variant="outline" size="sm" className="bg-background/20" asChild>
            <a
              href="https://docs.mapbox.com/help/getting-started/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Más información
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}

