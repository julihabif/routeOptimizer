"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { MapPin, MoreHorizontal, LucideRoute, Clock, ArrowRight, Edit, Trash2, Search, Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface RouteLocation {
  id: string
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface Route {
  id: string
  name: string
  description: string
  locations: RouteLocation[]
  distance: number
  duration: number
  created_at: string
}

export function RoutesList() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setLoading(false)
          return
        }

        // Simulando datos para la demostración
        // En una implementación real, esto sería una consulta a Supabase
        const mockRoutes: Route[] = [
          {
            id: "1",
            name: "Ruta de Entrega Norte",
            description: "Ruta optimizada para entregas en la zona norte de la ciudad",
            locations: [
              {
                id: "1",
                name: "Almacén Central",
                address: "Calle Principal 123, Madrid",
                coordinates: { lat: 40.416775, lng: -3.70379 },
              },
              {
                id: "2",
                name: "Cliente A",
                address: "Avenida Norte 45, Madrid",
                coordinates: { lat: 40.426775, lng: -3.71379 },
              },
              {
                id: "3",
                name: "Cliente B",
                address: "Calle Secundaria 67, Madrid",
                coordinates: { lat: 40.436775, lng: -3.72379 },
              },
            ],
            distance: 15.7,
            duration: 45,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "2",
            name: "Ruta de Proveedores",
            description: "Visita a proveedores principales",
            locations: [
              {
                id: "4",
                name: "Oficina Central",
                address: "Gran Vía 100, Madrid",
                coordinates: { lat: 40.420775, lng: -3.70879 },
              },
              {
                id: "5",
                name: "Proveedor 1",
                address: "Polígono Industrial Este, Nave 12, Madrid",
                coordinates: { lat: 40.430775, lng: -3.71879 },
              },
              {
                id: "6",
                name: "Proveedor 2",
                address: "Polígono Industrial Sur, Nave 5, Madrid",
                coordinates: { lat: 40.410775, lng: -3.72879 },
              },
              {
                id: "7",
                name: "Proveedor 3",
                address: "Calle Industria 34, Madrid",
                coordinates: { lat: 40.400775, lng: -3.73879 },
              },
            ],
            distance: 28.3,
            duration: 75,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "3",
            name: "Ruta Comercial Semanal",
            description: "Visitas a clientes potenciales",
            locations: [
              {
                id: "8",
                name: "Oficina Comercial",
                address: "Paseo de la Castellana 200, Madrid",
                coordinates: { lat: 40.440775, lng: -3.68879 },
              },
              {
                id: "9",
                name: "Cliente Potencial X",
                address: "Calle Velázquez 50, Madrid",
                coordinates: { lat: 40.450775, lng: -3.67879 },
              },
              {
                id: "10",
                name: "Cliente Potencial Y",
                address: "Calle Serrano 70, Madrid",
                coordinates: { lat: 40.460775, lng: -3.66879 },
              },
            ],
            distance: 12.5,
            duration: 35,
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]

        setRoutes(mockRoutes)
        setFilteredRoutes(mockRoutes)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar las rutas:", error)
        setLoading(false)
      }
    }

    fetchRoutes()
  }, [supabase])

  useEffect(() => {
    if (searchTerm) {
      const filtered = routes.filter(
        (route) =>
          route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.locations.some(
            (loc) =>
              loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              loc.address.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      )
      setFilteredRoutes(filtered)
    } else {
      setFilteredRoutes(routes)
    }
  }, [searchTerm, routes])

  const handleDeleteRoute = async (id: string) => {
    try {
      // Aquí iría la lógica real para eliminar la ruta
      // await supabase.from('routes').delete().eq('id', id)

      // Actualizamos el estado local para reflejar la eliminación
      const updatedRoutes = routes.filter((route) => route.id !== id)
      setRoutes(updatedRoutes)
      setFilteredRoutes(
        updatedRoutes.filter(
          (route) =>
            route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.locations.some(
              (loc) =>
                loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                loc.address.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        ),
      )

      toast({
        title: "Ruta eliminada",
        description: "La ruta ha sido eliminada correctamente",
      })
    } catch (error) {
      console.error("Error al eliminar la ruta:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la ruta",
        variant: "destructive",
      })
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours} h ${remainingMinutes} min` : `${hours} h`
  }

  if (loading) {
    return <RoutesSkeleton />
  }

  if (routes.length === 0) {
    return (
      <div className="text-center py-12">
        <LucideRoute className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No tienes rutas guardadas</h3>
        <p className="text-muted-foreground mb-4">Crea tu primera ruta para optimizar tus desplazamientos.</p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/create-route">
            <Plus className="mr-2 h-4 w-4" />
            Crear Ruta
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar rutas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRoutes.map((route) => (
          <Card key={route.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{route.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{route.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-mt-1 -mr-2">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Acciones</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/view-route/${route.id}`} className="flex items-center">
                        <LucideRoute className="mr-2 h-4 w-4" />
                        <span>Ver ruta</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/edit-route/${route.id}`} className="flex items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => handleDeleteRoute(route.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-sm">
                  <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{route.locations.length} ubicaciones</span>
                </div>
                <div className="flex items-center text-sm">
                  <LucideRoute className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{route.distance.toFixed(1)} km</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{formatDuration(route.duration)}</span>
                </div>
              </div>

              <div className="space-y-2">
                {route.locations.slice(0, 3).map((location, index) => (
                  <div key={location.id} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{location.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{location.address}</p>
                    </div>
                    {index < 2 && <ArrowRight className="h-4 w-4 text-muted-foreground mx-1 self-center" />}
                  </div>
                ))}

                {route.locations.length > 3 && (
                  <div className="text-sm text-muted-foreground text-center mt-2">
                    + {route.locations.length - 3} ubicaciones más
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Creada {formatDistanceToNow(new Date(route.created_at), { addSuffix: true, locale: es })}
              </div>
              <Button asChild variant="ghost" size="sm" className="ml-auto">
                <Link href={`/view-route/${route.id}`}>Ver detalles</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function RoutesSkeleton() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-full max-w-md" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-3/4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>

              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-start">
                    <Skeleton className="h-6 w-6 rounded-full mr-2" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24 ml-auto" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

