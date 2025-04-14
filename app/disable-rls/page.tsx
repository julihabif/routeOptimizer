"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { CheckCircle, AlertCircle, ArrowRight, Shield, ShieldOff } from "lucide-react"

export default function DisableRlsPage() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const disableRls = async () => {
    setIsExecuting(true)
    setResult(null)

    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        throw new Error("No se pudo crear el cliente de Supabase")
      }

      // SQL para deshabilitar RLS en la tabla users
      const sql = `
        -- Deshabilitar RLS en la tabla users
        ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
      `

      // Ejecutar el SQL
      const { error } = await supabase.rpc("exec_sql", { sql })

      if (error) {
        console.error("Error al ejecutar SQL:", error)

        // Si el error es por falta de permisos, proporcionar instrucciones alternativas
        if (error.message.includes("permission denied") || error.message.includes("insufficient privilege")) {
          throw new Error(
            "No tienes permisos suficientes para ejecutar este comando. Por favor, usa el Panel de Supabase para ejecutar el SQL manualmente.",
          )
        }

        throw new Error(`Error al ejecutar SQL: ${error.message}`)
      }

      setResult({
        success: true,
        message: "RLS deshabilitado correctamente en la tabla users. Ahora deberías poder registrarte sin problemas.",
      })
    } catch (error) {
      console.error("Error al deshabilitar RLS:", error)
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const enableRls = async () => {
    setIsExecuting(true)
    setResult(null)

    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        throw new Error("No se pudo crear el cliente de Supabase")
      }

      // SQL para habilitar RLS en la tabla users y configurar políticas
      const sql = `
        -- Habilitar RLS en la tabla users
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

        -- Eliminar políticas existentes para evitar conflictos
        DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.users;
        DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.users;
        DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.users;
        DROP POLICY IF EXISTS "El servicio puede gestionar todos los perfiles" ON public.users;
        DROP POLICY IF EXISTS "Usuarios no autenticados pueden insertar perfiles" ON public.users;

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
        
        -- Política para permitir a usuarios no autenticados insertar perfiles
        CREATE POLICY "Usuarios no autenticados pueden insertar perfiles" 
        ON public.users FOR INSERT 
        WITH CHECK (true);
      `

      // Ejecutar el SQL
      const { error } = await supabase.rpc("exec_sql", { sql })

      if (error) {
        console.error("Error al ejecutar SQL:", error)

        // Si el error es por falta de permisos, proporcionar instrucciones alternativas
        if (error.message.includes("permission denied") || error.message.includes("insufficient privilege")) {
          throw new Error(
            "No tienes permisos suficientes para ejecutar este comando. Por favor, usa el Panel de Supabase para ejecutar el SQL manualmente.",
          )
        }

        throw new Error(`Error al ejecutar SQL: ${error.message}`)
      }

      setResult({
        success: true,
        message: "RLS habilitado correctamente con las políticas necesarias configuradas.",
      })
    } catch (error) {
      console.error("Error al habilitar RLS:", error)
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
          <CardTitle>Gestión de Row Level Security (RLS)</CardTitle>
          <CardDescription>
            Esta página te permite deshabilitar temporalmente RLS para solucionar problemas de registro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Importante: Medida temporal</AlertTitle>
            <AlertDescription className="text-amber-700">
              <p className="mb-2">
                Deshabilitar RLS es una medida temporal para solucionar problemas de registro. Una vez que hayas creado
                tu cuenta, deberías volver a habilitar RLS para mantener la seguridad de tu base de datos.
              </p>
              <p>
                Si no puedes ejecutar estos comandos debido a restricciones de permisos, deberás usar el Panel de SQL de
                Supabase para ejecutar los comandos manualmente.
              </p>
            </AlertDescription>
          </Alert>

          <p className="mb-4">
            El error "new row violates row-level security policy for table users" ocurre porque las políticas de
            seguridad de Supabase (RLS) están impidiendo la creación de perfiles de usuario. Puedes:
          </p>

          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Deshabilitar RLS temporalmente para crear tu cuenta</li>
            <li>Volver a habilitar RLS con las políticas correctas después</li>
          </ul>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Éxito" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="flex justify-between w-full">
            <Button onClick={disableRls} disabled={isExecuting} className="flex-1 mr-2" variant="destructive">
              <ShieldOff className="mr-2 h-4 w-4" />
              {isExecuting ? "Procesando..." : "Deshabilitar RLS"}
            </Button>
            <Button onClick={enableRls} disabled={isExecuting} className="flex-1 ml-2">
              <Shield className="mr-2 h-4 w-4" />
              {isExecuting ? "Procesando..." : "Habilitar RLS"}
            </Button>
          </div>
          <Button variant="outline" onClick={() => (window.location.href = "/signup")} className="w-full">
            Volver al Registro <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

