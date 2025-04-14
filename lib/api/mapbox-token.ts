"use server"

// Esta función se ejecuta en el servidor y devuelve el token de Mapbox
export async function getMapboxToken() {
  // Accedemos a la variable de entorno de forma segura en el servidor
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

  if (!token) {
    console.error("No se encontró el token de Mapbox en las variables de entorno")
  }

  return token
}

// Esta función verifica si el token está configurado
export async function isMapboxTokenConfigured() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  return !!token && token.length > 0
}

