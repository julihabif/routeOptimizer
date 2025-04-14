import { redirect } from "next/navigation"
import { UserProfile } from "@/components/auth/user-profile"
import { getCurrentUser } from "@/lib/actions/auth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default async function ProfilePage() {
  // Obtener el usuario actual
  const user = await getCurrentUser()

  // Si no hay usuario, redirigir a la página de inicio de sesión
  if (!user) {
    redirect("/signin?redirectTo=/profile")
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">Tu Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y preferencias</p>
        </div>

        <UserProfile user={user} />
      </div>
      <Footer />
    </main>
  )
}

