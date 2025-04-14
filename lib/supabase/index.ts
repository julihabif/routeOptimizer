// Este archivo actúa como punto de entrada para la integración con Supabase
// y proporciona las funciones adecuadas según el contexto

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase-types"

// Verificar que las variables de entorno estén definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Las variables de entorno de Supabase no están configuradas correctamente")
}

// Cliente de Supabase para uso en el navegador
export const supabase = createClient<Database>(supabaseUrl || "", supabaseAnonKey || "")

// Función para crear un cliente de Supabase en el navegador
export function createBrowserSupabaseClient() {
  return createClient<Database>(supabaseUrl || "", supabaseAnonKey || "")
}

// Función para crear un cliente de Supabase en el servidor
// Esta función es compatible con ambos Pages Router y App Router
export function createServerSupabaseClient() {
  return createClient<Database>(supabaseUrl || "", supabaseAnonKey || "", {
    auth: {
      persistSession: false,
    },
  })
}

