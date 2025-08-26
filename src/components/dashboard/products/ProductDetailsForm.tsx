"use client";

import { FormEvent, useState } from "react";
import Input from "@/components/ui/form/Input";
import Textarea from "@/components/ui/form/Textarea";
import Select from "@/components/ui/form/Select";
import ImageUpload from "@/components/ui/form/ImageUpload";
import { useProductStore } from "@/stores/productStore";
import type { Category, Product, ProductCreateInput } from "@/types/product";
import { toast } from "react-toastify";

type Props = {
  onProductCreated: () => void;
};

const categories: Category[] = [
  {
    id: "cat1",
    category: "tshirts",
    displayText: "T-Shirts",
    imageUrl: "/images/categories/tshirts.png",
    products: [],
  },
  {
    id: "cat2",
    category: "hoodies",
    displayText: "Hoodies",
    imageUrl: "/images/categories/hoodies.png",
    products: [],
  },
  {
    id: "cat3",
    category: "jackets",
    displayText: "Jackets",
    imageUrl: "/images/categories/jackets.png",
    products: [],
  },
];

export default function ProductDetailsForm({ onProductCreated }: any) {
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const createProduct = useProductStore((state) => state.createProduct);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const productData: ProductCreateInput = {
      name: formData.get("name") as string,
      brand: formData.get("brand") as string,
      description: formData.get("description") as string,
      categoryId: formData.get("category") as string,
      gender: formData.get("gender") as string,
      price: Number(formData.get("price")),
      newPrice: formData.get("newPrice")
        ? Number(formData.get("newPrice"))
        : undefined,
      image: mainImageFile || undefined,
    };

    try {
      setLoading(true);
      const createdProduct = await createProduct(productData);

      if (createdProduct) {
        const newProduct = {
          id: "prod_" + Math.random().toString(36).substr(2, 9),
          name: productData.name as string,
        };

        onProductCreated(newProduct as any);
        setMainImageFile(null);
        // Optionally reset the form:
        // event.currentTarget.reset();
      } else {
        // Optionally handle failure (toast already shown in store)
        // toast.error("Product creation failed.");
      }
    } catch (err) {
      console.error("Failed to create product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border hover:bg-none nc-dark-box-bg-has-hover p-6"
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
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
