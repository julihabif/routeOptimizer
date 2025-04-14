import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">Política de Privacidad</h1>
          <p className="text-muted-foreground">Última actualización: 21 de marzo de 2025</p>
        </div>

        <div className="prose prose-blue max-w-none">
          <h2>1. Introducción</h2>
          <p>
            En ¿A quién dejo primero?, respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta
            política de privacidad te informará sobre cómo recopilamos, utilizamos y protegemos tus datos cuando
            utilizas nuestra aplicación.
          </p>

          <h2>2. Información que Recopilamos</h2>
          <p>Podemos recopilar los siguientes tipos de información:</p>
          <ul>
            <li>
              <strong>Información de registro:</strong> Nombre, dirección de correo electrónico y contraseña cuando
              creas una cuenta.
            </li>
            <li>
              <strong>Información de ubicación:</strong> Direcciones y coordenadas geográficas que ingresas para
              planificar rutas.
            </li>
            <li>
              <strong>Información de uso:</strong> Datos sobre cómo interactúas con nuestra aplicación, incluyendo las
              rutas que creas y las ubicaciones que guardas.
            </li>
            <li>
              <strong>Información técnica:</strong> Dirección IP, tipo de navegador, proveedor de servicios de Internet,
              páginas de referencia/salida, sistema operativo, fecha/hora y datos de clickstream.
            </li>
          </ul>

          <h2>3. Cómo Utilizamos tu Información</h2>
          <p>Utilizamos la información que recopilamos para:</p>
          <ul>
            <li>Proporcionar, mantener y mejorar nuestros servicios</li>
            <li>Procesar y completar transacciones</li>
            <li>Enviar información técnica, actualizaciones, alertas de seguridad y mensajes de soporte</li>
            <li>Responder a tus comentarios, preguntas y solicitudes</li>
            <li>Monitorear y analizar tendencias, uso y actividades relacionadas con nuestros servicios</li>
            <li>Detectar, investigar y prevenir actividades fraudulentas y no autorizadas</li>
            <li>Personalizar y mejorar tu experiencia con nuestros servicios</li>
          </ul>

          <h2>4. Compartir tu Información</h2>
          <p>No vendemos ni alquilamos tu información personal a terceros. Podemos compartir tu información con:</p>
          <ul>
            <li>Proveedores de servicios que nos ayudan a proporcionar nuestros servicios</li>
            <li>Socios comerciales con tu consentimiento</li>
            <li>Autoridades legales cuando sea requerido por ley</li>
          </ul>

          <h2>5. Seguridad de los Datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tus datos personales
            contra pérdida accidental, uso no autorizado, alteración o divulgación.
          </p>

          <h2>6. Tus Derechos</h2>
          <p>Dependiendo de tu ubicación, puedes tener los siguientes derechos:</p>
          <ul>
            <li>Acceder a tus datos personales</li>
            <li>Corregir datos inexactos</li>
            <li>Eliminar tus datos</li>
            <li>Oponerte al procesamiento de tus datos</li>
            <li>Solicitar la restricción del procesamiento de tus datos</li>
            <li>Solicitar la portabilidad de tus datos</li>
          </ul>

          <h2>7. Cookies y Tecnologías Similares</h2>
          <p>
            Utilizamos cookies y tecnologías similares para recopilar información sobre tus interacciones con nuestros
            servicios. Puedes configurar tu navegador para rechazar todas las cookies o para indicar cuándo se está
            enviando una cookie.
          </p>

          <h2>8. Cambios a esta Política</h2>
          <p>
            Podemos actualizar esta política de privacidad periódicamente. Te notificaremos cualquier cambio publicando
            la nueva política de privacidad en esta página y actualizando la fecha de "última actualización".
          </p>

          <h2>9. Contacto</h2>
          <p>
            Si tienes alguna pregunta sobre esta política de privacidad, puedes contactarnos en{" "}
            <a href="mailto:privacy@routeoptimizer.com">privacy@routeoptimizer.com</a>.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}

