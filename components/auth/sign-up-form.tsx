"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { GoogleAuthButton } from "./google-auth-button"
import { AlertCircle, Loader2 } from "lucide-react"

// Esquema de validación con reglas más estrictas para el correo
const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    email: z
      .string()
      .email({ message: "Por favor, ingresa un email válido" })
      // Añadir validación adicional para asegurar que el correo tenga un formato válido
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: "El formato del correo electrónico no es válido",
      }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Configurar el formulario con React Hook Form
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Función para manejar el envío del formulario
  async function onSubmit(values: SignUpFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // Verificar que las variables de entorno estén configuradas
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError("Error de configuración: Las variables de entorno de Supabase no están configuradas correctamente.")
        console.error("Variables de entorno de Supabase no configuradas:", {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Configurada" : "No configurada",
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configurada" : "No configurada",
        })
        return
      }

      // Crear cliente de Supabase con manejo de errores mejorado
      let supabase
      try {
        supabase = createBrowserSupabaseClient()
        if (!supabase) {
          throw new Error("No se pudo crear el cliente de Supabase")
        }
      } catch (error) {
        console.error("Error al crear el cliente de Supabase:", error)
        setError(`Error al inicializar Supabase: ${error instanceof Error ? error.message : String(error)}`)
        return
      }

      console.log("Intentando registrar usuario con email:", values.email)

      // Registrar al usuario con auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        console.error("Error en auth.signUp:", authError)

        // Mensajes de error más específicos según el tipo de error
        if (authError.message.includes("Invalid API key")) {
          setError(
            "Error de configuración: La clave API de Supabase es inválida. Verifica las variables de entorno y asegúrate de que la clave no tenga espacios o caracteres no válidos.",
          )
        } else if (authError.message.includes("User already registered")) {
          setError("Este correo electrónico ya está registrado. Por favor, inicia sesión o utiliza otro correo.")
        } else if (authError.message.includes("invalid")) {
          setError("El formato del correo electrónico no es aceptado. Intenta con otro correo.")
        } else {
          setError(authError.message)
        }
        return
      }

      if (!authData.user) {
        setError("No se pudo crear el usuario. Intenta de nuevo más tarde.")
        return
      }

      console.log("Usuario creado en auth:", authData.user)

      // Esperar un momento para asegurarse de que la transacción de auth.users se ha completado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Intentar crear el perfil de usuario
      try {
        const { error: insertError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: authData.user.email!,
          name: values.name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (insertError) {
          console.error("Error al crear perfil de usuario:", insertError)
          // Continuamos aunque haya error en el perfil, ya que el usuario se creó correctamente
        }
      } catch (profileError) {
        console.error("Error al crear perfil de usuario:", profileError)
        // Continuamos aunque haya error en el perfil, ya que el usuario se creó correctamente
      }

      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
      })

      // Redirigir a la página de inicio de sesión después de un breve retraso
      setTimeout(() => {
        router.push("/signin")
      }, 2000)
    } catch (error) {
      console.error("Error general en el registro:", error)
      setError(`Error inesperado: ${error instanceof Error ? error.message : "Ha ocurrido un error desconocido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Crear Cuenta</CardTitle>
        <CardDescription>Regístrate para guardar tus rutas y acceder a todas las funciones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mostrar errores */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Botón de Google */}
        <GoogleAuthButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O regístrate con email</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@email.com" type="email" {...field} autoComplete="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} autoComplete="new-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} autoComplete="new-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrarse"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/signin" className="text-primary underline-offset-4 hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

