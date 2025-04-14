"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import type { SavedRouteItem, DbSavedRoute } from "@/types/supabase-types"
import type { Route } from "@/types/route"
import type { VehicleProfile } from "@/components/vehicle-profile-selector"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth-service"

// Transformar datos de la base de datos al formato de la aplicación
function transformDbRouteToAppRoute(dbRoute: DbSavedRoute): SavedRouteItem {
  return {
    id: dbRoute.id,
    name: dbRoute.name,
    description: dbRoute.description,
    route: dbRoute.route_data as unknown as Route,
    vehicleProfile: dbRoute.vehicle_profile as unknown as VehicleProfile,
    date: dbRoute.created_at,
    isFavorite: dbRoute.is_favorite,
    tags: dbRoute.tags || [],
  }
}

// Obtener todas las rutas guardadas de un usuario
export async function getUserSavedRoutes(userId: string): Promise<SavedRouteItem[]> {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from("saved_routes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error al obtener rutas guardadas:", error)
      return []
    }

    return data.map(transformDbRouteToAppRoute)
  } catch (error) {
    console.error("Error inesperado al obtener rutas:", error)
    return []
  }
}

// Guardar una nueva ruta
export async function saveRoute(
  userId: string,
  name: string,
  description: string | null,
  route: Route,
  vehicleProfile: VehicleProfile,
  isFavorite = false,
  tags: string[] = [],
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = await createServerSupabaseClient()

  try {
    // Verificar que el usuario existe
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Usuario no autenticado o no existe" }
    }

    // Preparar los datos para guardar
    const routeData = {
      user_id: userId,
      name,
      description,
      route_data: route as any,
      vehicle_profile: vehicleProfile as any,
      is_favorite: isFavorite,
      tags,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Guardar la ruta
    const { data, error } = await supabase.from("saved_routes").insert(routeData).select().single()

    if (error) {
      console.error("Error al guardar la ruta:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/saved-routes")
    return { success: true, id: data.id }
  } catch (error) {
    console.error("Error inesperado al guardar ruta:", error)
    return { success: false, error: "Error inesperado al guardar la ruta" }
  }
}

// Obtener una ruta específica por ID
export async function getSavedRouteById(routeId: string): Promise<SavedRouteItem | null> {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("saved_routes").select("*").eq("id", routeId).single()

    if (error || !data) {
      console.error("Error al obtener la ruta:", error)
      return null
    }

    return transformDbRouteToAppRoute(data)
  } catch (error) {
    console.error("Error inesperado al obtener ruta por ID:", error)
    return null
  }
}

// Actualizar una ruta existente
export async function updateSavedRoute(
  routeId: string,
  updates: Partial<SavedRouteItem>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()

  try {
    // Transformar de formato de app a formato de DB
    const dbUpdates: Partial<DbSavedRoute> = {}

    if (updates.name) dbUpdates.name = updates.name
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.route) dbUpdates.route_data = updates.route as any
    if (updates.vehicleProfile) dbUpdates.vehicle_profile = updates.vehicleProfile as any
    if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite
    if (updates.tags) dbUpdates.tags = updates.tags

    dbUpdates.updated_at = new Date().toISOString()

    const { error } = await supabase.from("saved_routes").update(dbUpdates).eq("id", routeId)

    if (error) {
      console.error("Error al actualizar la ruta:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/saved-routes")
    revalidatePath(`/routes/${routeId}`)
    return { success: true }
  } catch (error) {
    console.error("Error inesperado al actualizar ruta:", error)
    return { success: false, error: "Error inesperado al actualizar la ruta" }
  }
}

// Eliminar una ruta
export async function deleteSavedRoute(routeId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()

  try {
    const { error } = await supabase.from("saved_routes").delete().eq("id", routeId)

    if (error) {
      console.error("Error al eliminar la ruta:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/saved-routes")
    return { success: true }
  } catch (error) {
    console.error("Error inesperado al eliminar ruta:", error)
    return { success: false, error: "Error inesperado al eliminar la ruta" }
  }
}

// Marcar/desmarcar una ruta como favorita
export async function toggleRouteFavorite(
  routeId: string,
  isFavorite: boolean,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()

  try {
    const { error } = await supabase
      .from("saved_routes")
      .update({
        is_favorite: isFavorite,
        updated_at: new Date().toISOString(),
      })
      .eq("id", routeId)

    if (error) {
      console.error("Error al actualizar favorito:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/saved-routes")
    return { success: true }
  } catch (error) {
    console.error("Error inesperado al cambiar favorito:", error)
    return { success: false, error: "Error inesperado al cambiar estado de favorito" }
  }
}
