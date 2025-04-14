"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar, ChevronRight, Heart, Map, MapPin, MoreHorizontal, Search, Trash, Share2, Clock } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"
import { deleteSavedRoute, toggleRouteFavorite } from "@/lib/services/route-service"
import type { SavedRouteItem } from "@/types/supabase-types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SavedRoutesListProps {
  routes: SavedRouteItem[]
}

export function SavedRoutesList({ routes }: SavedRoutesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [routeToDelete, setRouteToDelete] = useState<SavedRouteItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)

  // Filtrar rutas según la pestaña activa y la búsqueda
  const filteredRoutes = routes.filter((route) => {
    // Filtrar por tab
    if (activeTab === "favorites" && !route.isFavorite) return false

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        route.name.toLowerCase().includes(query) ||
        (route.description?.toLowerCase() || "").includes(query) ||
        route.route.start.name.toLowerCase().includes(query) ||
        route.route.end.name.toLowerCase().includes(query) ||
        route.route.stops.some((stop) => stop.name.toLowerCase().includes(query))
      )
    }

    return true
  })

  // Formatear la fecha
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: es })
    } catch (error) {
      return dateString
    }
  }

  // Formatear la duración
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes} min`
  }

  // Formatear la distancia
  const formatDistance = (meters: number) => {
    const km = meters / 1000
    return `${km.toFixed(1)} km`
  }

  // Manejar la eliminación de una ruta
  const handleDeleteRoute = async () => {
    if (!routeToDelete) return

    setIsDeleting(true)

    try {
      const result = await deleteSavedRoute(routeToDelete.id)

      if (result.success) {
        toast({
          title: "Ruta eliminada",
          description: "La ruta ha sido eliminada correctamente",
        })
        // Actualizar la lista de rutas (en una app real, se recargaría la página)
        window.location.reload()
      } else {
        toast({
          title: "Error al eliminar",
          description: result.error || "No se pudo eliminar la ruta",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al eliminar la ruta:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al eliminar la ruta",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setRouteToDelete(null)
    }
  }

  // Manejar el cambio de estado de favorito
  const handleToggleFavorite = async (route: SavedRouteItem) => {
    setIsTogglingFavorite(true)

    try {
      const result = await toggleRouteFavorite(route.id, !route.isFavorite)

      if (result.success) {
        toast({
          title: route.isFavorite ? "Eliminado de favoritos" : "Añadido a favoritos",
          description: route.isFavorite ? "La ruta ya no está en favoritos" : "La ruta se ha añadido a favoritos",
        })
        // Actualizar la lista de rutas (en una app real, se recargaría la página)
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo actualizar el estado de favorito",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al cambiar estado de favorito:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al actualizar el estado de favorito",
        variant: "destructive",
      })
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  // Manejar el compartir ruta
  const handleShareRoute = (route: SavedRouteItem) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/shared-route?data=${encodeURIComponent(JSON.stringify(route.route))}`,
    )

    toast({
      title: "Enlace copiado",
      description: "Enlace compartible copiado al portapapeles",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="favorites">Favoritas</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar rutas..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredRoutes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRoutes.map((route) => (
            <Card key={route.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      {route.name}
                      {route.isFavorite && <Heart className="ml-2 h-4 w-4 fill-red-500 text-red-500" />}
                    </CardTitle>
                    <CardDescription>{route.description || "Sin descripción"}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleToggleFavorite(route)}>
                        <Heart className={`mr-2 h-4 w-4 ${route.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                        {route.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShareRoute(route)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Compartir ruta
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setRouteToDelete(route)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Desde:</span>
                    <span className="truncate">{route.route.start.name}</span>
                  </div>
                  {route.route.stops.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="px-1">
                        {route.route.stops.length}
                      </Badge>
                      <span className="font-medium">Paradas</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Hasta:</span>
                    <span className="truncate">{route.route.end.name}</span>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Map className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDistance(route.route.distance)}</span>
                  </div>
                  <span className="text-sm">•</span>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDuration(route.route.duration)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-1">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(route.date)}</span>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                    <Link href={`/route/${route.id}`}>
                      Ver detalles
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Map className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No se encontraron rutas</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery
              ? "No hay rutas que coincidan con tu búsqueda"
              : activeTab === "favorites"
                ? "No tienes rutas marcadas como favoritas"
                : "Aún no has guardado ninguna ruta"}
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Crear nueva ruta</Link>
          </Button>
        </div>
      )}

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={!!routeToDelete} onOpenChange={(open) => !open && setRouteToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar ruta</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta ruta? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 rounded-lg border p-3">
            <p className="font-medium">{routeToDelete?.name}</p>
            <div className="text-sm text-muted-foreground">
              <div>De: {routeToDelete?.route.start.name}</div>
              <div>A: {routeToDelete?.route.end.name}</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRouteToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteRoute} disabled={isDeleting}>
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

