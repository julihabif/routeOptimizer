"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import type { CustomVehicleItem, DbCustomVehicle } from "@/types/supabase-types"
import type { VehicleProfile, VehicleType } from "@/components/vehicle-profile-selector"
import { revalidatePath } from "next/cache"

// Transformar datos de la base de datos al formato de la aplicación
async function transformDbVehicleToAppVehicle(dbVehicle: DbCustomVehicle): Promise<CustomVehicleItem> {
  return {
    id: dbVehicle.id,
    name: dbVehicle.name,
    type: dbVehicle.type as VehicleType,
    description: dbVehicle.description,
    properties: dbVehicle.properties as unknown as VehicleProfile["properties"],
    isDefault: dbVehicle.is_default,
  }
}

// Obtener todos los vehículos personalizados de un usuario
export async function getUserCustomVehicles(userId: string): Promise<CustomVehicleItem[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("custom_vehicles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error al obtener vehículos personalizados:", error)
    return []
  }

  const transformedData = await Promise.all(data.map(transformDbVehicleToAppVehicle))
  return transformedData
}

// Convertir CustomVehicleItem a VehicleProfile
export async function customVehicleToVehicleProfile(customVehicle: CustomVehicleItem): Promise<VehicleProfile> {
  return {
    id: customVehicle.id,
    name: customVehicle.name,
    type: customVehicle.type as VehicleType,
    description: customVehicle.description || "",
    icon: null, // El ícono se asigna en el componente según el tipo
    properties: customVehicle.properties,
  }
}

// Guardar un nuevo vehículo personalizado
export async function saveCustomVehicle(
  userId: string,
  vehicle: Omit<CustomVehicleItem, "id">,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("custom_vehicles")
    .insert({
      user_id: userId,
      name: vehicle.name,
      type: vehicle.type,
      description: vehicle.description || null,
      properties: vehicle.properties as any,
      is_default: vehicle.isDefault,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error al guardar el vehículo personalizado:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/custom-vehicles")
  return { success: true, id: data.id }
}

// Obtener un vehículo personalizado específico por ID
export async function getCustomVehicleById(vehicleId: string): Promise<CustomVehicleItem | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("custom_vehicles").select("*").eq("id", vehicleId).single()

  if (error || !data) {
    console.error("Error al obtener el vehículo personalizado:", error)
    return null
  }

  return await transformDbVehicleToAppVehicle(data)
}

// Actualizar un vehículo personalizado existente
export async function updateCustomVehicle(
  vehicleId: string,
  updates: Partial<CustomVehicleItem>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  // Transformar de formato de app a formato de DB
  const dbUpdates: Partial<DbCustomVehicle> = {}

  if (updates.name) dbUpdates.name = updates.name
  if (updates.type) dbUpdates.type = updates.type
  if (updates.description !== undefined) dbUpdates.description = updates.description
  if (updates.properties) dbUpdates.properties = updates.properties as any
  if (updates.isDefault !== undefined) dbUpdates.is_default = updates.isDefault

  dbUpdates.updated_at = new Date().toISOString()

  const { error } = await supabase.from("custom_vehicles").update(dbUpdates).eq("id", vehicleId)

  if (error) {
    console.error("Error al actualizar el vehículo personalizado:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/custom-vehicles")
  return { success: true }
}

// Eliminar un vehículo personalizado
export async function deleteCustomVehicle(vehicleId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("custom_vehicles").delete().eq("id", vehicleId)

  if (error) {
    console.error("Error al eliminar el vehículo personalizado:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/custom-vehicles")
  return { success: true }
}

