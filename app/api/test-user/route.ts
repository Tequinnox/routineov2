import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export async function GET() {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            const cookie = await cookieStore.get(name)
            return cookie?.value
          },
          async set(name: string, value: string, options: CookieOptions) {
            await cookieStore.set({
              name,
              value,
              ...options,
            })
          },
          async remove(name: string, options: CookieOptions) {
            await cookieStore.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            })
          },
        },
      }
    )

    // Use getUser() instead of getSession() for better security
    const { data: { user }, error } = await supabase.auth.getUser()

    // Get all cookies for debugging
    const allCookies = await cookieStore.getAll()
    const cookieNames = allCookies.map((cookie: RequestCookie) => cookie.name)

    return NextResponse.json({ 
      isAuthenticated: !!user,
      user,
      debug: {
        hasSessionToken: cookieNames.some((name: string) => name.includes('auth-token')),
        sessionExists: !!user,
        userId: user?.id,
        cookieNames,
      }
    })
  } catch (error) {
    console.error('Error in test-user endpoint:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 