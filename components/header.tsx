"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { MapIcon, Menu, Navigation, Plus, MapPin } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { UserNav } from "@/components/auth/user-nav"
import { useState, useEffect } from "react"

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        // Import getCurrentUser dynamically
        const { getCurrentUser } = await import("@/lib/actions/auth")
        const user = await getCurrentUser()
        setUser(user)
      } catch (error) {
        console.error("Error al obtener el usuario en el header:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <MapIcon className="h-6 w-6 text-route-primary" />
          <Link href="/" className="font-display text-xl font-bold">
            RouteOptimizer
          </Link>
        </div>

        {/* Navegación para pantallas medianas y grandes */}
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Inicio</Link>
          </Button>

          {user && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/saved-routes">
                  <Navigation className="mr-2 h-4 w-4" />
                  Mis Rutas
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/saved-locations">
                  <MapPin className="mr-2 h-4 w-4" />
                  Mis Ubicaciones
                </Link>
              </Button>
              <Button variant="outline" asChild className="bg-green-50 hover:bg-green-100 border-green-200">
                <Link href="/add-location">
                  <Plus className="mr-2 h-4 w-4 text-green-600" />
                  <span className="text-green-600">Añadir Ubicación</span>
                </Link>
              </Button>
            </>
          )}

          <Button variant="ghost" asChild>
            <Link href="/about">Acerca de</Link>
          </Button>

          <ModeToggle />

          <UserNav initialUser={user} />
        </nav>

        {/* Menú móvil */}
        <div className="flex items-center md:hidden">
          <ModeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <MapIcon className="h-5 w-5 text-route-primary" />
                  RouteOptimizer
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-6">
                <Button variant="ghost" asChild>
                  <Link href="/">Inicio</Link>
                </Button>

                {user && (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/saved-routes">
                        <Navigation className="mr-2 h-4 w-4" />
                        Mis Rutas
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/saved-locations">
                        <MapPin className="mr-2 h-4 w-4" />
                        Mis Ubicaciones
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="bg-green-50 hover:bg-green-100 border-green-200">
                      <Link href="/add-location">
                        <Plus className="mr-2 h-4 w-4 text-green-600" />
                        <span className="text-green-600">Añadir Ubicación</span>
                      </Link>
                    </Button>
                  </>
                )}

                <Button variant="ghost" asChild>
                  <Link href="/about">Acerca de</Link>
                </Button>

                <Button variant="ghost" asChild>
                  <Link href="/fix-cookies">Solucionar Cookies</Link>
                </Button>

                <div className="my-2 border-t" />

                <Button variant="ghost" asChild>
                  <Link href="/profile">Mi Perfil</Link>
                </Button>
                <Button asChild>
                  <Link href="/signin">Iniciar Sesión</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
