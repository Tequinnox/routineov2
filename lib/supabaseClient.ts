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
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          if (typeof window === 'undefined') return undefined
          const cookies = document.cookie.split('; ')
          const cookie = cookies.find((row) => row.startsWith(`${name}=`))
          return cookie ? cookie.split('=')[1] : undefined
        },
        set(name: string, value: string, options: { path?: string; maxAge?: number }) {
          if (typeof window === 'undefined') return
          const path = options.path || '/'
          const maxAge = options.maxAge || 3600
          document.cookie = `${name}=${value}; path=${path}; max-age=${maxAge}`
        },
        remove(name: string, options: { path?: string }) {
          if (typeof window === 'undefined') return
          const path = options.path || '/'
          document.cookie = `${name}=; path=${path}; max-age=0`
        },
      },
    }
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