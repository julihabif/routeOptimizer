"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getBrowserClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface RouteGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function RouteGuard({ children, redirectTo = "/signin" }: RouteGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("RouteGuard: Verificando autenticación...")
        const supabase = getBrowserClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          console.log("RouteGuard: Usuario autenticado, permitiendo acceso")
          setIsAuthenticated(true)
        } else {
          console.log("RouteGuard: Usuario no autenticado, redirigiendo a", `${redirectTo}?redirectTo=${pathname}`)
          // Usar replace en lugar de push para evitar problemas con el historial del navegador
          router.replace(`${redirectTo}?redirectTo=${encodeURIComponent(pathname)}`)
        }
      } catch (error) {
        console.error("RouteGuard: Error al verificar autenticación:", error)
        router.replace(`${redirectTo}?redirectTo=${encodeURIComponent(pathname)}`)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Suscribirse a cambios en la autenticación
    const supabase = getBrowserClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("RouteGuard: Evento de autenticación:", event)
      if (event === "SIGNED_IN" && session) {
        console.log("RouteGuard: Usuario ha iniciado sesión")
        setIsAuthenticated(true)
      } else if (event === "SIGNED_OUT") {
        console.log("RouteGuard: Usuario ha cerrado sesión, redirigiendo")
        setIsAuthenticated(false)
        router.replace(`${redirectTo}?redirectTo=${encodeURIComponent(pathname)}`)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, redirectTo, pathname])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : null
}
