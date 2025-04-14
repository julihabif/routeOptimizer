import { notFound } from "next/navigation"
import { getSavedRouteById } from "@/lib/services/route-service"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapIcon, BookOpen } from "lucide-react"
import Link from "next/link"
import { RouteMap } from "@/components/route-map"
import { RouteDetails } from "@/components/route-details"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface RoutePageProps {
  params: {
    id: string
  }
}

export default async function RoutePage({ params }: RoutePageProps) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Verificar que el usuario está autenticado
  if (!session) {
    return notFound()
  }

  // Obtener los detalles de la ruta
  const route = await getSavedRouteById(params.id)

  // Si no se encuentra la ruta, mostrar la página 404
  if (!route) {
    return notFound()
  }

  // Formatear la fecha
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/saved-routes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a mis rutas
            </Link>
          </Button>
          <h1 className="font-display text-3xl font-bold tracking-tight">{route.name}</h1>
          <p className="text-muted-foreground">
            {route.description || "Sin descripción"} • Guardada el {formatDate(route.date)}
          </p>
        </div>
      </div>

      <Tabs defaultValue="map" className="space-y-6">
        <TabsList>
          <TabsTrigger value="map">
            <MapIcon className="mr-2 h-4 w-4" />
            Mapa
          </TabsTrigger>
          <TabsTrigger value="details">
            <BookOpen className="mr-2 h-4 w-4" />
            Detalles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Ruta</CardTitle>
              <CardDescription>Visualización de la ruta guardada</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RouteMap route={route.route} className="h-[500px] w-full" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <RouteDetails route={route.route} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

