import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { supabaseConfig, validateSupabaseConfig } from "./config"
import type { Database } from "@/types/supabase-types"

export async function createServerSupabaseClient() {
  try {
    validateSupabaseConfig()

    const cookieStore = cookies()

    return createServerClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...supabaseConfig.cookieOptions, ...options }) // Apply global cookie options
          } catch (error) {
            console.error(`Error al establecer cookie ${name}:`, error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.delete({ name, ...supabaseConfig.cookieOptions, ...options }) // Apply global cookie options
          } catch (error) {
            console.error(`Error al eliminar cookie ${name}:`, error)
          }
        },
      },
    })
  } catch (error) {
    console.error("Error al crear el cliente de Supabase en el servidor:", error)
    return null
  }
}
