'use client'

import { useState, useCallback } from 'react'
import type { Route, Location } from '@/types/route'
import type { VehicleProfile } from '@/components/vehicle-profile-selector'
import { optimizeRoute } from '@/lib/route-optimizer'
import { toast } from '@/components/ui/use-toast'
import { generateId } from '@/lib/utils'

export function useRouteState() {
  const [startLocation, setStartLocation] = useState<Location | null>(null)
  const [endLocation, setEndLocation] = useState<Location | null>(null)
  const [stops, setStops] = useState<Location[]>([])
  const [optimizedRoute, setOptimizedRoute] = useState<Route | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fixEndPoint, setFixEndPoint] = useState(false)

  const addStop = useCallback((location: Location) => {
    setStops(prev => [...prev, { ...location, id: generateId() }])
  }, [])

  const removeStop = useCallback((stopId: string) => {
    setStops(prev => prev.filter(stop => stop.id !== stopId))
  }, [])

  const updateStop = useCallback((stopId: string, updates: Partial<Location>) => {
    setStops(prev => prev.map(stop => 
      stop.id === stopId ? { ...stop, ...updates } : stop
    ))
  }, [])

  const calculateRoute = useCallback(async (
    vehicleProfile?: VehicleProfile,
    fixEndPoint: boolean = false
  ) => {
    try {
      if (!startLocation) {
        throw new Error('Debe especificar un punto de inicio')
      }

      if (fixEndPoint && !endLocation) {
        throw new Error('Debe especificar un punto final')
      }

      if (stops.length === 0) {
        throw new Error('Debe agregar al menos una parada')
      }

      setIsCalculating(true)
      setError(null)

      const route = await optimizeRoute(
        startLocation,
        stops,
        fixEndPoint && endLocation ? endLocation : undefined,
        vehicleProfile
      )

      setOptimizedRoute(route)
    } catch (error) {
      console.error('Error al calcular la ruta:', error)
      setError(error instanceof Error ? error.message : 'Error al calcular la ruta')
    } finally {
      setIsCalculating(false)
    }
  }, [startLocation, endLocation, stops])

  const resetRoute = useCallback(() => {
    setStartLocation(null)
    setEndLocation(null)
    setStops([])
    setOptimizedRoute(null)
    setError(null)
    setFixEndPoint(false)
  }, [])

  return {
    startLocation,
    setStartLocation,
    endLocation,
    setEndLocation,
    stops,
    setStops,
    addStop,
    removeStop,
    updateStop,
    optimizedRoute,
    setOptimizedRoute,
    isCalculating,
    error,
    setError,
    fixEndPoint,
    setFixEndPoint,
    calculateRoute,
    resetRoute
  }
} 