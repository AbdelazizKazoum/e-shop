// src/app/(admin)/products/new/page.tsx
"use client";

import { useState } from "react";
import PageTitle from "@/components/ui/PageTitle";
import ProductDetailsForm from "@/components/dashboard/products/ProductDetailsForm";
import ProductVariantsForm from "@/components/dashboard/products/ProductVariantsForm";

// Reverted to the simpler Product type
export type Product = {
  id: string;
  name: string;
};

export default function NewProductPage() {
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);

  const handleProductCreated = (product: Product) => {
    setCreatedProduct(product);
  };

  return (
    <>
      <PageTitle
        title={
          createdProduct
            ? `Add Variants for "${createdProduct.name}"`
            : "Add New Product"
        }
        subtitle={
          createdProduct
            ? "Step 2 of 2: Manage Variants"
            : "Step 1 of 2: Core Details"
        }
      />

      <div className="mt-8">
        {!createdProduct ? (
          <ProductDetailsForm onProductCreated={handleProductCreated} />
        ) : (
          <ProductVariantsForm product={createdProduct} />
        )}
      </div>
    </>
  );
}
