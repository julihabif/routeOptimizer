"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "./auth-context"
import { toast } from "@/components/ui/use-toast"

export function AuthSuccessHandler() {
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()

  useEffect(() => {
    // Verificar si hay un parámetro de autenticación exitosa
    const authSuccess = searchParams.get("auth_success")

    if (authSuccess === "true") {
      // Actualizar el estado del usuario
      refreshUser().then(() => {
        // Mostrar mensaje de éxito
        toast({
          title: "Inicio de sesión exitoso",
          description: "Has iniciado sesión correctamente.",
        })

        // Limpiar el parámetro de la URL sin recargar la página
        const newUrl = window.location.pathname
        window.history.replaceState({}, document.title, newUrl)
      })
    }
  }, [searchParams, refreshUser])

  return null
}

