"use client";

import React, { FC, useState, useEffect } from "react";
import Label from "@/components/Label/Label";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Input from "@/shared/Input/Input";
import Radio from "@/shared/Radio/Radio";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { ShippingAddress as ShippingAddressType } from "@/types/checkout";

interface Props {
  isActive: boolean;
  onOpenActive: () => void;
  onCloseActive: () => void;
}

const ShippingAddress: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
}) => {
  const { shippingAddress, setShippingAddress } = useCheckoutStore();
  const [formData, setFormData] =
    useState<Partial<ShippingAddressType>>(shippingAddress);

  useEffect(() => {
    setFormData(shippingAddress);
  }, [shippingAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setShippingAddress(formData);
    onCloseActive();
  };

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden z-0">
      <div className="flex flex-col sm:flex-row items-start p-6">
        <span className="hidden sm:block">
          <svg
            className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.1401 15.0701V13.11C12.1401 10.59 14.1801 8.54004 16.7101 8.54004H18.6701"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.62012 8.55005H7.58014C10.1001 8.55005 12.1501 10.59 12.1501 13.12V13.7701V17.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.14008 6.75L5.34009 8.55L7.14008 10.35"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.8601 6.75L18.6601 8.55L16.8601 10.35"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="sm:ml-8">
          <h3 className=" text-slate-700 dark:text-slate-300 flex">
            <span className="uppercase">SHIPPING ADDRESS</span>
            {shippingAddress.address && (
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-5 h-5 ml-3"
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
            <span className="">
              {shippingAddress.address || "No address provided"}
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
        className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7 space-y-4 sm:space-y-6 ${
          isActive ? "block" : "hidden"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
          <div>
            <Label className="text-sm">First name</Label>
            <Input
              name="firstName"
              className="mt-1.5"
              value={formData.firstName || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label className="text-sm">Last name</Label>
            <Input
              name="lastName"
              className="mt-1.5"
              value={formData.lastName || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <Label className="text-sm">Address</Label>
          <Input
            name="address"
            className="mt-1.5"
            value={formData.address || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label className="text-sm">Apartment, suite, etc.</Label>
          <Input
            name="apartment"
            className="mt-1.5"
            value={formData.apartment || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
          <div>
            <Label className="text-sm">City</Label>
            <Input
              name="city"
              className="mt-1.5"
              value={formData.city || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label className="text-sm">Country</Label>
            <Input
              name="country"
              className="mt-1.5"
              value={formData.country || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
          <div>
            <Label className="text-sm">State/Province</Label>
            <Input
              name="state"
              className="mt-1.5"
              value={formData.state || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label className="text-sm">Postal code</Label>
            <Input
              name="zipCode"
              className="mt-1.5"
              value={formData.zipCode || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <Label className="text-sm">Address type</Label>
          <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <Radio
              label={`<span class="text-sm font-medium">Home <span class="font-light">(All Day Delivery)</span></span>`}
              id="Address-type-home"
              name="addressType"
              defaultChecked={formData.addressType === "Home"}
              onChange={() =>
                setFormData((prev) => ({ ...prev, addressType: "Home" }))
              }
            />
            <Radio
              label={`<span class="text-sm font-medium">Office <span class="font-light">(Delivery <span class="font-medium">9 AM - 5 PM</span>)</span> </span>`}
              id="Address-type-office"
              name="addressType"
              defaultChecked={formData.addressType === "Office"}
              onChange={() =>
                setFormData((prev) => ({ ...prev, addressType: "Office" }))
              }
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row pt-6">
          <ButtonPrimary className="sm:!px-7 shadow-none" onClick={handleSave}>
            Save and next to Payment
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

export default ShippingAddress;
