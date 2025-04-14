import type { GeoJSON } from "geojson"
import type { VehicleProfile } from '@/types/vehicle'

export interface Location {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  order?: number
}

export interface RouteStep {
  summary: string
  distance: number // in meters
  duration: number // in seconds
  instructions: string[]
}

export interface Route {
  id: string
  name: string
  description: string
  start: Location
  stops: Location[]
  end: Location | null
  distance: number
  duration: number
  geometry: string
  profile: VehicleProfile
  is_favorite: boolean
  created_at: string
  updated_at: string
}

