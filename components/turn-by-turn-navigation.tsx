"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight, Clock, MapPin, Navigation, RotateCcw, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { NavigationMapPreview } from "./navigation-map-preview"
import type { Route } from "@/types/route"

interface TurnByTurnNavigationProps {
  route: Route
  onClose: () => void
}

export function TurnByTurnNavigation({ route, onClose }: TurnByTurnNavigationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const [expandedMap, setExpandedMap] = useState(false)

  // Obtener el paso actual y la instrucción actual
  const currentStep = route.steps[currentStepIndex] || null
  const currentInstruction = currentStep?.instructions[currentInstructionIndex] || null

  // Calcular el progreso total de la ruta
  const totalSteps = route.steps.reduce((total, step) => total + step.instructions.length, 0)
  const completedSteps =
    route.steps.slice(0, currentStepIndex).reduce((total, step) => total + step.instructions.length, 0) +
    currentInstructionIndex
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  // Iniciar/detener la navegación
  const toggleNavigation = () => {
    setIsNavigating(!isNavigating)
    if (!isNavigating) {
      // Reiniciar el tiempo al comenzar la navegación
      setElapsedTime(0)
    }
  }

  // Reiniciar la navegación
  const resetNavigation = () => {
    setCurrentStepIndex(0)
    setCurrentInstructionIndex(0)
    setElapsedTime(0)
    setIsNavigating(false)
  }

  // Avanzar a la siguiente instrucción
  const nextInstruction = () => {
    if (!currentStep) return

    if (currentInstructionIndex < currentStep.instructions.length - 1) {
      // Avanzar a la siguiente instrucción dentro del mismo paso
      setCurrentInstructionIndex(currentInstructionIndex + 1)
    } else if (currentStepIndex < route.steps.length - 1) {
      // Avanzar al siguiente paso
      setCurrentStepIndex(currentStepIndex + 1)
      setCurrentInstructionIndex(0)
    }
  }

  // Retroceder a la instrucción anterior
  const previousInstruction = () => {
    if (currentInstructionIndex > 0) {
      // Retroceder a la instrucción anterior dentro del mismo paso
      setCurrentInstructionIndex(currentInstructionIndex - 1)
    } else if (currentStepIndex > 0) {
      // Retroceder al paso anterior
      setCurrentStepIndex(currentStepIndex - 1)
      const prevStep = route.steps[currentStepIndex - 1]
      setCurrentInstructionIndex(prevStep.instructions.length - 1)
    }
  }

  // Actualizar el tiempo transcurrido durante la navegación
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isNavigating) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isNavigating])

  // Formatear el tiempo transcurrido
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${secs}s`
  }

  // Formatear la distancia
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`
    }
    return `${Math.round(meters)} m`
  }

  // Determinar el icono para la instrucción actual
  const getInstructionIcon = (instruction: string) => {
    if (instruction.toLowerCase().includes("gira") && instruction.toLowerCase().includes("derecha")) {
      return <ArrowRight className="h-5 w-5 text-primary" />
    } else if (instruction.toLowerCase().includes("gira") && instruction.toLowerCase().includes("izquierda")) {
      return <ArrowLeft className="h-5 w-5 text-primary" />
    } else if (instruction.toLowerCase().includes("continúa")) {
      return <Navigation className="h-5 w-5 text-primary" />
    } else if (instruction.toLowerCase().includes("llega")) {
      return <MapPin className="h-5 w-5 text-primary" />
    } else {
      return <Navigation className="h-5 w-5 text-primary" />
    }
  }

  // Alternar la expansión del mapa
  const toggleMapExpansion = () => {
    setExpandedMap(!expandedMap)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Navegación Paso a Paso</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
        <CardDescription>Sigue las instrucciones detalladas para llegar a tu destino</CardDescription>

        {/* Barra de progreso */}
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información de la ruta */}
        <div className="flex items-center justify-between rounded-lg bg-muted p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{isNavigating ? formatTime(elapsedTime) : "00m 00s"}</span>
          </div>
          <Badge variant="outline">
            {currentStepIndex + 1}/{route.steps.length} tramos
          </Badge>
          <div className="text-sm">{formatDistance(route.distance - (currentStep?.distance || 0))} restantes</div>
        </div>

        {/* Vista previa del mapa */}
        <div
          className={cn(
            "relative rounded-lg border overflow-hidden transition-all duration-300",
            expandedMap ? "h-[300px]" : "h-[180px]",
          )}
        >
          <NavigationMapPreview
            route={route}
            currentStepIndex={currentStepIndex}
            currentInstructionIndex={currentInstructionIndex}
            className="w-full h-full"
          />

          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 left-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur z-10"
            onClick={toggleMapExpansion}
          >
            {expandedMap ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>

        {/* Instrucción actual */}
        {currentInstruction && (
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                {getInstructionIcon(currentInstruction)}
              </div>
              <div className="font-medium">{currentStep?.summary}</div>
            </div>

            <Separator className="my-2" />

            <div className="flex items-start gap-3 py-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {currentInstructionIndex + 1}
              </div>
              <div className="text-base">{currentInstruction}</div>
            </div>

            {currentInstructionIndex < (currentStep?.instructions.length || 0) - 1 && (
              <div className="mt-2 text-sm text-muted-foreground">
                Siguiente: {currentStep?.instructions[currentInstructionIndex + 1]}
              </div>
            )}
          </div>
        )}

        {/* Controles de navegación */}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            onClick={previousInstruction}
            disabled={currentStepIndex === 0 && currentInstructionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          <Button variant={isNavigating ? "destructive" : "default"} onClick={toggleNavigation}>
            {isNavigating ? "Pausar" : "Iniciar"} Navegación
          </Button>

          <Button
            variant="outline"
            onClick={nextInstruction}
            disabled={
              currentStepIndex === route.steps.length - 1 &&
              currentInstructionIndex === (currentStep?.instructions.length || 0) - 1
            }
          >
            Siguiente
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          className="w-full"
          onClick={resetNavigation}
          disabled={currentStepIndex === 0 && currentInstructionIndex === 0 && !isNavigating}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reiniciar Navegación
        </Button>
      </CardContent>
    </Card>
  )
}

