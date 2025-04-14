"use server"

// Acción del servidor para verificar SOLO el token del servidor
export async function checkServerMapboxToken() {
  // Verificar solo el token del servidor
  const hasServerToken = !!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  // Devolver solo información sobre si el token del servidor está configurado
  return {
    serverToken: hasServerToken,
  }
}

