import type { Location, Route } from "@/types/route"
import { getDirections } from "@/lib/mapbox"
import type { VehicleProfile } from "@/components/vehicle-profile-selector"

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

// Función para encontrar el vecino más cercano
function findNearestNeighbor(current: Location, unvisited: Location[]): Location {
  if (unvisited.length === 0) {
    throw new Error("No hay ubicaciones sin visitar para encontrar el vecino más cercano")
  }

  let nearest = unvisited[0]
  let minDistance = calculateDistance(current.coordinates, nearest.coordinates)

  for (let i = 1; i < unvisited.length; i++) {
    const distance = calculateDistance(current.coordinates, unvisited[i].coordinates)
    if (distance < minDistance) {
      minDistance = distance
      nearest = unvisited[i]
    }
  }

  return nearest
}

// Función para asegurar que cada ubicación tenga un ID único
function ensureUniqueIds(locations: Location[]): Location[] {
  const seenIds = new Map<string, number>()

  return locations.map((location) => {
    if (!location.id) {
      // Si no tiene ID, generar uno
      location.id = `loc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      return location
    }

    if (!seenIds.has(location.id)) {
      // Si el ID no se ha visto antes, registrarlo
      seenIds.set(location.id, 1)
      return location
    } else {
      // Si el ID ya existe, crear uno nuevo con un sufijo
      const count = seenIds.get(location.id)! + 1
      seenIds.set(location.id, count)
      const newId = `${location.id}-${count}`
      console.log(`ID duplicado detectado: ${location.name} (${location.id}). Generando nuevo ID: ${newId}`)
      return { ...location, id: newId }
    }
  })
}

// Función para validar una ubicación
function validateLocation(location: Location | null, type = "ubicación"): void {
  if (!location) {
    throw new Error(`La ${type} no ha sido seleccionada. Por favor, seleccione una ${type} válida.`)
  }

  if (!location.name || location.name.trim() === "") {
    throw new Error(`La ${type} no tiene un nombre válido. Por favor, ingrese una dirección para la ${type}.`)
  }

  if (
    !location.coordinates ||
    !Array.isArray(location.coordinates) ||
    location.coordinates.length !== 2 ||
    typeof location.coordinates[0] !== "number" ||
    typeof location.coordinates[1] !== "number" ||
    isNaN(location.coordinates[0]) ||
    isNaN(location.coordinates[1]) ||
    (location.coordinates[0] === 0 && location.coordinates[1] === 0)
  ) {
    throw new Error(`La ${type} no tiene coordenadas válidas. Por favor, ingrese una dirección válida para la ${type}.`)
  }
}

// Función principal de optimización usando el algoritmo del vecino más cercano
export async function optimizeRoute(
  start: Location | null,
  end: Location | null,
  stops: Location[],
  vehicleProfile?: VehicleProfile,
): Promise<Route> {
  // Validar la ubicación de inicio
  validateLocation(start, "ubicación de inicio")

  // Verificar que tenemos paradas para optimizar
  if (!stops || stops.length === 0) {
    throw new Error("No hay paradas para optimizar. Por favor, añada al menos una parada.")
  }

  // Validar cada parada
  stops.forEach((stop, index) => {
    try {
      validateLocation(stop, `parada ${index + 1}`)
    } catch (error) {
      throw new Error(`Error en la parada ${index + 1}: ${error instanceof Error ? error.message : String(error)}`)
    }
  })

  // Validar la ubicación final si está presente
  if (end) {
    validateLocation(end, "ubicación final")
  }

  console.log("Optimizando ruta con:", {
    start: start.name,
    end: end?.name || "No especificado",
    stops: stops.map((s) => s.name),
    vehicleProfile: vehicleProfile?.name || "No especificado",
  })

  // Asegurar que todas las ubicaciones tengan IDs únicos
  const uniqueStart = { ...start }
  const uniqueEnd = end ? { ...end } : null
  const uniqueStops = ensureUniqueIds([...stops])

  // Hacer una copia de las paradas para no modificar el array original
  const unvisitedStops = [...uniqueStops]
  const optimizedStops: Location[] = []
  let current = uniqueStart

  // Imprimir todas las paradas antes de optimizar
  console.log(
    "Paradas a optimizar:",
    unvisitedStops.map((s) => s.name),
  )

  // Encontrar el orden óptimo de paradas usando el algoritmo del vecino más cercano
  while (unvisitedStops.length > 0) {
    // Encontrar la parada más cercana a la ubicación actual
    const nearest = findNearestNeighbor(current, unvisitedStops)

    console.log(
      `La parada más cercana a ${current.name} es ${nearest.name} (distancia: ${calculateDistance(
        current.coordinates,
        nearest.coordinates,
      ).toFixed(0)} metros)`,
    )

    optimizedStops.push(nearest)

    // Eliminar la parada visitada de las no visitadas
    const index = unvisitedStops.findIndex((stop) => stop.id === nearest.id)
    if (index !== -1) {
      unvisitedStops.splice(index, 1)
    } else {
      console.error("No se pudo encontrar la parada en el array de paradas no visitadas:", nearest)
    }

    // Actualizar la ubicación actual
    current = nearest
  }

  // Si se especifica un final, usarlo; de lo contrario, usar la última parada como final
  const finalEnd = uniqueEnd || optimizedStops[optimizedStops.length - 1]

  // Verificar que el punto final no esté duplicado en las paradas optimizadas
  if (uniqueEnd) {
    // Comparar por nombre en lugar de ID para evitar problemas con IDs generados
    const endIndex = optimizedStops.findIndex((stop) => stop.name === uniqueEnd.name)
    if (endIndex !== -1) {
      console.log(`Eliminando el punto final ${uniqueEnd.name} de las paradas optimizadas para evitar duplicados`)
      optimizedStops.splice(endIndex, 1)
    }
  }

  // Imprimir el orden final de la ruta
  console.log(
    "Orden optimizado de paradas:",
    [
      uniqueStart.name,
      ...optimizedStops.map((s) => s.name),
      finalEnd.name !== optimizedStops[optimizedStops.length - 1]?.name ? finalEnd.name : "",
    ]
      .filter(Boolean)
      .join(" → "),
  )

  // Crear la lista final de ubicaciones para obtener direcciones
  const allLocations = [uniqueStart, ...optimizedStops]

  // Solo añadir el punto final si no es la última parada (para evitar duplicados)
  if (finalEnd.name !== optimizedStops[optimizedStops.length - 1]?.name) {
    allLocations.push(finalEnd)
  }

  console.log(
    "Obteniendo direcciones para:",
    allLocations.map((loc) => loc.name),
  )

  // Configurar opciones de ruta basadas en el perfil de vehículo
  const routeOptions: any = {}

  if (vehicleProfile) {
    // Configurar opciones específicas según el tipo de vehículo
    switch (vehicleProfile.type) {
      case "car":
        routeOptions.profile = "driving"
        break
      case "truck":
        routeOptions.profile = "driving"
        // Añadir restricciones para camiones
        routeOptions.avoid_highways = vehicleProfile.properties.avoidHighways
        routeOptions.avoid_tolls = vehicleProfile.properties.avoidTolls
        routeOptions.avoid_ferries = vehicleProfile.properties.avoidFerries
        break
      case "motorcycle":
        routeOptions.profile = "driving"
        routeOptions.avoid_highways = vehicleProfile.properties.avoidHighways
        break
      case "bicycle":
        routeOptions.profile = "cycling"
        break
      default:
        routeOptions.profile = "driving"
    }

    // Añadir restricciones generales si están definidas
    if (vehicleProfile.properties.avoidHighways !== undefined) {
      routeOptions.avoid_highways = vehicleProfile.properties.avoidHighways
    }
    if (vehicleProfile.properties.avoidTolls !== undefined) {
      routeOptions.avoid_tolls = vehicleProfile.properties.avoidTolls
    }
    if (vehicleProfile.properties.avoidFerries !== undefined) {
      routeOptions.avoid_ferries = vehicleProfile.properties.avoidFerries
    }
  }

  const directions = await getDirections(allLocations, routeOptions)

  // Calcular el centro de todos los puntos para el mapa
  const allCoordinates = allLocations.map((loc) => loc.coordinates)
  const centerLng = allCoordinates.reduce((sum, coord) => sum + coord[0], 0) / allCoordinates.length
  const centerLat = allCoordinates.reduce((sum, coord) => sum + coord[1], 0) / allCoordinates.length

  return {
    start: uniqueStart,
    end: finalEnd,
    stops: optimizedStops,
    steps: directions.steps,
    duration: directions.duration,
    distance: directions.distance,
    center: [centerLng, centerLat],
    geometry: directions.geometry,
    vehicleProfile: vehicleProfile,
  }
}

