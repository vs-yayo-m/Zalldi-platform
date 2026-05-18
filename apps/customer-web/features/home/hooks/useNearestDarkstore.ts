'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserLocation } from '@/services/location.service'
import { useLocationStore } from '@/store/locationStore'
import { createBrowserSupabaseClient } from '@/services/supabase/client.browser'

type Status = 'idle' | 'requesting' | 'resolving' | 'success' | 'no_coverage' | 'denied' | 'error'

export function useNearestDarkstore() {
  const [status, setStatus] = useState < Status > ('idle')
  const router = useRouter()
  const { setLocation, setDenied, lat, locationGranted } = useLocationStore()
  
  const requestLocation = useCallback(async () => {
    setStatus('requesting')
    
    const { coords, error: gpsError } = await getBrowserLocation()
    
    if (gpsError === 'permission_denied') {
      setDenied()
      setStatus('denied')
      return
    }
    
    if (gpsError || !coords) {
      setStatus('error')
      return
    }
    
    setStatus('resolving')
    
    try {
      // Call Supabase directly from client — no server action needed
      const supabase = createBrowserSupabaseClient()
      const { data, error } = await supabase.rpc('find_nearest_darkstore', {
        user_lat: coords.lat,
        user_lng: coords.lng,
      })
      
      if (error || !data || data.length === 0) {
        setStatus('no_coverage')
        return
      }
      
      const darkstore = data[0]
      
      setLocation({
        lat: coords.lat,
        lng: coords.lng,
        addressLabel: darkstore.name,
        darkstoreId: darkstore.id,
        darkstoreName: darkstore.name,
        deliveryMins: darkstore.avg_delivery_time_mins,
        isOpen: darkstore.is_open,
      })
      
      setStatus('success')
      
      // Trigger Server Component re-render with darkstore_id as search param
      router.push(`/home?ds=${darkstore.id}`)
      
    } catch {
      setStatus('error')
    }
  }, [setLocation, setDenied, router])
  
  return {
    status,
    requestLocation,
    isGranted: locationGranted,
    hasLocation: !!lat,
  }
}