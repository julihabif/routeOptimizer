import { createServerSupabaseClient } from "@/lib/supabase"
import { getUserSavedLocations } from "@/lib/services/location-service"
import { redirect } from "next/navigation"
import { SavedLocationsList } from "@/components/saved-locations-list"
import { Button } from "@/components/ui/button"
import { Navigation } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default async function SavedLocationsPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si no hay una sesión, redirigir a la página de inicio de sesión
  if (!session) {
    redirect("/signin?redirectTo=/saved-locations")
  }

  // Obtener las ubicaciones guardadas del usuario
  const savedLocations = await getUserSavedLocations(session.user.id)

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold tracking-tight">Mis Ubicaciones Guardadas</h1>
            <p className="text-muted-foreground">
              Gestiona tus ubicaciones guardadas y accede a ellas cuando las necesites
            </p>
          </div>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
            <Link href="/add-location">
              <Navigation className="mr-2 h-5 w-5" />
              Añadir Nueva Ubicación
            </Link>
          </Button>
        </div>

        <SavedLocationsList locations={savedLocations} />
      </div>
      <Footer />
    </main>
  )
}

