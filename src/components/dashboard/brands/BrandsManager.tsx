import ImageUploadPreview from "@/components/ui/form/ImageUploadPreview";
import Input from "@/components/ui/form/Input";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useBrandStore } from "@/stores/brandStore";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Brand } from "@/types/brand";
import Image from "next/image";

// --- Brand Form Component ---
const BrandForm = ({
  brand,
  onSave,
  onCancel,
  loading,
}: {
  brand?: Brand | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}) => {
  const [name, setName] = useState(brand?.name || "");
  const [description, setDescription] = useState(brand?.description || "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      id: brand?.id,
      name,
      description,
      imageFile,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="my-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border-l-4 border-primary-500"
    >
      <h3 className="font-medium mb-4">
        {brand ? "Edit Brand" : "Add New Brand"}
      </h3>
      <div className="flex flex-col md:flex-row items-end gap-4">
        <div className="flex-grow w-full flex flex-col gap-2">
          <Input
            label="Brand Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Nike"
            required
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brand description"
          />
        </div>
        <ImageUploadPreview
          label="Image"
          onFileChange={setImageFile}
          previewUrl={brand?.imageUrl}
        />
        <div className="flex gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 w-full justify-center rounded-md bg-neutral-200 px-4 text-sm font-medium text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`flex items-center gap-2 h-10 w-full justify-center whitespace-nowrap rounded-md bg-primary-500 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

// --- Skeleton Loader Component ---
const BrandSkeleton = () => (
  <div className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-sm animate-pulse dark:bg-neutral-800">
    <div className="h-12 w-12 rounded-md bg-neutral-300 dark:bg-neutral-700" />
    <div className="flex-1 h-5 bg-neutral-300 rounded dark:bg-neutral-700" />
    <div className="flex gap-2">
      <div className="h-6 w-6 rounded bg-neutral-300 dark:bg-neutral-700" />
      <div className="h-6 w-6 rounded bg-red-300 dark:bg-red-700" />
    </div>
  </div>
);

// --- Brands Manager Component ---
const BrandsManager = () => {
  const {
    brands,
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    loading,
    page,
    limit,
    total,
  } = useBrandStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBrand, setEditingBrand] = useState<Brand | null | undefined>(
    undefined
  );
  const [formLoading, setFormLoading] = useState(false);

  // Fetch brands on mount
  useEffect(() => {
    fetchBrands({ page: 1, limit: limit || 10, filter: searchTerm });
  }, [fetchBrands, searchTerm, limit]);

  const handleSave = async (data: any) => {
    setFormLoading(true);
    if (data.id) {
      await updateBrand({
        id: data.id,
        name: data.name,
        description: data.description,
        imageFile: data.imageFile,
      });
    } else {
      await createBrand({
        name: data.name,
        description: data.description,
        imageFile: data.imageFile,
      });
    }
    setFormLoading(false);
    setEditingBrand(undefined);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      await deleteBrand(id);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Manage Brands</h2>
        <div className="flex gap-2 items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by brand name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <button
            onClick={() => setEditingBrand(null)}
            className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
          >
            <PlusCircle size={18} /> Add New
          </button>
        </div>
      </div>
      {/* ...existing code... */}

      {editingBrand !== undefined && (
        <BrandForm
          brand={editingBrand}
          onSave={handleSave}
          onCancel={() => setEditingBrand(undefined)}
          loading={formLoading}
        />
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <BrandSkeleton key={idx} />
          ))}
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
          No brands found. Try adjusting your search or add a new brand.
        </div>
      ) : (
        <div className="space-y-3">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow dark:bg-neutral-800"
            >
              <Image
                src={brand.imageUrl || "/placeholder.png"}
                alt={brand.name || "Brand Image"}
                width={48}
                height={48}
                className="h-12 w-12 rounded-md object-cover"
              />

              <div className="flex-1">
                <p className="font-medium text-neutral-800 dark:text-neutral-100">
                  {brand.name}
                </p>
                {brand.description && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {brand.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingBrand(brand)}
                  className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Pagination */}
      {!loading && total && limit && total > limit && brands.length > 0 && (
        <div className="flex items-center justify-center mt-6 space-x-2">
          <button
            onClick={() =>
              fetchBrands({ page: (page || 1) - 1, limit, filter: searchTerm })
            }
            disabled={page === 1}
            className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="px-4 py-2 text-sm font-medium">
            Page {page} of {Math.ceil(total / limit)}
          </span>
          <button
            onClick={() =>
              fetchBrands({ page: (page || 1) + 1, limit, filter: searchTerm })
            }
            disabled={page === Math.ceil(total / limit)}
            className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandsManager;
