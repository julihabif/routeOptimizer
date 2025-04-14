'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signIn(email: string, password: string) {
  const supabase = createServerComponentClient({ cookies })
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  redirect('/')
}

export async function signUp(email: string, password: string) {
  const supabase = createServerComponentClient({ cookies })
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw error
  }

  redirect('/auth/verify-email')
}

export async function signOut() {
  const supabase = createServerComponentClient({ cookies })
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }

  redirect('/auth/signin')
} 