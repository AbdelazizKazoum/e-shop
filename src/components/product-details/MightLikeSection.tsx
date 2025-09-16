// MightLikeSection.tsx

"use client";

import React, { FC } from "react";
import SuggestedProductItem, { SuggestedProduct } from "./SuggestedProductItem";

interface MightLikeSectionProps {
  suggestedProducts: SuggestedProduct[];
}

const MightLikeSection: FC<MightLikeSectionProps> = ({ suggestedProducts }) => {
  // If there are no products to suggest, don't render the section
  if (!suggestedProducts || suggestedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
      <h5 className="text-sm font-semibold mb-3">You might also like</h5>
      <div className="space-y-3">
        {suggestedProducts.map((product) => (
          <SuggestedProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MightLikeSection;
