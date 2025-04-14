import { CookieCleaner } from "@/components/cookie-fixer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function FixCookiesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">Solucionar Problemas de Cookies</h1>
          <p className="text-muted-foreground">
            Utiliza esta herramienta para solucionar problemas relacionados con cookies de autenticación
          </p>
        </div>

        <CookieCleaner />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Información Adicional</h2>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">¿Por qué ocurre este problema?</h3>
            <p>
              El error <code>Failed to parse cookie string</code> puede ocurrir por varias razones:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Cookies corruptas en el navegador</li>
              <li>Problemas con la configuración de cookies en el middleware</li>
              <li>Incompatibilidad entre versiones de la biblioteca de Supabase</li>
              <li>Problemas con el manejo de cookies en el entorno de desarrollo</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Pasos adicionales si el problema persiste</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Intenta usar el modo incógnito o un navegador diferente</li>
              <li>Verifica que las variables de entorno de Supabase estén correctamente configuradas</li>
              <li>Asegúrate de que estás usando versiones compatibles de las bibliotecas de Supabase</li>
              <li>Revisa la configuración de CORS en tu proyecto de Supabase</li>
            </ol>
          </div>
        </div>

        <div className="flex justify-center">
          <Button asChild>
            <Link href="/signin">Volver a Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </main>
  )
}
