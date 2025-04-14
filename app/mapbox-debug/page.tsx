"use client"

import { MapboxDebugPanel } from "@/components/mapbox-debug-panel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function MapboxDebugPage() {
  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Diagnóstico de Mapbox</h1>
        <p className="text-muted-foreground">Utiliza esta página para diagnosticar y solucionar problemas con Mapbox</p>
      </div>

      <MapboxDebugPanel />

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Mapbox</CardTitle>
          <CardDescription>Instrucciones para configurar correctamente Mapbox en tu aplicación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription>
              Para que Mapbox funcione correctamente, necesitas obtener un token de acceso y configurarlo en tu
              aplicación.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pasos para configurar Mapbox:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Crea una cuenta en{" "}
                <a
                  href="https://account.mapbox.com/auth/signup/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Mapbox
                </a>{" "}
                si aún no tienes una
              </li>
              <li>
                Inicia sesión y ve a tu{" "}
                <a
                  href="https://account.mapbox.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  cuenta de Mapbox
                </a>
              </li>
              <li>Copia tu token de acceso público (comienza con "pk.")</li>
              <li>
                Crea un archivo <code>.env.local</code> en la raíz de tu proyecto si no existe
              </li>
              <li>
                Añade la siguiente línea al archivo:
                <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_token_de_mapbox
                </pre>
              </li>
              <li>Reemplaza "tu_token_de_mapbox" con el token que copiaste</li>
              <li>Reinicia la aplicación para que los cambios surtan efecto</li>
            </ol>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Solución de problemas comunes</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>
                <strong>Error "Cannot read properties of undefined (reading 'indoor')":</strong> Este error suele
                ocurrir cuando hay problemas con la inicialización o destrucción del mapa. Asegúrate de que el token de
                Mapbox esté configurado correctamente y que el contenedor del mapa tenga dimensiones válidas.
              </li>
              <li>
                <strong>Mapa en blanco:</strong> Verifica que tu token sea válido y que tengas conexión a Internet.
                También asegúrate de que tu navegador soporte WebGL.
              </li>
              <li>
                <strong>Error de CORS:</strong> Asegúrate de que estás utilizando un token público (que comienza con
                "pk.") y no un token secreto.
              </li>
            </ul>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Verificar de nuevo
            </Button>
            <Button variant="outline" asChild>
              <a href="https://docs.mapbox.com/mapbox-gl-js/guides/" target="_blank" rel="noopener noreferrer">
                Documentación de Mapbox <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button asChild>
          <Link href="/">Volver a la página principal</Link>
        </Button>
      </div>
    </div>
  )
}

