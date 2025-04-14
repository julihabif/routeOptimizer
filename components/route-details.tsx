"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, MapPin, RouteIcon } from "lucide-react"
import type { Route } from "@/types/route"
import { useEffect, useState } from "react"

interface RouteDetailsProps {
  route: Route
}

export function RouteDetails({ route }: RouteDetailsProps) {
  // Estado para almacenar la ruta con IDs únicos
  const [processedRoute, setProcessedRoute] = useState<Route | null>(null)

  // Procesar la ruta para asegurar IDs únicos
  useEffect(() => {
    // Función para asegurar IDs únicos en la ruta
    const ensureUniqueIds = (originalRoute: Route): Route => {
      // Crear un mapa para rastrear IDs ya vistos
      const seenIds = new Map<string, number>()

      // Función para obtener un ID único
      const getUniqueId = (location: { id: string; name: string }) => {
        if (!seenIds.has(location.id)) {
          seenIds.set(location.id, 1)
          return location.id
        } else {
          // Si el ID ya existe, añadir un sufijo único
          const count = seenIds.get(location.id)! + 1
          seenIds.set(location.id, count)
          return `${location.id}-${count}`
        }
      }

      // Crear copias con IDs únicos
      const uniqueStart = { ...originalRoute.start, id: getUniqueId(originalRoute.start) }
      const uniqueEnd = { ...originalRoute.end, id: getUniqueId(originalRoute.end) }
      const uniqueStops = originalRoute.stops.map((stop) => ({
        ...stop,
        id: getUniqueId(stop),
      }))

      // Devolver la ruta con IDs únicos
      return {
        ...originalRoute,
        start: uniqueStart,
        end: uniqueEnd,
        stops: uniqueStops,
      }
    }

    // Procesar la ruta
    setProcessedRoute(ensureUniqueIds(route))
  }, [route])

  // No renderizar hasta que la ruta esté procesada
  if (!processedRoute) {
    return <div className="p-8 text-center">Procesando detalles de la ruta...</div>
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes} min`
  }

  const formatDistance = (meters: number) => {
    const km = meters / 1000
    const miles = meters / 1609.34

    if (km >= 1) {
      return `${km.toFixed(1)} km (${miles.toFixed(1)} mi)`
    }
    return `${meters} m`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles de la Ruta</CardTitle>
        <CardDescription>Indicaciones paso a paso para tu ruta optimizada</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <Clock className="mr-1 h-3 w-3" />
              {formatDuration(processedRoute.duration)}
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <RouteIcon className="mr-1 h-3 w-3" />
              {formatDistance(processedRoute.distance)}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">{processedRoute.stops.length} paradas en orden óptimo</div>
        </div>

        <Separator />

        <div className="space-y-4">
          {/* Resumen del orden de la ruta */}
          <div className="rounded-lg bg-muted p-4">
            <h3 className="mb-2 font-medium">Orden optimizado de la ruta:</h3>
            <div className="flex flex-wrap items-center gap-2">
              {/* Punto de inicio */}
              <Badge className="bg-[#3B82F6]">{processedRoute.start.name}</Badge>

              {/* Paradas intermedias */}
              {processedRoute.stops.map((stop, index) => (
                <div key={`${stop.id}-${index}`} className="flex items-center">
                  <span className="mx-1 text-muted-foreground">→</span>
                  <Badge className="bg-[#8B5CF6]">{stop.name}</Badge>
                </div>
              ))}

              {/* Punto final (solo si es diferente de la última parada) */}
              {processedRoute.end.name !== processedRoute.stops[processedRoute.stops.length - 1]?.name && (
                <>
                  <span className="mx-1 text-muted-foreground">→</span>
                  <Badge className="bg-[#10B981]">{processedRoute.end.name}</Badge>
                </>
              )}
            </div>
          </div>

          {/* Punto de inicio */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B82F6] text-white">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">{processedRoute.start.name}</div>
              <div className="text-sm text-muted-foreground">Punto de partida</div>
            </div>
          </div>

          {/* Pasos de la ruta */}
          <Accordion type="multiple" className="w-full">
            {processedRoute.steps.map((step, index) => (
              <AccordionItem key={`step-${index}`} value={`step-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      {index + 1}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{step.summary}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistance(step.distance)} · {formatDuration(step.duration)}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-9">
                    {step.instructions.map((instruction, idx) => (
                      <div key={`instruction-${index}-${idx}`} className="text-sm">
                        {instruction}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Punto final */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#10B981] text-white">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">{processedRoute.end.name}</div>
              <div className="text-sm text-muted-foreground">Destino final</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

