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
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { toast } from '@/components/ui/use-toast'

interface SavedRoutesProps {
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

export function SavedRoutes({ onSelectRoute }: SavedRoutesProps) {
  const [routes, setRoutes] = useState<SavedRoute[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const supabase = createServerSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          setError('Debes iniciar sesión para ver tus rutas guardadas')
          return
        }

        const { data, error: fetchError } = await supabase
          .from('saved_routes')
          .select('*')
          .eq('user_id', session.user.id)
          .order('updated_at', { ascending: false })

        if (fetchError) throw fetchError

        setRoutes(data || [])
      } catch (error) {
        console.error('Error al cargar las rutas guardadas:', error)
        setError('No se pudieron cargar las rutas guardadas')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoutes()
  }, [])

  const toggleFavorite = async (routeId: string) => {
    try {
      const supabase = createServerSupabaseClient()
      const route = routes.find(r => r.id === routeId)
      if (!route) return

      const { error } = await supabase
        .from('saved_routes')
        .update({ is_favorite: !route.isFavorite })
        .eq('id', routeId)

      if (error) throw error

      setRoutes(prev =>
        prev.map(r =>
          r.id === routeId ? { ...r, isFavorite: !r.isFavorite } : r
        )
      )

      toast({
        title: route.isFavorite ? 'Ruta removida de favoritos' : 'Ruta añadida a favoritos',
        description: `La ruta "${route.name}" ha sido ${route.isFavorite ? 'removida de' : 'añadida a'} favoritos`,
      })
    } catch (error) {
      console.error('Error al actualizar favorito:', error)
      toast({
        title: 'Error al actualizar favorito',
        description: 'No se pudo actualizar el estado de favorito de la ruta',
        variant: 'destructive',
      })
    }
  }

  const deleteRoute = async (routeId: string) => {
    try {
      const supabase = createServerSupabaseClient()
      const route = routes.find(r => r.id === routeId)
      if (!route) return

      const { error } = await supabase
        .from('saved_routes')
        .delete()
        .eq('id', routeId)

      if (error) throw error

      setRoutes(prev => prev.filter(r => r.id !== routeId))

      toast({
        title: 'Ruta eliminada',
        description: `La ruta "${route.name}" ha sido eliminada`,
      })
    } catch (error) {
      console.error('Error al eliminar la ruta:', error)
      toast({
        title: 'Error al eliminar la ruta',
        description: 'No se pudo eliminar la ruta',
        variant: 'destructive',
      })
    }
  }

  const shareRoute = async (route: SavedRoute) => {
    try {
      await navigator.share({
        title: route.name,
        text: `Ruta: ${route.name}\nParadas: ${route.route.stops.length}\nDistancia: ${formatDistance(route.route.distance)}\nDuración: ${formatDuration(route.route.duration)}`,
        url: window.location.href,
      })
    } catch (error) {
      console.error('Error al compartir la ruta:', error)
      toast({
        title: 'Error al compartir',
        description: 'No se pudo compartir la ruta',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">{error}</div>
        </CardContent>
      </Card>
    )
  }

  const filteredRoutes = filter === 'favorites' 
    ? routes.filter(route => route.isFavorite)
    : routes

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Rutas Guardadas</CardTitle>
            <CardDescription>Tus rutas guardadas y favoritas</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              Todas
            </Button>
            <Button
              variant={filter === 'favorites' ? 'default' : 'outline'}
              onClick={() => setFilter('favorites')}
              size="sm"
            >
              Favoritas
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredRoutes.map((route) => (
              <Card key={route.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{route.name}</h4>
                      {route.description && (
                        <p className="text-sm text-muted-foreground">
                          {route.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(route.id)}
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
                        onClick={() => deleteRoute(route.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {route.route.stops.length} paradas
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(route.route.duration)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(route.createdAt)}
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {formatDistance(route.route.distance)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectRoute(route.route)}
                    >
                      Cargar Ruta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredRoutes.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                {filter === 'favorites' 
                  ? 'No tienes rutas favoritas'
                  : 'No hay rutas guardadas'}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 