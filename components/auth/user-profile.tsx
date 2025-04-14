"use client"

import { useState, useEffect } from "react"
import { getBrowserClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getBrowserClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Error al obtener el usuario:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Suscribirse a cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.refresh()
      router.push("/")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  if (loading) {
    return <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
  }

  if (!user) {
    return (
      <Button variant="outline" onClick={() => router.push("/signin")}>
        Iniciar Sesión
      </Button>
    )
  }

  // Obtener las iniciales del usuario para el avatar fallback
  const getInitials = () => {
    if (user.user_metadata?.name) {
      return user.user_metadata.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }
    return user.email?.substring(0, 2).toUpperCase() || "U"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage
              src={user.user_metadata?.avatar_url || ""}
              alt={user.user_metadata?.name || user.email || "Usuario"}
            />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="font-medium">{user.user_metadata?.name || user.email}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/profile")}>Mi Perfil</DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>Cerrar Sesión</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
