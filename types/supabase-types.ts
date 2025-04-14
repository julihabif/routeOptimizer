import type { Route } from "./route"
import type { VehicleProfile } from "@/components/vehicle-profile-selector"

// Definición de tipos para la base de datos Supabase
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
          name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          name?: string | null
          avatar_url?: string | null
        }
        Relationships: []
      }
      saved_routes: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          route_data: Json
          vehicle_profile: Json
          created_at: string
          updated_at: string
          is_favorite: boolean
          tags: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          route_data: Json
          vehicle_profile: Json
          created_at?: string
          updated_at?: string
          is_favorite?: boolean
          tags?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          route_data?: Json
          vehicle_profile?: Json
          created_at?: string
          updated_at?: string
          is_favorite?: boolean
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_routes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_locations: {
        Row: {
          id: string
          user_id: string
          name: string
          coordinates: number[]
          address: string
          location_type: string
          created_at: string
          updated_at: string
          is_favorite: boolean
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          coordinates: number[]
          address: string
          location_type: string
          created_at?: string
          updated_at?: string
          is_favorite?: boolean
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          coordinates?: number[]
          address?: string
          location_type?: string
          created_at?: string
          updated_at?: string
          is_favorite?: boolean
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_locations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_vehicles: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          description: string | null
          properties: Json
          created_at: string
          updated_at: string
          is_default: boolean
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          description?: string | null
          properties: Json
          created_at?: string
          updated_at?: string
          is_default?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          description?: string | null
          properties?: Json
          created_at?: string
          updated_at?: string
          is_default?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "custom_vehicles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Tipos para las operaciones de Supabase
export type DbUser = Database["public"]["Tables"]["users"]["Row"]
export type DbSavedRoute = Database["public"]["Tables"]["saved_routes"]["Row"]
export type DbSavedLocation = Database["public"]["Tables"]["saved_locations"]["Row"]
export type DbCustomVehicle = Database["public"]["Tables"]["custom_vehicles"]["Row"]

// Tipos para las operaciones CRUD
export interface SavedRouteItem extends Omit<Route, 'is_favorite' | 'created_at' | 'updated_at'> {
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface SavedLocationItem {
  id: string
  name: string
  coordinates: [number, number]
  address: string
  locationType: string
  isFavorite: boolean
  notes?: string | null
}

export interface CustomVehicleItem {
  id: string
  name: string
  type: string
  description?: string | null
  properties: VehicleProfile["properties"]
  isDefault: boolean
}

