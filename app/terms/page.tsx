import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">Términos y Condiciones</h1>
          <p className="text-muted-foreground">Última actualización: 21 de marzo de 2025</p>
        </div>

        <div className="prose prose-blue max-w-none">
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar ¿A quién dejo primero?, aceptas estar sujeto a estos Términos y Condiciones y a nuestra
            Política de Privacidad. Si no estás de acuerdo con alguno de estos términos, no debes utilizar nuestro
            servicio.
          </p>

          <h2>2. Descripción del Servicio</h2>
          <p>
          ¿A quién dejo primero? es una aplicación web que permite a los usuarios optimizar rutas entre múltiples ubicaciones,
            guardar ubicaciones frecuentes y compartir rutas con otros usuarios.
          </p>

          <h2>3. Cuentas de Usuario</h2>
          <p>
            Para acceder a ciertas funcionalidades de ¿A quién dejo primero?, deberás crear una cuenta. Eres responsable de
            mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.
          </p>

          <h2>4. Uso Aceptable</h2>
          <p>Te comprometes a no utilizar ¿A quién dejo primero? para:</p>
          <ul>
            <li>Violar leyes o regulaciones locales, estatales, nacionales o internacionales</li>
            <li>Infringir los derechos de propiedad intelectual de terceros</li>
            <li>Transmitir material ilegal, abusivo, difamatorio, obsceno o de otro modo objetable</li>
            <li>Transmitir virus, troyanos, gusanos u otro código malicioso</li>
            <li>Interferir con o interrumpir la integridad o el rendimiento del servicio</li>
          </ul>

          <h2>5. Propiedad Intelectual</h2>
          <p>
          ¿A quién dejo primero? y todo su contenido, características y funcionalidades son propiedad de nuestra empresa y
            están protegidos por leyes de propiedad intelectual. No puedes reproducir, distribuir, modificar, crear
            trabajos derivados, mostrar públicamente o utilizar de cualquier otra manera el contenido sin nuestro
            permiso expreso.
          </p>

          <h2>6. Limitación de Responsabilidad</h2>
          <p>
          ¿A quién dejo primero? se proporciona "tal cual" y "según disponibilidad" sin garantías de ningún tipo. No
            garantizamos que el servicio sea ininterrumpido, oportuno, seguro o libre de errores. No seremos
            responsables por cualquier pérdida o daño resultante del uso de nuestro servicio.
          </p>

          <h2>7. Indemnización</h2>
          <p>
            Aceptas indemnizar y mantener indemne a nuestra empresa y a sus afiliados, funcionarios, agentes y empleados
            de cualquier reclamo, responsabilidad, daño, pérdida y gasto que surja de tu uso del servicio o de la
            violación de estos términos.
          </p>

          <h2>8. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en
            vigor inmediatamente después de su publicación. Tu uso continuado del servicio después de cualquier
            modificación constituye tu aceptación de los nuevos términos.
          </p>

          <h2>9. Ley Aplicable</h2>
          <p>
            Estos términos se regirán e interpretarán de acuerdo con las leyes del país donde operamos, sin tener en
            cuenta sus disposiciones sobre conflictos de leyes.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Si tienes alguna pregunta sobre estos Términos y Condiciones, puedes contactarnos en{" "}
            <a href="mailto:legal@routeoptimizer.com">legal@routeoptimizer.com</a>.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}

