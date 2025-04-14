import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"

export default async function SignUpPage() {
  // Verificar si el usuario ya está autenticado
  try {
    const supabase = await createServerSupabaseClient()

    // Verificar que el cliente se creó correctamente
    if (!supabase) {
      console.error("No se pudo crear el cliente de Supabase en SignUpPage")
      // Continuar sin verificar la sesión, permitiendo que el usuario vea la página de registro
      return (
        <div className="container flex items-center justify-center min-h-screen py-10">
          <AuthForm type="signup" />
        </div>
      )
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Si ya hay una sesión, redirigir a la página principal
    if (session) {
      redirect("/")
    }
  } catch (error) {
    console.error("Error al verificar la sesión en SignUpPage:", error)
    // Continuar sin verificar la sesión, permitiendo que el usuario vea la página de registro
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <AuthForm type="signup" />
    </div>
  )
}
