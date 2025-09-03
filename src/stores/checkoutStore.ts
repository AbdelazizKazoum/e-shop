import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CheckoutState } from "@/types/checkout";
import { useCartStore } from "./cartStore";
import { Session } from "next-auth";
import { CartItem } from "@/types/cart";
import toast from "react-hot-toast";
import { createOrder } from "@/services/orderService";

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      contactInfo: {},
      shippingAddress: {},
      paymentMethod: {},
      isLoading: false,

      setContactInfo: (data) =>
        set((state) => ({
          contactInfo: { ...state.contactInfo, ...data },
        })),

      setShippingAddress: (data) =>
        set((state) => ({
          shippingAddress: { ...state.shippingAddress, ...data },
        })),

      setPaymentMethod: (data) =>
        set((state) => ({
          paymentMethod: { ...state.paymentMethod, ...data },
        })),
      submitOrder: async (
        cartItems: CartItem[],
        userSession: Session | null,
        total: number
      ) => {
        set({ isLoading: true });
        const { contactInfo, shippingAddress, paymentMethod } = get();

        try {
          // Basic validation
          if (
            !contactInfo.email ||
            !shippingAddress.address ||
            !shippingAddress.city
          ) {
            // Throw a specific error to be caught by the component, toast removed.
            throw new Error("Missing shipping information.");
          }

          if (!paymentMethod.method) {
            // Throw a specific error to be caught by the component, toast removed.
            throw new Error("Missing payment method.");
          }

          const orderPayload = {
            user: userSession?.user || { name: "Guest" },
            contactInfo,
            shippingAddress,
            paymentInfo: {
              method: paymentMethod.method,
              ...(paymentMethod.method === "Credit-Card" && {
                cardLast4: paymentMethod.cardNumber?.slice(-4),
              }),
            },
            items: cartItems.map((item) => ({
              productId: item.product.id,
              variantId: item.variant.id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.newPrice ?? item.product.price,
            })),
            totalAmount: total,
            orderDate: new Date().toISOString(),
          };

          // --- Call API ---
          const response = await createOrder(orderPayload);

          // The component will now handle the success UI by showing the modal.

          // Clear cart
          useCartStore.getState().clearCart();

          // Reset checkout state
          set({
            contactInfo: {},
            shippingAddress: {},
            paymentMethod: {},
          });

          return response.data;
        } catch (error: any) {
          console.error("Order submission failed:", error);

          // Handle specific API error messages with a toast, but not validation errors.
          if (
            error.message !== "Missing shipping information." &&
            error.message !== "Missing payment method." &&
            error.response?.data?.message
          ) {
            toast.error(error.response.data.message);
          }

          // Re-throw the error so the component's try/catch can handle it and show the modal
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "checkout-storage",
    }
  )
);
