import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

export default async function ProtectedTestPage() {
  // Verificar si el usuario está autenticado
  const supabase = await createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
  if (!session) {
    redirect("/signin?redirectTo=/protected-test")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Página Protegida</h1>
      <p>Esta página solo es accesible para usuarios autenticados.</p>
      <p>ID de usuario: {session.user.id}</p>
      <p>Email: {session.user.email}</p>
    </div>
  )
}
