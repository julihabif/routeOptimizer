import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation } from "lucide-react"
import Link from "next/link"

export function LocationBanner() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-100 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Guarda tus ubicaciones favoritas</h3>
              <p className="text-sm text-muted-foreground">
                Añade y gestiona tus ubicaciones para usarlas en tus rutas
              </p>
            </div>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700 shadow-sm">
            <Link href="/add-location">
              <Navigation className="mr-2 h-4 w-4" />
              Añadir Ubicación
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

