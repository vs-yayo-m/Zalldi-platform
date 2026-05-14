'use client'
import { useState, useCallback } from 'react'
import { getBrowserLocation } from '@/services/location.service'
import { resolveDarkstore } from '@/app/actions/location.action'
import { useLocationStore } from '@/store/locationStore'

type Status = 'idle' | 'requesting' | 'resolving' | 'success' | 'no_coverage' | 'denied' | 'error'

export function useNearestDarkstore() {
  const [status, setStatus] = useState < Status > ('idle')
  const { setLocation, setDenied, lat, locationGranted } = useLocationStore()
  
  const requestLocation = useCallback(async () => {
    setStatus('requesting')
    
    // Get browser GPS
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
    
    // Server Action — finds nearest darkstore via PostGIS
    const { darkstore, error } = await resolveDarkstore(coords.lat, coords.lng)
    
    if (error === 'no_darkstore') {
      setStatus('no_coverage')
      return
    }
    
    if (error || !darkstore) {
      setStatus('error')
      return
    }
    
    // Build a simple address label from coordinates
    // In Section 10 we replace with full reverse geocoding
    const label = `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
    
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
  }, [setLocation, setDenied])
  
  return {
    status,
    requestLocation,
    isGranted: locationGranted,
    hasLocation: !!lat,
  }
}