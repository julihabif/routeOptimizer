export interface VehicleProfile {
  id: string
  name: string
  type: string
  description: string
  icon: string
  properties: {
    maxSpeed: number
    weight: number
    height: number
    width: number
    length: number
    fuelType: string
    consumption: number
    avoidHighways: boolean
    avoidTolls: boolean
    avoidFerries: boolean
  }
} 