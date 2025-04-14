import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { supabaseConfig } from "@/lib/supabase/config"

// Rutas que no requieren autenticación (públicas)
const publicRoutes = [
  "/",
  "/signin",
  "/signup",
  "/auth/callback",
  "/about",
  "/terms",
  "/privacy",
  "/check-env",
  "/setup-database",
  "/setup-database-manual",
  "/setup-rls",
  "/setup-rls-correctly",
  "/fix-rls",
  "/manual-rls-fix",
  "/disable-rls",
  "/fix-table-structure",
  "/direct-sql",
  "/debug",
  "/auth-debug",
  "/auth-diagnostics",
  "/mapbox-debug",
  "/supabase-debug",
  "/rls-diagnosis",
  "/fix-auth",
  "/fix-cookie-parse",
  "/fix-cookies",
  "/setup-sql",
  "/diagnostics",
  "/auth-status",
  "/manual-de-usuario",
]

// Rutas que requieren autenticación (protegidas)
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/saved-routes",
  "/saved-locations",
  "/route",
  "/add-location",
  "/protected-test",
]

// Rutas de API que no requieren autenticación
const apiRoutes = ["/api/", "/auth/"]

export async function middleware(req: NextRequest) {
  try {
    // Verificar si la ruta actual es pública, protegida o de API
    const path = req.nextUrl.pathname
    console.log("Middleware: Verificando ruta:", path)

    // Verificar si es una ruta pública
    const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(route + "/"))

    // Verificar si es una ruta protegida
    const isProtectedRoute = protectedRoutes.some((route) => path === route || path.startsWith(route + "/"))

    // Verificar si es una ruta de API
    const isApiRoute = apiRoutes.some((route) => path.startsWith(route))

    // Verificar si es un activo estático
    const isStaticAsset =
      path.includes("_next") ||
      path.includes("favicon.ico") ||
      path.includes(".js") ||
      path.includes(".css") ||
      path.includes(".png") ||
      path.includes(".jpg") ||
      path.includes(".svg")

    // Si es una ruta pública, de API o un activo estático, permitir el acceso sin verificar autenticación
    if (isPublicRoute || isApiRoute || isStaticAsset) {
      return NextResponse.next()
    }

    // Si no es una ruta protegida, permitir el acceso
    if (!isProtectedRoute) {
      return NextResponse.next()
    }

    // Si es una ruta protegida, verificar la autenticación
    const res = NextResponse.next()

    // Crear cliente de Supabase
    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.delete({ name, ...options })
        },
      },
    })

    // Verificar la sesión
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Si no hay sesión, redirigir a la página de inicio de sesión
    if (!session) {
      console.log("Middleware: Usuario no autenticado, redirigiendo a /signin desde:", path)
      const redirectUrl = new URL("/signin", req.url)
      redirectUrl.searchParams.set("redirectTo", path)
      return NextResponse.redirect(redirectUrl)
    }

    // Si hay sesión, permitir el acceso
    console.log("Middleware: Usuario autenticado, permitiendo acceso a ruta protegida:", path)
    return res
  } catch (error) {
    console.error("Error en middleware:", error)

    // En caso de error, permitir el acceso
    return NextResponse.next()
  }
}

// Configurar el middleware para que se ejecute en todas las rutas excepto las estáticas
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
