import { create } from "zustand"

interface MobileNavStore {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

export const useMobileNavStore = create<MobileNavStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}))
