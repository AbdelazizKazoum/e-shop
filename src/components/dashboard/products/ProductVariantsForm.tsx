// src/components/products/ProductVariantsForm.tsx
"use client";

import { useState, FormEvent } from "react";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import { PlusCircle, Trash2 } from "lucide-react";
import { Product } from "@/app/dashboard/products/new/page";
import ColorPickerInput from "@/components/ui/form/ColorPickerInput";
import MultiImageUpload from "@/components/ui/form/MultiImageUpload";

type Props = {
  product: Product;
};

type Variant = {
  id: number;
  color: string;
  size: string;
  qte: number;
  images: File[];
};

export default function ProductVariantsForm({ product }: Props) {
  const [variants, setVariants] = useState<Variant[]>([
    { id: Date.now(), color: "#000000", size: "M", qte: 10, images: [] },
  ]);

  const addVariant = () => {
    setVariants([
      ...variants,
      { id: Date.now(), color: "#ffffff", size: "M", qte: 10, images: [] },
    ]);
  };

  const removeVariant = (id: number) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleVariantChange = (
    id: number,
    field: keyof Omit<Variant, "id" | "images">,
    value: any
  ) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleImagesChange = (variantId: number, files: File[]) => {
    setVariants(
      variants.map((v) => (v.id === variantId ? { ...v, images: files } : v))
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting Variants for Product ID:", product.id);
    console.log("Variants Data:", variants);
    alert(
      "Variants saved successfully! Check the console for the data structure."
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {variants.map((variant, index) => (
          <div
            key={variant.id}
            className="nc-box-has-hover nc-dark-box-bg-has-hover relative p-6"
          >
            <h3 className="mb-4 font-semibold text-neutral-700 dark:text-neutral-200">
              Variant {index + 1}
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <ColorPickerInput
                label="Color"
                value={variant.color}
                onChange={(color) =>
                  handleVariantChange(variant.id, "color", color)
                }
              />
              <Select
                label="Size"
                value={variant.size}
                onChange={(e) =>
                  handleVariantChange(variant.id, "size", e.target.value)
                }
                required
              >
                {["SM", "M", "L", "XL", "XXL", "3XL", "4XL"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
              <Input
                label="Quantity"
                type="number"
                value={variant.qte}
                onChange={(e) =>
                  handleVariantChange(
                    variant.id,
                    "qte",
                    parseInt(e.target.value) || 0
                  )
                }
                required
              />
            </div>
            <div className="mt-6">
              <MultiImageUpload
                label="Variant Images"
                onFilesChange={(files) => handleImagesChange(variant.id, files)}
              />
            </div>
            {variants.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariant(variant.id)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-2 rounded-md border border-primary-600 bg-white px-4 py-2 text-sm font-medium text-primary-600 shadow-sm hover:bg-primary-50 dark:bg-neutral-900 dark:border-neutral-700"
        >
          <PlusCircle className="h-5 w-5" />
          Add Another Variant
        </button>
        <button
          type="submit"
          className="rounded-md bg-secondary-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary-700"
        >
          Finish & Save Product
        </button>
      </div>
    </form>
  );
}
