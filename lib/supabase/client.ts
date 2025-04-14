import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase-types"
import { supabaseConfig, validateSupabaseConfig } from "./config"

let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const getBrowserClient = () => {
  if (typeof window === "undefined") {
    return null
  }
  if (!supabaseClient) {
    try {
      validateSupabaseConfig()
      supabaseClient = createClientComponentClient<Database>({
        supabaseUrl: supabaseConfig.url,
        supabaseKey: supabaseConfig.anonKey,
        options: {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: "supabase_auth_token", // Clave específica para evitar conflictos
          },
        },
      })
    } catch (error) {
      console.error("Error al inicializar el cliente de Supabase:", error)
      return null
    }
  }
  return supabaseClient
}
