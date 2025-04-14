import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { supabaseConfig } from "@/lib/supabase/config"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const redirectTo = requestUrl.searchParams.get("redirectTo") || "/"

  if (code) {
    try {
      const cookieStore = cookies()

      const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
        cookies: {
          get(name: string) {
            const cookie = cookieStore.get(name)
            return cookie?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options }) // Apply global cookie options
            } catch (error) {
              console.error(`Error al establecer cookie ${name}:`, error)
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.delete({ name, ...options }) // Apply global cookie options
            } catch (error) {
              console.error(`Error al eliminar cookie ${name}:`, error)
            }
          },
        },
      })

      // Intercambiar el código por una sesión
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error al intercambiar el código por una sesión:", error)
        return NextResponse.redirect(new URL("/signin?error=auth", request.url))
      }

      // Verificar que la sesión se haya creado correctamente
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        console.error("No se pudo crear la sesión")
        return NextResponse.redirect(new URL("/signin?error=session", request.url))
      }

      console.log("Sesión creada correctamente, redirigiendo a", redirectTo)

      // Redirigir a la página solicitada
      return NextResponse.redirect(new URL(redirectTo, request.url))
    } catch (error) {
      console.error("Error en la ruta de callback:", error)
      return NextResponse.redirect(new URL("/signin?error=unknown", request.url))
    }
  }

  // Si no hay código, redirigir a la página de inicio de sesión
  return NextResponse.redirect(new URL("/signin?error=no-code", request.url))
}
