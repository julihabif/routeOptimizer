"use client"
import { Moon, Sun, SunMoon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Guardar la preferencia del usuario
  const savePreference = (preference: string) => {
    localStorage.setItem("theme-preference", preference)
  }

  // Configurar el tema automático basado en la hora del día
  const setAutoTheme = () => {
    const hour = new Date().getHours()
    const isDayTime = hour >= 6 && hour < 18 // Día entre 6am y 6pm
    setTheme(isDayTime ? "light" : "dark")
    savePreference("auto")
  }

  // Efecto para manejar el montaje del componente
  useEffect(() => {
    setMounted(true)

    // Verificar si hay una preferencia guardada
    const savedPreference = localStorage.getItem("theme-preference")
    if (savedPreference === "auto") {
      setAutoTheme()
    }
  }, [])

  // Evitar problemas de hidratación
  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setTheme("light")
            savePreference("light")
          }}
        >
          <Sun className="mr-2 h-4 w-4" />
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("dark")
            savePreference("dark")
          }}
        >
          <Moon className="mr-2 h-4 w-4" />
          Oscuro
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setAutoTheme()
          }}
        >
          <SunMoon className="mr-2 h-4 w-4" />
          Automático (hora del día)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("system")
            savePreference("system")
          }}
        >
          <span className="mr-2">💻</span>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

