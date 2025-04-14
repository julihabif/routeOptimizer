import type { Location, RouteStep } from "@/types/route"

// Función para buscar ubicaciones por nombre
export async function searchLocations(query: string, token?: string): Promise<Location[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  // Obtener el token de acceso
  const accessToken = token || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  if (!accessToken) {
    console.error("No se puede buscar ubicaciones: falta el token de acceso de Mapbox")
    throw new Error(
      "Token de Mapbox no configurado. Por favor, configura NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN en tus variables de entorno.",
    )
  }

  try {
    console.log("Buscando ubicaciones para:", query)

    // Construir la URL con el token de acceso
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query,
    )}.json?access_token=${accessToken}&limit=5`

    console.log("URL de búsqueda:", url)

    // Realizar la solicitud a la API
    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error en la respuesta de la API:", response.status, errorText)
      throw new Error(`Geocoding API request failed: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log("Resultados de la API:", data.features?.length || 0)

    // Transformar la respuesta de Mapbox a nuestro formato Location
    if (data.features && Array.isArray(data.features)) {
      return data.features.map((feature: any) => ({
        id: feature.id || `loc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: feature.place_name,
        coordinates: feature.center as [number, number],
      }))
    }

    return []
  } catch (error) {
    console.error("Error buscando ubicaciones:", error)
    throw error
  }
}

// Función para obtener direcciones entre ubicaciones
export async function getDirections(
  locations: Location[],
  options: {
    profile?: string
    avoid_highways?: boolean
    avoid_tolls?: boolean
    avoid_ferries?: boolean
  } = {},
  token?: string,
): Promise<{
  steps: RouteStep[]
  duration: number
  distance: number
  geometry: GeoJSON.LineString
}> {
  console.log("Obteniendo direcciones para", locations.length, "ubicaciones con opciones:", options)

  // Asegurarse de que tenemos al menos 2 ubicaciones para crear una ruta
  if (locations.length < 2) {
    console.error("Se necesitan al menos 2 ubicaciones para crear una ruta")
    return {
      steps: [],
      duration: 0,
      distance: 0,
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    }
  }

  // Obtener el token de acceso
  const accessToken = token || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  if (!accessToken) {
    console.error("No se pueden obtener direcciones: falta el token de acceso de Mapbox")
    return fallbackDirections(locations)
  }

  try {
    // Crear la cadena de coordenadas para la API de Mapbox
    const coordinates = locations.map((loc) => loc.coordinates.join(",")).join(";")

    // Determinar el perfil de ruta
    const profile = options.profile || "driving"

    // Construir la URL base para la API de Directions
    let url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?steps=true&geometries=geojson&access_token=${accessToken}`

    // Añadir parámetros adicionales según las opciones
    const urlParams = new URLSearchParams()

    if (options.avoid_highways) {
      urlParams.append("exclude", "motorway")
    }

    if (options.avoid_tolls) {
      urlParams.append("exclude", "toll")
    }

    if (options.avoid_ferries) {
      urlParams.append("exclude", "ferry")
    }

    // Añadir los parámetros a la URL
    if (urlParams.toString()) {
      url += `&${urlParams.toString()}`
    }

    console.log("Solicitando direcciones a Mapbox:", url)

    // Realizar la solicitud a la API
    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error en la respuesta de la API de Directions:", response.status, errorText)
      throw new Error(`Directions API request failed: ${response.status} ${errorText}`)
    }

    const data = await response.json()

    // Verificar que tenemos una ruta
    if (!data.routes || data.routes.length === 0) {
      console.error("No se encontraron rutas")
      throw new Error("No routes found")
    }

    const route = data.routes[0]
    console.log("Ruta recibida:", route)

    // Transformar los pasos de la ruta al formato que esperamos
    const steps: RouteStep[] = []

    // Procesar cada tramo (leg) de la ruta
    route.legs.forEach((leg: any, legIndex: number) => {
      const start = locations[legIndex]
      const end = locations[legIndex + 1]

      console.log(`Procesando tramo ${legIndex + 1}: ${start.name} -> ${end.name}`)

      // Crear un paso para este tramo
      const stepInstructions: string[] = []

      // Añadir instrucciones detalladas si están disponibles
      if (leg.steps && leg.steps.length > 0) {
        leg.steps.forEach((step: any) => {
          if (step.maneuver && step.maneuver.instruction) {
            stepInstructions.push(step.maneuver.instruction)
          }
        })
      } else {
        // Instrucciones genéricas si no hay detalles
        stepInstructions.push(`Dirígete desde ${start.name} hacia ${end.name}`)
      }

      steps.push({
        summary: `De ${start.name} a ${end.name}`,
        distance: leg.distance || 0,
        duration: leg.duration || 0,
        instructions: stepInstructions,
      })
    })

    return {
      steps,
      duration: route.duration || 0,
      distance: route.distance || 0,
      geometry: route.geometry,
    }
  } catch (error) {
    console.error("Error obteniendo direcciones:", error)

    // Fallback a la implementación simulada si la API falla
    console.log("Usando implementación simulada como fallback")
    return fallbackDirections(locations)
  }
}

// Implementación de fallback para cuando la API falla
function fallbackDirections(locations: Location[]): {
  steps: RouteStep[]
  duration: number
  distance: number
  geometry: GeoJSON.LineString
} {
  console.log("Generando direcciones simuladas para", locations.length, "ubicaciones")

  // Generar pasos simulados entre cada par de ubicaciones
  const steps: RouteStep[] = []
  let totalDuration = 0
  let totalDistance = 0
  const coordinates: [number, number][] = []

  // Crear pasos entre cada par consecutivo de ubicaciones
  for (let i = 0; i < locations.length - 1; i++) {
    const start = locations[i]
    const end = locations[i + 1]

    console.log(`Creando paso de ruta simulado ${i + 1}: ${start.name} -> ${end.name}`)

    // Añadir coordenadas para la geometría
    coordinates.push(start.coordinates)

    // Calcular distancia y duración simuladas
    const distance = calculateDistance(start.coordinates, end.coordinates)
    const duration = Math.round(distance / 10) // Estimación aproximada: 10 metros por segundo

    totalDistance += distance
    totalDuration += duration

    // Crear un paso simulado
    steps.push({
      summary: `De ${start.name} a ${end.name}`,
      distance,
      duration,
      instructions: [
        `Dirígete hacia el ${getRandomDirection()} desde ${start.name}`,
        `Continúa por ${Math.round(distance / 3)} metros`,
        `Gira a la ${getRandomTurn()} en ${getRandomStreet()}`,
        `Continúa por ${Math.round(distance / 3)} metros`,
        `Gira a la ${getRandomTurn()} en ${getRandomStreet()}`,
        `Continúa por ${Math.round(distance / 3)} metros`,
        `Llega a ${end.name}`,
      ],
    })
  }

  // Añadir la última coordenada
  if (locations.length > 0) {
    coordinates.push(locations[locations.length - 1].coordinates)
  }

  console.log(
    `Ruta simulada creada con ${steps.length} pasos, ${totalDistance.toFixed(0)}m, ${Math.round(totalDuration)}s`,
  )

  return {
    steps,
    duration: totalDuration,
    distance: totalDistance,
    geometry: {
      type: "LineString",
      coordinates,
    },
  }
}

// Función auxiliar para calcular la distancia entre dos puntos
function calculateDistance(point1: [number, number], point2: [number, number]): number {
  const R = 6371e3 // Radio de la Tierra en metros
  const φ1 = (point1[1] * Math.PI) / 180
  const φ2 = (point2[1] * Math.PI) / 180
  const Δφ = ((point2[1] - point1[1]) * Math.PI) / 180
  const Δλ = ((point2[0] - point1[0]) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

// Funciones auxiliares para generar direcciones simuladas
function getRandomDirection(): string {
  const directions = ["norte", "noreste", "este", "sureste", "sur", "suroeste", "oeste", "noroeste"]
  return directions[Math.floor(Math.random() * directions.length)]
}

function getRandomTurn(): string {
  const turns = ["izquierda", "derecha", "ligera izquierda", "ligera derecha"]
  return turns[Math.floor(Math.random() * turns.length)]
}

function getRandomStreet(): string {
  const streets = [
    "Calle Principal",
    "Avenida Central",
    "Primera Avenida",
    "Avenida del Parque",
    "Calle Roble",
    "Calle Maple",
    "Boulevard Washington",
    "Avenida Lincoln",
    "Calle Jefferson",
  ]
  return streets[Math.floor(Math.random() * streets.length)]
}

declare global {
  namespace GeoJSON {
    interface LineString {
      type: "LineString"
      coordinates: [number, number][]
    }
  }
}

// Función para obtener la dirección a partir de coordenadas (geocodificación inversa)
export async function reverseGeocode(coordinates: [number, number], token?: string): Promise<Location | null> {
  // Obtener el token de acceso
  const accessToken = token || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  if (!accessToken) {
    console.error("No se puede realizar geocodificación inversa: falta el token de acceso de Mapbox")
    return null
  }

  try {
    console.log("Obteniendo dirección para las coordenadas:", coordinates)

    // Construir la URL con el token de acceso
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${accessToken}&limit=1`

    console.log("URL de geocodificación inversa:", url)

    // Realizar la solicitud a la API
    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error en la respuesta de la API:", response.status, errorText)
      throw new Error(`Reverse geocoding API request failed: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log("Resultados de la API:", data.features?.length || 0)

    // Transformar la respuesta de Mapbox a nuestro formato Location
    if (data.features && Array.isArray(data.features) && data.features.length > 0) {
      const feature = data.features[0]
      return {
        id: feature.id || `loc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: feature.place_name,
        coordinates: feature.center as [number, number],
      }
    }

    return null
  } catch (error) {
    console.error("Error en geocodificación inversa:", error)
    throw error
  }
}

