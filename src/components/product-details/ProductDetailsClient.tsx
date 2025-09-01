"use client";

import React, { useState, useMemo, useEffect, FC } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import LikeButton from "@/components/LikeButton";
import { StarIcon } from "@heroicons/react/24/solid";
import BagIcon from "@/components/BagIcon";
import NcInputNumber from "@/components/NcInputNumber";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Prices from "@/components/Prices";
import toast from "react-hot-toast";
import Image from "next/image";
import AccordionInfo from "@/components/AccordionInfo";
import { Product } from "@/types/product";
import NotifyAddTocart from "./NotifyAddTocart";
import Policy from "@/app/(client)/product-detail/Policy";
import { useCartStore } from "@/stores/cartStore"; // Import the cart store
import { ProductInfo } from "@/types/cart"; // Import the simplified product type for the cart

interface ProductDetailsClientProps {
  product: Product;
}

const ProductDetailsClient: FC<ProductDetailsClientProps> = ({ product }) => {
  const { variants, status, name, price, newPrice, brand, category, id } =
    product;
  const addToCart = useCartStore((state) => state.addToCart); // Get the addToCart action

  // --- STATE MANAGEMENT ---
  const [selectedColor, setSelectedColor] = useState(variants[0]?.color || "");
  const [selectedSize, setSelectedSize] = useState(variants[0]?.size || "");
  const [qualitySelected, setQualitySelected] = useState(1);
  const [activeImages, setActiveImages] = useState<string[]>([]);

  // --- DERIVED DATA ---
  const uniqueColors = useMemo(() => {
    return [...new Set(variants.map((v) => v.color))];
  }, [variants]);

  const availableSizesForSelectedColor = useMemo(() => {
    return variants.filter((v) => v.color === selectedColor).map((v) => v.size);
  }, [variants, selectedColor]);

  const selectedVariant = useMemo(() => {
    return variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [variants, selectedColor, selectedSize]);

  // --- EFFECT to update images when variant changes ---
  useEffect(() => {
    if (selectedVariant && selectedVariant.images.length > 0) {
      setActiveImages(selectedVariant.images.map((img) => img.image));
    } else {
      setActiveImages([product.image]);
    }
  }, [selectedVariant, product.image]);

  // --- EVENT HANDLERS ---
  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    const firstSizeForColor = variants.find((v) => v.color === color)?.size;
    if (firstSizeForColor) {
      setSelectedSize(firstSizeForColor);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a color and size.");
      return;
    }

    // 1. Create the simplified product info object for the cart store
    const productInfo: ProductInfo = {
      id,
      name,
      image: product.image,
      price,
      newPrice,
      brand,
      category,
    };

    // 2. Call the addToCart action from the Zustand store
    addToCart(productInfo, selectedVariant, qualitySelected);

    // 3. Show the toast notification
    toast.custom(
      (t) => (
        <NotifyAddTocart
          show={t.visible}
          productImage={selectedVariant.images[0]?.image || product.image}
          productName={name}
          price={price}
          newPrice={newPrice}
          colorSelected={selectedVariant.color}
          sizeSelected={selectedVariant.size}
          qualitySelected={qualitySelected}
        />
      ),
      { position: "top-right", id: "nc-product-notify", duration: 3000 }
    );
  };

  // --- RENDER FUNCTIONS ---
  const renderStatus = () => {
    if (!status) return null;
    const CLASSES =
      "absolute top-3 left-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300";
    if (status === "New in") {
      return (
        <div className={CLASSES}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lg:flex">
      {/* LEFT - IMAGE GALLERY */}
      <div className="w-full lg:w-[55%] ">
        <div className="relative">
          <div className="aspect-w-16 aspect-h-16 relative">
            {activeImages.length > 0 && (
              <Image
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                src={activeImages[0]}
                className="w-full rounded-2xl object-cover"
                alt={name}
              />
            )}
          </div>
          {renderStatus()}
          <LikeButton className="absolute right-3 top-3 " />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3 sm:gap-6 sm:mt-6 xl:gap-8 xl:mt-8">
          {activeImages.slice(1).map((item, index) => (
            <div
              key={index}
              className="aspect-w-11 xl:aspect-w-10 2xl:aspect-w-11 aspect-h-16 relative"
            >
              <Image
                sizes="(max-width: 640px) 100vw, 33vw"
                fill
                src={item}
                className="w-full rounded-2xl object-cover"
                alt={`${name} detail ${index + 2}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT - PRODUCT INFO & SELECTIONS */}
      <div className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
        <div className="space-y-7 2xl:space-y-8">
          {/* HEADING */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">{name}</h2>
            <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
              <Prices
                contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
                price={price}
                newPrice={newPrice}
              />
              <div className="h-7 border-l border-slate-300 dark:border-slate-700"></div>
              <div className="flex items-center">
                <a
                  href="#reviews"
                  className="flex items-center text-sm font-medium"
                >
                  <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                  <div className="ml-1.5 flex">
                    <span>{product.rating || 0}</span>
                    <span className="block mx-2">·</span>
                    <span className="text-slate-600 dark:text-slate-400 underline">
                      {product.reviewCount || 0} reviews
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* VARIANTS */}
          <div>
            <label>
              <span className="text-sm font-medium">
                Color:
                <span className="ml-1 font-semibold">{selectedColor}</span>
              </span>
            </label>
            <div className="flex mt-3 space-x-2">
              {uniqueColors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => handleColorClick(color)}
                  className={`relative w-10 h-10 rounded-full border-2 cursor-pointer ${
                    selectedColor === color
                      ? "border-primary-6000 dark:border-primary-500"
                      : "border-transparent"
                  }`}
                  title={color}
                >
                  <div
                    className="absolute inset-0.5 rounded-full z-0"
                    style={{ backgroundColor: color }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          {/* SIZES */}
          <div>
            <div className="flex justify-between font-medium text-sm">
              <label>
                <span>
                  Size:
                  <span className="ml-1 font-semibold">{selectedSize}</span>
                </span>
              </label>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="##"
                className="text-primary-6000 hover:text-primary-500"
              >
                See sizing chart
              </a>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-3">
              {availableSizesForSelectedColor.map((size, index) => {
                const isActive = size === selectedSize;
                const isOutOfStock = (selectedVariant?.qte ?? 0) === 0;
                return (
                  <div
                    key={index}
                    className={`relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center 
                      text-sm sm:text-base uppercase font-semibold select-none overflow-hidden z-0 ${
                        isOutOfStock
                          ? "cursor-not-allowed opacity-20"
                          : "cursor-pointer"
                      } ${
                      isActive
                        ? "bg-primary-6000 border-primary-6000 text-white"
                        : "border-slate-300 dark:border-slate-600 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                    }`}
                    onClick={() => {
                      if (isOutOfStock) return;
                      setSelectedSize(size);
                    }}
                  >
                    {size}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ADD TO CART */}
          <div className="flex space-x-3.5">
            <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
              <NcInputNumber
                defaultValue={qualitySelected}
                onChange={setQualitySelected}
              />
            </div>
            <ButtonPrimary
              className="flex-1 flex-shrink-0"
              onClick={handleAddToCart}
            >
              <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
              <span className="ml-3">Add to cart</span>
            </ButtonPrimary>
          </div>

          <hr className="2xl:!my-10 border-slate-200 dark:border-slate-700" />

          <AccordionInfo />

          <div className="hidden xl:block">
            <Policy />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsClient;
