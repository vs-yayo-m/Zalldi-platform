import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address } from "@zalldi/types";

interface AddressStore {
  activeAddress: Address | null;
  setActiveAddress: (address: Address) => void;
  clearAddress: () => void;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set) => ({
      activeAddress: null,
      setActiveAddress: (address) => set({ activeAddress: address }),
      clearAddress: () => set({ activeAddress: null }),
    }),
    { name: "zalldi-address" }
  )
);