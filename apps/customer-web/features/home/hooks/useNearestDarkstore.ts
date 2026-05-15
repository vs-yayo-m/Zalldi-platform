'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserLocation } from '@/services/location.service'
import { resolveDarkstore } from '@/app/actions/location.action'
import { useLocationStore } from '@/store/locationStore'

type Status = |
  'idle' |
  'requesting' |
  'resolving' |
  'success' |
  'no_coverage' |
  'denied' |
  'error'

export function useNearestDarkstore() {
  const router = useRouter()
  
  const [status, setStatus] = useState < Status > ('idle')
  
  const {
    setLocation,
    setDenied,
    lat,
    locationGranted,
  } = useLocationStore()
  
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
    
    const { darkstore, error } = await resolveDarkstore(
      coords.lat,
      coords.lng
    )
    
    if (error === 'no_darkstore') {
      setStatus('no_coverage')
      return
    }
    
    if (error || !darkstore) {
      setStatus('error')
      return
    }
    
     const label = darkstore.name
    
    setLocation({
      lat: coords.lat,
      lng: coords.lng,
      addressLabel: label,
      darkstoreId: darkstore.id,
      darkstoreName: darkstore.name,
      deliveryMins: darkstore.avg_delivery_time_mins,
      isOpen: darkstore.is_open,
    })
    
    setStatus('success')
    
    // CRITICAL
    router.refresh()
  }, [router, setLocation, setDenied])
  
  return {
    status,
    requestLocation,
    isGranted: locationGranted,
    hasLocation: !!lat,
  }
}