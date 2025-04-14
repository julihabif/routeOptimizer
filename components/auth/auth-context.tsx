"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getBrowserClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

type AuthUser = {
  id: string
  email: string
  name?: string
  avatar_url?: string
} | null

type AuthContextType = {
  user: AuthUser
  isLoading: boolean
  refreshUser: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  refreshUser: async () => {},
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode
  initialUser?: AuthUser
}) {
  const [user, setUser] = useState<AuthUser>(initialUser)
  const [isLoading, setIsLoading] = useState(!initialUser)
  const supabase = getBrowserClient()

  // Función para obtener el perfil del usuario desde la base de datos
  const fetchUserProfile = async (userId: string): Promise<AuthUser> => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) throw error

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        avatar_url: data.avatar_url,
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return null
    }
  }

  // Función para actualizar el estado del usuario
  const refreshUser = async () => {
    try {
      setIsLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id)

        if (profile) {
          setUser(profile)
        } else {
          // Si no hay perfil, usar datos básicos de la sesión
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
            avatar_url: session.user.user_metadata?.avatar_url,
          })
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      setUser(null)
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error al cerrar sesión",
        description: "Hubo un problema al cerrar sesión. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Escuchar cambios en la autenticación
  useEffect(() => {
    if (!supabase) return

    // Verificar la sesión inicial si no hay usuario inicial
    if (!initialUser) {
      refreshUser()
    }

    // Suscribirse a cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)

      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id)

          if (profile) {
            setUser(profile)
          } else {
            // Si no hay perfil, usar datos básicos de la sesión
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
              avatar_url: session.user.user_metadata?.avatar_url,
            })
          }
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }

      setIsLoading(false)
    })

    // Limpiar suscripción al desmontar
    return () => {
      subscription.unsubscribe()
    }
  }, [initialUser, supabase])

  return <AuthContext.Provider value={{ user, isLoading, refreshUser, signOut }}>{children}</AuthContext.Provider>
}

