"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Car, Truck, Bike, type LucideIcon } from "lucide-react"

export interface VehicleProfile {
  id: string
  name: string
  type: string
  icon: LucideIcon
  description: string
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

const vehicleProfiles: VehicleProfile[] = [
  {
    id: "car",
    name: "Coche",
    type: "car",
    description: "Vehículo de pasajeros estándar",
    icon: Car,
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
  },
  {
    id: "truck",
    name: "Camión",
    type: "truck",
    description: "Vehículo de carga pesada",
    icon: Truck,
    properties: {
      maxSpeed: 90,
      weight: 3500,
      height: 3.5,
      width: 2.5,
      length: 7.5,
      fuelType: "diesel",
      consumption: 15,
      avoidHighways: false,
      avoidTolls: false,
      avoidFerries: false,
    },
  },
  {
    id: "bike",
    name: "Bicicleta",
    type: "bicycle",
    description: "Rutas urbanas y cortas distancias",
    icon: Bike,
    properties: {
      maxSpeed: 30,
      weight: 15,
      height: 1.2,
      width: 0.6,
      length: 1.8,
      fuelType: "none",
      consumption: 0,
      avoidHighways: true,
      avoidTolls: true,
      avoidFerries: true,
    },
  },
]

interface VehicleProfileSelectorProps {
  value: string
  onChange: (value: string) => void
  onCalculate?: (vehicleProfile: VehicleProfile) => Promise<void>
  isCalculating?: boolean
  onReset?: () => void
  disabled?: boolean
}

export function VehicleProfileSelector({ 
  value, 
  onChange, 
  onCalculate,
  isCalculating,
  onReset,
  disabled 
}: VehicleProfileSelectorProps) {
  const selectedProfile = vehicleProfiles.find(profile => profile.id === value) || vehicleProfiles[0]
  const Icon = selectedProfile.icon

  const handleCalculate = async () => {
    if (onCalculate) {
      await onCalculate(selectedProfile)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-start" disabled={disabled}>
            <Icon className="mr-2 h-4 w-4" />
            {selectedProfile.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {vehicleProfiles.map((profile) => (
            <DropdownMenuItem
              key={profile.id}
              onClick={() => onChange(profile.id)}
              className="flex items-center gap-2"
            >
              <profile.icon className="h-4 w-4" />
              <div>
                <div className="font-medium">{profile.name}</div>
                <div className="text-xs text-muted-foreground">{profile.description}</div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex gap-2">
        {onCalculate && (
          <Button 
            onClick={handleCalculate} 
            disabled={disabled || isCalculating}
            className="flex-1"
          >
            {isCalculating ? "Calculando..." : "Calcular Ruta"}
          </Button>
        )}
        {onReset && (
          <Button 
            variant="outline" 
            onClick={onReset}
            disabled={disabled}
          >
            Reiniciar
          </Button>
        )}
      </div>
    </div>
  )
}

