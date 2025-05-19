import { useEffect, useState } from 'react'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Initial fetch of user
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        setUser(user)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user'))
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const { data: { user }, error } = await supabase.auth.getUser()
          if (error) {
            setError(error)
          } else {
            setUser(user)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  }
} 