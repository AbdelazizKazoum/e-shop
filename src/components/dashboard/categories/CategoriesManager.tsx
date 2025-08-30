import ImageUploadPreview from "@/components/ui/form/ImageUploadPreview";
import Input from "@/components/ui/form/Input";
import { Category } from "@/types/category";
import { Pencil, PlusCircle, Trash2, UploadCloud } from "lucide-react";
import { FormEvent, useState } from "react";

// --- MOCK DATA ---
const mockCategories: Category[] = [
  {
    id: "cat-1",
    displayText: "Electronics",
    category: "electronics",
    imageUrl: "https://placehold.co/100x100/3b82f6/ffffff?text=E",
  },
  {
    id: "cat-2",
    displayText: "Apparel",
    category: "apparel",
    imageUrl: "https://placehold.co/100x100/10b981/ffffff?text=A",
  },
  {
    id: "cat-3",
    displayText: "Books",
    category: "books",
    imageUrl: "https://placehold.co/100x100/f97316/ffffff?text=B",
  },
];

// 1. Categories Manager
const CategoryForm = ({
  category,
  onSave,
  onCancel,
}: {
  category?: Category | null;
  onSave: (data: any) => void;
  onCancel: () => void;
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
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 h-10 w-full justify-center whitespace-nowrap rounded-md bg-primary-500 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

const CategoriesManager = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [editingCategory, setEditingCategory] = useState<
    Category | null | undefined
  >(undefined);

  const handleSave = (data: any) => {
    if (data.id) {
      console.log("Updating category:", data);
      setCategories(
        categories.map((c) =>
          c.id === data.id ? { ...c, displayText: data.displayText } : c
        )
      );
    } else {
      console.log("Adding category:", data);
      const newCategory = {
        id: `cat-${Date.now()}`,
        displayText: data.displayText,
        category: data.displayText.toLowerCase(),
        imageUrl: "https://placehold.co/100x100/e2e8f0/64748b?text=N",
      };
      setCategories([...categories, newCategory]);
    }
    setEditingCategory(undefined);
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
        />
      )}

      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow dark:bg-neutral-800"
          >
            <img
              src={cat.imageUrl}
              alt={cat.displayText}
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
              <button className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesManager;
