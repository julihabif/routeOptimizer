import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  InfoIcon,
  BookOpen,
  Code,
  Database,
  Map,
  User,
  Wrench,
  FileText,
  Layers,
  GitBranch,
  AlertTriangle,
  Home,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ManualDeUsuarioPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">Manual Completo de ¿A quién dejo primero?</h1>
          <p className="text-muted-foreground">Documentación detallada del proyecto de optimización de rutas</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Tabla de Contenidos (Sidebar) */}
          <div className="md:w-64 shrink-0">
            <Card className="sticky top-20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contenido</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <nav className="flex flex-col space-y-1 text-sm">
                  <Link href="#vision-general" className="text-primary hover:underline flex items-center gap-2">
                    <InfoIcon className="h-4 w-4" />
                    Visión General
                  </Link>
                  <Link href="#arquitectura" className="hover:text-primary flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Arquitectura
                  </Link>
                  <Link href="#estructura" className="hover:text-primary flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Estructura de Carpetas
                  </Link>
                  <Link href="#autenticacion" className="hover:text-primary flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Autenticación
                  </Link>
                  <Link href="#mapbox" className="hover:text-primary flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    Integración con Mapbox
                  </Link>
                  <Link href="#supabase" className="hover:text-primary flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Integración con Supabase
                  </Link>
                  <Link href="#componentes" className="hover:text-primary flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Componentes Principales
                  </Link>
                  <Link href="#paginas" className="hover:text-primary flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Páginas y Rutas
                  </Link>
                  <Link href="#modelos" className="hover:text-primary flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Modelos de Datos
                  </Link>
                  <Link href="#servicios" className="hover:text-primary flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Servicios y Utilidades
                  </Link>
                  <Link href="#flujos" className="hover:text-primary flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Flujos de Trabajo
                  </Link>
                  <Link href="#problemas" className="hover:text-primary flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Solución de Problemas
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1 space-y-8">
            {/* Sección 1: Visión General */}
            <section id="vision-general" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <InfoIcon className="h-5 w-5 text-primary" />
                    Visión General del Proyecto
                  </CardTitle>
                  <CardDescription>Descripción general de ¿A quién dejo primero? y sus características</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    <strong>¿A quién dejo primero?</strong> es una aplicación web que permite a los usuarios optimizar rutas con
                    múltiples paradas. Utiliza el algoritmo del vecino más cercano para encontrar la ruta más eficiente
                    entre varias ubicaciones.
                  </p>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Características Principales:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Optimización de rutas con múltiples paradas</li>
                      <li>Visualización de rutas en mapas interactivos</li>
                      <li>Navegación paso a paso con indicaciones detalladas</li>
                      <li>Guardado y gestión de rutas y ubicaciones</li>
                      <li>Diferentes perfiles de vehículos para personalizar las rutas</li>
                      <li>Autenticación de usuarios con email y Google</li>
                      <li>Interfaz responsiva adaptada a dispositivos móviles y de escritorio</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Tecnologías Utilizadas:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>Frontend</strong>: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
                      </li>
                      <li>
                        <strong>Mapas</strong>: Mapbox GL JS
                      </li>
                      <li>
                        <strong>Backend</strong>: Supabase (PostgreSQL, Autenticación, Almacenamiento)
                      </li>
                      <li>
                        <strong>Componentes UI</strong>: Shadcn/UI
                      </li>
                      <li>
                        <strong>Iconos</strong>: Lucide React
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Sección 2: Arquitectura */}
            <section id="arquitectura" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Arquitectura del Sistema
                  </CardTitle>
                  <CardDescription>Estructura y organización técnica de la aplicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    La aplicación sigue una arquitectura moderna basada en componentes con Next.js, utilizando el patrón
                    App Router para la gestión de rutas y Server Components para optimizar el rendimiento.
                  </p>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Diagrama de Arquitectura:</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-xs overflow-auto">
                        Cliente (Navegador) → Next.js App Router → Server Components / Client Components
                        <br />
                        Server Components → Supabase SDK (Server) → Supabase Backend
                        <br />
                        Client Components → Supabase SDK (Client) → Supabase Backend
                        <br />
                        Client Components → Mapbox GL JS
                        <br />
                        Supabase Backend → PostgreSQL Database / Supabase Auth
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Flujo de Datos:</h3>
                    <ol className="list-decimal pl-6 space-y-1">
                      <li>El usuario interactúa con la interfaz (componentes del cliente)</li>
                      <li>Las acciones del usuario desencadenan operaciones en el cliente o solicitudes al servidor</li>
                      <li>Los componentes del servidor realizan operaciones con Supabase</li>
                      <li>Los datos se almacenan/recuperan de la base de datos PostgreSQL</li>
                      <li>La autenticación se maneja a través de Supabase Auth</li>
                      <li>La visualización de mapas se realiza con Mapbox GL JS en el cliente</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Sección 3: Estructura de Carpetas */}
            <section id="estructura" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Estructura de Carpetas
                  </CardTitle>
                  <CardDescription>Organización de archivos y directorios del proyecto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-xs overflow-auto whitespace-pre">
                      {`/
├── app/                    # Páginas y rutas (Next.js App Router)
│   ├── (main)/             # Layout principal
│   ├── about/              # Página Acerca de
│   ├── add-location/       # Página para añadir ubicaciones
│   ├── auth/               # Rutas de autenticación
│   ├── dashboard/          # Dashboard del usuario
│   ├── debug/              # Herramientas de diagnóstico
│   ├── fix-*/              # Páginas para solucionar problemas
│   ├── mapbox-debug/       # Diagnóstico de Mapbox
│   ├── privacy/            # Política de privacidad
│   ├── profile/            # Perfil de usuario
│   ├── route/              # Visualización de rutas específicas
│   ├── saved-*/            # Páginas de elementos guardados
│   ├── setup-*/            # Páginas de configuración
│   ├── signin/             # Inicio de sesión
│   ├── signup/             # Registro
│   ├── supabase-debug/     # Diagnóstico de Supabase
│   ├── terms/              # Términos y condiciones
│   ├── globals.css         # Estilos globales
│   ├── layout.tsx          # Layout principal de la aplicación
│   └── page.tsx            # Página principal
├── components/             # Componentes reutilizables
│   ├── auth/               # Componentes de autenticación
│   ├── layout/             # Componentes de layout
│   ├── ui/                 # Componentes de UI (shadcn)
│   └── [component].tsx     # Componentes específicos
├── lib/                    # Utilidades y servicios
│   ├── actions/            # Server Actions
│   ├── api/                # Funciones de API
│   ├── services/           # Servicios de datos
│   ├── supabase/           # Configuración de Supabase
│   └── utils.ts            # Utilidades generales
├── public/                 # Archivos estáticos
├── schema/                 # Esquemas SQL para Supabase
├── types/                  # Definiciones de tipos TypeScript
├── middleware.ts           # Middleware de Next.js
├── next.config.mjs         # Configuración de Next.js
└── tailwind.config.ts      # Configuración de Tailwind CSS`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Sección 4: Autenticación */}
            <section id="autenticacion" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Autenticación y Gestión de Usuarios
                  </CardTitle>
                  <CardDescription>Sistema de autenticación y gestión de perfiles de usuario</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    La aplicación utiliza Supabase Auth para la autenticación de usuarios, con soporte para
                    autenticación con email y contraseña, autenticación con Google, y gestión de sesiones con cookies.
                  </p>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Componentes Clave:</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">lib/supabase/client.ts</h4>
                        <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                          {`// Cliente de Supabase para el navegador (singleton)
export const getBrowserClient = () => {
  if (typeof window === "undefined") {
    return null;
  }
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient<Database>();
  }
  return supabaseClient;
}`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-medium">lib/supabase/server.ts</h4>
                        <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                          {`// Cliente de Supabase para el servidor
export async function createServerSupabaseClient() {
  try {
    const cookieStore = cookies();
    return createServerComponentClient<Database>({
      cookies: () => cookieStore,
    });
  } catch (error) {
    console.error("Error al crear el cliente de Supabase en el servidor:", error);
    return null;
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Flujo de Autenticación:</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>
                        <strong>Registro de Usuario</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>El usuario completa el formulario de registro</li>
                          <li>Se crea una cuenta en Supabase Auth</li>
                          <li>Se crea un perfil en la tabla `users`</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Inicio de Sesión</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>Con email/contraseña: Autenticación directa</li>
                          <li>Con Google: Redirección a Google → Callback → Autenticación</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Gestión de Sesiones</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>Las sesiones se almacenan en cookies</li>
                          <li>El middleware verifica la sesión para rutas protegidas</li>
                          <li>Los tokens se refrescan automáticamente</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Cierre de Sesión</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>Se elimina la sesión de Supabase</li>
                          <li>Se limpian las cookies</li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Sección 5: Integración con Mapbox */}
            <section id="mapbox" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" />
                    Integración con Mapbox
                  </CardTitle>
                  <CardDescription>Implementación de mapas y servicios de geolocalización</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    La aplicación utiliza Mapbox GL JS para la visualización de mapas y la geocodificación de
                    direcciones.
                  </p>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Configuración de Token:</h3>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                      {`// lib/api/mapbox-token.ts
export async function getMapboxToken() {
  const token = process.env.MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
  return token;
}`}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Componentes Principales:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>components/route-map.tsx</strong>: Visualiza la ruta optimizada en un mapa interactivo
                        con marcadores para inicio, fin y paradas.
                      </li>
                      <li>
                        <strong>components/location-input.tsx</strong>: Permite buscar y seleccionar ubicaciones con
                        autocompletado, utilizando la API de geocodificación de Mapbox.
                      </li>
                      <li>
                        <strong>components/navigation-map-preview.tsx</strong>: Muestra una vista previa del mapa
                        durante la navegación paso a paso.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Funcionalidades de Mapbox:</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>
                        <strong>Geocodificación</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>Búsqueda de ubicaciones por nombre/dirección</li>
                          <li>Geocodificación inversa (coordenadas a dirección)</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Visualización de Rutas</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>Líneas de ruta con estilos personalizados</li>
                          <li>Marcadores para inicio, paradas y fin</li>
                          <li>Ajuste automático de la vista para mostrar toda la ruta</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Interactividad</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>Zoom y desplazamiento</li>
                          <li>Popups con información de ubicaciones</li>
                          <li>Edición de rutas arrastrando puntos</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Navegación</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>Vista de navegación paso a paso</li>
                          <li>Indicaciones de giro y dirección</li>
                          <li>Simulación de progreso en la ruta</li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Sección 6: Integración con Supabase */}
            <section id="supabase" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Integración con Supabase
                  </CardTitle>
                  <CardDescription>Implementación de la base de datos y servicios de backend</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>La aplicación utiliza Supabase como backend para almacenamiento de datos y autenticación.</p>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Esquema de Base de Datos:</h3>
                    <p>
                      El esquema principal se encuentra en <code>schema/schema.sql</code> e incluye:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        Tabla <code>users</code>: Perfiles de usuario
                      </li>
                      <li>
                        Tabla <code>saved_routes</code>: Rutas guardadas
                      </li>
                      <li>
                        Tabla <code>saved_locations</code>: Ubicaciones guardadas
                      </li>
                      <li>
                        Tabla <code>custom_vehicles</code>: Vehículos personalizados
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Políticas de Seguridad (RLS):</h3>
                    <p>
                      Las políticas de Row Level Security (RLS) aseguran que los usuarios solo puedan acceder a sus
                      propios datos:
                    </p>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                      {`-- Ejemplo para saved_routes
CREATE POLICY "Los usuarios pueden ver sus propias rutas" 
ON public.saved_routes FOR SELECT 
USING (auth.uid() = user_id);`}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Servicios de Datos:</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">lib/services/route-service.ts</h4>
                        <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                          {`export async function getUserSavedRoutes(userId: string): Promise<SavedRouteItem[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("saved_routes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  // ...
}`}
                        </pre>
                      </div>
                    </div>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>
                        <strong>lib/services/location-service.ts</strong>: Gestiona operaciones CRUD para ubicaciones.
                      </li>
                      <li>
                        <strong>lib/services/vehicle-service.ts</strong>: Gestiona operaciones CRUD para perfiles de
                        vehículos.
                      </li>
                      <li>
                        <strong>lib/services/auth-service.ts</strong>: Gestiona operaciones relacionadas con la
                        autenticación y perfiles de usuario.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Funcionalidades de Supabase:</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>
                        <strong>Autenticación</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>Registro e inicio de sesión</li>
                          <li>Proveedores sociales (Google)</li>
                          <li>Gestión de sesiones</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Almacenamiento de Datos</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>Rutas optimizadas</li>
                          <li>Ubicaciones favoritas</li>
                          <li>Perfiles de vehículos</li>
                          <li>Información de usuario</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Seguridad</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>Row Level Security (RLS)</li>
                          <li>Funciones SQL con privilegios elevados</li>
                          <li>Validación de datos</li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Sección 7: Componentes Principales */}
            <section id="componentes" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Componentes Principales
                  </CardTitle>
                  <CardDescription>Componentes clave de la aplicación y su funcionalidad</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="route">
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="route">Componentes de Ruta</TabsTrigger>
                      <TabsTrigger value="location">Componentes de Ubicación</TabsTrigger>
                      <TabsTrigger value="auth">Componentes de Autenticación</TabsTrigger>
                      <TabsTrigger value="layout">Componentes de Layout</TabsTrigger>
                    </TabsList>

                    <TabsContent value="route" className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">components/route-optimizer.tsx</h3>
                        <p>Componente principal que permite a los usuarios crear y optimizar rutas.</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Gestiona entradas de ubicaciones (inicio, fin, paradas)</li>
                          <li>Inicia el proceso de optimización</li>
                          <li>Muestra resultados en diferentes pestañas</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">components/route-map.tsx</h3>
                        <p>Visualiza la ruta optimizada en un mapa interactivo.</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Renderiza el mapa con Mapbox GL</li>
                          <li>Muestra marcadores y líneas de ruta</li>
                          <li>Permite interacción (zoom, arrastrar)</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">components/route-details.tsx</h3>
                        <p>Muestra detalles paso a paso de la ruta optimizada.</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Instrucciones detalladas</li>
                          <li>Distancias y tiempos</li>
                          <li>Resumen de la ruta</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">components/turn-by-turn-navigation.tsx</h3>
                        <p>Proporciona navegación paso a paso para seguir la ruta.</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Instrucciones de giro</li>
                          <li>Vista previa del mapa</li>
                          <li>Progreso de la navegación</li>
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="location" className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">components/location-input.tsx</h3>
                        <p>Campo de entrada para buscar y seleccionar ubicaciones.</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Autocompletado de direcciones</li>
                          <li>Geocodificación con Mapbox</li>
                          <li>Opción para usar ubicación actual</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">components/saved-locations-list.tsx</h3>
                        <p>Lista de ubicaciones guardadas del usuario.</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Visualización de ubicaciones</li>
                          <li>Opciones para editar/eliminar</li>
                          <li>Filtrado y búsqueda</li>
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="auth" className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">components/auth/sign-in-form.tsx</h3>
                        <p>Formulario de inicio de sesión.</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Inicio de sesión con email/contraseña</li>
                          <li>Inicio de sesión con Google</li>
                          <li>Manejo de errores</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">components/auth/sign-up-form.tsx</h3>
                        <p>Formulario de registro.</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Registro con email/contraseña</li>
                          <li>Validación de campos</li>
                          <li>Creación de perfil</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">components/auth/user-nav.tsx</h3>
                        <p>Navegación de usuario en el header.</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Muestra avatar y nombre</li>
                          <li>Menú desplegable con opciones</li>
                          <li>Estado de sesión</li>
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="layout" className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">components/header.tsx</h3>
                        <p>Encabezado de la aplicación.</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Logo y navegación principal</li>
                          <li>Menú de usuario</li>
                          <li>Versión móvil y escritorio</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">components/footer.tsx</h3>
                        <p>Pie de página de la aplicación.</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Enlaces a páginas legales</li>
                          <li>Información de copyright</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">components/supabase-diagnostics.tsx</h3>
                        <p>Herramienta para diagnosticar problemas con Supabase.</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Verificación de conexión</li>
                          <li>Estado de autenticación</li>
                          <li>Configuración de variables de entorno</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">components/mapbox-diagnostics.tsx</h3>
                        <p>Herramienta para diagnosticar problemas con Mapbox.</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Verificación de token</li>
                          <li>Soporte de navegador</li>
                          <li>Estado de WebGL</li>
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* Sección 8: Páginas y Rutas */}
            <section id="paginas" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Páginas y Rutas
                  </CardTitle>
                  <CardDescription>Estructura de páginas y rutas de la aplicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Páginas Principales</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>app/page.tsx</strong>: Página principal con el optimizador de rutas.
                      </li>
                      <li>
                        <strong>app/dashboard/page.tsx</strong>: Dashboard del usuario con resumen de actividad y
                        accesos rápidos.
                      </li>
                      <li>
                        <strong>app/saved-routes/page.tsx</strong>: Lista de rutas guardadas por el usuario.
                      </li>
                      <li>
                        <strong>app/saved-locations/page.tsx</strong>: Lista de ubicaciones guardadas por el usuario.
                      </li>
                      <li>
                        <strong>app/route/[id]/page.tsx</strong>: Visualización detallada de una ruta específica.
                      </li>
                      <li>
                        <strong>app/add-location/page.tsx</strong>: Página para añadir una nueva ubicación.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Páginas de Autenticación</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>app/signin/page.tsx</strong>: Página de inicio de sesión.
                      </li>
                      <li>
                        <strong>app/signup/page.tsx</strong>: Página de registro.
                      </li>
                      <li>
                        <strong>app/auth/callback/route.ts</strong>: Ruta para manejar callbacks de autenticación.
                      </li>
                      <li>
                        <strong>app/profile/page.tsx</strong>: Perfil de usuario y configuración.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Páginas de Diagnóstico y Solución de Problemas</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>app/debug/page.tsx</strong>: Centro de diagnóstico general.
                      </li>
                      <li>
                        <strong>app/supabase-debug/page.tsx</strong>: Diagnóstico específico de Supabase.
                      </li>
                      <li>
                        <strong>app/mapbox-debug/page.tsx</strong>: Diagnóstico específico de Mapbox.
                      </li>
                      <li>
                        <strong>app/fix-auth/page.tsx</strong>: Herramientas para solucionar problemas de autenticación.
                      </li>
                      <li>
                        <strong>app/fix-cookies/page.tsx</strong>: Herramientas para solucionar problemas de cookies.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Páginas Informativas</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>app/about/page.tsx</strong>: Información sobre la aplicación.
                      </li>
                      <li>
                        <strong>app/terms/page.tsx</strong>: Términos y condiciones.
                      </li>
                      <li>
                        <strong>app/privacy/page.tsx</strong>: Política de privacidad.
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Sección 9: Modelos de Datos */}
            <section id="modelos" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Modelos de Datos
                  </CardTitle>
                  <CardDescription>Estructuras de datos y esquemas utilizados en la aplicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Tipos Principales</h3>
                    <div>
                      <h4 className="font-medium">types/route.ts</h4>
                      <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                        {`export interface Location {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface RouteStep {
  summary: string;
  distance: number; // in meters
  duration: number; // in seconds
  instructions: string[];
}

export interface Route {
  start: Location;
  end: Location;
  stops: Location[];
  steps: RouteStep[];
  duration: number; // in seconds
  distance: number; // in meters
  center: [number, number]; // center point for the map
  geometry?: GeoJSON.LineString; // geometría de la ruta que sigue las calles
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Esquema de Base de Datos</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Tabla users</h4>
                        <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                          {`CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-medium">Tabla saved_routes</h4>
                        <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                          {`CREATE TABLE IF NOT EXISTS public.saved_routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  route_data JSONB NOT NULL,
  vehicle_profile JSONB NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-medium">Tabla saved_locations</h4>
                        <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                          {`CREATE TABLE IF NOT EXISTS public.saved_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  name TEXT NOT NULL,
  coordinates NUMERIC[] NOT NULL,
  address TEXT NOT NULL,
  location_type TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Sección 10: Servicios y Utilidades */}
            <section id="servicios" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    Servicios y Utilidades
                  </CardTitle>
                  <CardDescription>Funciones y servicios de apoyo para la aplicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Servicios Principales</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>lib/route-optimizer.ts</strong>: Implementa el algoritmo de optimización de rutas.
                        <ul className="list-disc pl-6 mt-1">
                          <li>Algoritmo del vecino más cercano</li>
                          <li>Cálculo de distancias</li>
                          <li>Validación de ubicaciones</li>
                        </ul>
                      </li>
                      <li>
                        <strong>lib/mapbox.ts</strong>: Funciones para interactuar con la API de Mapbox.
                        <ul className="list-disc pl-6 mt-1">
                          <li>Geocodificación de direcciones</li>
                          <li>Obtención de rutas entre ubicaciones</li>
                          <li>Implementación de fallback para cuando la API falla</li>
                        </ul>
                      </li>
                      <li>
                        <strong>lib/services/route-service.ts</strong>: Operaciones CRUD para rutas en Supabase.
                      </li>
                      <li>
                        <strong>lib/services/location-service.ts</strong>: Operaciones CRUD para ubicaciones en
                        Supabase.
                      </li>
                      <li>
                        <strong>lib/services/auth-service.ts</strong>: Operaciones relacionadas con la autenticación.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Utilidades</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>lib/utils.ts</strong>: Funciones de utilidad generales.
                        <ul className="list-disc pl-6 mt-1">
                          <li>
                            Combinación de clases CSS (función <code>cn</code>)
                          </li>
                          <li>Formateo de fechas y horas</li>
                          <li>Validaciones comunes</li>
                        </ul>
                      </li>
                      <li>
                        <strong>lib/api/mapbox-token.ts</strong>: Gestión segura del token de Mapbox.
                      </li>
                      <li>
                        <strong>lib/supabase/client.ts</strong>: Cliente de Supabase para el navegador.
                      </li>
                      <li>
                        <strong>lib/supabase/server.ts</strong>: Cliente de Supabase para el servidor.
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Sección 11: Flujos de Trabajo */}
            <section id="flujos" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-primary" />
                    Flujos de Trabajo Principales
                  </CardTitle>
                  <CardDescription>Procesos y flujos de trabajo clave de la aplicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Optimización de Ruta</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-xs overflow-auto">
                        Usuario ingresa ubicaciones → Validación de ubicaciones → Geocodificación de direcciones
                        <br />→ Algoritmo de optimización → Cálculo de ruta con Mapbox → Visualización en mapa
                        <br />→ Detalles de la ruta
                      </pre>
                    </div>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>
                        <strong>Entrada de Ubicaciones</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>El usuario ingresa punto de inicio, fin y paradas</li>
                          <li>Selecciona perfil de vehículo</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Validación y Geocodificación</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>Se validan las entradas</li>
                          <li>Se convierten direcciones a coordenadas</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Optimización</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>Se aplica el algoritmo del vecino más cercano</li>
                          <li>Se determina el orden óptimo de paradas</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Cálculo de Ruta</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>Se obtiene la ruta detallada de Mapbox</li>
                          <li>Se calculan distancias y tiempos</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Visualización</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>Se muestra la ruta en el mapa</li>
                          <li>Se presentan instrucciones detalladas</li>
                        </ul>
                      </li>
                    </ol>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Autenticación de Usuario</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-xs overflow-auto">
                        Usuario accede a página protegida → Middleware verifica sesión
                        <br />→ Si no está autenticado: Redirección a /signin
                        <br />→ Usuario inicia sesión (Email/Password o Google)
                        <br />→ Creación/verificación de perfil → Redirección a página original
                      </pre>
                    </div>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>
                        <strong>Verificación de Acceso</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>El middleware verifica la sesión</li>
                          <li>Redirige a inicio de sesión si es necesario</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Inicio de Sesión</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>El usuario elige método (email o Google)</li>
                          <li>Se procesa la autenticación</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Creación de Perfil</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>
                            Se verifica si existe perfil en <code>users</code>
                          </li>
                          <li>Se crea si no existe</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Redirección</strong>:
                        <ul className="list-disc pl-6 mt-1">
                          <li>El usuario es redirigido a la página original</li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Sección 12: Solución de Problemas */}
            <section id="problemas" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Solución de Problemas Comunes
                  </CardTitle>
                  <CardDescription>Guía para resolver problemas frecuentes en la aplicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Problemas de Autenticación</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Error: "Failed to parse cookie string"</h4>
                        <p>
                          <strong>Solución</strong>: Utilizar la página <code>/fix-cookies</code> para limpiar cookies
                          corruptas.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">
                          Error: "new row violates row-level security policy for table users"
                        </h4>
                        <p>
                          <strong>Solución</strong>: Configurar correctamente las políticas RLS en Supabase usando las
                          herramientas en <code>/fix-auth</code> o <code>/setup-rls-correctly</code>.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Problemas con Mapbox</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Error: "Cannot read properties of undefined (reading 'indoor')"</h4>
                        <p>
                          <strong>Solución</strong>: Verificar que el token de Mapbox esté configurado correctamente y
                          que el contenedor del mapa tenga dimensiones válidas.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Mapa en blanco</h4>
                        <p>
                          <strong>Solución</strong>: Verificar la conexión a Internet, el token de Mapbox y el soporte
                          de WebGL en el navegador.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Problemas con Supabase</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Error de conexión</h4>
                        <p>
                          <strong>Solución</strong>: Verificar las variables de entorno{" "}
                          <code>NEXT_PUBLIC_SUPABASE_URL</code> y <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Errores de CORS</h4>
                        <p>
                          <strong>Solución</strong>: Configurar correctamente los dominios permitidos en la
                          configuración de Supabase.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Herramientas de Diagnóstico</AlertTitle>
                    <AlertDescription>
                      <p>
                        La aplicación incluye varias herramientas de diagnóstico para ayudar a solucionar problemas:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>
                          <Link href="/debug" className="text-primary hover:underline">
                            Centro de Diagnóstico General
                          </Link>
                        </li>
                        <li>
                          <Link href="/supabase-debug" className="text-primary hover:underline">
                            Diagnóstico de Supabase
                          </Link>
                        </li>
                        <li>
                          <Link href="/mapbox-debug" className="text-primary hover:underline">
                            Diagnóstico de Mapbox
                          </Link>
                        </li>
                        <li>
                          <Link href="/fix-auth" className="text-primary hover:underline">
                            Solución de Problemas de Autenticación
                          </Link>
                        </li>
                        <li>
                          <Link href="/fix-cookies" className="text-primary hover:underline">
                            Solución de Problemas de Cookies
                          </Link>
                        </li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Volver a la Página Principal
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </main>
  )
}
