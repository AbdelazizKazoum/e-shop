"use client";

import React, { useState, useMemo, useEffect, FC } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import LikeButton from "@/components/LikeButton";
import { StarIcon, XCircleIcon } from "@heroicons/react/24/solid";
import BagIcon from "@/components/BagIcon";
import NcInputNumber from "@/components/NcInputNumber";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Prices from "@/components/Prices";
import toast from "react-hot-toast";
import Image from "next/image";
import AccordionInfo from "@/components/AccordionInfo";
import { Product, Variant } from "@/types/product";
import NotifyAddTocart from "./NotifyAddTocart";
import Policy from "@/app/(client)/product-detail/Policy";
import { useCartStore } from "@/stores/cartStore";
import CountdownTimer from "./CountdownTimer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Route } from "next";
import ListingImageGallery from "@/components/listing-image-gallery/ListingImageGallery";

interface ProductDetailsClientProps {
  product: Product;
  productType?: "clothes" | "sunglasses";
}

const ProductDetailsClient: FC<ProductDetailsClientProps> = ({
  product,
  productType = "sunglasses",
}) => {
  const { variants, status, name, price, newPrice, brand, category, id } =
    product;
  const addToCart = useCartStore((state) => state.addToCart);

  // --- ROUTER & MODAL ---
  const router = useRouter();
  const thisPathname = usePathname();
  const searchParams = useSearchParams();
  const modal = searchParams?.get("modal");

  // --- STATE MANAGEMENT ---
  const [selectedColor, setSelectedColor] = useState(variants[0]?.color || "");
  const [selectedSize, setSelectedSize] = useState(variants[0]?.size || "");
  const [qualitySelected, setQualitySelected] = useState(1);
  const [activeImages, setActiveImages] = useState<string[]>([]);

  // --- DERIVED DATA ---
  const uniqueColors = useMemo(() => {
    return Array.from(new Set(variants.map((v) => v.color)));
  }, [variants]);

  const availableSizesForSelectedColor = useMemo(() => {
    return variants.filter((v) => v.color === selectedColor).map((v) => v.size);
  }, [variants, selectedColor]);

  const selectedVariant: Variant | undefined = useMemo(() => {
    return variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [variants, selectedColor, selectedSize]);

  const isOutOfStock = useMemo(() => {
    return (selectedVariant?.stock?.quantity ?? 0) === 0;
  }, [selectedVariant]);

  const saleEndDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    date.setHours(date.getHours() + 4);
    return date.toISOString();
  }, []);

  const allGalleryImages = useMemo(() => {
    const imageSet = new Set<string>();
    if (product.image) {
      imageSet.add(product.image as string);
    }
    product.variants.forEach((variant) => {
      variant.images.forEach((img) => {
        imageSet.add(img.image as string);
      });
    });
    return Array.from(imageSet);
  }, [product]);

  // --- DYNAMIC CLASSES ---
  const mainImageAspectRatioClass =
    productType === "sunglasses"
      ? "aspect-w-16 aspect-h-10"
      : "aspect-w-11 aspect-h-16";

  // --- EFFECT to update images when variant changes ---
  useEffect(() => {
    if (selectedVariant && selectedVariant.images.length > 0) {
      setActiveImages(selectedVariant.images.map((img) => img.image));
    } else {
      setActiveImages([product.image as string]);
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

  const handleOpenModalImageGallery = () => {
    router.push(`${thisPathname}?modal=PHOTO_TOUR_SCROLLABLE` as Route);
  };

  const handleCloseModalImageGallery = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.push(`${thisPathname}?${params.toString()}` as Route);
  };

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
      image: product.image,
      price,
      newPrice,
      brand,
      category,
    };
    //@ts-ignore
    addToCart(productInfo, selectedVariant, qualitySelected);

    toast.custom(
      (t) => (
        <NotifyAddTocart
          t={t}
          show={t.visible}
          productImage={
            selectedVariant.images[0]?.image || (product.image as string)
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

  // --- RENDER FUNCTIONS ---
  const renderStatus = () => {
    if (!status) return null;
    const CLASSES =
      "absolute top-3 left-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300";
    if (status === "active") {
      return (
        <div className={CLASSES}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      );
    }
    return null;
  };

  const renderSectionGallery = () => {
    return (
      <div className="w-full lg:w-[55%] ">
        <div className="relative">
          <div
            className={`group relative ${mainImageAspectRatioClass} rounded-2xl overflow-hidden cursor-pointer`}
            onClick={handleOpenModalImageGallery}
          >
            {activeImages.length > 0 && (
              <Image
                fill
                sizes="(max-width: 640px) 100vw, 55vw"
                src={activeImages[0]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                alt={name}
                priority
              />
            )}
            <div className="absolute inset-0 bg-neutral-900/20 opacity-0 group-hover:opacity-40 transition-opacity"></div>
          </div>

          <div
            className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-white text-slate-500 cursor-pointer hover:bg-slate-200 z-10"
            onClick={handleOpenModalImageGallery}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="ml-2 text-neutral-800 text-sm font-medium">
              Show all photos
            </span>
          </div>

          {renderStatus()}
          <LikeButton className="absolute right-3 top-3 " />
        </div>
        {productType === "sunglasses" ? (
          <div className="grid grid-cols-2 gap-4 mt-4 md:gap-6 md:mt-6">
            {activeImages.slice(1, 5).map((item, index) => (
              <div
                key={index}
                className="aspect-w-16 aspect-h-10 relative w-full group overflow-hidden rounded-2xl cursor-pointer"
                onClick={handleOpenModalImageGallery}
              >
                <Image
                  sizes="(max-width: 640px) 100vw, 50vw"
                  fill
                  src={item}
                  className="w-full h-full rounded-2xl object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={`${name} detail ${index + 2}`}
                />
                <div className="absolute inset-0 bg-neutral-900/20 opacity-0 group-hover:opacity-40 transition-opacity"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-3 sm:gap-6 sm:mt-6">
            {activeImages.slice(1, 5).map((item, index) => (
              <div
                key={index}
                className="aspect-w-11 aspect-h-16 relative group overflow-hidden rounded-2xl cursor-pointer"
                onClick={handleOpenModalImageGallery}
              >
                <Image
                  sizes="(max-width: 640px) 100vw, 33vw"
                  fill
                  src={item}
                  className="w-full rounded-2xl object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={`${name} detail ${index + 2}`}
                />
                <div className="absolute inset-0 bg-neutral-900/20 opacity-0 group-hover:opacity-40 transition-opacity"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="lg:flex">
        {/* LEFT - IMAGE GALLERY */}
        {renderSectionGallery()}

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

            <CountdownTimer
              price={price}
              newPrice={newPrice}
              endDate={saleEndDate}
            />

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

            {/* ADD TO CART & OUT OF STOCK MESSAGE */}
            {isOutOfStock ? (
              <div className="flex items-center justify-center p-3.5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-800">
                <XCircleIcon className="w-6 h-6" />
                <span className="ml-2.5 font-semibold">Out of Stock</span>
              </div>
            ) : (
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
                >
                  <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
                  <span className="ml-3">Add to cart</span>
                </ButtonPrimary>
              </div>
            )}

            <hr className="2xl:!my-10 border-slate-200 dark:border-slate-700" />
            <AccordionInfo />
            <div className="hidden xl:block">
              <Policy />
            </div>
          </div>
        </div>
      </div>
      <ListingImageGallery
        isShowModal={modal === "PHOTO_TOUR_SCROLLABLE"}
        onClose={handleCloseModalImageGallery}
        images={allGalleryImages.map((item, index) => ({
          id: index,
          url: item,
        }))}
      />
    </>
  );
};

export default ProductDetailsClient;
