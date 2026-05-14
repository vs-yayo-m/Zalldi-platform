import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Local type — moves to @zalldi/types in Section 10
interface Address {
  id: string
  label: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  lat?: number
  lng?: number
}

interface AddressStore {
  activeAddress: Address | null
  setActiveAddress: (address: Address) => void
  clearAddress: () => void
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set) => ({
      activeAddress: null,
      setActiveAddress: (address) => set({ activeAddress: address }),
      clearAddress: () => set({ activeAddress: null }),
    }),
    { name: 'zalldi-address' }
  )
)