import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { MapPin, Navigation, User, Clock, Map } from "lucide-react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase-types"

export default async function DashboardPage() {
  // Crear cliente de Supabase con manejo asíncrono de cookies
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })

  // Verificar si el usuario está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si no está autenticado, redirigir a la página de inicio de sesión
  if (!session) {
    redirect("/signin?redirectTo=/dashboard")
  }

  // Obtener información del usuario
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Obtener datos del perfil del usuario
  const { data: profile } = await supabase.from("users").select("*").eq("id", user?.id).single()

  // Obtener rutas recientes (hasta 3)
  const { data: recentRoutes } = await supabase
    .from("saved_routes")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(3)

  // Obtener conteo de rutas y ubicaciones
  const { count: routesCount } = await supabase
    .from("saved_routes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)

  const { count: locationsCount } = await supabase
    .from("saved_locations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido, {profile?.name || user?.email?.split("@")[0]}. Gestiona tus rutas y ubicaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Panel de perfil */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-route-primary" />
                Tu Perfil
              </CardTitle>
              <CardDescription>Información personal y estadísticas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Nombre:</span>
                  <span className="text-sm">{profile?.name || "No establecido"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Rutas guardadas:</span>
                  <span className="text-sm">{routesCount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Ubicaciones guardadas:</span>
                  <span className="text-sm">{locationsCount || 0}</span>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Panel de acciones rápidas */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-route-primary" />
                Acciones Rápidas
              </CardTitle>
              <CardDescription>Accede rápidamente a las funciones principales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  asChild
                  className="h-auto py-4 flex flex-col items-center justify-center bg-route-background hover:bg-route-background/80 text-route-primary"
                >
                  <Link href="/">
                    <Navigation className="h-8 w-8 mb-2" />
                    <span className="text-base font-medium">Crear Nueva Ruta</span>
                    <span className="text-xs text-muted-foreground mt-1">Optimiza una ruta con múltiples paradas</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <Link href="/saved-routes">
                    <Map className="h-8 w-8 mb-2 text-route-primary" />
                    <span className="text-base font-medium">Mis Rutas</span>
                    <span className="text-xs text-muted-foreground mt-1">Ver y gestionar rutas guardadas</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <Link href="/saved-locations">
                    <MapPin className="h-8 w-8 mb-2 text-route-primary" />
                    <span className="text-base font-medium">Mis Ubicaciones</span>
                    <span className="text-xs text-muted-foreground mt-1">Gestionar ubicaciones guardadas</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <Link href="/add-location">
                    <MapPin className="h-8 w-8 mb-2 text-route-secondary" />
                    <span className="text-base font-medium">Añadir Ubicación</span>
                    <span className="text-xs text-muted-foreground mt-1">Guardar una nueva ubicación</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Panel de rutas recientes */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-route-primary" />
                Rutas Recientes
              </CardTitle>
              <CardDescription>Tus últimas rutas guardadas</CardDescription>
            </CardHeader>
            <CardContent>
              {recentRoutes && recentRoutes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentRoutes.map((route) => (
                    <Card key={route.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="font-medium mb-2">{route.name}</div>
                        <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {route.description || "Sin descripción"}
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{new Date(route.created_at).toLocaleDateString()}</span>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/route/${route.id}`}>Ver Detalles</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No tienes rutas guardadas todavía</p>
                  <Button asChild>
                    <Link href="/">Crear tu primera ruta</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}
