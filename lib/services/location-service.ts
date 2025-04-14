"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import type { SavedLocationItem, DbSavedLocation } from "@/types/supabase-types"
import type { Location } from "@/types/route"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth-service"

// Transformar datos de la base de datos al formato de la aplicación
async function transformDbLocationToAppLocation(dbLocation: DbSavedLocation): Promise<SavedLocationItem> {
  return {
    id: dbLocation.id,
    name: dbLocation.name,
    coordinates: dbLocation.coordinates as unknown as [number, number],
    address: dbLocation.address,
    locationType: dbLocation.location_type,
    isFavorite: dbLocation.is_favorite,
    notes: dbLocation.notes || null,
  }
}

// Obtener todas las ubicaciones guardadas de un usuario
export async function getUserSavedLocations(userId: string): Promise<SavedLocationItem[]> {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from("saved_locations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error al obtener ubicaciones guardadas:", error)
      return []
    }

    const transformedData = await Promise.all(data.map(transformDbLocationToAppLocation))
    return transformedData
  } catch (error) {
    console.error("Error inesperado al obtener ubicaciones:", error)
    return []
  }
}

// Guardar una nueva ubicación
export async function saveLocation(
  userId: string,
  location: Location,
  address: string,
  locationType = "custom",
  isFavorite = false,
  notes?: string | null,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createServerSupabaseClient()

  try {
    // Verificar que el usuario existe
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Usuario no autenticado o no existe" }
    }

    // Preparar los datos para guardar
    const locationData = {
      user_id: userId,
      name: location.name,
      coordinates: location.coordinates,
      address,
      location_type: locationType,
      is_favorite: isFavorite,
      notes: notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Guardar la ubicación
    const { data, error } = await supabase.from("saved_locations").insert(locationData).select().single()

    if (error) {
      console.error("Error al guardar la ubicación:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/saved-locations")
    return { success: true, id: data.id }
  } catch (error) {
    console.error("Error inesperado al guardar ubicación:", error)
    return { success: false, error: "Error inesperado al guardar la ubicación" }
  }
}

// Obtener una ubicación específica por ID
export async function getSavedLocationById(locationId: string): Promise<SavedLocationItem | null> {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("saved_locations").select("*").eq("id", locationId).single()

    if (error || !data) {
      console.error("Error al obtener la ubicación:", error)
      return null
    }

    return await transformDbLocationToAppLocation(data)
  } catch (error) {
    console.error("Error inesperado al obtener ubicación por ID:", error)
    return null
  }
}

// Convertir SavedLocationItem a Location
export async function savedLocationToRouteLocation(savedLocation: SavedLocationItem): Promise<Location> {
  return {
    id: savedLocation.id,
    name: savedLocation.name,
    coordinates: savedLocation.coordinates,
  }
}

// Actualizar una ubicación existente
export async function updateSavedLocation(
  locationId: string,
  updates: Partial<SavedLocationItem>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  try {
    // Transformar de formato de app a formato de DB
    const dbUpdates: Partial<DbSavedLocation> = {}

    if (updates.name) dbUpdates.name = updates.name
    if (updates.coordinates) dbUpdates.coordinates = updates.coordinates as unknown as number[]
    if (updates.address) dbUpdates.address = updates.address
    if (updates.locationType) dbUpdates.location_type = updates.locationType
    if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes

    dbUpdates.updated_at = new Date().toISOString()

    const { error } = await supabase.from("saved_locations").update(dbUpdates).eq("id", locationId)

    if (error) {
      console.error("Error al actualizar la ubicación:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/saved-locations")
    return { success: true }
  } catch (error) {
    console.error("Error inesperado al actualizar ubicación:", error)
    return { success: false, error: "Error inesperado al actualizar la ubicación" }
  }
}

// Eliminar una ubicación
export async function deleteSavedLocation(locationId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase.from("saved_locations").delete().eq("id", locationId)

    if (error) {
      console.error("Error al eliminar la ubicación:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/saved-locations")
    return { success: true }
  } catch (error) {
    console.error("Error inesperado al eliminar ubicación:", error)
    return { success: false, error: "Error inesperado al eliminar la ubicación" }
  }
}

// Marcar/desmarcar una ubicación como favorita
export async function toggleLocationFavorite(
  locationId: string,
  isFavorite: boolean,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase
      .from("saved_locations")
      .update({
        is_favorite: isFavorite,
        updated_at: new Date().toISOString(),
      })
      .eq("id", locationId)

    if (error) {
      console.error("Error al actualizar favorito:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/saved-locations")
    return { success: true }
  } catch (error) {
    console.error("Error inesperado al cambiar favorito:", error)
    return { success: false, error: "Error inesperado al cambiar estado de favorito" }
  }
}

