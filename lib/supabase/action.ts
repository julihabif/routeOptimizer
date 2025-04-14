import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export function createActionClient() {
  try {
    const cookieStore = cookies()

    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            try {
              const cookie = cookieStore.get(name)
              return cookie?.value
            } catch (error) {
              console.error(`Error al obtener cookie ${name}:`, error)
              return undefined
            }
          },
          set(name, value, options) {
            try {
              cookieStore.set(name, value, {
                ...options,
                path: "/",
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
              })
            } catch (error) {
              console.error(`Error al establecer cookie ${name}:`, error)
            }
          },
          remove(name, options) {
            try {
              cookieStore.set(name, "", {
                ...options,
                path: "/",
                maxAge: 0,
              })
            } catch (error) {
              console.error(`Error al eliminar cookie ${name}:`, error)
            }
          },
        },
      },
    )
  } catch (error) {
    console.error("Error al crear el cliente de acción de Supabase:", error)
    // Devolver un cliente simulado para evitar errores
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
      }),
      rpc: async () => ({ data: null, error: null }),
    } as any
  }
}

