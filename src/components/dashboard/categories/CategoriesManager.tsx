import ImageUploadPreview from "@/components/ui/form/ImageUploadPreview";
import Input from "@/components/ui/form/Input";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useCategoryStore } from "@/stores/categoryStore";
import type { Category } from "@/types/category";
import Image from "next/image";

// --- Category Form Component ---
const CategoryForm = ({
  category,
  onSave,
  onCancel,
  loading,
}: {
  category?: Category | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}) => {
  const [displayText, setDisplayText] = useState(category?.displayText || "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ id: category?.id, displayText, imageFile });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="my-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border-l-4 border-primary-500"
    >
      <h3 className="font-medium mb-4">
        {category ? "Edit Category" : "Add New Category"}
      </h3>
      <div className="flex flex-col md:flex-row items-end gap-4">
        <div className="flex-grow w-full">
          <Input
            label="Category Name"
            value={displayText}
            onChange={(e) => setDisplayText(e.target.value)}
            placeholder="e.g., Winter Collection"
            required
          />
        </div>
        <ImageUploadPreview
          label="Image"
          onFileChange={setImageFile}
          previewUrl={category?.imageUrl}
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
const CategorySkeleton = () => (
  <div className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-sm animate-pulse dark:bg-neutral-800">
    <div className="h-12 w-12 rounded-md bg-neutral-300 dark:bg-neutral-700" />
    <div className="flex-1 h-5 bg-neutral-300 rounded dark:bg-neutral-700" />
    <div className="flex gap-2">
      <div className="h-6 w-6 rounded bg-neutral-300 dark:bg-neutral-700" />
      <div className="h-6 w-6 rounded bg-red-300 dark:bg-red-700" />
    </div>
  </div>
);

// --- Categories Manager Component ---
const CategoriesManager = () => {
  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
  } = useCategoryStore();
  const [editingCategory, setEditingCategory] = useState<
    Category | null | undefined
  >(undefined);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSave = async (data: any) => {
    setFormLoading(true);
    if (data.id) {
      await updateCategory({
        id: data.id,
        displayText: data.displayText,
        imageFile: data.imageFile,
      });
    } else {
      await createCategory({
        displayText: data.displayText,
        imageFile: data.imageFile,
      });
    }
    setFormLoading(false);
    setEditingCategory(undefined);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Categories</h2>
        <button
          onClick={() => setEditingCategory(null)}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
        >
          <PlusCircle size={18} /> Add New
        </button>
      </div>

      {editingCategory !== undefined && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSave}
          onCancel={() => setEditingCategory(undefined)}
          loading={formLoading}
        />
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <CategorySkeleton key={idx} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow dark:bg-neutral-800"
            >
              <Image
                src={cat.imageUrl || "/placeholder.png"}
                alt={cat.displayText || "Category Image"}
                width={48}
                height={48}
                className="h-12 w-12 rounded-md object-cover"
              />

              <div className="flex-1">
                <p className="font-medium text-neutral-800 dark:text-neutral-100">
                  {cat.displayText}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCategory(cat)}
                  className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesManager;
