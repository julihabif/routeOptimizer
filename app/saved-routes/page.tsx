import { createServerSupabaseClient } from "@/lib/supabase"
import { getUserSavedRoutes } from "@/lib/services/route-service"
import { redirect } from "next/navigation"
import { SavedRoutesList } from "@/components/saved-routes-list"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default async function SavedRoutesPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si no hay una sesión, redirigir a la página de inicio de sesión
  if (!session) {
    console.log("SavedRoutesPage: Usuario no autenticado, redirigiendo a /signin")
    redirect("/signin?redirectTo=/saved-routes")
  }

  // Obtener las rutas guardadas del usuario
  console.log("SavedRoutesPage: Usuario autenticado, obteniendo rutas guardadas")
  const savedRoutes = await getUserSavedRoutes(session.user.id)

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">Mis Rutas Guardadas</h1>
          <p className="text-muted-foreground">Gestiona tus rutas guardadas y accede a ellas cuando las necesites</p>
        </div>

        <SavedRoutesList routes={savedRoutes} />
      </div>
      <Footer />
    </main>
  )
}
