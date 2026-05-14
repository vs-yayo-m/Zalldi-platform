// Client-side only — browser GPS
'use client'

export interface Coordinates {
  lat: number
  lng: number
}

export type LocationError =
  | 'permission_denied'
  | 'position_unavailable'
  | 'timeout'
  | 'unsupported'

export async function getBrowserLocation(): Promise<
  { coords: Coordinates; error: null } |
  { coords: null; error: LocationError }
> {
  if (!navigator.geolocation) {
    return { coords: null, error: 'unsupported' }
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          error: null,
        })
      },
      (err) => {
        const map: Record<number, LocationError> = {
          1: 'permission_denied',
          2: 'position_unavailable',
          3: 'timeout',
        }
        resolve({ coords: null, error: map[err.code] ?? 'position_unavailable' })
      },
      { timeout: 10000, maximumAge: 300000, enableHighAccuracy: false }
    )
  })
}