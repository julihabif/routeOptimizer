'use client'

import { Button } from '@/components/ui/button'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useEffect, useState } from 'react'

export function ThemeSelector() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10">
        <Monitor className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-10 h-10"
      title={`Tema actual: ${theme}`}
    >
      {theme === 'dark' ? (
        <Moon className="h-5 w-5" />
      ) : theme === 'light' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Monitor className="h-5 w-5" />
      )}
      <span className="sr-only">
        Cambiar tema a {theme === 'dark' ? 'claro' : theme === 'light' ? 'sistema' : 'oscuro'}
      </span>
    </Button>
  )
} 