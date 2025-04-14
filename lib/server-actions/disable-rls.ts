"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

/**
 * Función de servidor que deshabilita RLS para la tabla users
 * Esta función se ejecuta en el servidor con privilegios elevados
 */
export async function disableRlsServerAction(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Deshabilitando RLS para la tabla users desde el servidor")

    // Crear cliente de Supabase con rol de servicio
    const supabase = createServerSupabaseClient()

    // Ejecutar SQL para deshabilitar RLS
    const { error } = await supabase.rpc("exec_sql", {
      sql: "ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;",
    })

    if (error) {
      console.error("Error al deshabilitar RLS:", error)
      return { success: false, error: `Error al deshabilitar RLS: ${error.message}` }
    }

    return { success: true }
  } catch (error) {
    console.error("Error general al deshabilitar RLS:", error)
    return { success: false, error: `Error general: ${error instanceof Error ? error.message : String(error)}` }
  }
}

