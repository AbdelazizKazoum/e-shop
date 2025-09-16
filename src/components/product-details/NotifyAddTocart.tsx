"use client";

import React, { FC } from "react";
import { Transition } from "@/app/headlessui";
import Prices from "@/components/Prices";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import MightLikeSection from "./MightLikeSection";

export interface NotifyAddTocartProps {
  show: boolean;
  productImage: string | StaticImageData;
  productName: string;
  price: number;
  newPrice?: number | null;
  colorSelected: string;
  sizeSelected: string;
  qualitySelected: number;
  t: { id: string }; // Prop to handle toast dismissal
}

const NotifyAddTocart: FC<NotifyAddTocartProps> = ({
  show,
  productImage,
  productName,
  price,
  newPrice,
  colorSelected,
  sizeSelected,
  qualitySelected,
  t,
}) => {
  // For demonstration, create a placeholder product list.
  const demoSuggestedProducts = [
    {
      id: "prod_123_gloves",
      name: "Leather Gloves",
      price: "$25",
      imageSrc: "https://picsum.photos/100", // Placeholder image
    },
  ];

  const renderProductCartOnNotify = () => {
    return (
      <div className="flex gap-5">
        <div className="h-32 w-28 relative flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={productImage}
            alt={productName}
            fill
            sizes="150px"
            className="h-full w-full object-contain object-center"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold">{productName}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 flex items-center space-x-2">
              <span
                className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-700"
                style={{ backgroundColor: colorSelected }}
                title={colorSelected}
              ></span>
              <span className="border-l border-slate-200 dark:border-slate-700 h-4"></span>
              <span>{sizeSelected}</span>
            </p>
          </div>
          <div className="mt-3">
            <Prices
              price={price}
              newPrice={newPrice || price}
              className="mt-0.5"
            />
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">{`Qty ${qualitySelected}`}</p>
            <div className="flex">
              <Link
                href="/cart"
                className="font-semibold text-primary-6000 dark:text-primary-500"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Transition
      appear
      show={show}
      className="p-6 max-w-2xl w-full bg-white dark:bg-slate-800 shadow-2xl rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200 relative"
      enter="transition-all duration-150"
      enterFrom="opacity-0 translate-x-20"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all duration-150"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-20"
    >
      {/* Close Button */}
      <button
        onClick={() => toast.dismiss(t.id)}
        className="absolute top-4 right-4 p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>

      {/* Success Header */}
      <div className="flex items-center gap-3">
        <CheckCircleIcon className="w-8 h-8 text-green-500" />
        <p className="text-lg font-semibold">Product added successfully!</p>
      </div>

      <hr className="border-slate-200/70 dark:border-slate-700/70 my-4" />

      {renderProductCartOnNotify()}

      <MightLikeSection />
    </Transition>
  );
};

export default NotifyAddTocart;
