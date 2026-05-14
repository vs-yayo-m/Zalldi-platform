'use server'
import { createClient } from '@/services/supabase/client.server'
import { cookies } from 'next/headers'

export interface DarkstoreResult {
  id: string
  name: string
  latitude: number
  longitude: number
  service_radius_km: number
  is_open: boolean
  opens_at: string
  closes_at: string
  avg_delivery_time_mins: number
  distance_km: number
}

export interface LocationActionResult {
  darkstore: DarkstoreResult | null
  error: 'no_darkstore' | 'postgis_error' | null
}

// Called from client when user grants GPS or selects address
export async function resolveDarkstore(
  lat: number,
  lng: number
): Promise < LocationActionResult > {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .rpc('find_nearest_darkstore', {
        user_lat: lat,
        user_lng: lng,
      })
    
    if (error) {
      console.error('PostGIS error:', error.message)
      return { darkstore: null, error: 'postgis_error' }
    }
    
    if (!data || data.length === 0) {
      return { darkstore: null, error: 'no_darkstore' }
    }
    
    const darkstore = data[0] as DarkstoreResult
    
    // Store darkstore_id in httpOnly cookie — never exposed to client JS
    const cookieStore = await cookies()
    cookieStore.set('zalldi_darkstore_id', darkstore.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    
    // Store delivery time (non-sensitive, readable by client)
    cookieStore.set('zalldi_delivery_mins', String(darkstore.avg_delivery_time_mins), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    
    return { darkstore, error: null }
  } catch (err) {
    console.error('resolveDarkstore error:', err)
    return { darkstore: null, error: 'postgis_error' }
  }
}

// Called by Server Components to get current darkstore_id from cookie
export async function getDarkstoreIdFromCookie(): Promise < string | null > {
  const cookieStore = await cookies()
  return cookieStore.get('zalldi_darkstore_id')?.value ?? null
}