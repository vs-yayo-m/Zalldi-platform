import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FoodCartItem, GroceryCartItem } from "@zalldi/types";

interface CartStore {
  // Food cart
  foodItems: FoodCartItem[];
  foodRestaurantId: string | null;
  addFoodItem: (item: FoodCartItem, restaurantId: string) => "added" | "conflict";
  removeFoodItem: (menu_item_id: string) => void;
  updateFoodItemQty: (menu_item_id: string, qty: number) => void;
  clearFoodCart: () => void;

  // Grocery cart
  groceryItems: GroceryCartItem[];
  groceryDarkstoreId: string | null;
  addGroceryItem: (item: GroceryCartItem, darkstoreId: string) => void;
  removeGroceryItem: (product_id: string) => void;
  updateGroceryItemQty: (product_id: string, qty: number) => void;
  clearGroceryCart: () => void;

  // Computed
  foodTotal: () => number;
  groceryTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // ---- Food Cart ----
      foodItems: [],
      foodRestaurantId: null,

      addFoodItem: (item, restaurantId) => {
        const { foodRestaurantId, foodItems } = get();

        // Different restaurant — signal conflict
        if (foodRestaurantId && foodRestaurantId !== restaurantId) {
          return "conflict";
        }

        const existing = foodItems.find((i) => i.menu_item_id === item.menu_item_id);
        if (existing) {
          set({
            foodItems: foodItems.map((i) =>
              i.menu_item_id === item.menu_item_id
                ? { ...i, quantity: i.quantity + item.quantity, item_total: (i.quantity + item.quantity) * i.price }
                : i
            ),
          });
        } else {
          set({
            foodItems: [...foodItems, item],
            foodRestaurantId: restaurantId,
          });
        }
        return "added";
      },

      removeFoodItem: (menu_item_id) =>
        set((s) => ({
          foodItems: s.foodItems.filter((i) => i.menu_item_id !== menu_item_id),
          foodRestaurantId: s.foodItems.length <= 1 ? null : s.foodRestaurantId,
        })),

      updateFoodItemQty: (menu_item_id, qty) =>
        set((s) => ({
          foodItems:
            qty <= 0
              ? s.foodItems.filter((i) => i.menu_item_id !== menu_item_id)
              : s.foodItems.map((i) =>
                  i.menu_item_id === menu_item_id
                    ? { ...i, quantity: qty, item_total: qty * i.price }
                    : i
                ),
        })),

      clearFoodCart: () => set({ foodItems: [], foodRestaurantId: null }),

      // ---- Grocery Cart ----
      groceryItems: [],
      groceryDarkstoreId: null,

      addGroceryItem: (item, darkstoreId) => {
        const { groceryItems } = get();
        const existing = groceryItems.find((i) => i.product_id === item.product_id);
        if (existing) {
          const newQty = Math.min(existing.quantity + 1, existing.stock_quantity);
          set({
            groceryItems: groceryItems.map((i) =>
              i.product_id === item.product_id ? { ...i, quantity: newQty } : i
            ),
          });
        } else {
          set({ groceryItems: [...groceryItems, item], groceryDarkstoreId: darkstoreId });
        }
      },

      removeGroceryItem: (product_id) =>
        set((s) => ({
          groceryItems: s.groceryItems.filter((i) => i.product_id !== product_id),
          groceryDarkstoreId: s.groceryItems.length <= 1 ? null : s.groceryDarkstoreId,
        })),

      updateGroceryItemQty: (product_id, qty) =>
        set((s) => ({
          groceryItems:
            qty <= 0
              ? s.groceryItems.filter((i) => i.product_id !== product_id)
              : s.groceryItems.map((i) =>
                  i.product_id === product_id ? { ...i, quantity: Math.min(qty, i.stock_quantity) } : i
                ),
        })),

      clearGroceryCart: () => set({ groceryItems: [], groceryDarkstoreId: null }),

      // ---- Computed ----
      foodTotal: () =>
        get().foodItems.reduce((sum, i) => sum + i.item_total, 0),

      groceryTotal: () =>
        get().groceryItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "zalldi-cart",
      partialize: (s) => ({
        foodItems: s.foodItems,
        foodRestaurantId: s.foodRestaurantId,
        groceryItems: s.groceryItems,
        groceryDarkstoreId: s.groceryDarkstoreId,
      }),
    }
  )
);
