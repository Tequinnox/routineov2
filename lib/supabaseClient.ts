import { createBrowserClient } from '@supabase/ssr'

// These environment variables will be set in the next task
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a browser client for client-side usage
export const createClient = () => {
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}

// Create a singleton instance for client-side usage
export const supabase = createClient()

// Test function to verify client setup
export const testSupabaseConnection = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { success: true, user }
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return { success: false, error }
  }
} 