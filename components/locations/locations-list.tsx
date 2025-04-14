"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, MapPin } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

// Tipo para las ubicaciones
interface Location {
  id: string
  name: string
  address: string
  coordinates: [number, number]
  locationType: string
  isFavorite: boolean
  createdAt: string
}

// Props para el componente
interface LocationsListProps {
  locations: Location[]
  isLoading?: boolean
}

// Componente de esqueleto para mostrar durante la carga
export function LocationsSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
              <TableCell>
                <Skeleton className="h-5 w-[180px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[250px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[100px]" />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Componente principal de lista de ubicaciones
export function LocationsList({ locations, isLoading = false }: LocationsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
  const router = useRouter()

  // Filtrar ubicaciones cuando cambia la búsqueda o las ubicaciones
  useEffect(() => {
    if (!locations) return

    if (searchQuery.trim() === "") {
      setFilteredLocations(locations)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = locations.filter(
        (location) => location.name.toLowerCase().includes(query) || location.address.toLowerCase().includes(query),
      )
      setFilteredLocations(filtered)
    }
  }, [searchQuery, locations])

  // Función para obtener el ícono según el tipo de ubicación
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

  // Función para obtener el nombre legible del tipo de ubicación
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

  // Si está cargando, mostrar el esqueleto
  if (isLoading) {
    return <LocationsSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar ubicaciones..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
          <Link href="/add-location">
            <Plus className="mr-2 h-4 w-4" />
            Añadir Nueva Ubicación
          </Link>
        </Button>
      </div>

      {filteredLocations.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <span className="mr-2">{getLocationTypeIcon(location.locationType)}</span>
                      {location.name}
                      {location.isFavorite && <span className="ml-2 text-red-500">❤</span>}
                    </div>
                  </TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getLocationTypeName(location.locationType)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/location/${location.id}`)}>
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => router.push(`/location/${location.id}/edit`)}>
                        Editar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No se encontraron ubicaciones</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery ? "No hay ubicaciones que coincidan con tu búsqueda" : "Aún no has guardado ninguna ubicación"}
          </p>
          <Button asChild className="mt-4">
            <Link href="/add-location">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Nueva Ubicación
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

