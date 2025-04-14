"use client"

import { useEffect, useState } from "react"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SessionStatus() {
  const [sessionData, setSessionData] = useState<{
    status: "authenticated" | "unauthenticated" | "loading"
    userId?: string
    expiresAt?: number
    provider?: string
  }>({
    status: "loading",
  })

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createBrowserSupabaseClient()
        if (!supabase) {
          setSessionData({ status: "unauthenticated" })
          return
        }

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          setSessionData({
            status: "authenticated",
            userId: session.user.id,
            expiresAt: session.expires_at,
            provider: session.user.app_metadata.provider || "email",
          })
        } else {
          setSessionData({ status: "unauthenticated" })
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setSessionData({ status: "unauthenticated" })
      }
    }

    checkSession()

    // Check session every 30 seconds
    const interval = setInterval(checkSession, 30000)

    return () => clearInterval(interval)
  }, [])

  // Calculate time until expiration
  const getExpirationTime = () => {
    if (!sessionData.expiresAt) return "N/A"

    const now = Math.floor(Date.now() / 1000)
    const timeLeft = sessionData.expiresAt - now

    if (timeLeft <= 0) return "Expired"

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return `${minutes}m ${seconds}s`
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Session Status
          <Badge variant={sessionData.status === "authenticated" ? "default" : "destructive"}>
            {sessionData.status}
          </Badge>
        </CardTitle>
        <CardDescription>Current authentication status and session information</CardDescription>
      </CardHeader>
      <CardContent>
        {sessionData.status === "authenticated" ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="font-medium">User ID:</span>
              <span className="truncate">{sessionData.userId}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="font-medium">Provider:</span>
              <span>{sessionData.provider}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="font-medium">Expires in:</span>
              <span>{getExpirationTime()}</span>
            </div>
          </div>
        ) : (
          <p>No active session. Please sign in.</p>
        )}
      </CardContent>
    </Card>
  )
}

