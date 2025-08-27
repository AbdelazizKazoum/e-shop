"use client";

import React, { useState, useEffect, FormEvent, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  PlusCircle,
  Search,
  Eye,
  Pencil,
  Filter,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { create } from "zustand";
import { SketchPicker, ColorResult } from "react-color";
import { useProductStore } from "@/stores/productStore";
import { Category, Product, Variant } from "@/types/product";

// --- TYPE DEFINITIONS (would be in src/lib/types.ts) ---
export interface Image {
  id: string;
  image: string;
}

// --- UI COMPONENTS ---

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

const PageTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div>
    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 md:text-3xl">
      {title}
    </h1>
    {subtitle && <p className="text-neutral-500">{subtitle}</p>}
  </div>
);

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, id, ...props }, ref) => (
  <div>
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
    >
      {label}
    </label>
    <input
      id={id}
      ref={ref}
      {...props}
      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
    />
  </div>
));
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }
>(({ label, id, ...props }, ref) => (
  <div>
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
    >
      {label}
    </label>
    <textarea
      id={id}
      ref={ref}
      rows={4}
      {...props}
      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
    />
  </div>
));
Textarea.displayName = "Textarea";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }
>(({ label, id, children, ...props }, ref) => (
  <div>
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
    >
      {label}
    </label>
    <select
      id={id}
      ref={ref}
      {...props}
      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
    >
      {children}
    </select>
  </div>
));
Select.displayName = "Select";

const ImageUpload = ({
  label,
  onFileChange,
  initialPreview,
}: {
  label: string;
  onFileChange: (file: File | null) => void;
  initialPreview?: string;
}) => {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);

  useEffect(() => {
    setPreview(initialPreview || null);
  }, [initialPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onFileChange(file);
    } else {
      setPreview(initialPreview || null);
      onFileChange(null);
    }
  };

  return (
    <div>
      <label className="mb-4 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <div className="w-full">
        {preview ? (
          <div className="relative aspect-square w-full rounded-md overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 cursor-pointer text-white transition-opacity">
              Change
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        ) : (
          <label className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-4 text-neutral-500 dark:text-neutral-400" />
              <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
                <span className="font-semibold">Click to upload</span>
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
};

const ColorPickerInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  useOnClickOutside(pickerRef, () => setShowPicker(false));
  const handleColorChange = (color: ColorResult) => onChange(color.hex);

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <div className="flex items-center">
        <button
          type="button"
          className="h-10 w-10 flex-shrink-0 rounded-l-md border border-r-0 border-neutral-300 dark:border-neutral-700"
          style={{ backgroundColor: value || "#ffffff" }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="w-full rounded-r-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
        />
      </div>
      {showPicker && (
        <div ref={pickerRef} className="absolute z-10 mt-2">
          <SketchPicker color={value} onChangeComplete={handleColorChange} />
        </div>
      )}
    </div>
  );
};

// --- UPDATE PRODUCT FORM ---
const UpdateProductForm = ({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) => {
  const [formData, setFormData] = useState(product);
  const [newMainImage, setNewMainImage] = useState<File | null>(null);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = categories.find(
      (cat) => cat.id === e.target.value
    );
    if (selectedCategory) {
      setFormData({ ...formData, category: selectedCategory });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const submissionData = { ...formData, imageFile: newMainImage };
    console.log("Submitting updated product data:", submissionData);
    alert("Product updated! (Check console)");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 bg-white dark:bg-neutral-800/50 rounded-lg border border-neutral-200/70 dark:border-neutral-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-6">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <Input
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
              />
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </Select>
              <div className="md:col-span-2">
                <Textarea
                  label="Description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                />
              </div>
              <Input
                label="Price ($)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
              />
              <Input
                label="New Price ($)"
                name="newPrice"
                type="number"
                value={formData.newPrice || ""}
                onChange={handleInputChange}
                step="0.01"
              />
              <Select
                label="Category"
                name="category"
                value={formData.category.id}
                onChange={handleCategoryChange}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.displayText}
                  </option>
                ))}
              </Select>
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </Select>
            </div>
          </div>
          <div className="lg:col-span-1">
            <ImageUpload
              label="Main Product Image"
              initialPreview={formData.image}
              onFileChange={setNewMainImage}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

// --- EDIT VARIANT FORM ---
const EditVariantForm = ({
  variant,
  onSave,
  onCancel,
}: {
  variant: Variant;
  onSave: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(variant);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = newImageFiles.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImageFiles]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleColorChange = (color: string) => {
    setFormData({ ...formData, color });
  };
  const handleDeleteImage = (imageId: string) => {
    setDeletedImageIds([...deletedImageIds, imageId]);
    setFormData({
      ...formData,
      images: formData.images.filter((img) => img.id !== imageId),
    });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImageFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };
  const handleDeleteNewImage = (indexToRemove: number) => {
    setNewImageFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const submissionData = {
      variantId: formData.id,
      data: {
        color: formData.color,
        size: formData.size,
        qte: formData.qte,
        deletedImages: deletedImageIds,
      },
      newImages: newImageFiles,
    };
    console.log("Submitting variant update:", submissionData);
    alert("Variant updated! (Check console)");
    onSave(submissionData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 my-2 bg-primary-50 dark:bg-neutral-900 rounded-md border-l-4 border-primary-500"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ColorPickerInput
          label="Color"
          value={formData.color}
          onChange={handleColorChange}
        />
        <Select
          label="Size"
          name="size"
          value={formData.size}
          onChange={handleInputChange}
        >
          {["SM", "M", "L", "XL", "XXL", "3XL", "4XL"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Input
          label="Quantity"
          name="qte"
          type="number"
          value={formData.qte}
          onChange={handleInputChange}
        />
      </div>
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium">Images</label>
        <div className="flex flex-wrap gap-2">
          {formData.images.map((img) => (
            <div key={img.id} className="relative h-20 w-20">
              <img
                src={img.image}
                alt="variant"
                className="h-full w-full rounded-md object-cover"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(img.id)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {newImagePreviews.map((preview, index) => (
            <div key={index} className="relative h-20 w-20">
              <img
                src={preview}
                alt="new preview"
                className="h-full w-full rounded-md object-cover"
              />
              <button
                type="button"
                onClick={() => handleDeleteNewImage(index)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
            <UploadCloud className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white"
        >
          Save Variant
        </button>
      </div>
    </form>
  );
};

// --- VARIANT LIST ---
const VariantList = ({ variants }: { variants: Variant[] }) => {
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);

  const handleDeleteVariant = (variantId: string) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      console.log("Deleting variant:", variantId);
      alert("Variant deleted! (Check console)");
    }
  };

  return (
    <div className="mt-8 p-6 bg-white dark:bg-neutral-800/50 rounded-lg border border-neutral-200/70 dark:border-neutral-700/50">
      <h2 className="text-lg font-semibold mb-4">Variants</h2>
      <div className="space-y-2">
        {variants.map((variant) => (
          <div key={variant.id}>
            {editingVariantId === variant.id ? (
              <EditVariantForm
                variant={variant}
                onSave={() => setEditingVariantId(null)}
                onCancel={() => setEditingVariantId(null)}
              />
            ) : (
              <div className="flex items-center gap-4 p-3 rounded-md bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700/60">
                <img
                  src={
                    variant.images[0]?.image ||
                    "https://placehold.co/100x100/e2e8f0/64748b?text=N/A"
                  }
                  alt="variant"
                  className="h-12 w-12 rounded-md object-cover"
                />
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-5 w-5 rounded-full border border-neutral-300 dark:border-neutral-600"
                      style={{ backgroundColor: variant.color }}
                    ></div>
                    <span className="font-mono">{variant.color}</span>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-500">Size:</span>{" "}
                    {variant.size}
                  </div>
                  <div>
                    <span className="font-medium text-neutral-500">Qty:</span>{" "}
                    {variant.qte}
                  </div>
                  <div>
                    <span className="font-medium text-neutral-500">
                      Images:
                    </span>{" "}
                    {variant.images.length}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingVariantId(variant.id || null)}
                    className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteVariant(variant.id || "")}
                    className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SKELETON LOADER ---
const UpdateProductPageSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-1/3 rounded-lg bg-neutral-200 dark:bg-neutral-700 mb-8"></div>
    <div className="p-6 rounded-lg bg-neutral-100 dark:bg-neutral-800/50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-6 w-1/4 mb-6 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <div className="h-4 w-1/4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
              <div className="h-10 w-full rounded-md bg-neutral-200 dark:bg-neutral-700"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700"></div>
              <div className="h-10 w-full rounded-md bg-neutral-200 dark:bg-neutral-700"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700"></div>
              <div className="h-10 w-full rounded-md bg-neutral-200 dark:bg-neutral-700"></div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <div className="h-4 w-1/4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
              <div className="h-24 w-full rounded-md bg-neutral-200 dark:bg-neutral-700"></div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="h-4 w-1/3 mb-4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          <div className="aspect-square w-full rounded-md bg-neutral-200 dark:bg-neutral-700"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export default function UpdateProductPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    selectedProduct,
    categories,
    loading,
    fetchProductById,
    fetchCategories,
  } = useProductStore();

  useEffect(() => {
    // In a real Next.js app, params.id would come from the URL
    // For this example, we'll use a hardcoded ID if params.id is not available
    const productId = params?.id || "9608eb35-9897-4f6f-ba4e-c018fc1e3151";

    console.log(`Fetching data for product ID: ${productId}`);
    fetchProductById(productId);
    fetchCategories();

    // Log the fetched data once it's available in the store
    // Note: Zustand updates are async, so we use a subscriber to log the state after it updates.
    const unsubscribe = useProductStore.subscribe((state) => {
      if (state.selectedProduct && state.categories.length > 0) {
        console.log("Product from store:", state.selectedProduct);
        console.log("Categories from store:", state.categories);
        unsubscribe(); // Clean up the subscription after logging
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [params?.id, fetchProductById, fetchCategories]);

  if (loading || !selectedProduct) {
    return <UpdateProductPageSkeleton />;
  }

  return (
    <>
      <PageTitle title={`Edit: ${selectedProduct.name}`} />
      <div className="mt-8">
        <UpdateProductForm product={selectedProduct} categories={categories} />
        <VariantList variants={selectedProduct.variants} />
      </div>
    </>
  );
}
