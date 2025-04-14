"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Trash2, RefreshCw } from "lucide-react"

export function CookieCleaner() {
  const [cleaned, setCleaned] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cookiesRemoved, setCookiesRemoved] = useState(0)
  const [localStorageItemsRemoved, setLocalStorageItemsRemoved] = useState(0)

  const clearSupabaseCookies = () => {
    setIsLoading(true)

    try {
      // Obtener todas las cookies
      const cookies = document.cookie.split(";")
      let cookiesCount = 0

      // Filtrar y eliminar las cookies de Supabase
      cookies.forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim()

        // Identificar cookies de Supabase
        if (
          cookieName.includes("supabase") ||
          cookieName.includes("sb-") ||
          cookieName.includes("_supabase") ||
          cookieName.includes("sb:token") ||
          cookieName.includes("auth")
        ) {
          // Eliminar la cookie estableciéndola con una fecha pasada
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`
          cookiesCount++
        }
      })

      setCookiesRemoved(cookiesCount)

      // Limpiar localStorage
      let localStorageCount = 0
      if (typeof window !== "undefined" && window.localStorage) {
        const keysToRemove = []

        // Identificar elementos de localStorage relacionados con Supabase
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (
            key &&
            (key.includes("supabase") || key.includes("sb-") || key.includes("auth") || key.includes("token"))
          ) {
            keysToRemove.push(key)
          }
        }

        // Eliminar los elementos identificados
        keysToRemove.forEach((key) => {
          localStorage.removeItem(key)
          localStorageCount++
        })
      }

      setLocalStorageItemsRemoved(localStorageCount)
      setCleaned(true)

      console.log(
        `Se eliminaron ${cookiesCount} cookies y ${localStorageCount} elementos de localStorage relacionados con Supabase`,
      )
    } catch (error) {
      console.error("Error al limpiar cookies y localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshPage = () => {
    window.location.reload()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Limpieza de Cookies y LocalStorage de Supabase</CardTitle>
        <CardDescription>Soluciona problemas de autenticación eliminando datos corruptos de Supabase</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Si estás experimentando errores como <code>Failed to parse cookie string</code> o problemas de autenticación,
          limpiar las cookies y el localStorage de Supabase puede resolver el problema.
        </p>

        {cleaned && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Datos eliminados</AlertTitle>
            <AlertDescription className="text-green-700">
              <p>
                Se han eliminado {cookiesRemoved} cookies y {localStorageItemsRemoved} elementos de localStorage
                relacionados con Supabase.
              </p>
              <p className="mt-2">Ahora puedes recargar la página e intentar iniciar sesión nuevamente.</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="destructive" onClick={clearSupabaseCookies} disabled={isLoading || cleaned}>
          <Trash2 className="mr-2 h-4 w-4" />
          {isLoading ? "Limpiando..." : "Limpiar Datos de Supabase"}
        </Button>

        {cleaned && (
          <Button onClick={refreshPage}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Recargar Página
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
