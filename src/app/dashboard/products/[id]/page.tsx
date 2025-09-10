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
import { Product, Variant } from "@/types/product";
import Image from "next/image";
import { Category } from "@/types/category";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import Input from "@/components/ui/form/Input";

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
            <Image
              src={preview}
              alt="Preview"
              width={400}
              height={400}
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

  const { loading, updateProduct } = useProductStore();

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      categoryId: formData.category.id,
      imageFile: newMainImage ?? undefined, // only send if new image uploaded
    };

    try {
      // @ts-ignore
      await updateProduct(submissionData); // call store action
    } catch (err) {
      console.error("❌ Failed to update product:", err);
    }
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
              initialPreview={formData.image as string}
              onFileChange={setNewMainImage}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
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

  const { updateVariant, loading } = useProductStore();

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const submissionData = {
      color: formData.color,
      size: formData.size,
      qte: formData.qte,
      deletedImages: deletedImageIds,
    };
    try {
      // @ts-ignore
      await updateVariant(formData.id, submissionData, newImageFiles);
      // onSave(submissionData);
    } catch (err) {
      console.error("Failed to update variant:", err);
    }
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
              <Image
                src={img.image}
                alt="variant"
                width={80}
                height={80}
                className="h-full w-full rounded-md object-cover"
              />
              <button
                type="button"
                // @ts-ignore
                onClick={() => handleDeleteImage(img.id)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {newImagePreviews.map((preview, index) => (
            <div key={index} className="relative h-20 w-20">
              <Image
                src={preview}
                alt="new preview"
                width={80}
                height={80}
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
          disabled={loading}
          className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Variant"}
        </button>
      </div>
    </form>
  );
};

// --- ADD VARIANT FORM ---
const AddVariantForm = ({
  onSave,
  onCancel,
}: {
  onSave: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    color: "#ffffff",
    size: "M",
    qte: 10,
  });
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const { loading } = useProductStore();

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      qte: Number(formData.qte),
      images: newImageFiles,
    };

    console.log("🚀 New Variant Data:", submissionData);
    // You can call your createVariant store action here
    onSave(submissionData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 my-2 bg-green-50 dark:bg-neutral-900 rounded-md border-l-4 border-green-500"
    >
      <h3 className="text-md font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
        Add New Variant
      </h3>
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
        <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Images
        </label>
        <div className="flex flex-wrap gap-2">
          {newImagePreviews.map((preview, index) => (
            <div key={index} className="relative h-20 w-20">
              <Image
                src={preview}
                alt="new preview"
                width={80}
                height={80}
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
              accept="image/*"
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
          disabled={loading}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Variant"}
        </button>
      </div>
    </form>
  );
};

// --- VARIANT LIST ---
const VariantList = ({ variants }: { variants: Variant[] }) => {
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<string | null>(null);

  const {
    createSingleVariant,
    selectedProduct,
    fetchProductById,
    deleteVariant,
    loading,
  } = useProductStore();

  const handleDeleteVariant = (variantId: string) => {
    setVariantToDelete(variantId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (variantToDelete) {
      await deleteVariant(variantToDelete);
      if (selectedProduct?.id) {
        await fetchProductById(selectedProduct.id);
      }
    }
    setShowDeleteModal(false);
    setVariantToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setVariantToDelete(null);
  };

  const handleSaveNewVariant = async (data: any) => {
    if (!selectedProduct?.id) return;
    await createSingleVariant(selectedProduct.id, data);
    await fetchProductById(selectedProduct.id);
    setShowAddForm(false);
  };

  return (
    <div className="mt-8 p-6 bg-white dark:bg-neutral-800/50 rounded-lg border border-neutral-200/70 dark:border-neutral-700/50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Variants</h2>
      </div>

      {showAddForm && (
        <AddVariantForm
          onSave={handleSaveNewVariant}
          onCancel={() => setShowAddForm(false)}
        />
      )}

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
                <Image
                  src={
                    variant.images[0]?.image ||
                    "https://placehold.co/100x100/e2e8f0/64748b?text=N/A"
                  }
                  alt="variant"
                  width={48}
                  height={48}
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
      {!showAddForm && (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex mt-3 items-center gap-2 rounded-md border border-primary-600 bg-white px-4 py-2 text-sm font-medium text-primary-600 shadow-sm hover:bg-primary-50 dark:bg-neutral-900 dark:border-neutral-700"
        >
          <PlusCircle className="h-5 w-5" />
          Add Another Variant
        </button>
      )}

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-100">
              Delete Variant
            </h3>
            <p className="mb-6 text-neutral-600 dark:text-neutral-300">
              Are you sure you want to delete this variant? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
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
    const productId = params?.id;
    if (productId) {
      console.log(`Fetching data for product ID: ${productId}`);
      fetchProductById(productId);
      fetchCategories();
    }
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
