"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { CheckCircle, Copy, AlertCircle, ArrowRight, Database } from "lucide-react"

export default function DirectSqlPage() {
  const [sql, setSql] = useState(`-- Deshabilitar RLS para la tabla users
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Verificar el estado de RLS
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'users' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');`)

  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const executeSql = async () => {
    if (!sql.trim()) {
      setError("Por favor, ingresa un SQL válido")
      return
    }

    setIsExecuting(true)
    setResult(null)
    setError(null)

    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        throw new Error("No se pudo crear el cliente de Supabase")
      }

      // Ejecutar el SQL
      const { data, error: sqlError } = await supabase.rpc("exec_sql", { sql })

      if (sqlError) {
        console.error("Error al ejecutar SQL:", sqlError)
        setError(`Error al ejecutar SQL: ${sqlError.message}`)
      } else {
        setResult(data)
      }
    } catch (error) {
      console.error("Error general al ejecutar SQL:", error)
      setError(`Error general: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsExecuting(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Ejecutar SQL Directo
          </CardTitle>
          <CardDescription>
            Ejecuta comandos SQL directamente en la base de datos para solucionar problemas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Solución directa para problemas de RLS</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Esta página te permite ejecutar SQL directamente en la base de datos para solucionar problemas de RLS.
                El SQL predeterminado deshabilita RLS para la tabla users, lo que debería resolver el problema de
                registro.
              </p>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">SQL a ejecutar</h3>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar SQL
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              className="font-mono text-xs h-[200px] resize-none"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Resultado</h3>
              <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px]">
                <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          )}

          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Instrucciones</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>El SQL predeterminado deshabilita RLS para la tabla users</li>
              <li>Haz clic en "Ejecutar SQL" para ejecutar el comando</li>
              <li>Si el comando se ejecuta correctamente, deberías poder registrarte sin problemas</li>
              <li>Si el comando falla, copia el SQL y ejecútalo manualmente en el Panel de SQL de Supabase</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={executeSql} disabled={isExecuting}>
            {isExecuting ? "Ejecutando..." : "Ejecutar SQL"}
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/signup")}>
            Volver al Registro <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

