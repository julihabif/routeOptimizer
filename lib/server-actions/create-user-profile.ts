"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

/**
 * Función de servidor que utiliza el rol de servicio para crear un perfil de usuario
 * Esta función se ejecuta en el servidor con privilegios elevados, evitando las restricciones de RLS
 */
export async function createUserProfileServerAction(
  userId: string,
  email: string,
  name: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Creando perfil de usuario desde servidor para:", { userId, email, name })

    // Crear cliente de Supabase con rol de servicio
    const supabase = createServerSupabaseClient()

    // Verificar si el usuario ya existe en la tabla users
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .maybeSingle()

    if (checkError) {
      console.error("Error al verificar usuario existente:", checkError)
      // Continuamos con la inserción aunque haya error en la verificación
    }

    // Si el usuario ya existe, no hacer nada
    if (existingUser) {
      console.log("El usuario ya existe en la tabla users:", existingUser)
      return { success: true }
    }

    // Insertar el usuario en la tabla users
    const { error: insertError } = await supabase.from("users").insert({
      id: userId,
      email: email,
      name: name || email.split("@")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error al insertar usuario desde servidor:", insertError)

      // Intentar un enfoque alternativo si falla la inserción directa
      try {
        // Ejecutar SQL directo para insertar el usuario
        const { error: sqlError } = await supabase.rpc("exec_sql", {
          sql: `
            INSERT INTO public.users (id, email, name, created_at, updated_at)
            VALUES (
              '${userId}',
              '${email}',
              '${name || email.split("@")[0]}',
              NOW(),
              NOW()
            )
            ON CONFLICT (id) DO NOTHING;
          `,
        })

        if (sqlError) {
          console.error("Error al insertar usuario con SQL directo:", sqlError)
          return { success: false, error: `Error al insertar usuario: ${sqlError.message}` }
        }

        return { success: true }
      } catch (sqlExecError) {
        console.error("Error al ejecutar SQL directo:", sqlExecError)
        return { success: false, error: `Error al ejecutar SQL: ${String(sqlExecError)}` }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error general al crear perfil de usuario desde servidor:", error)
    return { success: false, error: `Error general: ${error instanceof Error ? error.message : String(error)}` }
  }
}

