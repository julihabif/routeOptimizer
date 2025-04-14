"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

// Esquemas de validación
const signUpSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
})

const signInSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
})

// Tipos para las respuestas
type AuthResponse = {
  success: boolean
  error?: string
}

// Acción para registrar un nuevo usuario
export async function signUp(formData: FormData): Promise<AuthResponse> {
  try {
    // Validar los datos del formulario
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const validatedData = signUpSchema.parse({ name, email, password })

    // Crear cliente de Supabase
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return { success: false, error: "No se pudo inicializar Supabase" }
    }

    // Registrar al usuario
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          name: validatedData.name,
        },
      },
    })

    if (error) {
      console.error("Error al registrar usuario:", error)
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: "No se pudo crear el usuario" }
    }

    // Esperar un momento para asegurarse de que la transacción de auth.users se ha completado
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Crear perfil de usuario usando la función SQL
    try {
      await supabase.rpc("create_user_profile", {
        user_id: data.user.id,
        user_email: data.user.email!,
        user_name: validatedData.name,
      })
    } catch (profileError) {
      console.error("Error al crear perfil de usuario:", profileError)
      // Continuamos aunque haya error, ya que el trigger debería crear el perfil
    }

    return { success: true }
  } catch (error) {
    console.error("Error en signUp:", error)
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { success: false, error: firstError || "Datos de formulario inválidos" }
    }
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

// Acción para iniciar sesión
export async function signIn(formData: FormData): Promise<AuthResponse> {
  try {
    console.log("Iniciando proceso de inicio de sesión en el servidor")

    // Validar los datos del formulario
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const validatedData = signInSchema.parse({ email, password })

    // Crear cliente de Supabase
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return { success: false, error: "No se pudo inicializar Supabase" }
    }

    // Iniciar sesión
    console.log("Intentando iniciar sesión con Supabase")
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      console.error("Error al iniciar sesión:", error)
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: "No se pudo autenticar al usuario" }
    }

    console.log("Inicio de sesión exitoso, usuario autenticado:", data.user.id)

    // Verificar si el usuario existe en la tabla users
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single()

    // Si el usuario no existe en la tabla users, crearlo
    if (userError && userError.code === "PGRST116") {
      console.log("Perfil de usuario no encontrado, creando perfil...")
      try {
        await supabase.rpc("create_user_profile", {
          user_id: data.user.id,
          user_email: data.user.email!,
          user_name: data.user.user_metadata.name || null,
        })
      } catch (profileError) {
        console.error("Error al crear perfil de usuario durante el inicio de sesión:", profileError)
        // Continuamos aunque haya error
      }
    }

    // Verificar que la sesión se haya establecido correctamente
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log("Estado de sesión después de iniciar sesión:", session ? "Activa" : "No activa")

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error en signIn:", error)
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { success: false, error: firstError || "Datos de formulario inválidos" }
    }
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

// Acción para cerrar sesión
export async function signOut(): Promise<AuthResponse> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return { success: false, error: "No se pudo inicializar Supabase" }
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error al cerrar sesión:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    redirect("/")
  } catch (error) {
    console.error("Error en signOut:", error)
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

// Acción para obtener el usuario actual
export async function getCurrentUser() {
  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      console.error("No se pudo inicializar Supabase")
      return null
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Error al obtener la sesión:", error)
      return null
    }

    if (!session?.user) {
      console.log("No se encontró sesión de usuario")
      return null
    }

    return session.user
  } catch (error) {
    console.error("Error al obtener el usuario actual:", error)
    return null
  }
}
