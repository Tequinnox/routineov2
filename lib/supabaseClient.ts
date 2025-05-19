import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'

// These environment variables will be set in the next task
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a browser client for client-side usage only
export const createClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('createClient should only be used in client components')
  }
  
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}

// Create a singleton instance for client-side usage
export const supabase = typeof window !== 'undefined' ? createClient() : null

// Test function to verify client setup - only use in client components
export const testSupabaseConnection = async () => {
  if (typeof window === 'undefined') {
    throw new Error('testSupabaseConnection should only be used in client components')
  }

  if (!supabase) {
    return { success: false, error: new Error('Supabase client not initialized') }
  }

  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return { success: false, error }
  }
} 