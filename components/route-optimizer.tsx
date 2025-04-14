"use client"

import { useRef } from "react"

import { FormDescription } from "@/components/ui/form"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LocationInput } from "@/components/location-input"
import { RouteMap } from "@/components/route-map"
import { RouteDetails } from "@/components/route-details"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  MapPin,
  Navigation,
  Plus,
  RotateCcw,
  Save,
  Share2,
  Trash2,
  Truck,
  Car,
  BookmarkPlus,
  AlertCircle,
} from "lucide-react"
import { optimizeRoute } from "@/lib/route-optimizer"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { VehicleProfileSelector, type VehicleProfile } from "@/components/vehicle-profile-selector"
import type { Location, Route } from "@/types/route"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// Actualizar la importación de supabase
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { saveRoute } from "@/lib/services/route-service"
import { saveLocation } from "@/lib/services/location-service"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Asegúrate de que la API key de Mapbox esté disponible
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

// Esquema para la validación del formulario de guardar ruta
const saveRouteSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  description: z.string().optional(),
  isFavorite: z.boolean().default(false),
})

type SaveRouteFormValues = z.infer<typeof saveRouteSchema>

// Esquema para la validación del formulario de guardar ubicación
const saveLocationSchema = z.object({
  address: z.string().min(3, { message: "La dirección debe tener al menos 3 caracteres" }),
  locationType: z.string().default("custom"),
  isFavorite: z.boolean().default(false),
})

type SaveLocationFormValues = z.infer<typeof saveLocationSchema>

interface Stop {
  id: string
  name: string
  coordinates?: [number, number]
  address: string
}

export function RouteOptimizer() {
  const [startLocation, setStartLocation] = useState<Location | null>(null)
  const [endLocation, setEndLocation] = useState<Location | null>(null)
  const [stops, setStops] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [optimizedRoute, setOptimizedRoute] = useState<Route | null>(null)
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [optimizedRouteOld, setOptimizedRouteOld] = useState<Route | null>(null)
  const [fixEndPoint, setFixEndPoint] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)
  const [activeTab, setActiveTab] = useState("input")
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [selectedVehicleProfile, setSelectedVehicleProfile] = useState<VehicleProfile>({
    id: "car-standard",
    name: "Coche estándar",
    type: "car",
    description: "Vehículo de pasajeros estándar",
    icon: <Car className="h-4 w-4" />,
    properties: {
      maxSpeed: 120,
      weight: 1500,
      height: 1.6,
      width: 1.8,
      length: 4.5,
      fuelType: "gasoline",
      consumption: 7.5,
      avoidHighways: false,
      avoidTolls: false,
      avoidFerries: false,
    },
  })
  const [user, setUser] = useState<any>(null)
  const [saveRouteOpen, setSaveRouteOpen] = useState(false)
  const [saveLocationOpen, setSaveLocationOpen] = useState(false)
  const [locationToSave, setLocationToSave] = useState<Location | null>(null)

  // Formulario para guardar ruta
  const saveRouteForm = useForm<SaveRouteFormValues>({
    resolver: zodResolver(saveRouteSchema),
    defaultValues: {
      name: "",
      description: "",
      isFavorite: false,
    },
  })

  // Formulario para guardar ubicación
  const saveLocationForm = useForm<SaveLocationFormValues>({
    resolver: zodResolver(saveLocationSchema),
    defaultValues: {
      address: "",
      locationType: "custom",
      isFavorite: false,
    },
  })

  // Inicializar el mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-58.3816, -34.6037], // Buenos Aires como centro predeterminado
      zoom: 10,
    })

    map.current.on("load", () => {
      setMapLoaded(true)
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Actualizar marcadores en el mapa cuando cambian las paradas
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Limpiar marcadores existentes
    const markers = document.querySelectorAll(".mapboxgl-marker")
    markers.forEach((marker) => marker.remove())

    // Añadir nuevos marcadores para cada parada con coordenadas
    stops.forEach((stop, index) => {
      if (stop.coordinates) {
        const el = document.createElement("div")
        el.className = "marker"
        el.style.backgroundColor = index === 0 ? "#4CAF50" : "#2196F3"
        el.style.width = "24px"
        el.style.height = "24px"
        el.style.borderRadius = "50%"
        el.style.display = "flex"
        el.style.justifyContent = "center"
        el.style.alignItems = "center"
        el.style.color = "white"
        el.style.fontWeight = "bold"
        el.innerText = (index + 1).toString()

        new mapboxgl.Marker(el)
          .setLngLat(stop.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${stop.name}</h3><p>${stop.address}</p>`))
          .addTo(map.current!)
      }
    })

    // Si hay coordenadas, ajustar el mapa para mostrar todas las paradas
    const coordinates = stops.filter((stop) => stop.coordinates).map((stop) => stop.coordinates!)
    if (coordinates.length > 0) {
      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord as [number, number]),
        new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]),
      )

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      })
    }
  }, [stops, mapLoaded])

  // Geocodificar una dirección para obtener coordenadas
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address,
        )}.json?access_token=${mapboxgl.accessToken}&limit=1`,
      )
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        return [lng, lat]
      }
      return null
    } catch (error) {
      console.error("Error geocodificando dirección:", error)
      return null
    }
  }

  // Actualizar la dirección de una parada
  const updateStopAddress = (id: string, address: string) => {
    setStops((prevStops) =>
      prevStops.map((stop) => (stop.id === id ? { ...stop, address, coordinates: undefined } : stop)),
    )
  }

  // Añadir una nueva parada
  const addStop = () => {
    // Crear un ID único para el nuevo stop
    const newStopId = `stop-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // Añadir un nuevo stop con un ID único y valores iniciales vacíos
    setStops([
      ...stops,
      {
        id: newStopId,
        name: "",
        coordinates: [0, 0],
      },
    ])

    // Limpiar errores de validación relacionados con las paradas
    setValidationErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`stop-${stops.length}`]
      return newErrors
    })
  }

  // Eliminar una parada
  const removeStop = (index: number) => {
    const newStops = [...stops]
    newStops.splice(index, 1)
    setStops(newStops)

    // Actualizar errores de validación
    setValidationErrors((prev) => {
      const newErrors = { ...prev }
      // Eliminar el error de la parada eliminada
      delete newErrors[`stop-${index}`]

      // Reindexar los errores de las paradas siguientes
      for (let i = index + 1; i < stops.length; i++) {
        if (newErrors[`stop-${i}`]) {
          newErrors[`stop-${i - 1}`] = newErrors[`stop-${i}`]
          delete newErrors[`stop-${i}`]
        }
      }

      return newErrors
    })
  }

  // Geocodificar todas las direcciones
  const geocodeAllAddresses = async () => {
    const updatedStops = [...stops]
    let allValid = true

    for (let i = 0; i < updatedStops.length; i++) {
      const stop = updatedStops[i]
      if (!stop.address) {
        allValid = false
        continue
      }

      if (!stop.coordinates) {
        const coordinates = await geocodeAddress(stop.address)
        if (coordinates) {
          updatedStops[i] = { ...stop, coordinates }
        } else {
          allValid = false
        }
      }
    }

    setStops(updatedStops)
    return allValid
  }

  // Optimizar la ruta
  const optimizeRouteNew = async () => {
    setLoading(true)
    try {
      // Primero geocodificar todas las direcciones
      const allValid = await geocodeAllAddresses()

      if (!allValid) {
        alert("No se pudieron geocodificar todas las direcciones. Por favor, verifica las direcciones.")
        setLoading(false)
        return
      }

      // Filtrar paradas con coordenadas
      const validStops = stops.filter((stop) => stop.coordinates)

      if (validStops.length < 2) {
        alert("Se necesitan al menos 2 paradas válidas para optimizar la ruta.")
        setLoading(false)
        return
      }

      // Aquí normalmente llamaríamos a una API para optimizar la ruta
      // Por ahora, simularemos una optimización simple
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simular tiempo de procesamiento

      // Ordenar las paradas (esto es solo una simulación, no una optimización real)
      const optimized = [...validStops].sort((a, b) => a.name.localeCompare(b.name))
      setOptimizedRoute(optimized)

      // Dibujar la ruta en el mapa
      drawRoute(optimized)
    } catch (error) {
      console.error("Error al optimizar la ruta:", error)
      alert("Ocurrió un error al optimizar la ruta. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  // Dibujar la ruta en el mapa
  const drawRoute = async (routeStops: Stop[]) => {
    if (!map.current || !mapLoaded || routeStops.length < 2) return

    // Limpiar rutas existentes
    if (map.current.getSource("route")) {
      map.current.removeLayer("route")
      map.current.removeSource("route")
    }

    // Construir la cadena de coordenadas para la API de direcciones de Mapbox
    const coordinates = routeStops.map((stop) => stop.coordinates!.join(",")).join(";")

    try {
      // Obtener la ruta de la API de direcciones de Mapbox
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`,
      )
      const data = await response.json()

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry

        // Añadir la fuente y capa de la ruta al mapa
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: route,
          },
        })

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        })
      }
    } catch (error) {
      console.error("Error al obtener la ruta:", error)
    }
  }

  // Limpiar la ruta
  const clearRoute = () => {
    setOptimizedRoute([])

    if (map.current && map.current.getSource("route")) {
      map.current.removeLayer("route")
      map.current.removeSource("route")
    }
  }

  // Reemplazar el useEffect que verifica el usuario
  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createBrowserSupabaseClient()
        if (!supabase) {
          console.error("No se pudo crear el cliente de Supabase")
          return
        }

        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)

        // Suscribirse a cambios en la autenticación
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null)
        })

        return () => {
          authListener?.subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error)
      }
    }

    checkUser()
  }, [])

  const updateStop = (index: number, location: Location) => {
    const newStops = [...stops]
    newStops[index] = location
    setStops(newStops)

    //  => {

    // Limpiar el error de validación para esta parada si existe
    setValidationErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`stop-${index}`]
      return newErrors
    })
  }

  const calculateRoute = async () => {
    // Limpiar errores previos
    setValidationErrors({})
    setGeneralError(null)

    try {
      // Validar que tengamos los datos necesarios
      if (!startLocation) {
        setValidationErrors((prev) => ({ ...prev, start: "La ubicación de inicio es obligatoria" }))
        toast({
          title: "Falta el punto de inicio",
          description: "Por favor, ingresa un punto de partida",
          variant: "destructive",
        })
        return
      }

      if (stops.length === 0) {
        setGeneralError("No hay paradas añadidas. Por favor, añade al menos una parada.")
        toast({
          title: "No hay paradas añadidas",
          description: "Por favor, añade al menos una parada",
          variant: "destructive",
        })
        return
      }

      if (fixEndPoint && !endLocation) {
        setValidationErrors((prev) => ({
          ...prev,
          end: "La ubicación final es obligatoria cuando el punto final está fijo",
        }))
        toast({
          title: "Falta el punto final",
          description: "Por favor, ingresa un punto final o desactiva la opción de punto final fijo",
          variant: "destructive",
        })
        return
      }

      // Validar cada parada
      let hasInvalidStops = false
      stops.forEach((stop, index) => {
        if (!stop.name || (stop.coordinates[0] === 0 && stop.coordinates[1] === 0)) {
          setValidationErrors((prev) => ({
            ...prev,
            [`stop-${index}`]: "Esta parada no tiene una ubicación válida",
          }))
          hasInvalidStops = true
        }
      })

      if (hasInvalidStops) {
        toast({
          title: "Paradas inválidas",
          description:
            "Algunas paradas no tienen ubicaciones válidas. Por favor, selecciona ubicaciones válidas del menú desplegable.",
          variant: "destructive",
        })
        return
      }

      setIsCalculating(true)

      // Calcular la ruta optimizada
      const result = await optimizeRoute(startLocation, fixEndPoint ? endLocation : null, stops, selectedVehicleProfile)

      setOptimizedRoute(result)
      setActiveTab("map")

      toast({
        title: "Ruta optimizada",
        description: `Se encontró la mejor ruta con ${result.stops.length} paradas en orden óptimo`,
      })
    } catch (error) {
      console.error("Error al calcular la ruta:", error)

      // Manejar el error específicamente
      if (error instanceof Error) {
        setGeneralError(error.message)
        toast({
          title: "Error al calcular la ruta",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setGeneralError("Hubo un problema al optimizar tu ruta. Por favor, inténtalo de nuevo.")
        toast({
          title: "Error al calcular la ruta",
          description: "Hubo un problema al optimizar tu ruta. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    } finally {
      setIsCalculating(false)
    }
  }

  const resetForm = () => {
    setStartLocation(null)
    setEndLocation(null)
    setStops([])
    setOptimizedRoute(null)
    setActiveTab("input")
    setValidationErrors({})
    setGeneralError(null)
  }

  // Guardar ruta en Supabase
  const handleSaveRoute = async (values: SaveRouteFormValues) => {
    if (!user) {
      toast({
        title: "Inicia sesión para guardar",
        description: "Debes iniciar sesión para guardar rutas",
        variant: "destructive",
      })
      return
    }

    if (!optimizedRoute) return

    try {
      const result = await saveRoute(
        user.id,
        values.name,
        values.description || null,
        optimizedRoute,
        selectedVehicleProfile,
        values.isFavorite,
      )

      if (result.success) {
        toast({
          title: "Ruta guardada",
          description: "Tu ruta ha sido guardada correctamente",
        })
        setSaveRouteOpen(false)
        saveRouteForm.reset()
      } else {
        toast({
          title: "Error al guardar",
          description: result.error || "No se pudo guardar la ruta",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al guardar la ruta:", error)
      toast({
        title: "Error al guardar",
        description: "Ha ocurrido un error al guardar la ruta",
        variant: "destructive",
      })
    }
  }

  // Guardar ubicación en Supabase
  const handleSaveLocation = async (values: SaveLocationFormValues) => {
    if (!user) {
      toast({
        title: "Inicia sesión para guardar",
        description: "Debes iniciar sesión para guardar ubicaciones",
        variant: "destructive",
      })
      return
    }

    if (!locationToSave) return

    try {
      const result = await saveLocation(user.id, locationToSave, values.address, values.locationType, values.isFavorite)

      if (result.success) {
        toast({
          title: "Ubicación guardada",
          description: "La ubicación ha sido guardada correctamente",
        })
        setSaveLocationOpen(false)
        saveLocationForm.reset()
      } else {
        toast({
          title: "Error al guardar",
          description: result.error || "No se pudo guardar la ubicación",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al guardar la ubicación:", error)
      toast({
        title: "Error al guardar",
        description: "Ha ocurrido un error al guardar la ubicación",
        variant: "destructive",
      })
    }
  }

  const shareRoute = () => {
    if (!optimizedRoute) return

    // En una aplicación real, esto generaría un enlace compartible
    navigator.clipboard.writeText(
      `${window.location.origin}/shared-route?data=${encodeURIComponent(JSON.stringify(optimizedRoute))}`,
    )

    toast({
      title: "Enlace copiado",
      description: "Enlace compartible copiado al portapapeles",
    })
  }

  // Manejar actualizaciones de la ruta desde el mapa
  const handleRouteUpdate = (updatedRoute: Route) => {
    setOptimizedRoute(updatedRoute)

    toast({
      title: "Ruta actualizada",
      description: "Los cambios en la ruta han sido aplicados",
    })
  }

  // Preparar formulario para guardar ubicación
  const prepareToSaveLocation = (location: Location) => {
    setLocationToSave(location)
    saveLocationForm.reset({
      address: location.name,
      locationType: "custom",
      isFavorite: false,
    })
    setSaveLocationOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Optimizador de Rutas</h1>
        <p className="text-muted-foreground">Encuentra la ruta más eficiente entre múltiples ubicaciones</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input" className="font-medium">
            <MapPin className="mr-2 h-4 w-4" />
            Ubicaciones
          </TabsTrigger>
          <TabsTrigger value="map" className="font-medium" disabled={!optimizedRoute}>
            <Navigation className="mr-2 h-4 w-4" />
            Mapa
          </TabsTrigger>
          <TabsTrigger value="details" className="font-medium" disabled={!optimizedRoute}>
            <Truck className="mr-2 h-4 w-4" />
            Indicaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ingresa las Ubicaciones</CardTitle>
              <CardDescription>Añade tu punto de partida, destino y paradas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {generalError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-profile">Perfil de Vehículo</Label>
                  <VehicleProfileSelector
                    selectedProfile={selectedVehicleProfile}
                    onProfileChange={setSelectedVehicleProfile}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="start-location">Punto de Partida</Label>
                    {user && startLocation && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => prepareToSaveLocation(startLocation)}
                        className="h-8"
                      >
                        <BookmarkPlus className="mr-2 h-4 w-4" />
                        Guardar
                      </Button>
                    )}
                  </div>
                  <LocationInput
                    id="start-location"
                    placeholder="Ingresa la ubicación de partida"
                    value={startLocation}
                    onChange={setStartLocation}
                    className="bg-[#F0F9FF]"
                    required={true}
                    error={validationErrors.start}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="end-location">Punto Final</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="fix-end-point" checked={fixEndPoint} onCheckedChange={setFixEndPoint} />
                      <Label htmlFor="fix-end-point" className="text-sm">
                        Punto Final Fijo
                      </Label>
                    </div>
                  </div>
                  {fixEndPoint && (
                    <LocationInput
                      id="end-location"
                      placeholder="Ingresa la ubicación final"
                      value={endLocation}
                      onChange={setEndLocation}
                      className="bg-[#F0F9FF]"
                      showSaveButton={!!user && !!endLocation}
                      onSaveLocation={() => prepareToSaveLocation(endLocation!)}
                      required={fixEndPoint}
                      error={validationErrors.end}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Paradas</Label>
                    <Badge variant="outline" className="font-normal">
                      {stops.length} paradas
                    </Badge>
                  </div>

                  {stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center gap-2">
                      <LocationInput
                        id={`stop-${index}`}
                        placeholder={`Parada ${index + 1}`}
                        value={stop.name ? stop : null}
                        onChange={(location) => updateStop(index, location)}
                        className="bg-[#F0F9FF] flex-1"
                        showSaveButton={!!user && !!stop.name}
                        onSaveLocation={() => prepareToSaveLocation(stop)}
                        required={true}
                        error={validationErrors[`stop-${index}`]}
                      />
                      <Button variant="outline" size="icon" onClick={() => removeStop(index)} className="shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button variant="outline" onClick={addStop} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir Parada
                  </Button>
                </div>
              </div>

              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <Button
                  onClick={calculateRoute}
                  className="flex-1 bg-[#3B82F6] hover:bg-[#3B82F6]/90 shadow-md hover:shadow-lg"
                  disabled={isCalculating}
                >
                  {isCalculating ? "Calculando..." : "Calcular Ruta Óptima"}
                </Button>
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reiniciar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Mapa de Ruta</CardTitle>
              <CardDescription>Visualiza tu ruta optimizada</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {optimizedRoute && (
                <RouteMap route={optimizedRoute} className="h-[500px] w-full" onRouteUpdate={handleRouteUpdate} />
              )}
            </CardContent>
          </Card>

          {optimizedRoute && (
            <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              {user ? (
                <Dialog open={saveRouteOpen} onOpenChange={setSaveRouteOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1">
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Ruta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Guardar Ruta</DialogTitle>
                      <DialogDescription>Guarda esta ruta para acceder a ella más tarde</DialogDescription>
                    </DialogHeader>
                    <Form {...saveRouteForm}>
                      <form onSubmit={saveRouteForm.handleSubmit(handleSaveRoute)} className="space-y-4">
                        <FormField
                          control={saveRouteForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre de la Ruta</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej: Ruta al trabajo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={saveRouteForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descripción (opcional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Añade una descripción para esta ruta"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={saveRouteForm.control}
                          name="isFavorite"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Marcar como favorita</FormLabel>
                                <FormDescription>Las rutas favoritas aparecerán destacadas en tu lista</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <DialogFooter>
                          <Button type="submit">Guardar</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Inicia sesión para guardar",
                      description: "Debes iniciar sesión para guardar rutas",
                      variant: "destructive",
                    })
                  }}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Ruta
                </Button>
              )}
              <Button onClick={shareRoute} variant="outline" className="flex-1">
                <Share2 className="mr-2 h-4 w-4" />
                Compartir Ruta
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="details">{optimizedRoute && <RouteDetails route={optimizedRoute} />}</TabsContent>
      </Tabs>

      {/* Diálogo para guardar ubicación */}
      <Dialog open={saveLocationOpen} onOpenChange={setSaveLocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guardar Ubicación</DialogTitle>
            <DialogDescription>Guarda esta ubicación para usarla más tarde</DialogDescription>
          </DialogHeader>
          <Form {...saveLocationForm}>
            <form onSubmit={saveLocationForm.handleSubmit(handleSaveLocation)} className="space-y-4">
              <FormField
                control={saveLocationForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Dirección completa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={saveLocationForm.control}
                name="locationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Ubicación</FormLabel>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="home">Casa</option>
                      <option value="work">Trabajo</option>
                      <option value="favorite">Favorito</option>
                      <option value="custom">Personalizado</option>
                    </select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={saveLocationForm.control}
                name="isFavorite"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Marcar como favorita</FormLabel>
                      <FormDescription>Las ubicaciones favoritas aparecerán destacadas en tu lista</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
