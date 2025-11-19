import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Use service role key for server-side operations to bypass RLS
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    )
  }

  try {
    // Get count from users table
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error fetching user count from users table:', error)
      return NextResponse.json(
        { error: 'Failed to fetch user count', count: 0 },
        { status: 500 }
      )
    }

    return NextResponse.json({ count: count ?? 0 })
  } catch (error) {
    console.error('Exception fetching user count:', error)
    return NextResponse.json(
      { error: 'Internal server error', count: 0 },
      { status: 500 }
    )
  }
}

