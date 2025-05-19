'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AuthTestPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authAction, setAuthAction] = useState<'login' | 'signup'>('login')
  const router = useRouter()

  useEffect(() => {
    // Check initial auth state
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        setUser(user)
      } catch (err) {
        console.error('Error checking auth state:', err)
        setError(err instanceof Error ? err.message : 'Failed to check auth state')
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user)
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (authAction === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        alert('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/auth-test')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out')
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto space-y-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Auth Test Page</h1>
          
          {/* Current Auth State */}
          <div className="mb-8 p-4 bg-gray-50 rounded">
            <h2 className="font-semibold mb-2">Current Auth State:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify({ user, error }, null, 2)}
            </pre>
          </div>

          {/* Auth Form */}
          {!user ? (
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : authAction === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthAction(authAction === 'login' ? 'signup' : 'login')}
                  className="flex-1 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Switch to {authAction === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 text-green-700 rounded">
                Signed in as: {user.email}
              </div>
              <button
                onClick={handleSignOut}
                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Test API Button */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test API Endpoint</h2>
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/test-user')
                const data = await response.json()
                alert(JSON.stringify(data, null, 2))
              } catch (err) {
                alert('Error testing API: ' + (err instanceof Error ? err.message : 'Unknown error'))
              }
            }}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Test /api/test-user
          </button>
        </div>
      </div>
    </div>
  )
} 