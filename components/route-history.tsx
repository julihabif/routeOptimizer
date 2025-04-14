'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Clock, Star, StarOff, MapPin, Calendar, Share2, Trash2 } from 'lucide-react'
import type { Route } from '@/types/route'
import { formatDistance, formatDuration, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { getSavedRoutes, toggleFavorite, deleteRoute } from '@/app/actions/routes'

interface RouteHistoryProps {
  userId: string
  onSelectRoute: (route: Route) => void
}

interface SavedRoute {
  id: string
  name: string
  description: string | null
  route: Route
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export function RouteHistory({ userId, onSelectRoute }: RouteHistoryProps) {
  const [routes, setRoutes] = useState<SavedRoute[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await getSavedRoutes(userId)

        if (!data) {
          setRoutes([])
          return
        }

        const transformedRoutes = data.map(route => ({
          id: route.id,
          name: route.name,
          description: route.description,
          route: route.route_data as Route,
          isFavorite: route.is_favorite,
          createdAt: route.created_at,
          updatedAt: route.updated_at,
        }))

        setRoutes(transformedRoutes)
      } catch (error) {
        console.error('Error al cargar las rutas:', error)
        setError('No se pudieron cargar las rutas guardadas')
        toast({
          title: "Error",
          description: "No se pudieron cargar las rutas guardadas",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchRoutes()
    }
  }, [userId])

  const handleToggleFavorite = async (routeId: string) => {
    try {
      const route = routes.find(r => r.id === routeId)
      if (!route) return

      await toggleFavorite(routeId, !route.isFavorite)

      setRoutes(routes.map(route => 
        route.id === routeId 
          ? { ...route, isFavorite: !route.isFavorite }
          : route
      ))

      toast({
        title: "Actualizado",
        description: "El estado de favorito ha sido actualizado",
      })
    } catch (error) {
      console.error('Error al actualizar favorito:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de favorito",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRoute = async (routeId: string) => {
    try {
      await deleteRoute(routeId)

      setRoutes(routes.filter(route => route.id !== routeId))

      toast({
        title: "Eliminado",
        description: "La ruta ha sido eliminada correctamente",
      })
    } catch (error) {
      console.error('Error al eliminar la ruta:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la ruta",
        variant: "destructive",
      })
    }
  }

  const shareRoute = async (route: SavedRoute) => {
    try {
      const shareData = {
        title: route.name,
        text: route.description || 'Ruta compartida',
        url: `${window.location.origin}/shared-route/${route.id}`,
      }

      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        toast({
          title: "Enlace copiado",
          description: "El enlace ha sido copiado al portapapeles",
        })
      }
    } catch (error) {
      console.error('Error al compartir la ruta:', error)
      toast({
        title: "Error",
        description: "No se pudo compartir la ruta",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Rutas</CardTitle>
          <CardDescription>Cargando rutas guardadas...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Rutas</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (routes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Rutas</CardTitle>
          <CardDescription>No hay rutas guardadas</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Rutas</CardTitle>
        <CardDescription>Rutas guardadas anteriormente</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {routes.map((route) => (
              <div key={route.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{route.name}</h3>
                    {route.description && (
                      <p className="text-sm text-muted-foreground">{route.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleFavorite(route.id)}
                    >
                      {route.isFavorite ? (
                        <Star className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => shareRoute(route)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRoute(route.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {route.route.stops.length} paradas
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {formatDuration(route.route.duration)}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {formatDate(route.createdAt)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => onSelectRoute(route.route)}
                >
                  Usar esta ruta
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 