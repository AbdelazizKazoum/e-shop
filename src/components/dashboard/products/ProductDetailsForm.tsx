// src/components/products/ProductDetailsForm.tsx
"use client";

import { FormEvent, useState } from "react";
import Input from "@/components/ui/form/Input";
import Textarea from "@/components/ui/form/Textarea";
import Select from "@/components/ui/form/Select";
import ImageUpload from "@/components/ui/form/ImageUpload";
import { Product } from "@/app/dashboard/products/new/page";

type Props = {
  onProductCreated: (product: Product) => void;
};

const categories = [
  { id: "cat1", displayText: "T-Shirts" },
  { id: "cat2", displayText: "Hoodies" },
];

export default function ProductDetailsForm({ onProductCreated }: Props) {
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const productData = Object.fromEntries(formData.entries());

    // Add the file to the data object for logging/submission
    const submissionData = {
      ...productData,
      image: mainImageFile,
    };

    console.log("Submitting Product Data:", submissionData);

    const newProduct: Product = {
      id: "prod_" + Math.random().toString(36).substr(2, 9),
      name: productData.name as string,
    };

    onProductCreated(newProduct);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="nc-box-has-hover nc-dark-box-bg-has-hover p-6"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          name="name"
          label="Product Name"
          type="text"
          required
          placeholder="e.g., Classic Cotton Tee"
        />
        <Input
          name="brand"
          label="Brand"
          type="text"
          required
          placeholder="e.g., Acme Apparel"
        />
        <div className="md:col-span-2">
          <Textarea
            name="description"
            label="Description"
            placeholder="Describe the product..."
          />
        </div>
        <Select name="category" label="Category" required>
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.displayText}
            </option>
          ))}
        </Select>
        <Select name="gender" label="Gender" required defaultValue="Unisex">
          <option value="Unisex">Unisex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </Select>
        <Input
          name="price"
          label="Price ($)"
          type="number"
          required
          placeholder="25.99"
          step="0.01"
        />
        <Input
          name="newPrice"
          label="Sale Price ($) (Optional)"
          type="number"
          placeholder="19.99"
          step="0.01"
        />
        <div className="md:col-span-2">
          <ImageUpload
            label="Main Image"
            onFileChange={(file) => setMainImageFile(file)}
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
        >
          Save and Add Variants
        </button>
      </div>
    </form>
  );
}
