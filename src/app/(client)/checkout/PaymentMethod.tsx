"use client";

import Label from "@/components/Label/Label";
import React, { FC, useState, useEffect } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Input from "@/shared/Input/Input";
import Radio from "@/shared/Radio/Radio";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { PaymentMethod as PaymentMethodType } from "@/types/checkout";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/stores/cartStore";
import SuccessModal from "@/components/modals/SuccessModal";
import NotificationModal from "@/components/modals/NotificationModal"; // Changed import from FailedModal

interface Props {
  isActive: boolean;
  onCloseActive: () => void;
  onOpenActive: () => void;
}

const PaymentMethod: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
}) => {
  const { paymentMethod, setPaymentMethod, submitOrder } = useCheckoutStore();
  const { items: cartItems, getCartTotal } = useCartStore();

  const [formData, setFormData] =
    useState<Partial<PaymentMethodType>>(paymentMethod);
  const [methodActive, setMethodActive] = useState(paymentMethod.method || "");
  const [errors, setErrors] = useState<{
    method?: string;
    cardNumber?: string;
    cardHolder?: string;
    expirationDate?: string;
    cvc?: string;
  }>({});
  const { data: session } = useSession();

  // State for modals
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  // A single state to handle different notification types (error, info)
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "error" as "error" | "info",
    title: "",
    message: "",
  });

  useEffect(() => {
    setFormData(paymentMethod);
    setMethodActive(paymentMethod.method || "Credit-Card");
  }, [paymentMethod]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMethodChange = (method: PaymentMethodType["method"]) => {
    setMethodActive(method);
    const newFormData = { ...formData, method };
    if (method !== "Credit-Card") {
      delete newFormData.cardNumber;
      delete newFormData.cardHolder;
      delete newFormData.expirationDate;
      delete newFormData.cvc;
    }
    setFormData(newFormData);
    setPaymentMethod(newFormData); // Immediately update store
    // Remove method error if any
    setErrors((prev) => ({ ...prev, method: undefined }));
  };

  // Credit card validation helpers
  const validateCardNumber = (num: string) =>
    /^\d{13,19}$/.test(num.replace(/\s/g, ""));
  const validateCardHolder = (name: string) => name.trim().length > 2;
  const validateExpiration = (exp: string) =>
    /^(0[1-9]|1[0-2])\/(\d{2})$/.test(exp);
  const validateCVC = (cvc: string) => /^\d{3,4}$/.test(cvc);

  const handleConfirmOrder = async () => {
    // Validate method
    const newErrors: typeof errors = {};
    if (!methodActive) {
      newErrors.method = "Please select a payment method.";
    }
    if (methodActive === "Credit-Card") {
      if (!formData.cardNumber || !validateCardNumber(formData.cardNumber)) {
        newErrors.cardNumber = "Enter a valid card number.";
      }
      if (!formData.cardHolder || !validateCardHolder(formData.cardHolder)) {
        newErrors.cardHolder = "Enter the cardholder's name.";
      }
      if (
        !formData.expirationDate ||
        !validateExpiration(formData.expirationDate)
      ) {
        newErrors.expirationDate = "Format MM/YY";
      }
      if (!formData.cvc || !validateCVC(formData.cvc)) {
        newErrors.cvc = "Enter a valid CVC.";
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setPaymentMethod(formData);
    const total = getCartTotal();
    try {
      await submitOrder(cartItems, session, total);
      setSuccessModalOpen(true);
    } catch (error: any) {
      if (error.message === "Missing shipping information.") {
        setNotification({
          isOpen: true,
          type: "info",
          title: "Shipping Information Required",
          message:
            "Please provide your complete shipping address before placing an order.",
        });
      } else {
        console.error("Order confirmation failed:", error);
        setNotification({
          isOpen: true,
          type: "error",
          title: "Order Submission Failed",
          message: "Failed to create order. Please try again later.",
        });
      }
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    onCloseActive();
  };

  const handleCloseNotificationModal = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  const renderDebitCredit = () => {
    const active = methodActive === "Credit-Card";
    return (
      <div className="flex items-start space-x-4 sm:space-x-6">
        <Radio
          className="pt-3.5"
          name="payment-method"
          id="Credit-Card"
          checked={active}
          onChange={() => handleMethodChange("Credit-Card")}
        />
        <div className="flex-1">
          <label
            htmlFor="Credit-Card"
            className="flex items-center space-x-4 sm:space-x-6 cursor-pointer"
          >
            <div
              className={`p-2.5 rounded-xl border-2 ${
                active
                  ? "border-slate-600 dark:border-slate-300"
                  : "border-gray-200 dark:border-slate-600"
              }`}
            >
              {/* ...svg... */}
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M2 12.6101H19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 10.28V17.43C18.97 20.28 18.19 21 15.22 21H5.78003C2.76003 21 2 20.2501 2 17.2701V10.28C2 7.58005 2.63 6.71005 5 6.57005C5.24 6.56005 5.50003 6.55005 5.78003 6.55005H15.22C18.24 6.55005 19 7.30005 19 10.28Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 6.73V13.72C22 16.42 21.37 17.29 19 17.43V10.28C19 7.3 18.24 6.55 15.22 6.55H5.78003C5.50003 6.55 5.24 6.56 5 6.57C5.03 3.72 5.81003 3 8.78003 3H18.22C21.24 3 22 3.75 22 6.73Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.25 17.8101H6.96997"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.10986 17.8101H12.5499"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="font-medium">Debit / Credit Card</p>
          </label>
          <div
            className={`mt-6 mb-4 space-y-3 sm:space-y-5 ${
              active ? "block" : "hidden"
            }`}
          >
            <div className="max-w-lg">
              <Label className="text-sm">
                Card number <span className="text-red-500">*</span>
              </Label>
              <Input
                name="cardNumber"
                autoComplete="off"
                className={`mt-1.5 ${
                  errors.cardNumber ? "border-red-500" : ""
                }`}
                type={"text"}
                value={formData.cardNumber || ""}
                onChange={(e) => {
                  handleInputChange(e);
                  if (validateCardNumber(e.target.value)) {
                    setErrors((prev) => ({ ...prev, cardNumber: undefined }));
                  }
                }}
              />
              {errors.cardNumber && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.cardNumber}
                </div>
              )}
            </div>
            <div className="max-w-lg">
              <Label className="text-sm">
                Name on Card <span className="text-red-500">*</span>
              </Label>
              <Input
                name="cardHolder"
                autoComplete="off"
                className={`mt-1.5 ${
                  errors.cardHolder ? "border-red-500" : ""
                }`}
                value={formData.cardHolder || ""}
                onChange={(e) => {
                  handleInputChange(e);
                  if (validateCardHolder(e.target.value)) {
                    setErrors((prev) => ({ ...prev, cardHolder: undefined }));
                  }
                }}
              />
              {errors.cardHolder && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.cardHolder}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="sm:w-2/3">
                <Label className="text-sm">
                  Expiration date (MM/YY){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="expirationDate"
                  autoComplete="off"
                  className={`mt-1.5 ${
                    errors.expirationDate ? "border-red-500" : ""
                  }`}
                  placeholder="MM/YY"
                  value={formData.expirationDate || ""}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (validateExpiration(e.target.value)) {
                      setErrors((prev) => ({
                        ...prev,
                        expirationDate: undefined,
                      }));
                    }
                  }}
                />
                {errors.expirationDate && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.expirationDate}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Label className="text-sm">
                  CVC <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="cvc"
                  autoComplete="off"
                  className={`mt-1.5 ${errors.cvc ? "border-red-500" : ""}`}
                  placeholder="CVC"
                  value={formData.cvc || ""}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (validateCVC(e.target.value)) {
                      setErrors((prev) => ({ ...prev, cvc: undefined }));
                    }
                  }}
                />
                {errors.cvc && (
                  <div className="text-red-500 text-xs mt-1">{errors.cvc}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInterNetBanking = () => {
    const active = methodActive === "Internet-banking";
    return (
      <div className="flex items-start space-x-4 sm:space-x-6">
        <Radio
          className="pt-3.5"
          name="payment-method"
          id="Internet-banking"
          defaultChecked={active}
          onChange={() => handleMethodChange("Internet-banking")}
        />
        <div className="flex-1">
          <label
            htmlFor="Internet-banking"
            className="flex items-center space-x-4 sm:space-x-6 cursor-pointer"
          >
            <div
              className={`p-2.5 rounded-xl border-2 ${
                active
                  ? "border-slate-600 dark:border-slate-300"
                  : "border-gray-200 dark:border-slate-600"
              }`}
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.99998 3H8.99998C7.04998 8.84 7.04998 15.16 8.99998 21H7.99998"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 3C16.95 8.84 16.95 15.16 15 21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 16V15C8.84 16.95 15.16 16.95 21 15V16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 9.0001C8.84 7.0501 15.16 7.0501 21 9.0001"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="font-medium">Internet banking</p>
          </label>
        </div>
      </div>
    );
  };

  const renderWallet = () => {
    const active = methodActive === "Wallet";
    return (
      <div className="flex items-start space-x-4 sm:space-x-6">
        <Radio
          className="pt-3.5"
          name="payment-method"
          id="Wallet"
          defaultChecked={active}
          onChange={() => handleMethodChange("Wallet")}
        />
        <div className="flex-1">
          <label
            htmlFor="Wallet"
            className="flex items-center space-x-4 sm:space-x-6 cursor-pointer"
          >
            <div
              className={`p-2.5 rounded-xl border-2 ${
                active
                  ? "border-slate-600 dark:border-slate-300"
                  : "border-gray-200 dark:border-slate-600"
              }`}
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 12H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="font-medium">Google / Apple Wallet</p>
          </label>
        </div>
      </div>
    );
  };

  const renderCashOnDelivery = () => {
    const active = methodActive === "Cash-on-Delivery";
    return (
      <div className="flex items-start space-x-4 sm:space-x-6">
        <Radio
          className="pt-3.5"
          name="payment-method"
          id="Cash-on-Delivery"
          defaultChecked={active}
          onChange={() => handleMethodChange("Cash-on-Delivery")}
        />
        <div className="flex-1">
          <label
            htmlFor="Cash-on-Delivery"
            className="flex items-center space-x-4 sm:space-x-6 cursor-pointer"
          >
            <div
              className={`p-2.5 rounded-xl border-2 ${
                active
                  ? "border-slate-600 dark:border-slate-300"
                  : "border-gray-200 dark:border-slate-600"
              }`}
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3.46021 7.42L11.5402 3.82C11.8002 3.69 12.1902 3.69 12.4602 3.82L20.5402 7.42C21.1902 7.73 21.5002 8.46 21.2402 9.1L19.4602 14.04C19.0302 15.25 17.8602 16.06 16.5902 16.06H7.41021C6.14021 16.06 4.97021 15.25 4.54021 14.04L2.76021 9.1C2.50021 8.46 2.81021 7.73 3.46021 7.42Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M12 21V16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M8 19H16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            <p className="font-medium">Cash on Delivery</p>
          </label>
        </div>
      </div>
    );
  };

  // Border color: red unless all required valid, green only if all required fields are valid and no errors
  let borderColor = "border-red-500";
  if (methodActive) {
    if (methodActive === "Credit-Card") {
      if (
        formData.cardNumber &&
        validateCardNumber(formData.cardNumber) &&
        formData.cardHolder &&
        validateCardHolder(formData.cardHolder) &&
        formData.expirationDate &&
        validateExpiration(formData.expirationDate) &&
        formData.cvc &&
        validateCVC(formData.cvc) &&
        !errors.cardNumber &&
        !errors.cardHolder &&
        !errors.expirationDate &&
        !errors.cvc
      ) {
        borderColor = "border-green-500";
      }
    } else if (!errors.method) {
      borderColor = "border-green-500";
    }
  }

  return (
    <>
      <div className={`border rounded-xl ${borderColor}`}>
        <div className="p-6 flex flex-col sm:flex-row items-start">
          <span className="hidden sm:block">
            <svg
              className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3.92969 15.8792L15.8797 3.9292"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.1013 18.2791L12.3013 17.0791"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.793 15.5887L16.183 13.1987"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.60127 10.239L10.2413 3.599C12.3613 1.479 13.4213 1.469 15.5213 3.569L20.4313 8.479C22.5313 10.579 22.5213 11.639 20.4013 13.759L13.7613 20.399C11.6413 22.519 10.5813 22.529 8.48127 20.429L3.57127 15.519C1.47127 13.419 1.47127 12.369 3.60127 10.239Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 21.9985H22"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="sm:ml-8">
            <h3 className=" text-slate-700 dark:text-slate-400 flex ">
              <span className="uppercase tracking-tight">PAYMENT METHOD</span>
              {paymentMethod.method && (
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-5 h-5 ml-3 text-slate-900 dark:text-slate-100"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              )}
            </h3>
            <div className="font-semibold mt-1 text-sm">
              <span>
                {paymentMethod.method === "Credit-Card" &&
                paymentMethod.cardNumber
                  ? `Card ending in ${paymentMethod.cardNumber.slice(-4)}`
                  : paymentMethod.method?.replace(/-/g, " ") || "Not selected"}
              </span>
            </div>
          </div>
          <button
            className="py-2 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 mt-5 sm:mt-0 sm:ml-auto text-sm font-medium rounded-lg"
            onClick={onOpenActive}
          >
            Change
          </button>
        </div>

        <div
          className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7 space-y-6 ${
            isActive ? "block" : "hidden"
          }`}
        >
          {errors.method && (
            <div className="text-red-500 text-xs mb-2">{errors.method}</div>
          )}
          <div>{renderDebitCredit()}</div>
          <div>{renderInterNetBanking()}</div>
          <div>{renderWallet()}</div>
          <div>{renderCashOnDelivery()}</div>
          <div className="flex pt-6">
            <ButtonPrimary
              className="w-full max-w-[240px]"
              onClick={handleConfirmOrder}
            >
              Confirm order
            </ButtonPrimary>
            <ButtonSecondary className="ml-3" onClick={onCloseActive}>
              Cancel
            </ButtonSecondary>
          </div>
        </div>
      </div>

      {/* Render the success modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
      />

      {/* Render the notification modal for both info and error states */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={handleCloseNotificationModal}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </>
  );
};

export default PaymentMethod;
