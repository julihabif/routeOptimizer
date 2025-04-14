import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { MapPin, Route, Clock, Shield, Mail, Github, Twitter } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Acerca de <strong>¿A quién dejo primero?</strong>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Hacemos que planificar rutas sea fácil, rápido y sin complicaciones
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">Nuestra Misión</h2>
                <p className="text-muted-foreground md:text-lg">
                En ¿A quién dejo primero? queremos que organizar rutas no sea un lío. Por eso armamos una herramienta simple para que cualquier persona —ya sea para un viaje con amigos, hacer trámites o salir a repartir algo— pueda planificar sus recorridos sin perder tiempo.
                No hace falta ser un experto: nuestra plataforma es súper fácil de usar, y te ayuda a moverte de forma más rápida, cómoda y gastando menos.
                La idea es que disfrutes más del camino (y de lo que viene después) sin andar adivinando por dónde ir.
                </p>
              </div>
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Gestión de Ubicaciones</h3>
                    <p className="text-muted-foreground">
                    Guardá y organizá los lugares que visitás seguido. Así, la próxima vez, los tenés a mano en segundos.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Route className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Optimización Inteligente</h3>
                    <p className="text-muted-foreground">
                    Nuestro sistema calcula la mejor ruta entre varios puntos, para que no des vueltas de más y ahorres nafta y tiempo
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Ahorro de Tiempo</h3>
                    <p className="text-muted-foreground">
                    Menos tiempo viendo el mapa, más tiempo para hacer lo que tengas ganas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Privacidad Garantizada</h3>
                    <p className="text-muted-foreground">
                    Tus datos son solo tuyos. No los compartimos con nadie y están protegidos con tecnología segura.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Nuestro Equipo</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg mb-12">
              Somos un equipo apasionado de desarrolladores, diseñadores y expertos en logística comprometidos con la
              creación de soluciones que simplifiquen tu día a día.
            </p>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="bg-card rounded-lg p-6">
                <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">Ana García</h3>
                <p className="text-muted-foreground">CEO & Fundadora</p>
              </div>
              <div className="bg-card rounded-lg p-6">
                <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">Carlos Rodríguez</h3>
                <p className="text-muted-foreground">CTO</p>
              </div>
              <div className="bg-card rounded-lg p-6">
                <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">Laura Martínez</h3>
                <p className="text-muted-foreground">Diseñadora UX</p>
              </div>
              <div className="bg-card rounded-lg p-6">
                <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">Javier López</h3>
                <p className="text-muted-foreground">Desarrollador Full Stack</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Comienza a Optimizar tus Rutas</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg mb-8">
              Únete a los miles de profesionales y empresas que ya están ahorrando tiempo y recursos con RouteOptimizer.
            </p>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/saved-routes">Comenzar Ahora</Link>
            </Button>
          </div>
        </section> */}

        <section className="py-12 md:py-16 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tighter mb-2">Contacto</h2>
                <p className="text-muted-foreground">¿Tenes preguntas o sugerencias? Estamos acá para ayudarte.</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="icon">
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </Button>
                <Button variant="outline" size="icon">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button variant="outline" size="icon">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

