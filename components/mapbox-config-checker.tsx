"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { checkServerMapboxToken } from "@/lib/actions/server-token-checker"

export function MapboxConfigChecker() {
  const [isChecking, setIsChecking] = useState(false)
  const [publicTokenStatus, setPublicTokenStatus] = useState<boolean | null>(null)
  const [serverTokenStatus, setServerTokenStatus] = useState<boolean | null>(null)

  const checkMapboxConfig = async () => {
    setIsChecking(true)
    try {
      // Verificar el token público directamente en el cliente
      // Esto es seguro porque es un token público destinado a ser usado en el cliente
      // Verificamos si el token está disponible en el cliente sin hacer referencia directa a la variable
      const hasPublicToken =
        typeof window !== "undefined" && (!!window.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || !!window.mapboxgl?.accessToken)

      setPublicTokenStatus(hasPublicToken)

      // Usar la acción del servidor para verificar SOLO el token del servidor
      const result = await checkServerMapboxToken()
      setServerTokenStatus(result.serverToken)
    } catch (error) {
      console.error("Error checking Mapbox configuration:", error)
      // En caso de error, asumimos que los tokens no están configurados
      setPublicTokenStatus(false)
      setServerTokenStatus(false)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkMapboxConfig()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Configuración de Mapbox</CardTitle>
        <CardDescription>
          Verifica si las variables de entorno de Mapbox están configuradas correctamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Token Público de Mapbox:</span>
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
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
            <span className="font-medium">Token de Servidor de Mapbox:</span>
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : serverTokenStatus === true ? (
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
        </div>

        <Button onClick={checkMapboxConfig} disabled={isChecking} variant="outline" size="sm" className="w-full">
          {isChecking ? "Verificando..." : "Verificar de nuevo"}
        </Button>
      </CardContent>
    </Card>
  )
}

