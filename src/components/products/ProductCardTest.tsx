"use client";

import React, { FC, useState, useEffect } from "react";
import LikeButton from "../LikeButton";
import Prices from "../Prices";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import BagIcon from "../BagIcon";
import toast from "react-hot-toast";
import { Transition } from "@/app/headlessui";
import ModalQuickView from "../ModalQuickView";
import ProductStatus from "../ProductStatus";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import NcImage from "@/shared/NcImage/NcImage";
import { Product, Variant } from "@/types/product";
import { useCartStore } from "@/stores/cartStore"; // Import the cart store
import { ProductInfo } from "@/types/cart"; // Import the cart's product type

export interface ProductCardProps {
  className?: string;
  data: Product;
  isLiked?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  className = "",
  data,
  isLiked,
}) => {
  const {
    id,
    name,
    price,
    newPrice,
    image,
    rating,
    reviewCount,
    status,
    variants,
    category,
    brand, // Destructure brand
  } = data;

  const addToCart = useCartStore((state) => state.addToCart); // Get addToCart action
  const [variantActive, setVariantActive] = useState(
    variants && variants.length > 0 ? 0 : null
  );
  const [showModalQuickView, setShowModalQuickView] = useState(false);
  const [currentImage, setCurrentImage] = useState(image);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (
      userHasInteracted &&
      variantActive !== null &&
      variants &&
      variants[variantActive]
    ) {
      setCurrentImage(variants[variantActive].images[0]?.image || image);
    }
  }, [variantActive, variants, image, userHasInteracted]);

  const notifyAddTocart = (variant: Variant) => {
    toast.custom(
      (t) => (
        <Transition
          appear
          show={t.visible}
          className="p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
          enter="transition-all duration-150"
          enterFrom="opacity-0 translate-x-20"
          enterTo="opacity-100 translate-x-0"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-20"
        >
          <p className="block text-base font-semibold leading-none">
            Added to cart!
          </p>
          <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
          {renderProductCartOnNotify(variant)}
        </Transition>
      ),
      {
        position: "top-right",
        id: "add-to-cart-toast",
        duration: 3000,
      }
    );
  };

  const renderProductCartOnNotify = (variant: Variant) => {
    return (
      <div className="flex ">
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            width={80}
            height={96}
            src={variant.images[0]?.image || image}
            alt={name}
            className="absolute object-cover object-center"
          />
        </div>
        <div className="ms-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">{name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{variant.color}</span>
                  <span className="mx-2 border-s border-slate-200 dark:border-slate-700 h-4"></span>
                  <span>{variant.size}</span>
                </p>
              </div>
              <Prices price={newPrice || price} className="mt-0.5" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">Qty 1</p>
            <div className="flex">
              <button
                type="button"
                className="font-medium text-primary-6000 dark:text-primary-500 "
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/cart");
                }}
              >
                View cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleAddToCart = (size: string) => {
    if (variantActive === null) {
      toast.error("Please select a color first");
      return;
    }

    const activeColor = variants[variantActive].color;
    const targetVariant = variants.find(
      (v) => v.color === activeColor && v.size === size
    );

    if (targetVariant) {
      // Create the simplified product info object
      const productInfo: ProductInfo = {
        id,
        name,
        image,
        price,
        newPrice,
        brand,
        category,
      };
      // Call the Zustand store action
      addToCart(productInfo, targetVariant, 1);
      // Show notification
      notifyAddTocart(targetVariant);
    } else {
      toast.error("This size is not available for the selected color.");
    }
  };

  const handleColorClick = (index: number) => {
    setVariantActive(index);
    setUserHasInteracted(true);
  };

  const renderVariants = () => {
    if (!variants || !variants.length) {
      return null;
    }
    const uniqueColors = variants.filter(
      (variant, index, self) =>
        index === self.findIndex((v) => v.color === variant.color)
    );

    return (
      <div className="flex space-x-1">
        {uniqueColors.map((variant) => {
          const firstIndexOfColor = variants.findIndex(
            (v) => v.color === variant.color
          );
          return (
            <div
              key={variant.id}
              onClick={() => handleColorClick(firstIndexOfColor)}
              className={`relative w-6 h-6 rounded-full overflow-hidden z-10 border-2 cursor-pointer ${
                variantActive !== null &&
                variants[variantActive].color === variant.color
                  ? "border-primary-500"
                  : "border-transparent"
              }`}
              title={variant.color}
            >
              <div
                className="absolute inset-0.5 rounded-full z-0"
                style={{ backgroundColor: variant.color }}
              ></div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSizeList = () => {
    if (!variants || !variants.length) {
      return null;
    }
    const uniqueSizes = [...new Set(variants.map((v) => v.size))];

    return (
      <div className="absolute bottom-0 inset-x-1 space-x-1.5 rtl:space-x-reverse flex justify-center opacity-0 invisible group-hover:bottom-4 group-hover:opacity-100 group-hover:visible transition-all">
        {uniqueSizes.map((size, index) => {
          return (
            <div
              key={index}
              className="nc-shadow-lg w-10 h-10 rounded-xl bg-white hover:bg-slate-900 hover:text-white transition-colors cursor-pointer flex items-center justify-center uppercase font-semibold tracking-tight text-sm text-slate-900"
              onClick={() => handleAddToCart(size)}
            >
              {size}
            </div>
          );
        })}
      </div>
    );
  };

  const renderGroupButtons = () => {
    return (
      <div className="absolute bottom-0 group-hover:bottom-4 inset-x-1 flex justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <ButtonPrimary
          className="shadow-lg"
          fontSize="text-xs"
          sizeClass="py-2 px-4"
          onClick={() => toast.error("This product has no options to select.")}
        >
          <BagIcon className="w-3.5 h-3.5 mb-0.5" />
          <span className="ms-1">Add to bag</span>
        </ButtonPrimary>
        <ButtonSecondary
          className="ms-1.5 bg-white hover:!bg-gray-100 hover:text-slate-900 transition-colors shadow-lg"
          fontSize="text-xs"
          sizeClass="py-2 px-4"
          onClick={() => setShowModalQuickView(true)}
        >
          <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
          <span className="ms-1">Quick view</span>
        </ButtonSecondary>
      </div>
    );
  };

  return (
    <>
      <div
        className={`nc-ProductCard relative flex flex-col bg-transparent ${className}`}
      >
        <Link
          href={`/product-detail/${id}`}
          className="absolute inset-0 z-0"
        ></Link>

        <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 rounded-3xl overflow-hidden z-1 group">
          {/* Discount badge - larger and only here */}
          {typeof price === "number" &&
            typeof newPrice === "number" &&
            price > newPrice && (
              <span className="absolute top-3 left-3 z-20 bg-green-500 text-white text-base font-extrabold px-3 py-1 rounded-full shadow-lg">
                -{Math.round(((price - newPrice) / price) * 100)}%
              </span>
            )}

          <Link href={`/product-detail/${id}`} className="block">
            <NcImage
              containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
              src={currentImage}
              className="object-cover w-full h-full drop-shadow-xl"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 40vw"
              alt={name}
            />
          </Link>
          <ProductStatus status={status} />
          <LikeButton liked={isLiked} className="absolute top-3 end-3 z-10" />
          {variants && variants.length > 0
            ? renderSizeList()
            : renderGroupButtons()}
        </div>

        <div className="space-y-4 px-2.5 pt-5 pb-2.5">
          {renderVariants()}
          <div>
            <h2 className="nc-ProductCard__title text-base font-semibold transition-colors">
              {name}
            </h2>
            <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 `}>
              {category?.displayText}
            </p>
          </div>

          <div className="flex justify-between items-end ">
            <Prices price={price} newPrice={newPrice} />
            <div className="flex items-center mb-0.5">
              <StarIcon className="w-5 h-5 pb-[1px] text-amber-400" />
              <span className="text-sm ms-1 text-slate-500 dark:text-slate-400">
                {rating || "0"} ({reviewCount || 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <ModalQuickView
        show={showModalQuickView}
        onCloseModalQuickView={() => setShowModalQuickView(false)}
        product={data}
      />
    </>
  );
};

export default ProductCard;
