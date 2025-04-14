"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Map, MapPin, Heart } from "lucide-react"
import { getBrowserClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

interface UserNavProps {
  initialUser?: {
    id: string
    email: string
    name?: string
    avatar_url?: string
  } | null
}

export function UserNav({ initialUser }: UserNavProps) {
  const [user, setUser] = useState(initialUser)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Verificar el estado de autenticación al montar el componente
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getBrowserClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Obtener datos del perfil
          const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single()

          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || session.user.user_metadata.name || session.user.email?.split("@")[0],
            avatar_url: profile?.avatar_url || session.user.user_metadata.avatar_url,
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        setUser(null)
      }
    }

    if (!initialUser) {
      checkAuth()
    }

    // Suscribirse a cambios en la autenticación
    const supabase = getBrowserClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        if (session?.user) {
          // Obtener datos del perfil
          const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single()

          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || session.user.user_metadata.name || session.user.email?.split("@")[0],
            avatar_url: profile?.avatar_url || session.user.user_metadata.avatar_url,
          })
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [initialUser])

  // Función para cerrar sesión
  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      const supabase = getBrowserClient()
      await supabase.auth.signOut()

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (!user) {
    return (
      <Button asChild>
        <Link href="/signin">Iniciar Sesión</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {user.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.name || user.email} />
            ) : (
              <AvatarFallback>{user.name ? getInitials(user.name) : <User className="h-5 w-5" />}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium">{user.name || "Usuario"}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/saved-routes" className="cursor-pointer">
            <Map className="mr-2 h-4 w-4" />
            <span>Mis Rutas</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/saved-locations" className="cursor-pointer">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Mis Ubicaciones</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/favorites" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            <span>Favoritos</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isLoading} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? "Cerrando sesión..." : "Cerrar Sesión"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

