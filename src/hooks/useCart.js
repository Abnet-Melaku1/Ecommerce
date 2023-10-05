import { create } from "zustand"

const useCartStore = create((set) => ({
  isCartOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
}))

export default useCartStore
