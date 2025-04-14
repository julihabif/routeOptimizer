"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { cn } from "@/lib/utils"
import type { Route } from "@/types/route"
import { Button } from "@/components/ui/button"
import { Expand, Minus, Plus, RefreshCw, Edit, Check, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TurnByTurnNavigation } from "./turn-by-turn-navigation"
import { Navigation } from "lucide-react"
import { getMapboxToken } from "@/lib/api/mapbox-token"

interface RouteMapProps {
  route: Route
  className?: string
  onRouteUpdate?: (updatedRoute: Route) => void
}

export function RouteMap({ route, className, onRouteUpdate }: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showNavigation, setShowNavigation] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const waypointMarkers = useRef<mapboxgl.Marker[]>([])
  const draggedRoute = useRef<GeoJSON.LineString | null>(null)
  const mapInitialized = useRef<boolean>(false)
  const [mapboxToken, setMapboxToken] = useState<string>("")

  // Obtener el token de Mapbox al cargar el componente
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getMapboxToken()
        setMapboxToken(token)

        if (token) {
          mapboxgl.accessToken = token
        } else {
          setMapError(
            "No se encontró el token de Mapbox. Por favor, configura NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN en tus variables de entorno.",
          )
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error al obtener el token de Mapbox:", error)
        setMapError("Error al obtener el token de Mapbox. Las funciones de mapas no funcionarán correctamente.")
        setIsLoading(false)
      }
    }

    fetchToken()
  }, [])

  // Función para inicializar el mapa
  const initializeMap = () => {
    if (!mapContainer.current) {
      console.error("Error: El contenedor del mapa no está disponible")
      setMapError("No se pudo inicializar el contenedor del mapa")
      setIsLoading(false)
      return
    }

    if (!mapboxgl.accessToken) {
      console.error("Error: Token de Mapbox no configurado")
      setMapError("Token de Mapbox no configurado correctamente")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setMapError(null)

    // Limpiar el mapa anterior si existe
    if (map.current) {
      try {
        map.current.remove()
      } catch (error) {
        console.error("Error al eliminar el mapa anterior:", error)
      }
      map.current = null
      mapInitialized.current = false
    }

    try {
      console.log("Inicializando mapa con ruta:", {
        start: route.start.name,
        stops: route.stops.map((s) => s.name),
        end: route.end.name,
      })

      // Inicializar mapa - el contenedor debe estar vacío
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: route.center,
        zoom: 12,
        attributionControl: true,
      })

      // Añadir controles de navegación
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

      // Manejar errores de carga del mapa
      map.current.on("error", (e) => {
        console.error("Error en el mapa:", e)
        setMapError(`Error al cargar el mapa: ${e.error?.message || "Error desconocido"}`)
        setIsLoading(false)
      })

      // Añadir marcadores y línea de ruta cuando el mapa se carga
      map.current.on("load", () => {
        if (!map.current) return

        mapInitialized.current = true
        setIsLoading(false)

        try {
          // Añadir marcador de inicio
          new mapboxgl.Marker({
            element: createMarkerElement("start-marker", "I"),
            anchor: "bottom",
            draggable: isEditing,
          })
            .setLngLat(route.start.coordinates)
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>Inicio:</strong> ${route.start.name}`))
            .addTo(map.current)

          // Añadir marcadores de paradas
          route.stops.forEach((stop, index) => {
            console.log(`Añadiendo marcador para parada ${index + 1}:`, stop.name)
            const marker = new mapboxgl.Marker({
              element: createMarkerElement("stop-marker", `${index + 1}`),
              anchor: "bottom",
              draggable: isEditing,
            })
              .setLngLat(stop.coordinates)
              .setPopup(new mapboxgl.Popup().setHTML(`<strong>Parada ${index + 1}:</strong> ${stop.name}`))
              .addTo(map.current!)

            if (isEditing) {
              waypointMarkers.current.push(marker)

              // Añadir evento de arrastre
              marker.on("dragend", () => handleWaypointDrag(index))
            }
          })

          // Añadir marcador de fin (solo si es diferente de la última parada)
          if (route.end.name !== route.stops[route.stops.length - 1]?.name) {
            new mapboxgl.Marker({
              element: createMarkerElement("end-marker", "F"),
              anchor: "bottom",
              draggable: isEditing,
            })
              .setLngLat(route.end.coordinates)
              .setPopup(new mapboxgl.Popup().setHTML(`<strong>Fin:</strong> ${route.end.name}`))
              .addTo(map.current)
          }

          // Obtener el valor de la variable CSS para el color de la ruta
          const routeColor =
            getComputedStyle(document.documentElement).getPropertyValue("--route-primary").trim() || "#3B82F6"

          // Añadir línea de ruta usando la geometría de la API de Directions si está disponible
          if (route.geometry && route.geometry.coordinates.length > 0) {
            console.log("Usando geometría de la API para la ruta")

            map.current.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: route.geometry,
              },
            })

            // Guardar la geometría original para edición
            draggedRoute.current = { ...route.geometry }

            // Añadir puntos de control para edición si está en modo edición
            if (isEditing && route.geometry.coordinates.length > 2) {
              // Añadir puntos de control cada cierta distancia a lo largo de la ruta
              const controlPoints = selectControlPoints(route.geometry.coordinates, 5)

              controlPoints.forEach((point, idx) => {
                const controlMarker = new mapboxgl.Marker({
                  element: createControlPointElement(),
                  anchor: "center",
                  draggable: true,
                })
                  .setLngLat(point as [number, number])
                  .addTo(map.current!)

                waypointMarkers.current.push(controlMarker)

                // Añadir evento de arrastre
                controlMarker.on("dragstart", () => setIsDragging(true))
                controlMarker.on("dragend", () => {
                  setIsDragging(false)
                  handleControlPointDrag(idx, controlMarker.getLngLat())
                })
              })
            }
          } else {
            // Fallback a líneas rectas si no hay geometría disponible
            console.log("Usando líneas rectas para la ruta (fallback)")

            // Crear un array con todas las coordenadas en el orden correcto
            const routeCoordinates = [route.start.coordinates, ...route.stops.map((stop) => stop.coordinates)]

            // Solo añadir el punto final si es diferente de la última parada
            if (route.end.name !== route.stops[route.stops.length - 1]?.name) {
              routeCoordinates.push(route.end.coordinates)
            }

            map.current.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: routeCoordinates,
                },
              },
            })

            // Guardar la geometría para edición
            draggedRoute.current = {
              type: "LineString",
              coordinates: routeCoordinates,
            }
          }

          // Añadir la capa de ruta
          map.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": routeColor,
              "line-width": 4,
              "line-opacity": 0.8,
            },
          })

          // Ajustar los límites para incluir toda la ruta
          try {
            const bounds = new mapboxgl.LngLatBounds()
            let hasValidBounds = false
            // Añadir todas las ubicaciones al bounds
            ;[route.start, ...route.stops].forEach((loc) => {
              if (isValidCoordinate(loc.coordinates)) {
                bounds.extend(loc.coordinates)
                hasValidBounds = true
              }
            })

            if (
              route.end.name !== route.stops[route.stops.length - 1]?.name &&
              isValidCoordinate(route.end.coordinates)
            ) {
              bounds.extend(route.end.coordinates)
              hasValidBounds = true
            }

            // Si hay geometría de ruta, incluir todos sus puntos
            if (route.geometry && route.geometry.coordinates.length > 0) {
              route.geometry.coordinates.forEach((coord) => {
                if (isValidCoordinate(coord as [number, number])) {
                  bounds.extend(coord as [number, number])
                  hasValidBounds = true
                }
              })
            }

            // Solo ajustar si tenemos límites válidos y el mapa tiene un tamaño adecuado
            if (
              hasValidBounds &&
              mapContainer.current &&
              mapContainer.current.offsetWidth > 0 &&
              mapContainer.current.offsetHeight > 0
            ) {
              map.current.fitBounds(bounds, {
                padding: 50,
                maxZoom: 15,
              })
            } else {
              console.log("No se pudo ajustar el mapa: límites inválidos o contenedor demasiado pequeño")
            }
          } catch (error) {
            console.error("Error al ajustar los límites del mapa:", error)
          }
        } catch (error) {
          console.error("Error al configurar el mapa:", error)
          setMapError(`Error al configurar el mapa: ${error instanceof Error ? error.message : "Error desconocido"}`)
        }
      })
    } catch (error) {
      console.error("Error al inicializar el mapa:", error)
      setMapError(`Error al inicializar el mapa: ${error instanceof Error ? error.message : "Error desconocido"}`)
      setIsLoading(false)
    }
  }

  // Función para validar coordenadas
  const isValidCoordinate = (coord: [number, number]): boolean => {
    return (
      Array.isArray(coord) &&
      coord.length === 2 &&
      !isNaN(coord[0]) &&
      !isNaN(coord[1]) &&
      Math.abs(coord[0]) <= 180 &&
      Math.abs(coord[1]) <= 90
    )
  }

  // Función para seleccionar puntos de control para la edición
  const selectControlPoints = (coordinates: [number, number][], count: number): [number, number][] => {
    if (coordinates.length <= 2 || count <= 0) return []

    const result: [number, number][] = []
    const step = Math.max(1, Math.floor(coordinates.length / (count + 1)))

    for (let i = step; i < coordinates.length - step; i += step) {
      result.push(coordinates[i])
    }

    return result
  }

  // Manejar el arrastre de un punto de control
  const handleControlPointDrag = (index: number, newPosition: mapboxgl.LngLat) => {
    if (!map.current || !draggedRoute.current || !onRouteUpdate) return

    // Actualizar la geometría de la ruta
    const newCoordinates = [...draggedRoute.current.coordinates]

    // Calcular el índice real en las coordenadas
    const step = Math.max(1, Math.floor(newCoordinates.length / 6))
    const realIndex = (index + 1) * step

    if (realIndex >= 0 && realIndex < newCoordinates.length) {
      newCoordinates[realIndex] = [newPosition.lng, newPosition.lat]

      // Actualizar la fuente de datos del mapa
      ;(map.current.getSource("route") as mapboxgl.GeoJSONSource).setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: newCoordinates,
        },
      })

      // Actualizar la referencia de la ruta arrastrada
      draggedRoute.current.coordinates = newCoordinates

      // Notificar el cambio
      const updatedRoute = { ...route }
      updatedRoute.geometry = {
        type: "LineString",
        coordinates: newCoordinates,
      }
      onRouteUpdate(updatedRoute)
    }
  }

  // Manejar el arrastre de un punto de parada
  const handleWaypointDrag = (index: number) => {
    if (!map.current || !onRouteUpdate || waypointMarkers.current.length <= index) return

    const marker = waypointMarkers.current[index]
    const newPosition = marker.getLngLat()

    // Actualizar la parada en la ruta
    const updatedStops = [...route.stops]
    updatedStops[index] = {
      ...updatedStops[index],
      coordinates: [newPosition.lng, newPosition.lat],
    }

    // Notificar el cambio
    const updatedRoute = {
      ...route,
      stops: updatedStops,
    }
    onRouteUpdate(updatedRoute)
  }

  // Inicializar el mapa cuando el componente se monta o la ruta cambia
  useEffect(() => {
    // Limpiar los marcadores de puntos de control
    waypointMarkers.current = []

    // Esperar un momento para asegurarse de que el contenedor tenga dimensiones
    const timer = setTimeout(() => {
      if (mapboxToken) {
        initializeMap()
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      // Limpiar el mapa de forma segura al desmontar el componente
      if (map.current && mapInitialized.current) {
        try {
          map.current.remove()
          map.current = null
          mapInitialized.current = false
        } catch (error) {
          console.error("Error al eliminar el mapa:", error)
        }
      }
    }
  }, [route, isEditing, mapboxToken])

  const createMarkerElement = (className: string, number?: string) => {
    const el = document.createElement("div")
    el.className = `location-marker ${className}`

    if (number) {
      el.innerHTML = `<span class="marker-number">${number}</span>`
    }

    return el
  }

  const createControlPointElement = () => {
    const el = document.createElement("div")
    el.className = "control-point-marker"
    return el
  }

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut()
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    // Necesitamos redimensionar el mapa después de que cambie el tamaño del contenedor
    setTimeout(() => {
      if (map.current) {
        map.current.resize()
      }
    }, 100)
  }

  const handleRefresh = () => {
    initializeMap()
  }

  const toggleEditing = () => {
    setIsEditing(!isEditing)
  }

  const toggleNavigation = () => {
    setShowNavigation(!showNavigation)
  }

  return (
    <div className={cn("relative", isFullscreen && "fixed inset-0 z-50 bg-background p-6", className)}>
      {mapError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error del mapa</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{mapError}</span>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Indicador de carga fuera del contenedor del mapa */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Cargando mapa...</p>
          </div>
        </div>
      )}

      {/* Contenedor del mapa - debe estar vacío para Mapbox */}
      <div
        ref={mapContainer}
        className={cn(
          "h-full w-full rounded-lg border",
          isFullscreen && "h-[calc(100%-40px)]",
          isDragging && "cursor-grabbing",
        )}
        style={{ minHeight: "500px" }}
      />

      <div className="absolute right-4 top-4 flex flex-col gap-2 z-20">
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomIn}
          className="h-8 w-8 rounded-full bg-background/90 backdrop-blur"
          disabled={isLoading || !!mapError}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomOut}
          className="h-8 w-8 rounded-full bg-background/90 backdrop-blur"
          disabled={isLoading || !!mapError}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleFullscreen}
          className="h-8 w-8 rounded-full bg-background/90 backdrop-blur"
          disabled={isLoading || !!mapError}
        >
          <Expand className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleRefresh}
          className="h-8 w-8 rounded-full bg-background/90 backdrop-blur"
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant={isEditing ? "default" : "secondary"}
          size="icon"
          onClick={toggleEditing}
          className="h-8 w-8 rounded-full bg-background/90 backdrop-blur"
          disabled={isLoading || !!mapError}
          title={isEditing ? "Guardar cambios" : "Editar ruta"}
        >
          {isEditing ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
        </Button>
      </div>

      {/* Botón de navegación paso a paso */}
      <div className="absolute left-4 bottom-4 z-20">
        <Button
          variant="default"
          onClick={toggleNavigation}
          className="bg-background/90 backdrop-blur"
          disabled={isLoading || !!mapError}
        >
          <Navigation className="mr-2 h-4 w-4" />
          {showNavigation ? "Ocultar navegación" : "Navegación paso a paso"}
        </Button>
      </div>

      {/* Panel de navegación paso a paso */}
      {showNavigation && (
        <div className="absolute left-0 right-0 bottom-16 z-20 px-4">
          <TurnByTurnNavigation route={route} onClose={() => setShowNavigation(false)} />
        </div>
      )}
    </div>
  )
}

