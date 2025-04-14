import { SupabaseDiagnostics } from "@/components/supabase-diagnostics"

export default function DiagnosticsPage() {
  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Diagnóstico del Sistema</h1>
        <p className="text-muted-foreground">Verifica la configuración y conexión con servicios externos</p>
      </div>

      <SupabaseDiagnostics />
    </div>
  )
}

