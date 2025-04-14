"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)
  const [isDayTime, setIsDayTime] = React.useState(true)

  // Efecto para montar el componente
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Efecto para detectar la hora del día
  React.useEffect(() => {
    if (!props.enableSystem) return

    const updateDayTime = () => {
      const hour = new Date().getHours()
      setIsDayTime(hour >= 6 && hour < 18)
    }

    updateDayTime()
    const interval = setInterval(updateDayTime, 60 * 60 * 1000) // Verificar cada hora

    return () => clearInterval(interval)
  }, [props.enableSystem])

  // Efecto para aplicar el tema automático
  React.useEffect(() => {
    if (!mounted || !props.enableSystem) return

    if (localStorage.getItem("theme-preference") === "auto") {
      document.documentElement.classList.toggle("dark", !isDayTime)
    }
  }, [mounted, props.enableSystem, isDayTime])

  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

