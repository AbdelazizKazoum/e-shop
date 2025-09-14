"use client";
import React, { FC, useState, useMemo, useEffect } from "react";
import { stockService } from "@/services/stockService";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import LikeButton from "@/components/LikeButton";
import { StarIcon } from "@heroicons/react/24/solid";
import BagIcon from "@/components/BagIcon";
import NcInputNumber from "@/components/NcInputNumber";
import { Product } from "@/types/product";
import { useCartStore } from "@/stores/cartStore";
import {
  NoSymbolIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import IconDiscount from "@/components/IconDiscount";
import Prices from "@/components/Prices";
import toast from "react-hot-toast";
import NotifyAddTocart from "./NotifyAddTocart";
import AccordionInfo from "@/components/AccordionInfo";
import Image from "next/image";

export interface ProductQuickViewProps {
  className?: string;
  product: Product;
  productType?: "clothes" | "sunglasses"; // Added productType
}

const ProductQuickView: FC<ProductQuickViewProps> = ({
  className = "",
  product,
  productType = "sunglasses", // Default to sunglasses
}) => {
  const [variants, setVariants] = useState(product.variants);
  const {
    status,
    name,
    price,
    newPrice,
    image,
    category,
    id,
    rating,
    reviewCount,
  } = product;
  const [loadingStock, setLoadingStock] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  // State
  const [selectedColor, setSelectedColor] = useState(variants[0]?.color || "");
  const [selectedSize, setSelectedSize] = useState(variants[0]?.size || "");
  const [qualitySelected, setQualitySelected] = useState(1);
  const [activeImages, setActiveImages] = useState<string[]>([]);

  // DYNAMIC CLASSES based on productType
  const mainImageAspectRatioClass =
    productType === "sunglasses"
      ? "aspect-w-16 aspect-h-10" // Landscape for sunglasses
      : "aspect-w-11 aspect-h-16"; // Portrait for clothes

  // Fetch stock for all variants on mount
  useEffect(() => {
    let mounted = true;
    async function fetchStock() {
      setLoadingStock(true);
      try {
        const variantIds = product.variants
          .map((v) => v.id)
          .filter((id): id is string => Boolean(id));
        if (variantIds.length === 0) return;
        const stockMap: Record<string, number> =
          await stockService.getQuantitiesForVariants(variantIds);

        const updatedVariants = product.variants.map((v) => ({
          ...v,
          stock: { quantity: stockMap[v.id ?? ""] ?? 0 },
        }));
        //@ts-ignore
        if (mounted) setVariants(updatedVariants);
      } catch (e) {
        console.error("Failed to fetch stock", e);
      } finally {
        if (mounted) setLoadingStock(false);
      }
    }
    fetchStock();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.variants]);

  // Derived data
  const uniqueColors = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color))),
    [variants]
  );
  const availableSizesForSelectedColor = useMemo(
    () => variants.filter((v) => v.color === selectedColor).map((v) => v.size),
    [variants, selectedColor]
  );
  const selectedVariant = useMemo(
    () =>
      variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      ),
    [variants, selectedColor, selectedSize]
  );
  const isOutOfStock = useMemo(
    () => (selectedVariant?.stock?.quantity ?? 0) === 0,
    [selectedVariant]
  );

  // Update images when variant changes
  useEffect(() => {
    if (selectedVariant && selectedVariant.images.length > 0) {
      setActiveImages(selectedVariant.images.map((img) => img.image));
    } else {
      setActiveImages([typeof image === "string" ? image : ""]);
    }
  }, [selectedVariant, image]);

  // Add to cart handler
  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a color and size.");
      return;
    }
    if (isOutOfStock) {
      toast.error("This item is currently out of stock.");
      return;
    }
    if ((selectedVariant.stock?.quantity ?? 0) < qualitySelected) {
      toast.error("Not enough items in stock.");
      return;
    }
    const productInfo: any = {
      id,
      name,
      image: typeof image === "string" ? image : "",
      price,
      newPrice,
      brand: product.brand,
      category,
    };
    //@ts-ignore
    addToCart(productInfo, selectedVariant, qualitySelected);
    toast.custom(
      (t) => (
        <NotifyAddTocart
          show={t.visible}
          productImage={
            selectedVariant.images[0]?.image ||
            (typeof image === "string" ? image : "")
          }
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

  const renderVariants = () => {
    if (!uniqueColors.length) return null;
    return (
      <div>
        <label>
          <span className="text-sm font-medium">
            Color:
            <span className="ms-1 font-semibold">{selectedColor}</span>
          </span>
        </label>
        <div className="flex mt-3 space-x-2">
          {uniqueColors.map((color, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedColor(color);
                const firstSize = variants.find((v) => v.color === color)?.size;
                if (firstSize) setSelectedSize(firstSize);
              }}
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
    );
  };

  const renderSizeList = () => {
    if (!availableSizesForSelectedColor.length) return null;
    return (
      <div>
        <div className="flex justify-between font-medium text-sm">
          <label>
            <span>
              Size:
              <span className="ms-1 font-semibold">{selectedSize}</span>
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
            const variantForThisSize = variants.find(
              (v) => v.color === selectedColor && v.size === size
            );
            const isVariantOutOfStock =
              (variantForThisSize?.stock?.quantity ?? 0) === 0;
            return (
              <div
                key={index}
                className={`relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center text-sm sm:text-base uppercase font-semibold select-none overflow-hidden z-0 ${
                  isVariantOutOfStock
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                } ${
                  isActive
                    ? "bg-primary-6000 border-primary-6000 text-white"
                    : "border-slate-300 dark:border-slate-600 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                }`}
                onClick={() => {
                  if (isVariantOutOfStock) return;
                  setSelectedSize(size);
                }}
              >
                {size}
                {isVariantOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 dark:bg-black dark:bg-opacity-60">
                    <svg
                      className="w-full h-full text-slate-400 dark:text-slate-500"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      stroke="currentColor"
                    >
                      <line
                        x1="0"
                        y1="100"
                        x2="100"
                        y2="0"
                        vectorEffect="non-scaling-stroke"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {selectedVariant?.stock && !isOutOfStock && (
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-medium">In stock:</span>{" "}
            <span className="font-semibold">
              {selectedVariant.stock.quantity}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderStatus = () => {
    if (!status) return null;
    const CLASSES =
      "absolute top-3 start-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300";
    if (status === "New in") {
      return (
        <div className={CLASSES}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      );
    }
    // ... other status cases
    return null;
  };

  // NEW: Renders gallery based on productType
  const renderImageGallery = () => {
    if (productType === "sunglasses") {
      return (
        <div className="hidden lg:grid grid-cols-2 gap-4 mt-4">
          {activeImages.slice(1, 5).map((item, index) => (
            <div
              key={index}
              className="aspect-w-16 aspect-h-10 relative w-full"
            >
              <Image
                fill
                src={item}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full rounded-lg object-cover"
                alt={`${name} detail ${index + 2}`}
              />
            </div>
          ))}
        </div>
      );
    }

    if (productType === "clothes") {
      return (
        <div className="hidden lg:grid grid-cols-2 gap-3 mt-3">
          {activeImages.slice(1, 3).map((item, index) => (
            <div key={index} className="aspect-w-11 aspect-h-16 relative">
              <Image
                fill
                src={item}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full rounded-xl object-cover"
                alt={`${name} detail ${index + 2}`}
              />
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderSectionContent = () => {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold hover:text-primary-6000 transition-colors">
            {name}
          </h2>

          <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
            <Prices
              contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
              price={price}
              newPrice={newPrice}
            />
            <div className="h-6 border-l border-slate-300 dark:border-slate-700"></div>
            <div className="flex items-center">
              <span className="flex items-center text-sm font-medium">
                <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                <span className="ml-1.5">
                  {rating || 0} ({reviewCount || 0} reviews)
                </span>
              </span>
            </div>
          </div>
        </div>

        <div>{renderVariants()}</div>
        <div>{renderSizeList()}</div>

        {/* QTY AND ADD TO CART BUTTON */}
        <div className="flex space-x-3.5">
          <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
            <NcInputNumber
              defaultValue={qualitySelected}
              onChange={setQualitySelected}
              max={selectedVariant?.stock?.quantity}
            />
          </div>
          <ButtonPrimary
            className="flex-1 flex-shrink-0"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? (
              "Out of stock"
            ) : (
              <>
                <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
                <span className="ms-3">Add to cart</span>
              </>
            )}
          </ButtonPrimary>
        </div>

        <hr className=" border-slate-200 dark:border-slate-700"></hr>
        <AccordionInfo />
      </div>
    );
  };

  return (
    <div className={`nc-ProductQuickView ${className} relative`}>
      {/* Loading overlay */}
      {loadingStock && (
        <div className="absolute z-10 inset-0 bg-white/70 dark:bg-slate-900/70 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-8 w-8 text-primary-6000"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="mt-2 font-medium text-slate-700 dark:text-slate-200">
              Loading stock...
            </span>
          </div>
        </div>
      )}

      <div className="lg:flex">
        {/* LEFT - IMAGE GALLERY */}
        <div className="w-full lg:w-[50%] ">
          <div className="relative">
            <div className={`relative ${mainImageAspectRatioClass}`}>
              {activeImages.length > 0 && (
                <Image
                  fill
                  src={activeImages[0]}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full rounded-xl object-cover"
                  alt={name}
                />
              )}
            </div>
            {renderStatus()}
            <LikeButton className="absolute end-3 top-3 " />
          </div>
          {/* Render dynamic gallery */}
          {renderImageGallery()}
        </div>

        {/* SIDEBAR */}
        <div className="w-full lg:w-[50%] pt-6 lg:pt-0 lg:ps-7 xl:ps-8">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
