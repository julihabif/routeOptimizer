'use client'

import { useState, useEffect } from 'react'
import { useTheme as useNextTheme } from 'next-themes'

export function useTheme() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, systemTheme } = useNextTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(systemTheme === 'dark' ? 'light' : 'dark')
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark')
    }
  }

  return {
    theme: mounted ? theme : 'system',
    systemTheme,
    setTheme,
    toggleTheme,
    mounted,
    effectiveTheme: mounted ? (theme === 'system' ? systemTheme : theme) : 'system'
  }
} 