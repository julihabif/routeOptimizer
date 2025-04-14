"use client"

import { SignInForm } from "@/components/auth/sign-in-form"
import { Footer } from "@/components/footer"
import Header from "@/components/Header"
import { redirect, useSearchParams } from "next/navigation"
import { useEffect } from "react"
// Remove the existing import
// import { createServerSupabaseClient } from "@/lib/supabase"

export default function SignInPage() {
  const searchParams = useSearchParams()
  let redirectTo = "/"
  if (searchParams && searchParams.has("redirectTo")) {
    const redirectParam = searchParams.get("redirectTo")
    if (typeof redirectParam === "string") {
      redirectTo = redirectParam
    }
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Dynamically import createServerSupabaseClient
        const { createServerSupabaseClient } = await import("@/lib/supabase")
        const supabase = createServerSupabaseClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          redirect("/")
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error)
      }
    }

    checkSession()
  }, [])

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container flex items-center justify-center py-10">
        <div className="w-full max-w-md">
          <SignInForm redirectTo={redirectTo} />
        </div>
      </div>
      <Footer />
    </main>
  )
}
