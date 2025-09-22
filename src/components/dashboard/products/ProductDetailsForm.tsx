"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import Input from "@/components/ui/form/Input";
import Textarea from "@/components/ui/form/Textarea";
import Select from "@/components/ui/form/Select";
import ImageUpload from "@/components/ui/form/ImageUpload";
import { useProductStore } from "@/stores/productStore";
import { useBrandStore } from "@/stores/brandStore"; // <-- import brand store
import type { ProductCreateInput } from "@/types/product";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import BrandSelect from "./BrandSelect";

export default function ProductDetailsForm({ onProductCreated }: any) {
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Category logic
  const categories = useProductStore((state) => state.categories);
  const fetchCategories = useProductStore((state) => state.fetchCategories);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      fetchCategories();
    }
  }, [categories, fetchCategories]);

  // Brand logic
  const {
    brands,
    fetchBrands,
    page,
    limit,
    total,
    loading: brandsLoading,
  } = useBrandStore();
  const [brandSearch, setBrandSearch] = useState("");
  const [brandPage, setBrandPage] = useState(1);

  useEffect(() => {
    fetchBrands({ page: brandPage, limit: 10, filter: brandSearch });
  }, [fetchBrands, brandPage, brandSearch]);

  const createProduct = useProductStore((state) => state.createProduct);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim().length > 0) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag: string) => {
    if (tag.length > 0 && !tags.includes(tag.toLowerCase())) {
      setTags([...tags, tag]);
    }
    setTagInput("");
    tagInputRef.current?.focus();
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    const splitTags = pasted
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    splitTags.forEach(addTag);
    e.preventDefault();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const productData: ProductCreateInput = {
      name: formData.get("name") as string,
      brand: selectedBrand,
      description: formData.get("description") as string,
      categoryId: formData.get("category") as string,
      gender: formData.get("gender") as string,
      price: Number(formData.get("price")),
      newPrice: formData.get("newPrice")
        ? Number(formData.get("newPrice"))
        : undefined,
      image: mainImageFile || undefined,
      tags: tags, // <-- Use array of tags
    };

    try {
      setLoading(true);
      const createdProduct = await createProduct(productData);

      if (createdProduct) {
        const newProduct = {
          id: createdProduct.id,
          name: productData.name as string,
        };

        onProductCreated(newProduct as any);
        setMainImageFile(null);
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
        <BrandSelect
          value={selectedBrand}
          onChange={setSelectedBrand}
          required
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
        {/* --- Keywords input moved here --- */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Keywords (press Enter or comma to add)
          </label>
          <div className="flex flex-wrap items-center gap-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 px-2 py-2 shadow-sm">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center bg-primary-100 text-primary-700 rounded px-2 py-0.5 text-xs font-medium mr-1 mb-1"
              >
                {tag}
                <button
                  type="button"
                  className="ml-1 text-primary-500 hover:text-red-500"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove ${tag}`}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </span>
            ))}
            <input
              ref={tagInputRef}
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              onPaste={handleTagPaste}
              className="flex-1 bg-transparent py-2 text-sm text-neutral-800 dark:text-neutral-200 border-none outline-none focus:ring-0"
              placeholder="Type keyword and press Enter or comma"
              style={{
                minWidth: "120px",
                boxShadow: "none",
                borderRadius: "0.375rem",
              }}
            />
          </div>
        </div>
        {/* --- End keywords input --- */}
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
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-70"
          disabled={loading}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
