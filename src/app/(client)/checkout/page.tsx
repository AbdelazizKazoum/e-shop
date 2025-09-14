"use client";

import Label from "@/components/Label/Label";
import NcInputNumber from "@/components/NcInputNumber";
import Prices from "@/components/Prices";
import { useEffect, useState } from "react";
import NotificationModal from "@/components/modals/NotificationModal";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import ContactInfo from "./ContactInfo";
import PaymentMethod from "./PaymentMethod";
import ShippingAddress from "./ShippingAddress";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { CartItem } from "@/types/cart";
import { SessionProvider } from "next-auth/react";

const CheckoutPage = () => {
  const [tabActive, setTabActive] = useState<
    "ContactInfo" | "ShippingAddress" | "PaymentMethod" | ""
  >("ContactInfo");

  const [isMounted, setIsMounted] = useState(false);
  const { items, removeFromCart, updateQuantity, getCartTotal } =
    useCartStore();
  const {
    isLoading,
    contactInfo,
    shippingAddress,
    paymentMethod,
    submitOrder,
  } = useCheckoutStore();

  const [notification, setNotification] = useState({
    isOpen: false,
    type: "error" as "error" | "info",
    title: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const renderProduct = (item: CartItem, index: number) => {
    if (!item?.product || !item?.variant) {
      return null;
    }

    const { product, variant, quantity } = item;
    const { name, price, newPrice, id } = product;
    const imageUrl = variant.images?.[0]?.image || product.image;

    return (
      <div key={index} className="relative flex py-7 first:pt-0 last:pb-0">
        <div className="relative h-36 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={imageUrl}
            fill
            alt={name}
            className="h-full w-full object-contain object-center"
            sizes="150px"
          />
          <Link
            href={`/product-detail/${id}`}
            className="absolute inset-0"
          ></Link>
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div className="flex-[1.5] ">
                <h3 className="text-base font-semibold">
                  <Link href={`/product-detail/${id}`}>{name}</Link>
                </h3>
                <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.35 1.94995L9.69 3.28992"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.07 11.92L17.19 11.26"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 22H16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{variant.color}</span>
                  </div>
                  <span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span>
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 9V3H15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 15V21H9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 3L13.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.5 13.5L3 21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{variant.size}</span>
                  </div>
                </div>
              </div>

              <div className="hidden flex-1 sm:flex flex-col items-end justify-end">
                <div className="flex items-center gap-2">
                  {price !== newPrice && (
                    <span className="line-through text-slate-400 text-xs">
                      ${price?.toFixed(2)}
                    </span>
                  )}
                  <span className="font-semibold text-primary-600 text-base">
                    ${(newPrice ?? price)?.toFixed(2)}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  x {quantity} = ${((newPrice ?? price) * quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-sm">
            <div className="hidden sm:block text-center relative">
              <NcInputNumber
                className="relative z-10"
                defaultValue={quantity}
                onChange={(value) => updateQuantity(variant.id, value)}
                max={variant.qte}
              />
            </div>
            <a
              href="##"
              onClick={() => removeFromCart(variant.id)}
              className="relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm "
            >
              <span>Remove</span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  const renderLeft = () => {
    return (
      <div className="space-y-8">
        <div id="ContactInfo" className="scroll-mt-24">
          <ContactInfo
            isActive={tabActive === "ContactInfo"}
            onOpenActive={() => {
              setTabActive("ContactInfo");
              handleScrollToEl("ContactInfo");
            }}
            onCloseActive={() => {
              setTabActive("");
              // handleScrollToEl("ShippingAddress");
            }}
            onSave={() => {
              setTabActive("ShippingAddress");
              handleScrollToEl("ShippingAddress");
            }}
          />
        </div>

        <div id="ShippingAddress" className="scroll-mt-24">
          <ShippingAddress
            isActive={tabActive === "ShippingAddress"}
            onOpenActive={() => {
              setTabActive("ShippingAddress");
              handleScrollToEl("ShippingAddress");
            }}
            onCloseActive={() => {
              setTabActive("");
              handleScrollToEl("ShippingAddress");
            }}
            onSave={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
          />
        </div>

        <div id="PaymentMethod" className="scroll-mt-24">
          <PaymentMethod
            isActive={tabActive === "PaymentMethod"}
            onOpenActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
            onCloseActive={() => {
              setTabActive("");
              handleScrollToEl("PaymentMethod");
            }}
          />
        </div>
      </div>
    );
  };

  const selectedItems = items.filter((item) => item.selected);

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
    0
  );

  const discount = selectedItems.reduce(
    (sum, item) =>
      sum +
      ((item.product.price ?? 0) -
        (item.product.newPrice ?? item.product.price ?? 0)) *
        item.quantity,
    0
  );

  const shippingEstimate = 0;
  const taxEstimate = 0;
  const orderTotal = selectedItems.reduce(
    (sum, item) =>
      sum + (item.product.newPrice ?? item.product.price ?? 0) * item.quantity,
    0
  );

  return (
    <SessionProvider>
      <div className="nc-CheckoutPage">
        {/* === LOADING OVERLAY === */}
        {isLoading && (
          <div className="fixed inset-0 bg-white bg-opacity-70 dark:bg-black dark:bg-opacity-70 z-50 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-primary-600 border-t-transparent"></div>
          </div>
        )}

        {/* === MAIN CONTENT === */}
        <div
          className={`transition-opacity ${
            isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          <main className="container py-16 lg:pb-28 lg:pt-20 ">
            <div className="mb-16">
              <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
                Checkout
              </h2>
              <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
                <Link href={"/"} className="">
                  Homepage
                </Link>
                <span className="text-xs mx-1 sm:mx-1.5">/</span>
                <span className="underline">Checkout</span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row">
              <div className="flex-1">{renderLeft()}</div>

              <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:lg:mx-14 2xl:mx-16 "></div>

              <div className="w-full lg:w-[36%] ">
                <h3 className="text-lg font-semibold">Order summary</h3>
                <div className="mt-8 divide-y divide-slate-200/70 dark:divide-slate-700 ">
                  {isMounted && selectedItems.length > 0 ? (
                    selectedItems.map(renderProduct)
                  ) : (
                    <div className="py-10 text-center text-sm text-slate-500">
                      {isMounted && items.length > 0
                        ? "No items selected for checkout."
                        : "Your cart is empty."}
                    </div>
                  )}
                </div>

                <div className="mt-10 pt-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-700 ">
                  <div>
                    <Label className="text-sm">Discount code</Label>
                    <div className="flex mt-1.5">
                      <Input sizeClass="h-10 px-4 py-3" className="flex-1" />
                      <button className="text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 rounded-2xl px-4 ml-3 font-medium text-sm bg-neutral-200/70 dark:bg-neutral-700 dark:hover:bg-neutral-800 w-24 flex justify-center items-center transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between py-2.5">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span>Discount</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span>Shipping estimate</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      $0.00
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span>Tax estimate</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      $0.00
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                    <span>Order total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
                <ButtonPrimary
                  className="mt-8 w-full"
                  disabled={
                    !isMounted || selectedItems.length === 0 || isSubmitting
                  }
                  onClick={async () => {
                    setIsSubmitting(true);
                    const total = getCartTotal();
                    try {
                      await submitOrder(selectedItems, null, total);
                      // Success: you may want to redirect or show a modal here
                      setNotification({
                        isOpen: true,
                        type: "info",
                        title: "Order Submitted",
                        message: "Your order was placed successfully!",
                      });
                    } catch (error: any) {
                      if (error.message === "Missing shipping information.") {
                        setNotification({
                          isOpen: true,
                          type: "info",
                          title: "Shipping Information Required",
                          message:
                            "Please provide your complete shipping address before placing an order.",
                        });
                      } else if (error.message === "Missing payment method.") {
                        setNotification({
                          isOpen: true,
                          type: "info",
                          title: "Payment Method Required",
                          message:
                            "Please select a payment method before placing an order.",
                        });
                      } else {
                        setNotification({
                          isOpen: true,
                          type: "error",
                          title: "Order Submission Failed",
                          message:
                            "Failed to create order. Please try again later.",
                        });
                      }
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  Confirm order
                </ButtonPrimary>
                <NotificationModal
                  isOpen={notification.isOpen}
                  onClose={() =>
                    setNotification((prev) => ({ ...prev, isOpen: false }))
                  }
                  type={notification.type}
                  title={notification.title}
                  message={notification.message}
                />
                <div className="mt-5 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
                  <p className="block relative pl-5">
                    <svg
                      className="w-4 h-4 absolute -left-1 top-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 8V13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.9945 16H12.0035"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Learn more{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="##"
                      className="text-slate-900 dark:text-slate-200 underline font-medium"
                    >
                      Taxes
                    </a>
                    <span> and </span>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="##"
                      className="text-slate-900 dark:text-slate-200 underline font-medium"
                    >
                      Shipping
                    </a>
                    {` `} infomation
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
};

export default CheckoutPage;
