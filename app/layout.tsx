import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth/auth-provider"
import { createServerSupabaseClient } from "@/lib/supabase" // Import the server client
import Header from "@/components/Header" // Ensure correct import path

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Route Optimizer",
  description: "Optimize your routes with multiple stops",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Obtener el usuario actual para el renderizado del servidor
  let user = null

  try {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      user = session?.user || null
    }
  } catch (error) {
    console.error("Error al obtener el usuario actual en layout:", error)
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen font-sans antialiased", inter.variable, montserrat.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider initialUser={user}>
            <Header />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
