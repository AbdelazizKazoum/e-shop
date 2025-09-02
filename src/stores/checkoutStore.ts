import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CheckoutState,
  ContactInfo,
  ShippingAddress,
  PaymentMethod,
} from "@/types/checkout";
import { useCartStore } from "./cartStore"; // Import cart store to clear it after order

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      contactInfo: {},
      shippingAddress: {},
      paymentMethod: {},

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

      submitOrder: async (cartItems, userSession, total) => {
        const { contactInfo, shippingAddress, paymentMethod } = get();

        // Basic validation
        if (
          !contactInfo.email ||
          !shippingAddress.address ||
          !shippingAddress.city
        ) {
          console.error("Missing required shipping information.");
          // Here you would typically show an error toast to the user
          return;
        }

        const orderPayload = {
          user: userSession?.user || { name: "Guest" },
          contactInfo,
          shippingAddress,
          // NOTE: Do not log or store full payment details in a real application.
          // This is for demonstration only. In production, you would send this
          // to a secure payment gateway and only store a transaction reference.
          paymentInfo: {
            method: "Credit Card", // Example
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

        // Here you would typically make an API call to your backend:
        // await fetch('/api/orders', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(orderPayload),
        // });

        // After successful submission, clear the cart and checkout state
        useCartStore.getState().clearCart();
        set({
          contactInfo: {},
          shippingAddress: {},
          paymentMethod: {},
        });

        // Optionally, you can redirect the user to an order confirmation page.
      },
    }),
    {
      name: "checkout-storage", // local storage key
    }
  )
);
