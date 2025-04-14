"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserSupabaseClient } from "@/lib/supabase"

type User = {
  id: string
  email: string
  name?: string
  avatar_url?: string
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode
  initialUser?: User
}) {
  const [user, setUser] = useState<User>(initialUser)
  const [isLoading, setIsLoading] = useState(!initialUser)

  useEffect(() => {
    if (initialUser) {
      setIsLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        console.log("Verificando estado de autenticación en el cliente...")
        const supabase = createBrowserSupabaseClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        console.log("Estado de sesión en el cliente:", session ? "Autenticado" : "No autenticado")

        if (session?.user) {
          // Obtener datos del perfil
          const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single()

          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || session.user.user_metadata.name || session.user.email?.split("@")[0],
            avatar_url: profile?.avatar_url || session.user.user_metadata.avatar_url,
          })
          console.log("Usuario establecido en el contexto:", session.user.id)
        } else {
          setUser(null)
          console.log("No hay sesión activa, usuario establecido como null")
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Suscribirse a cambios en la autenticación
    const supabase = createBrowserSupabaseClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Evento de autenticación:", event)

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
          console.log("Usuario actualizado en el contexto después de evento:", session.user.id)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        console.log("Usuario cerró sesión, establecido como null")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [initialUser])

  const signOut = async () => {
    try {
      const supabase = createBrowserSupabaseClient()
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, signOut }}>{children}</AuthContext.Provider>
}

