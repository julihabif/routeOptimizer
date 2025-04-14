"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getBrowserClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setIsAuthenticated(true)
        } else {
          router.push(`${redirectTo}?redirectTo=${window.location.pathname}`)
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        router.push(`${redirectTo}?redirectTo=${window.location.pathname}`)
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
      if (event === "SIGNED_IN" && session) {
        setIsAuthenticated(true)
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false)
        router.push(`${redirectTo}?redirectTo=${window.location.pathname}`)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, redirectTo])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : null
}

