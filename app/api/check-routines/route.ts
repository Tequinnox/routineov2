import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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
          async set(name: string, value: string, options: { path?: string; maxAge?: number }) {
            await cookieStore.set({
              name,
              value,
              ...options,
            })
          },
          async remove(name: string, options: { path?: string }) {
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

    // First check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      return NextResponse.json({ 
        error: 'Authentication required',
        details: authError
      }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        message: 'Please log in to access this endpoint'
      }, { status: 401 })
    }

    // Create a test routine to verify table structure
    const testRoutine = {
      user_id: user.id,
      name: 'Test Routine',
      part_of_day: 'morning',
      day_of_week: ['monday', 'wednesday', 'friday'],
      order: 1,
      is_checked: false
    }

    // Insert the test routine
    const { data: insertedRoutine, error: insertError } = await supabase
      .from('routines')
      .insert(testRoutine)
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ 
        error: 'Failed to insert test routine',
        details: insertError
      }, { status: 500 })
    }

    // Get all routines for this user to verify the structure
    const { data: routines, error: selectError } = await supabase
      .from('routines')
      .select('*')
      .eq('user_id', user.id)

    if (selectError) {
      return NextResponse.json({ 
        error: 'Failed to retrieve routines',
        details: selectError
      }, { status: 500 })
    }

    // Clean up - delete the test routine
    await supabase
      .from('routines')
      .delete()
      .eq('name', 'Test Routine')
      .eq('user_id', user.id)

    // Get the column names from the inserted routine
    const columns = insertedRoutine ? Object.keys(insertedRoutine) : []

    return NextResponse.json({ 
      tableExists: true,
      columns,
      sampleRow: insertedRoutine,
      allRoutines: routines,
      user: {
        id: user.id,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Error checking routines table:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 