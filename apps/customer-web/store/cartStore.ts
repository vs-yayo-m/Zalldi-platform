// apps/customer-web/store/cartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Local types — moves to @zalldi/types in Section 6
interface GroceryCartItem {
  product_id: string
  name: string
  price: number
  mrp: number
  image_url: string | null
  quantity: number
  stock_quantity: number
}

interface FoodCartItem {
  item_id: string
  name: string
  price: number
  quantity: number
  restaurant_id: string
}

interface CartStore {
  foodItems: FoodCartItem[]
  groceryItems: GroceryCartItem[]
  darkstoreId: string | null
  restaurantId: string | null
  addGroceryItem: (item: GroceryCartItem, darkstoreId: string) => void
  updateGroceryItemQty: (productId: string, qty: number) => void
  clearGroceryCart: () => void
  addFoodItem: (item: FoodCartItem) => void
  updateFoodItemQty: (itemId: string, qty: number) => void
  clearFoodCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      foodItems:    [],
      groceryItems: [],
      darkstoreId:  null,
      restaurantId: null,

      addGroceryItem: (item, darkstoreId) =>
        set((state) => {
          const existing = state.groceryItems.find(i => i.product_id === item.product_id)
          if (existing) {
            return {
              groceryItems: state.groceryItems.map(i =>
                i.product_id === item.product_id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return {
            groceryItems: [...state.groceryItems, item],
            darkstoreId,
          }
        }),

      updateGroceryItemQty: (productId, qty) =>
        set((state) => ({
          groceryItems: qty <= 0
            ? state.groceryItems.filter(i => i.product_id !== productId)
            : state.groceryItems.map(i =>
                i.product_id === productId ? { ...i, quantity: qty } : i
              ),
        })),

      clearGroceryCart: () => set({ groceryItems: [], darkstoreId: null }),

      addFoodItem: (item) =>
        set((state) => {
          const existing = state.foodItems.find(i => i.item_id === item.item_id)
          if (existing) {
            return {
              foodItems: state.foodItems.map(i =>
                i.item_id === item.item_id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return {
            foodItems: [...state.foodItems, item],
            restaurantId: item.restaurant_id,
          }
        }),

      updateFoodItemQty: (itemId, qty) =>
        set((state) => ({
          foodItems: qty <= 0
            ? state.foodItems.filter(i => i.item_id !== itemId)
            : state.foodItems.map(i =>
                i.item_id === itemId ? { ...i, quantity: qty } : i
              ),
        })),

      clearFoodCart: () => set({ foodItems: [], restaurantId: null }),
    }),
    { name: 'zalldi-cart' }
  )
)