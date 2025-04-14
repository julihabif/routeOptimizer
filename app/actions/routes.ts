'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getSavedRoutes(userId: string) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('saved_routes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function toggleFavorite(routeId: string, isFavorite: boolean) {
  const supabase = createServerComponentClient({ cookies })
  
  const { error } = await supabase
    .from('saved_routes')
    .update({ is_favorite: isFavorite })
    .eq('id', routeId)

  if (error) {
    throw error
  }

  revalidatePath('/')
}

export async function deleteRoute(routeId: string) {
  const supabase = createServerComponentClient({ cookies })
  
  const { error } = await supabase
    .from('saved_routes')
    .delete()
    .eq('id', routeId)

  if (error) {
    throw error
  }

  revalidatePath('/')
} 