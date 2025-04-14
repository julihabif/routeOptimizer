"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react"

export default function SetupRLSPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const setupRLS = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        throw new Error("No se pudo crear el cliente de Supabase")
      }

      // Política para permitir a los usuarios insertar su propio perfil
      const { error: insertPolicyError } = await supabase.rpc("create_insert_policy", {
        table_name: "users",
        policy_name: "Los usuarios pueden insertar su propio perfil",
        policy_using: "auth.uid() = id",
      })

      if (insertPolicyError) {
        console.error("Error al crear política de inserción:", insertPolicyError)
        // Intentar con enfoque alternativo
        const { error: rawSqlError } = await supabase
          .from("_exec_sql")
          .select("*")
          .eq(
            "query",
            `
          DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.users;
          CREATE POLICY "Los usuarios pueden insertar su propio perfil" 
          ON public.users FOR INSERT 
          WITH CHECK (auth.uid() = id);
        `,
          )

        if (rawSqlError) {
          throw new Error(`No se pudo crear la política de inserción: ${rawSqlError.message}`)
        }
      }

      setResult({
        success: true,
        message: "Políticas de seguridad configuradas correctamente. Ahora deberías poder registrarte sin problemas.",
      })
    } catch (error) {
      console.error("Error al configurar RLS:", error)
      setResult({
        success: false,
        message: `Error al configurar políticas de seguridad: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Configurar Políticas de Seguridad</CardTitle>
          <CardDescription>
            Esta página te ayudará a configurar las políticas de seguridad necesarias para que el registro de usuarios
            funcione correctamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            El error &quot;new row violates row-level security policy for table users&quot; ocurre porque faltan
            políticas de seguridad que permitan a los usuarios insertar su propio perfil.
          </p>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Éxito" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <h3 className="font-medium mb-2">Alternativa Manual</h3>
              <p className="text-sm mb-2">
                Si el botón no funciona, puedes ejecutar manualmente el siguiente SQL en el editor SQL de Supabase:
              </p>
              <pre className="text-xs bg-black text-white p-2 rounded overflow-x-auto">
                {`DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.users;
CREATE POLICY "Los usuarios pueden insertar su propio perfil" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);`}
              </pre>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={setupRLS} disabled={isLoading}>
            {isLoading ? "Configurando..." : "Configurar Políticas"}
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/signup")}>
            Volver al Registro <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

