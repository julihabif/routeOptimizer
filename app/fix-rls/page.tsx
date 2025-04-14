"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react"

export default function FixRlsPage() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const fixRls = async () => {
    setIsExecuting(true)
    setResult(null)

    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        throw new Error("No se pudo crear el cliente de Supabase")
      }

      // SQL para configurar las políticas RLS
      const sql = `
        -- Asegurarse de que RLS está habilitado
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

        -- Eliminar políticas existentes para evitar conflictos
        DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.users;
        DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.users;
        DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.users;
        DROP POLICY IF EXISTS "El servicio puede gestionar todos los perfiles" ON public.users;

        -- Crear políticas actualizadas
        -- Política para permitir a los usuarios ver su propio perfil
        CREATE POLICY "Los usuarios pueden ver su propio perfil" 
        ON public.users FOR SELECT 
        USING (auth.uid() = id);

        -- Política para permitir a los usuarios actualizar su propio perfil
        CREATE POLICY "Los usuarios pueden actualizar su propio perfil" 
        ON public.users FOR UPDATE 
        USING (auth.uid() = id);

        -- Política para permitir a los usuarios insertar su propio perfil
        CREATE POLICY "Los usuarios pueden insertar su propio perfil" 
        ON public.users FOR INSERT 
        WITH CHECK (auth.uid() = id);

        -- Política para permitir al servicio gestionar todos los perfiles
        CREATE POLICY "El servicio puede gestionar todos los perfiles" 
        ON public.users 
        USING (true);
      `

      // Ejecutar el SQL
      const { error } = await supabase.rpc("exec_sql", { sql })

      if (error) {
        console.error("Error al ejecutar SQL:", error)
        throw new Error(`Error al ejecutar SQL: ${error.message}`)
      }

      setResult({
        success: true,
        message: "Políticas RLS configuradas correctamente. Ahora deberías poder registrarte sin problemas.",
      })
    } catch (error) {
      console.error("Error al configurar RLS:", error)
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="container py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Solucionar Problema de RLS</CardTitle>
          <CardDescription>
            Esta página te ayudará a solucionar el error "new row violates row-level security policy for table users"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Este error ocurre porque las políticas de seguridad de Supabase (RLS) están impidiendo la creación de
            perfiles de usuario. Al hacer clic en el botón de abajo, configuraremos las políticas necesarias para que el
            registro funcione correctamente.
          </p>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Éxito" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">¿Qué hace esta solución?</h3>
            <p className="text-sm text-muted-foreground">
              Esta solución configura las políticas de seguridad RLS en Supabase para permitir:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside space-y-1">
              <li>Que los usuarios puedan ver su propio perfil</li>
              <li>Que los usuarios puedan actualizar su propio perfil</li>
              <li>Que los usuarios puedan insertar su propio perfil</li>
              <li>Que el servicio pueda gestionar todos los perfiles</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={fixRls} disabled={isExecuting}>
            {isExecuting ? "Configurando..." : "Solucionar Problema"}
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/signup")}>
            Volver al Registro <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

