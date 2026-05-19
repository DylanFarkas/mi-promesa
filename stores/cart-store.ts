import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  quantity: number
  // Cached UI fields — el servidor valida el precio real en checkout
  title: string
  price: number
  compareAtPrice: number | null
  image: string | null
  brandName: string
  brandSlug: string
  productSlug: string
}

interface CartState {
  items: CartItem[]
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  addItem: (item: CartItem) => void
  updateQty: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
  totalItems: () => number
  subtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === newItem.productId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === newItem.productId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i,
              ),
            }
          }
          return { items: [...state.items, newItem] }
        }),

      updateQty: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity } : i,
                ),
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      clear: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: 'dist-cart-v1',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)
