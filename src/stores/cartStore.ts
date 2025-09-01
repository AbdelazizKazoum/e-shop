import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductInfo, Variant, CartItem } from "@/types/cart"; // Adjust the import path as needed

// Define the state shape and the actions
interface CartState {
  items: CartItem[];
  addToCart: (
    product: ProductInfo,
    variant: Variant,
    quantity?: number
  ) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

// Define the default state separately so it can be reused
const defaultItems: CartItem[] = [
  {
    product: {
      id: "9608eb35-9897-4f6f-ba4e-c018fc1e3151",
      name: "PC Gamer",
      image:
        "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/main/1756294920602-search_page.jpg",
      price: 50,
      newPrice: 50,
      brand: "apple",
      category: {
        id: "1",
        category: "sport",
        displayText: "Sport",
        imageUrl:
          "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/categories/1756718454005-Schema-Diagram.png",
      },
    },
    variant: {
      id: "317e5c07-60cc-4bca80754b566c4d7d1ae4d-74782f742717",
      color: "#ba5c5c",
      size: "XL",
      qte: 21,
      images: [
        {
          id: "b565fbca-0861-4f3c-9e5c-1b3c7af62f82",
          image:
            "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1756294974763-1_0_signup_sender.jpg",
        },
      ],
    },
    quantity: 1,
  },
];

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: defaultItems, // Set initial state from the defaultItems array

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
              { product, variant, quantity: Math.min(quantity, variant.qte) },
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
       * Calculates the total price of all items in the cart.
       */
      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          if (!item || !item.product) {
            return total;
          }
          const price = item.product.newPrice ?? item.product.price;
          return total + price * item.quantity;
        }, 0);
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
