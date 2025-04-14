import { RouteOptimizer } from "@/components/route-optimizer"
import { getCurrentUser } from "@/lib/actions/auth"

export default async function Home() {
  let user = null
  let isAuthenticated = false

  try {
    user = await getCurrentUser()
    isAuthenticated = !!user
    console.log("Renderizando página principal, estado de sesión:", isAuthenticated ? "Autenticado" : "No autenticado")
  } catch (error) {
    console.error("Error al verificar autenticación en la página principal:", error)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <RouteOptimizer />
      </div>
    </main>
  )
}
