import { createServerClient, type CookieOptions } from '@supabase/ssr'
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

    // Get the user's settings
    const { data: settings, error: selectError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // If no settings exist, create them with default values
    if (selectError?.code === 'PGRST116') {
      const { data: newSettings, error: insertError } = await supabase
        .from('user_settings')
        .insert([
          { 
            user_id: user.id,
            reset_time: '05:00' // Default reset time
          }
        ])
        .select()
        .single()

      if (insertError) {
        return NextResponse.json({ 
          error: 'Failed to create default settings',
          details: insertError
        }, { status: 500 })
      }

      return NextResponse.json({ 
        tableExists: true,
        columns: Object.keys(newSettings),
        currentSettings: newSettings,
        message: 'Created default settings for user',
        user: {
          id: user.id,
          email: user.email
        }
      })
    }

    if (selectError) {
      // If we get a "relation does not exist" error, the table hasn't been created
      if (selectError.code === '42P01') {
        return NextResponse.json({ 
          tableExists: false,
          error: 'Table does not exist',
          details: selectError
        })
      }
      
      return NextResponse.json({ 
        error: 'Failed to get settings',
        details: selectError
      }, { status: 500 })
    }

    // Try to update the settings to test the update policy and trigger
    const newResetTime = '06:00'
    const { data: updatedSettings, error: updateError } = await supabase
      .from('user_settings')
      .update({ reset_time: newResetTime })
      .eq('user_id', user.id)
      .select()
      .single()

    // Get the column names from the settings
    const columns = settings ? Object.keys(settings) : []

    return NextResponse.json({ 
      tableExists: true,
      columns,
      currentSettings: settings,
      updateTest: {
        success: !updateError,
        error: updateError,
        updatedSettings
      },
      user: {
        id: user.id,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Error checking user settings:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 