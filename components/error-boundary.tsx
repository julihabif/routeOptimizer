'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ErrorBoundary({ children, fallback }: Props) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true)
      setError(event.error)
      // Aquí podrías enviar el error a un servicio de registro de errores
      console.error('Error capturado por ErrorBoundary:', event.error)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  const handleRetry = () => {
    setHasError(false)
    setError(null)
  }

  if (hasError) {
    if (fallback) {
      return fallback
    }

    return (
      <Alert variant="destructive" className="m-4">
        <AlertTitle>Algo salió mal</AlertTitle>
        <AlertDescription className="mt-2">
          <div className="space-y-2">
            <p>
              {error?.message || 
                "Ha ocurrido un error inesperado. Por favor, intenta recargar la página."}
            </p>
            <Button 
              variant="outline" 
              onClick={handleRetry}
              className="mt-2"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Intentar de nuevo
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return children
} 