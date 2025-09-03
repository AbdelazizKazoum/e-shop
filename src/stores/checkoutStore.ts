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
      isLoading: false, // Add isLoading to the initial state

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
        set({ isLoading: true }); // Set loading to true when submission starts
        const { contactInfo, shippingAddress, paymentMethod } = get();

        try {
          // Basic validation
          if (
            !contactInfo.email ||
            !shippingAddress.address ||
            !shippingAddress.city
          ) {
            toast.error("Please fill in all required shipping information.");
            return; // Exit if validation fails
          }

          if (!paymentMethod.method) {
            toast.error("Payment method not selected.");
            return; // Exit if validation fails
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

          console.log("--- SUBMITTING ORDER ---");
          console.log(JSON.stringify(orderPayload, null, 2));
          console.log("------------------------");

          // --- Call API ---
          const response = await createOrder(orderPayload);
          console.log("🚀 ~ response:", response);

          toast.success("Order submitted successfully!");

          // Clear cart
          useCartStore.getState().clearCart();

          // Reset checkout state
          set({
            contactInfo: {},
            shippingAddress: {},
            paymentMethod: {},
          });

          return response.data; // you can return created order if needed
        } catch (error: any) {
          console.error("Order submission failed:", error);
          toast.error(
            error.response?.data?.message ||
              "Failed to submit order. Please try again."
          );
          throw error;
        } finally {
          set({ isLoading: false }); // Set loading to false when done
        }
      },
    }),
    {
      name: "checkout-storage",
    }
  )
);
