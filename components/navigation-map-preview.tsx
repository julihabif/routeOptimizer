"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { cn } from "@/lib/utils"
import type { Route } from "@/types/route"
import { Navigation } from "lucide-react"

// Importar la función para obtener el token
import { getMapboxToken } from "@/lib/api/mapbox-token"

interface NavigationMapPreviewProps {
  route: Route
  currentStepIndex: number
  currentInstructionIndex: number
  className?: string
}

export function NavigationMapPreview({
  route,
  currentStepIndex,
  currentInstructionIndex,
  className,
}: NavigationMapPreviewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const currentPositionMarker = useRef<mapboxgl.Marker | null>(null)
  const routeSource = useRef<string | null>(null)
  const [mapboxToken, setMapboxToken] = useState<string>("")

  // Obtener el token de Mapbox al cargar el componente
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getMapboxToken()
        setMapboxToken(token)
        mapboxgl.accessToken = token
      } catch (error) {
        console.error("Error al obtener el token de Mapbox:", error)
        setError("Error al obtener el token de Mapbox. Las funciones de mapas no funcionarán correctamente.")
      }
    }

    fetchToken()
  }, [])

  // Inicializar el mapa
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return

    // Limpiar el mapa anterior si existe
    if (map.current) {
      map.current.remove()
      map.current = null
    }

    try {
      // Inicializar el mapa
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: route.center,
        zoom: 14,
        attributionControl: false,
        interactive: false, // Desactivar interacción para que sea solo visualización
      })

      // Manejar errores
      map.current.on("error", (e) => {
        console.error("Error en el mapa de navegación:", e)
        setError(`Error al cargar el mapa: ${e.error?.message || "Error desconocido"}`)
        setIsLoading(false)
      })

      // Configurar el mapa cuando se cargue
      map.current.on("load", () => {
        if (!map.current) return
        setIsLoading(false)

        try {
          // Añadir la ruta completa como referencia (línea gris)
          if (route.geometry && route.geometry.coordinates.length > 0) {
            map.current.addSource("route-full", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: route.geometry,
              },
            })

            map.current.addLayer({
              id: "route-full",
              type: "line",
              source: "route-full",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#aaaaaa",
                "line-width": 3,
                "line-opacity": 0.5,
              },
            })

            // Añadir la fuente para el segmento actual (se actualizará dinámicamente)
            map.current.addSource("route-active", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: [],
                },
              },
            })

            map.current.addLayer({
              id: "route-active",
              type: "line",
              source: "route-active",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#3B82F6",
                "line-width": 5,
                "line-opacity": 0.8,
              },
            })

            routeSource.current = "route-active"

            // Añadir marcador de posición actual
            const el = document.createElement("div")
            el.className = "current-position-marker"

            currentPositionMarker.current = new mapboxgl.Marker({
              element: el,
              anchor: "center",
            })
              .setLngLat(route.geometry.coordinates[0])
              .addTo(map.current)
          }
        } catch (error) {
          console.error("Error al configurar el mapa de navegación:", error)
          setError(`Error al configurar el mapa: ${error instanceof Error ? error.message : "Error desconocido"}`)
        }
      })
    } catch (error) {
      console.error("Error al inicializar el mapa de navegación:", error)
      setError(`Error al inicializar el mapa: ${error instanceof Error ? error.message : "Error desconocido"}`)
      setIsLoading(false)
    }

    // Limpieza al desmontar
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [route, mapboxToken])

  // Actualizar la visualización del mapa cuando cambia el paso actual
  useEffect(() => {
    if (!map.current || !route.geometry || !routeSource.current) return

    try {
      // Calcular el índice aproximado en las coordenadas de la ruta basado en el progreso de la navegación
      const totalSteps = route.steps.reduce((total, step) => total + step.instructions.length, 0)
      const completedSteps =
        route.steps.slice(0, currentStepIndex).reduce((total, step) => total + step.instructions.length, 0) +
        currentInstructionIndex

      const progress = totalSteps > 0 ? completedSteps / totalSteps : 0
      const totalCoords = route.geometry.coordinates.length
      const currentCoordIndex = Math.min(Math.floor(progress * totalCoords), totalCoords - 1)

      // Obtener las coordenadas para el segmento activo (desde la posición actual hasta un poco más adelante)
      const lookAheadCount = Math.min(20, totalCoords - currentCoordIndex)
      const activeSegment = route.geometry.coordinates.slice(
        Math.max(0, currentCoordIndex - 5),
        currentCoordIndex + lookAheadCount,
      )

      // Actualizar la fuente de datos con el segmento activo
      if (activeSegment.length > 0) {
        ;(map.current.getSource(routeSource.current) as mapboxgl.GeoJSONSource).setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: activeSegment,
          },
        })

        // Actualizar la posición del marcador
        if (currentPositionMarker.current) {
          currentPositionMarker.current.setLngLat(activeSegment[0] as [number, number])
        }

        // Centrar el mapa en la posición actual con un poco de desplazamiento hacia adelante
        const centerIndex = Math.min(3, activeSegment.length - 1)
        map.current.easeTo({
          center: activeSegment[centerIndex] as [number, number],
          duration: 1000,
          zoom: 15,
        })
      }
    } catch (error) {
      console.error("Error al actualizar el mapa de navegación:", error)
    }
  }, [route, currentStepIndex, currentInstructionIndex])

  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 p-4">
          <div className="text-sm text-destructive text-center">
            <p>{error}</p>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full min-h-[200px]" />

      {/* Indicador de dirección */}
      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1.5 z-10">
        <Navigation className="h-4 w-4 text-primary" />
      </div>
    </div>
  )
}

