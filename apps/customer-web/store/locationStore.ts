import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LocationStore {
  // User coordinates
  lat: number | null
  lng: number | null
  // Human readable address label
  addressLabel: string
  // Darkstore info (non-sensitive only)
  darkstoreId: string | null
  darkstoredName: string | null
  deliveryMins: number
  isOpen: boolean
  // State
  locationGranted: boolean
  locationDenied: boolean
  
  setLocation: (params: {
    lat: number
    lng: number
    addressLabel: string
    darkstoreId: string
    darkstoreName: string
    deliveryMins: number
    isOpen: boolean
  }) => void
  setDenied: () => void
  clearLocation: () => void
}

export const useLocationStore = create < LocationStore > ()(
  persist(
    (set) => ({
      lat: null,
      lng: null,
      addressLabel: '',
      darkstoreId: null,
      darkstoredName: null,
      deliveryMins: 20,
      isOpen: false,
      locationGranted: false,
      locationDenied: false,
      
      setLocation: (params) => set({
        lat: params.lat,
        lng: params.lng,
        addressLabel: params.addressLabel,
        darkstoreId: params.darkstoreId,
        darkstoredName: params.darkstoreName,
        deliveryMins: params.deliveryMins,
        isOpen: params.isOpen,
        locationGranted: true,
        locationDenied: false,
      }),
      
      setDenied: () => set({ locationDenied: true }),
      
      clearLocation: () => set({
        lat: null,
        lng: null,
        addressLabel: '',
        darkstoreId: null,
        darkstoredName: null,
        locationGranted: false,
        locationDenied: false,
      }),
    }),
    {
      name: 'zalldi-location',
      // Only persist coordinates + label, not sensitive ids
      partialize: (state) => ({
        lat: state.lat,
        lng: state.lng,
        addressLabel: state.addressLabel,
        locationGranted: state.locationGranted,
        deliveryMins: state.deliveryMins,
      }),
    }
  )
)