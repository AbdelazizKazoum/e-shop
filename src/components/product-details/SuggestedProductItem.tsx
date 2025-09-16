// SuggestedProductItem.tsx

"use client";

import React, { FC } from "react";
import Image from "next/image";

// Define the shape of the product data for this component
export interface SuggestedProduct {
  id: string;
  name: string;
  price: string;
  imageSrc: string;
}

interface SuggestedProductItemProps {
  product: SuggestedProduct;
}

const SuggestedProductItem: FC<SuggestedProductItemProps> = ({ product }) => {
  const handleAddToCart = () => {
    // In a real application, this would trigger a cart store action
    alert(`Added ${product.name} to cart! (demo)`);
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="h-16 w-16 relative flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
        <Image
          src={product.imageSrc}
          alt={product.name}
          fill
          sizes="80px"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{product.name}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {product.price}
        </p>
      </div>
      <button
        onClick={handleAddToCart}
        className="text-xs font-medium text-primary-6000 dark:text-primary-500 px-3 py-1.5 rounded-lg border border-primary-6000 hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors"
      >
        Add
      </button>
    </div>
  );
};

export default SuggestedProductItem;
