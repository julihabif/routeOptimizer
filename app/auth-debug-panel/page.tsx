"use client"

import { useEffect, useState } from "react"
import { getBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function AuthDebugPanel() {
  const [status, setStatus] = useState<"checking" | "authenticated" | "unauthenticated">("checking")
  const [userInfo, setUserInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [cookies, setCookies] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getBrowserClient()
        if (!supabase) {
          setError("No se pudo inicializar Supabase")
          setStatus("unauthenticated")
          return
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          setError(`Error al obtener la sesión: ${sessionError.message}`)
          setStatus("unauthenticated")
          return
        }

        // Obtener las cookies
        const allCookies = document.cookie.split(";").map((cookie) => cookie.trim())
        setCookies(allCookies.filter((cookie) => cookie.includes("supabase") || cookie.includes("sb-")))

        if (session) {
          setStatus("authenticated")
          setUserInfo({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || "No disponible",
          })
        } else {
          setStatus("unauthenticated")
        }
      } catch (error: any) {
        setError(`Error al verificar autenticación: ${error.message}`)
        setStatus("unauthenticated")
      }
    }

    checkAuth()
  }, [])

  const handleSignOut = async () => {
    try {
      const supabase = getBrowserClient()
      if (!supabase) {
        setError("No se pudo inicializar Supabase")
        return
      }

      await supabase.auth.signOut()
      setStatus("unauthenticated")
      setUserInfo(null)
      router.push("/signin")
    } catch (error: any) {
      setError(`Error al cerrar sesión: ${error.message}`)
    }
  }

  const handleGoToSignIn = () => {
    router.push("/signin")
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Estado de Autenticación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "checking" && <p>Verificando estado de autenticación...</p>}

        {status === "authenticated" && (
          <div className="space-y-4">
            <p className="text-green-600 font-semibold">Usuario autenticado</p>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">ID:</span> {userInfo.id}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {userInfo.email}
              </p>
              <p>
                <span className="font-semibold">Nombre:</span> {userInfo.name}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Cookies:</p>
              <ul className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {cookies.length > 0 ? (
                  cookies.map((cookie, index) => (
                    <li key={index} className="mb-1">
                      {cookie}
                    </li>
                  ))
                ) : (
                  <li>No se encontraron cookies de Supabase</li>
                )}
              </ul>
            </div>
            <Button onClick={handleSignOut} variant="destructive">
              Cerrar Sesión
            </Button>
          </div>
        )}

        {status === "unauthenticated" && (
          <div className="space-y-4">
            <p className="text-red-600 font-semibold">Usuario no autenticado</p>
            {error && <p className="text-red-500">{error}</p>}
            <div className="space-y-2">
              <p className="font-semibold">Cookies:</p>
              <ul className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {cookies.length > 0 ? (
                  cookies.map((cookie, index) => (
                    <li key={index} className="mb-1">
                      {cookie}
                    </li>
                  ))
                ) : (
                  <li>No se encontraron cookies de Supabase</li>
                )}
              </ul>
            </div>
            <Button onClick={handleGoToSignIn}>Ir a Iniciar Sesión</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
