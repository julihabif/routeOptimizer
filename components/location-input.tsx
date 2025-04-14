"use client"

import { useState, useEffect, useRef } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Loader2, MapPin, Navigation, BookmarkPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { searchLocations, reverseGeocode } from "@/lib/mapbox"
import { toast } from "@/components/ui/use-toast"
import type { Location } from "@/types/route"
// Importar la función para obtener el token
import { getMapboxToken } from "@/lib/api/mapbox-token"

// Modificar la interfaz de props para incluir las nuevas propiedades
interface LocationInputProps {
  id: string
  placeholder: string
  value: Location | null
  onChange: (location: Location) => void
  className?: string
  showSaveButton?: boolean
  onSaveLocation?: () => void
  required?: boolean
  error?: string
}

// Actualizar la función para usar las nuevas props
export function LocationInput({
  id,
  placeholder,
  value,
  onChange,
  className,
  showSaveButton = false,
  onSaveLocation,
  required = false,
  error,
}: LocationInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [mapboxToken, setMapboxToken] = useState<string>("")

  // Obtener el token de Mapbox al cargar el componente
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getMapboxToken()
        setMapboxToken(token)
      } catch (error) {
        console.error("Error al obtener el token de Mapbox:", error)
      }
    }

    fetchToken()
  }, [])

  // Actualizar el valor del input cuando cambia el valor de la prop
  useEffect(() => {
    if (value) {
      setInputValue(value.name)
    } else {
      setInputValue("")
    }
  }, [value])

  // Función para manejar el cambio en el input
  const handleInputChange = async (newValue: string) => {
    setInputValue(newValue)
    setHasInteracted(true)

    // Cancelar cualquier búsqueda pendiente
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Solo buscar si hay al menos 3 caracteres
    if (newValue.trim().length >= 3) {
      setIsLoading(true)

      // Usar un timeout para evitar demasiadas solicitudes mientras el usuario escribe
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          console.log("Buscando:", newValue)
          const results = await searchLocations(newValue, mapboxToken)
          console.log("Resultados encontrados:", results.length)
          setSuggestions(results)
        } catch (error) {
          console.error("Error en la búsqueda:", error)
          setSuggestions([])
        } finally {
          setIsLoading(false)
        }
      }, 300)
    } else {
      setSuggestions([])
      setIsLoading(false)
    }
  }

  // Función para seleccionar una ubicación de las sugerencias
  const handleSelectLocation = (location: Location) => {
    onChange(location)
    setInputValue(location.name)
    setOpen(false)
    setHasInteracted(true)
  }

  // Función para manejar la apertura del popover
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)

    // Si se abre el popover y hay un valor, buscar sugerencias inmediatamente
    if (newOpen && inputValue.trim().length >= 3 && suggestions.length === 0 && !isLoading) {
      handleInputChange(inputValue)
    }
  }

  // Función para obtener la ubicación actual del usuario
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocalización no soportada",
        description: "Tu navegador no soporta la geolocalización",
        variant: "destructive",
      })
      return
    }

    setIsLocating(true)

    try {
      // Obtener las coordenadas del usuario
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      })

      const { latitude, longitude } = position.coords
      console.log("Ubicación obtenida:", latitude, longitude)

      // Convertir coordenadas a dirección
      const location = await reverseGeocode([longitude, latitude], mapboxToken)

      if (location) {
        // Actualizar el input con la ubicación obtenida
        handleSelectLocation(location)
        toast({
          title: "Ubicación detectada",
          description: `Se ha detectado tu ubicación: ${location.name}`,
        })
      } else {
        toast({
          title: "No se pudo obtener la dirección",
          description: "Se obtuvieron las coordenadas pero no se pudo convertir a una dirección",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al obtener la ubicación:", error)
      toast({
        title: "Error de geolocalización",
        description: error instanceof Error ? error.message : "No se pudo obtener tu ubicación",
        variant: "destructive",
      })
    } finally {
      setIsLocating(false)
    }
  }

  // Determinar si mostrar el estado de error
  const showError = error && (required || hasInteracted)

  // Modificar el return para incluir el botón de guardar y el estado de error
  return (
    <div className="space-y-1 w-full">
      <div className="flex items-center gap-2 w-full">
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between font-normal",
                !value && "text-muted-foreground",
                showError && "border-red-500 focus-visible:ring-red-500",
                className,
              )}
              onClick={() => setOpen(true)}
            >
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 shrink-0 text-[#3B82F6]" />
                {value ? value.name : placeholder}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={`Buscar ${placeholder.toLowerCase()}`}
                value={inputValue}
                onValueChange={handleInputChange}
                className="h-9"
                autoFocus
              />
              <CommandList>
                {isLoading && (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}

                {!isLoading && inputValue.trim().length < 3 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Escribe al menos 3 caracteres para buscar
                  </div>
                )}

                {!isLoading && inputValue.trim().length >= 3 && suggestions.length === 0 && (
                  <CommandEmpty>No se encontraron ubicaciones</CommandEmpty>
                )}

                {!isLoading && suggestions.length > 0 && (
                  <CommandGroup>
                    {suggestions.map((location) => (
                      <CommandItem
                        key={location.id}
                        value={location.name}
                        onSelect={() => handleSelectLocation(location)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          <Check
                            className={cn("mr-2 h-4 w-4", value?.id === location.id ? "opacity-100" : "opacity-0")}
                          />
                          <span>{location.name}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex gap-1 shrink-0">
          {showSaveButton && onSaveLocation && (
            <Button
              variant="outline"
              size="icon"
              onClick={onSaveLocation}
              className="shrink-0"
              title="Guardar ubicación"
            >
              <BookmarkPlus className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={getCurrentLocation}
            disabled={isLocating}
            className="shrink-0"
            title="Usar mi ubicación actual"
          >
            {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {showError && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}

