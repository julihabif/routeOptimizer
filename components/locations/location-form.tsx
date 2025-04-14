"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Importamos el mapa de forma dinámica para evitar problemas de SSR
const LocationMap = dynamic(() => import("@/components/locations/location-map"), { ssr: false })

const locationFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  address: z.string().min(5, {
    message: "La dirección debe tener al menos 5 caracteres.",
  }),
  city: z.string().min(2, {
    message: "La ciudad debe tener al menos 2 caracteres.",
  }),
  category: z.string({
    required_error: "Por favor selecciona una categoría.",
  }),
  notes: z.string().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
})

type LocationFormValues = z.infer<typeof locationFormSchema>

const defaultValues: Partial<LocationFormValues> = {
  name: "",
  address: "",
  city: "",
  category: "",
  notes: "",
  coordinates: {
    lat: 40.416775,
    lng: -3.70379,
  },
}

export function LocationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues,
  })

  async function onSubmit(data: LocationFormValues) {
    setIsSubmitting(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para añadir ubicaciones",
          variant: "destructive",
        })
        return
      }

      // Aquí iría la lógica real para guardar la ubicación
      // await supabase.from('locations').insert({
      //   ...data,
      //   user_id: user.id,
      //   created_at: new Date().toISOString(),
      // })

      // Simulamos un retraso para mostrar el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Ubicación añadida",
        description: "La ubicación ha sido añadida correctamente",
      })

      // Redirigimos a la página de ubicaciones guardadas
      router.push("/saved-locations")
    } catch (error) {
      console.error("Error al añadir la ubicación:", error)
      toast({
        title: "Error",
        description: "No se pudo añadir la ubicación",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    form.setValue("coordinates", { lat, lng })
  }

  const handleSearchAddress = async () => {
    const address = form.getValues("address")
    const city = form.getValues("city")

    if (!address || !city) {
      toast({
        title: "Información incompleta",
        description: "Por favor ingresa la dirección y la ciudad para buscar en el mapa",
        variant: "destructive",
      })
      return
    }

    try {
      // Aquí iría la lógica real para geocodificar la dirección
      // En una implementación real, usaríamos un servicio como Mapbox o Google Maps

      // Simulamos una respuesta de geocodificación
      const mockCoordinates = {
        lat: 40.416775 + (Math.random() * 0.1 - 0.05),
        lng: -3.70379 + (Math.random() * 0.1 - 0.05),
      }

      form.setValue("coordinates", mockCoordinates)

      toast({
        title: "Ubicación encontrada",
        description: "Se ha localizado la dirección en el mapa",
      })
    } catch (error) {
      console.error("Error al buscar la dirección:", error)
      toast({
        title: "Error",
        description: "No se pudo encontrar la dirección en el mapa",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Oficina Central" {...field} />
                  </FormControl>
                  <FormDescription>Nombre descriptivo para identificar la ubicación.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Calle Principal 123" {...field} />
                  </FormControl>
                  <FormDescription>Dirección completa de la ubicación.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input placeholder="Madrid" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Oficina">Oficina</SelectItem>
                      <SelectItem value="Almacén">Almacén</SelectItem>
                      <SelectItem value="Tienda">Tienda</SelectItem>
                      <SelectItem value="Cliente">Cliente</SelectItem>
                      <SelectItem value="Proveedor">Proveedor</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Información adicional sobre esta ubicación..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Notas opcionales sobre la ubicación.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleSearchAddress}>
                <MapPin className="mr-2 h-4 w-4" />
                Buscar en Mapa
              </Button>

              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 hover:bg-green-700">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Ubicación"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="rounded-md border overflow-hidden h-[500px]">
        <LocationMap coordinates={form.watch("coordinates")} onMapClick={handleMapClick} />
      </div>
    </div>
  )
}

