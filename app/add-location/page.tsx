"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MapPin, Save, ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { LocationInput } from "@/components/location-input"
import { saveLocation } from "@/lib/services/location-service"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import type { Location } from "@/types/route"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// Esquema para la validación del formulario
const locationSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  address: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
  locationType: z.string().default("custom"),
  notes: z.string().optional(),
  isFavorite: z.boolean().default(false),
})

type LocationFormValues = z.infer<typeof locationSchema>

export default function AddLocationPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Configurar el formulario
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      address: "",
      locationType: "custom",
      notes: "",
      isFavorite: false,
    },
  })

  // Verificar el usuario al cargar la página
  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createBrowserSupabaseClient()
        if (!supabase) {
          throw new Error("No se pudo crear el cliente de Supabase")
        }

        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)

        if (!session?.user) {
          toast({
            title: "Inicia sesión para guardar ubicaciones",
            description: "Debes iniciar sesión para guardar ubicaciones",
            variant: "destructive",
          })
          router.push("/signin?redirectTo=/add-location")
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error)
      }
    }

    checkUser()
  }, [router])

  // Actualizar el formulario cuando se selecciona una ubicación
  const handleLocationChange = (location: Location) => {
    setSelectedLocation(location)
    form.setValue("name", location.name)
    form.setValue("address", location.name) // Usar el nombre como dirección por defecto
  }

  // Manejar el envío del formulario
  const onSubmit = async (values: LocationFormValues) => {
    if (!user) {
      toast({
        title: "Inicia sesión para guardar",
        description: "Debes iniciar sesión para guardar ubicaciones",
        variant: "destructive",
      })
      return
    }

    if (!selectedLocation) {
      toast({
        title: "Selecciona una ubicación",
        description: "Debes seleccionar una ubicación del mapa",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Crear una ubicación con los datos del formulario
      const locationToSave: Location = {
        ...selectedLocation,
        name: values.name, // Usar el nombre del formulario
      }

      const result = await saveLocation(user.id, locationToSave, values.address, values.locationType, values.isFavorite)

      if (result.success) {
        toast({
          title: "Ubicación guardada",
          description: "La ubicación ha sido guardada correctamente",
        })

        // Redirigir a la página de ubicaciones guardadas
        setTimeout(() => {
          router.push("/saved-locations")
        }, 1500)
      } else {
        toast({
          title: "Error al guardar",
          description: result.error || "No se pudo guardar la ubicación",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al guardar la ubicación:", error)
      toast({
        title: "Error al guardar",
        description: "Ha ocurrido un error al guardar la ubicación",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-8 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/saved-locations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a mis ubicaciones
            </Link>
          </Button>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">Añadir Nueva Ubicación</h1>
          <p className="text-muted-foreground">Guarda una ubicación para usarla en tus rutas</p>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Nueva Ubicación
            </CardTitle>
            <CardDescription>Busca y selecciona una ubicación en el mapa y completa los detalles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location-search">Buscar Ubicación</Label>
              <LocationInput
                id="location-search"
                placeholder="Busca una dirección o lugar"
                value={selectedLocation}
                onChange={handleLocationChange}
                className="bg-[#F0F9FF]"
              />
            </div>

            {selectedLocation && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la Ubicación</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Mi Casa, Oficina, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección Completa</FormLabel>
                        <FormControl>
                          <Input placeholder="Dirección completa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="locationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Ubicación</FormLabel>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="home">Casa</option>
                          <option value="work">Trabajo</option>
                          <option value="favorite">Favorito</option>
                          <option value="custom">Personalizado</option>
                        </select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas (opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Añade notas o información adicional sobre esta ubicación"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFavorite"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Marcar como favorita</FormLabel>
                          <FormDescription>Las ubicaciones favoritas aparecerán destacadas en tu lista</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Guardando..." : "Guardar Ubicación"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Las ubicaciones guardadas se pueden usar en tus rutas y compartir con otros usuarios
            </p>
          </CardFooter>
        </Card>

        <Toaster />
      </div>
      <Footer />
    </main>
  )
}

