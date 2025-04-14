"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Copy, AlertCircle, ArrowRight, ShieldOff, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ManualRlsFixPage() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("disable")

  // SQL para deshabilitar RLS
  const disableRlsSQL = `
-- Script para deshabilitar RLS en la tabla users
-- Ejecuta este script en el Editor SQL de Supabase

-- Deshabilitar RLS en la tabla users
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Verificar que RLS está deshabilitado
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'users' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
`.trim()

  // SQL para habilitar RLS con políticas correctas
  const enableRlsSQL = `
-- Script para habilitar RLS en la tabla users con las políticas correctas
-- Ejecuta este script en el Editor SQL de Supabase después de registrarte

-- Habilitar RLS en la tabla users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.users;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.users;
DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.users;

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

-- Verificar que RLS está habilitado
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'users' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
`.trim()

  const copyToClipboard = () => {
    const textToCopy = activeTab === "disable" ? disableRlsSQL : enableRlsSQL
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Solución Manual para Problemas de RLS</CardTitle>
          <CardDescription>
            Instrucciones para solucionar el error "new row violates row-level security policy for table users"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Problema detectado: Restricciones RLS</AlertTitle>
            <AlertDescription className="text-amber-700">
              <p className="mb-2">
                El error ocurre porque las políticas de seguridad de Supabase (RLS) están impidiendo la creación de
                perfiles de usuario. Para solucionarlo, necesitas deshabilitar temporalmente RLS, crear tu cuenta, y
                luego volver a habilitarlo.
              </p>
            </AlertDescription>
          </Alert>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="disable" className="flex items-center">
                <ShieldOff className="mr-2 h-4 w-4" />
                Paso 1: Deshabilitar RLS
              </TabsTrigger>
              <TabsTrigger value="enable" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Paso 2: Habilitar RLS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="disable" className="space-y-4 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Instrucciones para deshabilitar RLS</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Copia el siguiente script SQL</li>
                  <li>
                    Ve al{" "}
                    <a
                      href="https://app.supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Panel de Supabase
                    </a>
                  </li>
                  <li>Selecciona tu proyecto</li>
                  <li>Ve a la sección "SQL Editor" o "Editor SQL"</li>
                  <li>Crea un nuevo script</li>
                  <li>Pega el script SQL</li>
                  <li>Ejecuta el script</li>
                  <li>Regresa a la página de registro e intenta registrarte nuevamente</li>
                </ol>

                <div className="relative">
                  <Textarea value={disableRlsSQL} readOnly className="font-mono text-xs h-[250px] resize-none" />
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
            </TabsContent>

            <TabsContent value="enable" className="space-y-4 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Instrucciones para habilitar RLS después de registrarte</h3>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Importante</AlertTitle>
                  <AlertDescription>
                    Ejecuta este script DESPUÉS de haberte registrado exitosamente para restaurar la seguridad de tu
                    base de datos.
                  </AlertDescription>
                </Alert>

                <ol className="list-decimal list-inside space-y-2">
                  <li>Copia el siguiente script SQL</li>
                  <li>
                    Ve al{" "}
                    <a
                      href="https://app.supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Panel de Supabase
                    </a>
                  </li>
                  <li>Selecciona tu proyecto</li>
                  <li>Ve a la sección "SQL Editor" o "Editor SQL"</li>
                  <li>Crea un nuevo script</li>
                  <li>Pega el script SQL</li>
                  <li>Ejecuta el script</li>
                </ol>

                <div className="relative">
                  <Textarea value={enableRlsSQL} readOnly className="font-mono text-xs h-[250px] resize-none" />
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
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => (window.location.href = "/debug")}>
            Ver Diagnóstico
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/signup")}>
            Volver al Registro <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

