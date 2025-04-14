"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { createBrowserSupabaseClient } from "@/lib/supabase"

interface AuthFormProps {
  type: "signin" | "signup"
}

export function AuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Verificar si hay un error en la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get("error")
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = type === "signup" ? (formData.get("name") as string) : undefined

    try {
      console.log(`Iniciando ${type === "signin" ? "inicio de sesión" : "registro"} en el cliente...`)

      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        throw new Error("No se pudo crear el cliente de Supabase")
      }

      if (type === "signin") {
        // Iniciar sesión
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          throw signInError
        }

        // Verificar si el usuario existe en la tabla users
        if (data.user) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single()

          // Si el usuario no existe, crearlo
          if (userError && userError.code === "PGRST116") {
            const { error: insertError } = await supabase.from("users").insert({
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata.name || data.user.email!.split("@")[0],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

            if (insertError) {
              console.error("Error al crear perfil de usuario:", insertError)
            }
          }
        }
      } else {
        // Registrar usuario
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        })

        if (signUpError) {
          throw signUpError
        }

        // Crear perfil de usuario
        if (data.user) {
          // Esperar un momento para asegurarse de que la transacción de auth.users se ha completado
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const { error: insertError } = await supabase.from("users").insert({
            id: data.user.id,
            email: data.user.email!,
            name: name || data.user.email!.split("@")[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("Error al crear perfil de usuario:", insertError)
          }
        }
      }

      toast({
        title: type === "signin" ? "Sesión iniciada" : "Cuenta creada",
        description:
          type === "signin" ? "Has iniciado sesión correctamente." : "Tu cuenta ha sido creada correctamente.",
      })

      // Usar window.location.href para una redirección completa
      window.location.href = "/"
    } catch (err) {
      console.error(`Error en ${type}:`, err)

      if (err instanceof Error) {
        // Manejar errores específicos
        if (err.message.includes("Invalid login credentials")) {
          setError("Credenciales inválidas. Por favor, verifica tu email y contraseña.")
        } else if (err.message.includes("User already registered")) {
          setError("Este email ya está registrado. Por favor, inicia sesión o usa otro email.")
        } else if (err.message.includes("cookie")) {
          setError("Error con las cookies. Intenta limpiar las cookies y volver a intentar.")

          // Redirigir a la página de limpieza de cookies
          setTimeout(() => {
            router.push("/fix-auth")
          }, 2000)
        } else {
          setError(err.message)
        }
      } else {
        setError("Ha ocurrido un error inesperado")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{type === "signin" ? "Iniciar Sesión" : "Crear Cuenta"}</h1>
          <p className="text-gray-500">
            {type === "signin"
              ? "Ingresa tus credenciales para acceder a tu cuenta"
              : "Completa el formulario para crear una nueva cuenta"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              {error.includes("cookie") && (
                <div className="mt-2">
                  <Button variant="outline" size="sm" onClick={() => router.push("/fix-auth")}>
                    Limpiar Cookies
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" placeholder="Tu nombre" required disabled={isLoading} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••"
              required
              disabled={isLoading}
              autoComplete={type === "signin" ? "current-password" : "new-password"}
            />
          </div>

          {type === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {type === "signin" ? "Iniciando sesión..." : "Creando cuenta..."}
              </>
            ) : type === "signin" ? (
              "Iniciar Sesión"
            ) : (
              "Crear Cuenta"
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          {type === "signin" ? (
            <p>
              ¿No tienes una cuenta?{" "}
              <Button variant="link" className="p-0" onClick={() => router.push("/signup")}>
                Regístrate
              </Button>
            </p>
          ) : (
            <p>
              ¿Ya tienes una cuenta?{" "}
              <Button variant="link" className="p-0" onClick={() => router.push("/signin")}>
                Inicia sesión
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
