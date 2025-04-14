import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SupabaseConfigChecker } from "@/components/supabase-config-checker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ShieldOff, ExternalLink, Settings, Database, AlertTriangle, Code } from "lucide-react"

export default function DebugPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">Página de Diagnóstico</h1>
          <p className="text-muted-foreground">
            Utiliza esta página para diagnosticar y solucionar problemas con la aplicación
          </p>
        </div>

        <Tabs defaultValue="rls" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rls">Problemas de RLS</TabsTrigger>
            <TabsTrigger value="fk">Problemas de Clave Foránea</TabsTrigger>
            <TabsTrigger value="supabase">Supabase</TabsTrigger>
            <TabsTrigger value="env">Variables de Entorno</TabsTrigger>
            <TabsTrigger value="tools">Herramientas</TabsTrigger>
          </TabsList>

          <TabsContent value="rls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Solución a problemas de RLS</CardTitle>
                <CardDescription>
                  Si estás experimentando el error "new row violates row-level security policy for table users" al
                  registrarte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Este error ocurre porque las políticas de seguridad de Supabase (RLS) están impidiendo la creación de
                  perfiles de usuario. Tenemos varias soluciones disponibles:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild variant="destructive">
                    <Link href="/direct-sql">
                      <Code className="mr-2 h-4 w-4" />
                      Solución SQL Directa (NUEVA)
                    </Link>
                  </Button>
                  <Button asChild variant="destructive">
                    <Link href="/rls-diagnosis">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Diagnóstico y Solución
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/setup-rls-correctly">
                      <Settings className="mr-2 h-4 w-4" />
                      Solución permanente
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/manual-rls-fix">
                      <ShieldOff className="mr-2 h-4 w-4" />
                      Solución temporal
                    </Link>
                  </Button>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">¿Cuál solución debo elegir?</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Solución SQL Directa:</strong> La opción más rápida y efectiva. Ejecuta SQL directamente
                      para solucionar el problema.
                    </li>
                    <li>
                      <strong>Diagnóstico y Solución:</strong> Diagnostica el problema y ofrece soluciones.
                    </li>
                    <li>
                      <strong>Solución permanente:</strong> Configura correctamente las políticas RLS y funciones de
                      servicio para evitar problemas futuros.
                    </li>
                    <li>
                      <strong>Solución temporal:</strong> Deshabilita temporalmente RLS para crear tu cuenta, y luego
                      vuelve a habilitarlo.
                    </li>
                  </ul>
                </div>

                <Button variant="outline" asChild className="mt-2">
                  <a
                    href="https://supabase.com/docs/guides/auth/row-level-security"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Documentación RLS
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Solución a problemas de Clave Foránea</CardTitle>
                <CardDescription>
                  Si estás experimentando el error "insert or update on table 'users' violates foreign key constraint
                  'users_id_fkey'" al registrarte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Este error ocurre porque la restricción de clave foránea está configurada para verificarse
                  inmediatamente, pero el registro en auth.users aún no está completamente confirmado cuando intentamos
                  crear el perfil.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild>
                    <Link href="/fix-table-structure">
                      <Database className="mr-2 h-4 w-4" />
                      Corregir Estructura de Tabla
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <a
                      href="https://www.postgresql.org/docs/current/sql-set-constraints.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Documentación PostgreSQL
                    </a>
                  </Button>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">¿Qué hace esta solución?</h3>
                  <p>
                    Esta solución modifica la restricción de clave foránea para que se verifique al final de la
                    transacción, no inmediatamente, lo que permite que ambas inserciones (en auth.users y en
                    public.users) se completen correctamente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supabase" className="space-y-4">
            <SupabaseConfigChecker />

            <Card>
              <CardHeader>
                <CardTitle>Enlaces útiles para Supabase</CardTitle>
                <CardDescription>Accede a recursos para solucionar problemas con Supabase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" asChild>
                    <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer">
                      Panel de Control de Supabase
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer">
                      Documentación de Supabase
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="https://supabase.com/docs/guides/auth" target="_blank" rel="noopener noreferrer">
                      Guía de Autenticación
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a
                      href="https://github.com/supabase/supabase/discussions"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Foro de Discusión
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="env" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Variables de Entorno</CardTitle>
                <CardDescription>Verifica las variables de entorno necesarias para la aplicación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Variables de Supabase</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>NEXT_PUBLIC_SUPABASE_URL</strong>: URL de tu proyecto de Supabase
                      <div className="text-sm text-muted-foreground mt-1">
                        Ejemplo: https://abcdefghijklm.supabase.co
                      </div>
                    </li>
                    <li>
                      <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong>: Clave anónima de tu proyecto de Supabase
                      <div className="text-sm text-muted-foreground mt-1">
                        Debe ser la clave anónima (pública), no la clave de servicio
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Variables de Mapbox</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Tokens de Mapbox</strong>: Se requieren tokens de acceso para las funcionalidades de mapas
                      <div className="text-sm text-muted-foreground mt-1">
                        Asegúrate de configurar correctamente los tokens de Mapbox según la documentación
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted p-4 rounded-md mt-4">
                  <h3 className="text-sm font-medium mb-2">¿Cómo configurar las variables de entorno?</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>
                      Crea un archivo <code>.env.local</code> en la raíz de tu proyecto
                    </li>
                    <li>Añade las variables necesarias con sus valores</li>
                    <li>Reinicia el servidor de desarrollo</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Herramientas de Diagnóstico</CardTitle>
                <CardDescription>Accede a herramientas para diagnosticar problemas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild>
                    <Link href="/direct-sql">Ejecutar SQL Directo</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/setup-database">Configuración de Base de Datos</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/check-env">Verificar Variables de Entorno</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/diagnostics">Diagnóstico del Sistema</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/setup-rls-correctly">Configurar RLS Correctamente</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/fix-table-structure">Corregir Estructura de Tabla</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </main>
  )
}

