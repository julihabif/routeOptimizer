import { useState, useEffect, useCallback } from 'react'
import type { Route, Location } from '@/types/route'
import { getMapboxToken } from '@/lib/api/mapbox-token'

export function useMapState() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapboxToken, setMapboxToken] = useState<string>("")
  const [isInitialized, setIsInitialized] = useState(false)

  const initializeMapbox = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const token = await getMapboxToken()
      if (!token) {
        throw new Error("No se encontró el token de Mapbox")
      }
      
      setMapboxToken(token)
      setIsInitialized(true)
    } catch (error) {
      console.error("Error al inicializar Mapbox:", error)
      setError("Error al inicializar el mapa. Por favor, recarga la página.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    initializeMapbox()
  }, [initializeMapbox])

  const validateCoordinates = useCallback((route: Route): boolean => {
    const allLocations = [route.start, ...route.stops]
    if (route.end) allLocations.push(route.end)

    return allLocations.every(
      (loc) => 
        loc?.coordinates && 
        Array.isArray(loc.coordinates) && 
        loc.coordinates.length === 2 && 
        isFinite(loc.coordinates[0]) && 
        isFinite(loc.coordinates[1]) &&
        !(loc.coordinates[0] === 0 && loc.coordinates[1] === 0)
    )
  }, [])

  const calculateBounds = useCallback((locations: Location[]) => {
    const bounds = {
      north: -90,
      south: 90,
      east: -180,
      west: 180
    }

    locations.forEach(loc => {
      const [lng, lat] = loc.coordinates
      bounds.north = Math.max(bounds.north, lat)
      bounds.south = Math.min(bounds.south, lat)
      bounds.east = Math.max(bounds.east, lng)
      bounds.west = Math.min(bounds.west, lng)
    })

    return bounds
  }, [])

  return {
    isLoading,
    error,
    mapboxToken,
    isInitialized,
    validateCoordinates,
    calculateBounds,
    initializeMapbox
  }
} 