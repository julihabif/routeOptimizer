"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { DbUser } from "@/types/supabase-types"
import { revalidatePath } from "next/cache"
import { cookies } from 'next/headers'

// Función para crear perfil con reintentos
async function createUserProfile(
  supabase: any,
  userId: string,
  email: string,
  name: string | null = null,
): Promise<boolean> {
  // Estrategia de reintento con espera exponencial
  const maxRetries = 5
  let retryCount = 0

  while (retryCount < maxRetries) {
    try {
      // Esperar un tiempo que aumenta con cada reintento
      const waitTime = Math.min(1000 * Math.pow(2, retryCount), 10000)
      await new Promise((resolve) => setTimeout(resolve, waitTime))

      console.log(`Intento ${retryCount + 1}: Creando perfil de usuario...`)

      // Intentar inserción directa
      const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        email: email,
        name: name || email.split("@")[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (!insertError) {
        console.log("Perfil de usuario creado correctamente")
        return true
      }

      console.error(`Intento ${retryCount + 1}: Error al insertar directamente:`, insertError)

      // Si el error es de clave foránea, esperar más tiempo
      if (insertError.message.includes("violates foreign key constraint")) {
        console.log("Error de clave foránea, reintentando después de esperar...")
        retryCount++
        continue
      }

      // Si es otro tipo de error (como RLS), no reintentar
      return false
    } catch (error) {
      console.error(`Intento ${retryCount + 1}: Error general:`, error)
      retryCount++
    }
  }

  // Si llegamos aquí, todos los intentos fallaron
  return false
}

// Obtener el usuario actual
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

export async function getSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    return null
  }
  
  return session
}

// Iniciar sesión con email y contraseña
export async function signInWithEmail(email: string, password: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    // Asegurarse de que el usuario existe en la tabla users
    await getCurrentUser()

    revalidatePath("/")
    return { success: true, user: data.user }
  } catch (error) {
    console.error("Error en signInWithEmail:", error)
    return { error: "Error inesperado al iniciar sesión" }
  }
}

// Registrar un nuevo usuario
export async function signUp(email: string, password: string, name: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Primero registramos al usuario con auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (authError) {
      return { error: authError.message }
    }

    // Si el registro de auth es exitoso, creamos el perfil en la tabla users
    if (authData.user) {
      // Esperar un momento para asegurarse de que la transacción de auth.users se ha completado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const profileCreated = await createUserProfile(supabase, authData.user.id, authData.user.email!, name)

      if (!profileCreated) {
        return {
          success: true,
          user: authData.user,
          message:
            "Usuario creado correctamente, pero hubo un problema al crear el perfil. Por favor, inicia sesión para completar el proceso.",
        }
      }
    }

    revalidatePath("/")
    return { success: true, user: authData.user }
  } catch (error) {
    console.error("Error en signUp:", error)
    return { error: "Error inesperado al registrar usuario" }
  }
}

// Cerrar sesión
export async function signOut() {
  const supabase = createServerSupabaseClient()

  try {
    await supabase.auth.signOut()
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error en signOut:", error)
    return { error: "Error al cerrar sesión" }
  }
}

// Actualizar perfil de usuario
export async function updateUserProfile(userId: string, data: Partial<DbUser>) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase
      .from("users")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error en updateUserProfile:", error)
    return { error: "Error al actualizar perfil" }
  }
}

