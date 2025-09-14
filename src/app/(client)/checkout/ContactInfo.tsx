"use client";

import React, { FC, useState, useEffect } from "react";
import Label from "@/components/Label/Label";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Checkbox from "@/shared/Checkbox/Checkbox";
import Input from "@/shared/Input/Input";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { ContactInfo as ContactInfoType } from "@/types/checkout";

interface Props {
  isActive: boolean;
  onOpenActive: () => void;
  onCloseActive: () => void;
  onSave: () => void;
}

const ContactInfo: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
  onSave,
}) => {
  const { contactInfo, setContactInfo } = useCheckoutStore();
  const [formData, setFormData] =
    useState<Partial<ContactInfoType>>(contactInfo);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  useEffect(() => {
    // Sync local form data if global state changes
    setFormData(contactInfo);
  }, [contactInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Remove error if the new value is valid
    if (name === "email" && typeof value === "string") {
      if (validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    }
    if (name === "phone" && typeof value === "string") {
      if (validatePhone(value)) {
        setErrors((prev) => ({ ...prev, phone: undefined }));
      }
    }
  };

  // Simple validation helpers
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const validatePhone = (phone: string) => {
    return /^\+?\d{7,15}$/.test(phone.replace(/\s/g, ""));
  };

  const handleSave = () => {
    const newErrors: { email?: string; phone?: string } = {};
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone || !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setContactInfo(formData);
    onSave();
  };

  const isFormValid =
    formData.email &&
    validateEmail(formData.email) &&
    formData.phone &&
    validatePhone(formData.phone);

  // Border color: red unless all valid, green only if all valid and no errors
  let borderColor = "border-red-500";
  if (isFormValid && Object.keys(errors).length === 0) {
    borderColor = "border-green-500";
  }

  return (
    <div className={`border rounded-xl overflow-hidden z-0 ${borderColor}`}>
      <div className="flex flex-col sm:flex-row items-start p-6 ">
        <span className="hidden sm:block">
          <svg
            className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="sm:ml-8">
          <h3 className=" text-slate-700 dark:text-slate-300 flex ">
            <span className="uppercase tracking-tight">CONTACT INFO</span>
            {contactInfo.email && (
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
            <span>{contactInfo.email || "No email provided"}</span>
            <span className="ml-3 tracking-tighter">{contactInfo.phone}</span>
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
        className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7 space-y-4 sm:space-y-6 ${
          isActive ? "block" : "hidden"
        }`}
      >
        <div className="flex justify-between flex-wrap items-baseline">
          <h3 className="text-lg font-semibold">Contact infomation</h3>
          <span className="block text-sm my-1 md:my-0">
            Do not have an account?{` `}
            <a href="/login" className="text-primary-500 font-medium">
              Log in
            </a>
          </span>
        </div>
        <div className="max-w-lg">
          <Label className="text-sm">Your phone number</Label>
          <Input
            name="phone"
            className={`mt-1.5 ${errors.phone ? "border-red-500" : ""}`}
            value={formData.phone || ""}
            onChange={handleInputChange}
            type={"tel"}
          />
          {errors.phone && (
            <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
          )}
        </div>
        <div className="max-w-lg">
          <Label className="text-sm">Email address</Label>
          <Input
            name="email"
            className={`mt-1.5 ${errors.email ? "border-red-500" : ""}`}
            type={"email"}
            value={formData.email || ""}
            onChange={handleInputChange}
          />
          {errors.email && (
            <div className="text-red-500 text-xs mt-1">{errors.email}</div>
          )}
        </div>
        <div>
          <Checkbox
            className="!text-sm"
            name="newsAndOffers"
            label="Email me news and offers"
            defaultChecked={formData.newsAndOffers || false}
            onChange={(checked) =>
              setFormData((prev) => ({ ...prev, newsAndOffers: checked }))
            }
          />
        </div>
        <div className="flex flex-col sm:flex-row pt-6">
          <ButtonPrimary className="sm:!px-7 shadow-none" onClick={handleSave}>
            Save and next to Shipping
          </ButtonPrimary>
          <ButtonSecondary
            className="mt-3 sm:mt-0 sm:ml-3"
            onClick={onCloseActive}
          >
            Cancel
          </ButtonSecondary>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
