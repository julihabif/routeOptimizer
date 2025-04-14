"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { CheckCircle, Copy, AlertCircle, ArrowRight, Database } from "lucide-react"

export default function FixTableStructurePage() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [copied, setCopied] = useState(false)

  // SQL para corregir la estructura de la tabla users
  const fixTableSQL = `
-- Verificar la estructura actual de la tabla users
SELECT 
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
JOIN pg_class t ON t.oid = c.conrelid
WHERE t.relname = 'users' AND n.nspname = 'public';

-- Eliminar la restricción de clave foránea existente
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Recrear la restricción de clave foránea con la opción DEFERRABLE INITIALLY DEFERRED
-- Esto permite que la restricción se verifique al final de la transacción, no inmediatamente
ALTER TABLE public.users 
ADD CONSTRAINT users_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) 
DEFERRABLE INITIALLY DEFERRED;

-- Verificar que la restricción se ha creado correctamente
SELECT 
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
JOIN pg_class t ON t.oid = c.conrelid
WHERE t.relname = 'users' AND n.nspname = 'public';
`.trim()

  const executeSQL = async () => {
    setIsExecuting(true)
    setResult(null)

    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        throw new Error("No se pudo crear el cliente de Supabase")
      }

      // Ejecutar el SQL para corregir la estructura de la tabla
      const { error } = await supabase.rpc("exec_sql", { sql: fixTableSQL })

      if (error) {
        console.error("Error al ejecutar SQL:", error)
        throw new Error(`Error al ejecutar SQL: ${error.message}`)
      }

      setResult({
        success: true,
        message:
          "La estructura de la tabla users ha sido corregida correctamente. Ahora la restricción de clave foránea permite que la creación de perfiles se realice de manera más flexible.",
      })
    } catch (error) {
      console.error("Error al corregir la estructura de la tabla:", error)
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fixTableSQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Corregir Estructura de la Tabla Users
          </CardTitle>
          <CardDescription>
            Soluciona el error de clave foránea modificando la estructura de la tabla users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Problema de clave foránea</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                El error "insert or update on table 'users' violates foreign key constraint 'users_id_fkey'" ocurre
                porque la restricción de clave foránea está configurada para verificarse inmediatamente, pero el
                registro en auth.users aún no está completamente confirmado cuando intentamos crear el perfil.
              </p>
              <p>
                Esta solución modifica la restricción para que se verifique al final de la transacción, no
                inmediatamente, lo que permite que ambas inserciones (en auth.users y en public.users) se completen
                correctamente.
              </p>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">SQL para corregir la estructura</h3>
            <div className="relative">
              <Textarea value={fixTableSQL} readOnly className="font-mono text-xs h-[300px] resize-none" />
              <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={copyToClipboard}>
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
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className="mt-4">
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Éxito" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">¿Qué hace esta solución?</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Elimina la restricción de clave foránea existente</li>
              <li>
                Crea una nueva restricción con la opción <code>DEFERRABLE INITIALLY DEFERRED</code>, que permite que la
                verificación de la clave foránea se realice al final de la transacción
              </li>
              <li>Verifica que la restricción se haya creado correctamente</li>
            </ol>
            <p>
              Esta modificación resuelve el problema de sincronización entre la creación del usuario en{" "}
              <code>auth.users</code> y la creación del perfil en <code>public.users</code>, permitiendo que ambas
              operaciones se completen en la misma transacción.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={executeSQL} disabled={isExecuting}>
            {isExecuting ? "Ejecutando..." : "Corregir Estructura"}
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/signup")}>
            Volver al Registro <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

