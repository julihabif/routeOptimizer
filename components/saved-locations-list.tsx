"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Heart, MapPin, MoreHorizontal, Search, Trash2, Share2, Navigation, Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { deleteSavedLocation, toggleLocationFavorite } from "@/lib/services/location-service"
import type { SavedLocationItem } from "@/types/supabase-types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface SavedLocationsListProps {
  locations: SavedLocationItem[]
}

export function SavedLocationsList({ locations }: SavedLocationsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [locationToDelete, setLocationToDelete] = useState<SavedLocationItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)

  // Filtrar ubicaciones según la pestaña activa y la búsqueda
  const filteredLocations = locations.filter((location) => {
    // Filtrar por tab
    if (activeTab === "favorites" && !location.isFavorite) return false

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        location.name.toLowerCase().includes(query) ||
        location.address.toLowerCase().includes(query) ||
        location.locationType.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Manejar la eliminación de una ubicación
  const handleDeleteLocation = async () => {
    if (!locationToDelete) return

    setIsDeleting(true)

    try {
      const result = await deleteSavedLocation(locationToDelete.id)

      if (result.success) {
        toast({
          title: "Ubicación eliminada",
          description: "La ubicación ha sido eliminada correctamente",
        })
        // Actualizar la lista de ubicaciones (en una app real, se recargaría la página)
        window.location.reload()
      } else {
        toast({
          title: "Error al eliminar",
          description: result.error || "No se pudo eliminar la ubicación",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al eliminar la ubicación:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al eliminar la ubicación",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setLocationToDelete(null)
    }
  }

  // Manejar el cambio de estado de favorito
  const handleToggleFavorite = async (location: SavedLocationItem) => {
    setIsTogglingFavorite(true)

    try {
      const result = await toggleLocationFavorite(location.id, !location.isFavorite)

      if (result.success) {
        toast({
          title: location.isFavorite ? "Eliminado de favoritos" : "Añadido a favoritos",
          description: location.isFavorite
            ? "La ubicación ya no está en favoritos"
            : "La ubicación se ha añadido a favoritos",
        })
        // Actualizar la lista de ubicaciones (en una app real, se recargaría la página)
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

  // Manejar el compartir ubicación
  const handleShareLocation = (location: SavedLocationItem) => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${location.coordinates[1]},${location.coordinates[0]}`
    navigator.clipboard.writeText(mapUrl)

    toast({
      title: "Enlace copiado",
      description: "Enlace de Google Maps copiado al portapapeles",
    })
  }

  // Obtener el ícono según el tipo de ubicación
  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return "🏠"
      case "work":
        return "🏢"
      case "favorite":
        return "⭐"
      default:
        return "📍"
    }
  }

  // Obtener el nombre legible del tipo de ubicación
  const getLocationTypeName = (type: string) => {
    switch (type) {
      case "home":
        return "Casa"
      case "work":
        return "Trabajo"
      case "favorite":
        return "Favorito"
      default:
        return "Personalizado"
    }
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
            placeholder="Buscar ubicaciones..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredLocations.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLocations.map((location) => (
            <Card key={location.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <span className="mr-2">{getLocationTypeIcon(location.locationType)}</span>
                      {location.name}
                      {location.isFavorite && <Heart className="ml-2 h-4 w-4 fill-red-500 text-red-500" />}
                    </CardTitle>
                    <CardDescription>{location.address}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleToggleFavorite(location)}>
                        <Heart className={`mr-2 h-4 w-4 ${location.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                        {location.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShareLocation(location)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Compartir ubicación
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setLocationToDelete(location)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
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
                    <span className="font-medium">Tipo:</span>
                    <Badge variant="outline">{getLocationTypeName(location.locationType)}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Coordenadas:</span>
                    <span className="text-xs text-muted-foreground">
                      {location.coordinates[1].toFixed(6)}, {location.coordinates[0].toFixed(6)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-1">
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleShareLocation(location)}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Ver en Google Maps
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No se encontraron ubicaciones</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery
              ? "No hay ubicaciones que coincidan con tu búsqueda"
              : activeTab === "favorites"
                ? "No tienes ubicaciones marcadas como favoritas"
                : "Aún no has guardado ninguna ubicación"}
          </p>
          <Button asChild className="mt-4">
            <Link href="/add-location">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Nueva Ubicación
            </Link>
          </Button>
        </div>
      )}

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={!!locationToDelete} onOpenChange={(open) => !open && setLocationToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar ubicación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta ubicación? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 rounded-lg border p-3">
            <p className="font-medium">{locationToDelete?.name}</p>
            <div className="text-sm text-muted-foreground">
              <div>{locationToDelete?.address}</div>
              <div>Tipo: {getLocationTypeName(locationToDelete?.locationType || "custom")}</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLocationToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteLocation} disabled={isDeleting}>
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

