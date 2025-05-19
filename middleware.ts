import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// List of paths that don't require authentication
const publicPaths = [
  '/auth/login',
  '/auth/signup',
  '/auth-test', // Add auth test page
  '/api/test-user', // Keep this for testing
]

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          })
        },
      },
    }
  )

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))
  
  if (!isPublicPath) {
    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // If no user and not on a public path, redirect to login
    if (!user || error) {
      const redirectUrl = new URL('/auth/login', request.url)
      // Add the original URL as a query parameter so we can redirect back after login
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 