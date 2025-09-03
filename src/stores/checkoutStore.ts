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
            toast.error("Please fill in all required shipping information.");
            // Throw an error to be caught by the component
            throw new Error("Missing shipping information.");
          }

          if (!paymentMethod.method) {
            toast.error("Payment method not selected.");
            // Throw an error to be caught by the component
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
            // orderDate: newtoISOString(),
          };

          console.log("--- SUBMITTING ORDER ---");
          console.log(JSON.stringify(orderPayload, null, 2));
          console.log("------------------------");

          // --- Call API ---
          const response = await createOrder(orderPayload);
          console.log("🚀 ~ response:", response);

          // I've removed the success toast from here.
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
          // Keep the error toast for failures
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else if (
            error.message !== "Missing shipping information." &&
            error.message !== "Missing payment method."
          ) {
            // Only show generic error if it's not a validation one we already showed
            toast.error("Failed to submit order. Please try again.");
          }
          // Re-throw the error so the component's try/catch can handle it
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
