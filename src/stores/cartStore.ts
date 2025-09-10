import { create } from "zustand";
import { persist } from "zustand/middleware";

import { stockService } from "@/services/stockService";
import { CartItem, ProductInfo, Variant } from "@/types/cart";

// Define the state shape and the actions
interface CartState {
  items: CartItem[];
  loading: boolean;
  addToCart: (
    product: ProductInfo,
    variant: Variant,
    quantity?: number
  ) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  fetchAndUpdateVariantStock: (variantId: string) => Promise<void>;
  fetchAndUpdateVariantsStock: (variantIds: string[]) => Promise<void>;
  toggleItemSelected: (variantId: string) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
}

// Define the default state separately so it can be reused
const defaultItems: CartItem[] = [];

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: defaultItems, // Set initial state from the defaultItems array
      loading: false,
      /**
       * Fetch and update the stock quantity for a single variant in the cart.
       */
      fetchAndUpdateVariantStock: async (variantId) => {
        set({ loading: true });
        try {
          const res = await stockService.getStockQuantityByVariant(variantId);
          set({
            items: get().items.map((item) =>
              item.variant.id === variantId
                ? {
                    ...item,
                    variant: {
                      ...item.variant,
                      qte: res.quantity ?? item.variant.qte,
                    },
                  }
                : item
            ),
          });
        } catch (e) {
          // On error, set qte to 0 for the affected variant
          set({
            items: get().items.map((item) =>
              item.variant.id === variantId
                ? {
                    ...item,
                    variant: {
                      ...item.variant,
                      qte: 0,
                    },
                  }
                : item
            ),
          });
        } finally {
          set({ loading: false });
        }
      },

      /**
       * Fetch and update the stock quantities for multiple variants in the cart.
       */
      fetchAndUpdateVariantsStock: async (variantIds) => {
        set({ loading: true });
        try {
          const res = await stockService.getQuantitiesForVariants(variantIds);
          // res is an object: { [variantId]: quantity }
          set({
            items: get().items.map((item) => {
              const qte =
                res && typeof res === "object" && item.variant.id in res
                  ? res[item.variant.id]
                  : item.variant.qte;
              return {
                ...item,
                variant: {
                  ...item.variant,
                  qte: qte,
                },
                // Unselect if out of stock
                selected: qte > 0 ? item.selected : false,
              };
            }),
          });
        } catch (e) {
          // On error, set qte to 0 and unselect for all affected variants
          set({
            items: get().items.map((item) =>
              variantIds.includes(item.variant.id)
                ? {
                    ...item,
                    variant: {
                      ...item.variant,
                      qte: 0,
                    },
                    selected: false,
                  }
                : item
            ),
          });
        } finally {
          set({ loading: false });
        }
      },

      /**
       * Adds a new item to the cart or updates the quantity of an existing item.
       */
      addToCart: (product, variant, quantity = 1) => {
        const validItems = get().items.filter(
          (item) => item?.product && item?.variant
        );
        const existingItem = validItems.find(
          (item) => item.variant.id === variant.id
        );

        if (existingItem) {
          const updatedItems = validItems.map((item) =>
            item.variant.id === variant.id
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + quantity, variant.qte),
                }
              : item
          );
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...validItems,
              {
                product,
                variant,
                quantity: Math.min(quantity, variant.qte),
                selected: true,
              }, // New items are selected by default
            ],
          });
        }
      },

      /**
       * Removes an item completely from the cart.
       */
      removeFromCart: (variantId) =>
        set({
          items: get().items.filter(
            (item) =>
              item?.product && item?.variant && item.variant.id !== variantId
          ),
        }),

      /**
       * Updates the quantity of a specific item in the cart.
       */
      updateQuantity: (variantId, quantity) =>
        set({
          items: get()
            .items.filter((item) => item?.product && item?.variant)
            .map((item) =>
              item.variant.id === variantId
                ? {
                    ...item,
                    quantity: Math.max(1, Math.min(quantity, item.variant.qte)),
                  }
                : item
            ),
        }),

      /**
       * Removes all items from the cart.
       */
      clearCart: () => set({ items: [] }),

      /**
       * Calculates the total price of all *selected* items in the cart.
       */
      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          if (
            !item ||
            !item.product ||
            !item.selected ||
            item.variant.qte === 0
          ) {
            return total;
          }
          const price = item.product.newPrice ?? item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      /**
       * Toggles the selection state of a single item.
       */
      toggleItemSelected: (variantId) => {
        set({
          items: get().items.map((item) =>
            item.variant.id === variantId
              ? { ...item, selected: !item.selected }
              : item
          ),
        });
      },

      /**
       * Selects all items that are in stock.
       */
      selectAllItems: () => {
        set({
          items: get().items.map((item) =>
            item.variant.qte > 0 ? { ...item, selected: true } : item
          ),
        });
      },

      /**
       * Deselects all items.
       */
      deselectAllItems: () => {
        set({
          items: get().items.map((item) => ({ ...item, selected: false })),
        });
      },
    }),
    {
      name: "cart-storage",
      /**
       * This function now ensures that if the stored cart is empty after hydration
       * (either from being cleared or invalid data removal), it gets reset to the default state.
       */
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("An error occurred during cart rehydration:", error);
          return;
        }
        if (state) {
          const validItems = state.items.filter(
            (item) =>
              item && typeof item === "object" && item.product && item.variant
          );

          // If the hydrated cart is empty, reset it with the default items.
          if (validItems.length === 0) {
            state.items = defaultItems;
          } else {
            state.items = validItems;
          }
        }
      },
    }
  )
);
