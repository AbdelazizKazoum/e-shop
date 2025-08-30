"use client";

import React, { useState, FormEvent } from "react";
import {
  Tag,
  Building,
  Percent,
  DollarSign,
  PlusCircle,
  Trash2,
  Pencil,
  UploadCloud,
  X,
} from "lucide-react";
import Image from "next/image";

// --- TYPE DEFINITIONS ---
export interface Category {
  id: string;
  displayText: string;
  category: string;
  imageUrl: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: "active" | "inactive" | "blacklisted";
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

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

const mockSuppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "Global Tech Inc.",
    email: "contact@globaltech.com",
    status: "active",
  },
  {
    id: "sup-2",
    name: "Fashion Forward Ltd.",
    email: "sales@fashionforward.com",
    status: "inactive",
  },
];

const mockOffers: Offer[] = [
  {
    id: "off-1",
    title: "Summer Sale 2025",
    description: "Up to 50% off on all summer apparel.",
    imageUrl: "https://placehold.co/600x300/ef4444/ffffff?text=Summer+Sale",
    isActive: true,
  },
  {
    id: "off-2",
    title: "Tech Bonanza",
    description: "Great deals on the latest electronics.",
    imageUrl: "https://placehold.co/600x300/3b82f6/ffffff?text=Tech+Deals",
    isActive: false,
  },
];

// --- UI COMPONENTS ---

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
      rows={3}
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
  previewUrl,
  size = "w-24 h-24",
}: {
  label: string;
  onFileChange: (file: File | null) => void;
  previewUrl?: string | null;
  size?: string;
}) => {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onFileChange(file);
    } else {
      setPreview(null);
      onFileChange(null);
    }
  };
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 relative overflow-hidden ${size}`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <UploadCloud className="h-8 w-8 text-neutral-400" />
        )}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

const ToggleSwitch = ({
  label,
  enabled,
  setEnabled,
}: {
  label: string;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
      {label}
    </label>
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      className={`${
        enabled ? "bg-primary-500" : "bg-neutral-300 dark:bg-neutral-700"
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
    >
      <span
        className={`${
          enabled ? "translate-x-5" : "translate-x-0"
        } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
);

// --- PARAMETERS PAGE COMPONENTS ---

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
        <ImageUpload
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

// 2. Suppliers Manager
const SupplierForm = ({
  supplier,
  onSave,
  onCancel,
}: {
  supplier?: Supplier | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: supplier?.name || "",
    email: supplier?.email || "",
    status: supplier?.status || "active",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ id: supplier?.id, ...formData });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="my-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border-l-4 border-primary-500"
    >
      <h3 className="font-medium mb-4">
        {supplier ? "Edit Supplier" : "Add New Supplier"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Supplier Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Contact Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blacklisted">Blacklisted</option>
        </Select>
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
          className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white"
        >
          Save
        </button>
      </div>
    </form>
  );
};

const SuppliersManager = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [editingSupplier, setEditingSupplier] = useState<
    Supplier | null | undefined
  >(undefined);

  const handleSave = (data: any) => {
    console.log("Saving supplier:", data);
    setEditingSupplier(undefined);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "inactive":
        return "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300";
      case "blacklisted":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default:
        return "";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Suppliers</h2>
        <button
          onClick={() => setEditingSupplier(null)}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
        >
          <PlusCircle size={18} /> Add New
        </button>
      </div>

      {editingSupplier !== undefined && (
        <SupplierForm
          supplier={editingSupplier}
          onSave={handleSave}
          onCancel={() => setEditingSupplier(undefined)}
        />
      )}

      <div className="space-y-3">
        {suppliers.map((sup) => (
          <div
            key={sup.id}
            className="flex flex-col md:flex-row md:items-center gap-4 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow dark:bg-neutral-800"
          >
            <div className="flex-1">
              <p className="font-medium text-neutral-800 dark:text-neutral-100">
                {sup.name}
              </p>
              <p className="text-sm text-neutral-500">{sup.email}</p>
            </div>
            <div className="flex-shrink-0">
              <span
                className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusColor(
                  sup.status
                )}`}
              >
                {sup.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingSupplier(sup)}
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

// 3. Offers Manager
const OfferForm = ({
  offer,
  onSave,
  onCancel,
}: {
  offer?: Offer | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: offer?.title || "",
    description: offer?.description || "",
    isActive: offer?.isActive === undefined ? true : offer.isActive,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ id: offer?.id, ...formData, imageFile });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="my-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border-l-4 border-primary-500"
    >
      <h3 className="font-medium mb-4">
        {offer ? "Edit Offer" : "Add New Offer"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Input
            label="Offer Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <ToggleSwitch
            label="Active Status"
            enabled={formData.isActive}
            setEnabled={(val) => setFormData({ ...formData, isActive: val })}
          />
        </div>
        <ImageUpload
          label="Offer Image"
          onFileChange={setImageFile}
          previewUrl={offer?.imageUrl}
          size="w-full h-48"
        />
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white"
        >
          Save Offer
        </button>
      </div>
    </form>
  );
};

const OffersManager = () => {
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [editingOffer, setEditingOffer] = useState<Offer | null | undefined>(
    undefined
  );

  const handleSave = (data: any) => {
    console.log("Saving offer:", data);
    setEditingOffer(undefined);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Offers</h2>
        <button
          onClick={() => setEditingOffer(null)}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
        >
          <PlusCircle size={18} /> Add New Offer
        </button>
      </div>

      {editingOffer !== undefined && (
        <OfferForm
          offer={editingOffer}
          onSave={handleSave}
          onCancel={() => setEditingOffer(undefined)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-lg bg-white dark:bg-neutral-800 shadow-sm overflow-hidden group"
          >
            <div className="relative">
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                width={600}
                height={192}
                className="h-48 w-full object-cover"
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    offer.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-neutral-200 text-neutral-800"
                  }`}
                >
                  {offer.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-neutral-800 dark:text-neutral-100">
                {offer.title}
              </h3>
              <p className="text-sm text-neutral-500 mt-1 h-10">
                {offer.description}
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setEditingOffer(offer)}
                  className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500"
                >
                  Edit
                </button>
                <button className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Currency Manager
const CurrencyManager = () => {
  const [currency, setCurrency] = useState("USD");
  const handleSave = () => {
    console.log("Saving currency:", currency);
    alert("Currency saved!");
  };
  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-lg font-medium mb-4">Store Currency</h3>
      <p className="text-sm text-neutral-500 mb-4">
        This is the main currency for your store. Prices will be displayed in
        this currency.
      </p>
      <Select
        label="Select Currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option value="USD">USD - United States Dollar</option>
        <option value="EUR">EUR - Euro</option>
        <option value="GBP">GBP - British Pound</option>
        <option value="JPY">JPY - Japanese Yen</option>
        <option value="MAD">MAD - Moroccan Dirham</option>
      </Select>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-md bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
        >
          Save Currency
        </button>
      </div>
    </div>
  );
};

// --- TABS & MAIN PAGE ---
const tabs = [
  { name: "Categories", icon: Tag, component: CategoriesManager },
  { name: "Suppliers", icon: Building, component: SuppliersManager },
  { name: "Offers", icon: Percent, component: OffersManager },
  { name: "Currency", icon: DollarSign, component: CurrencyManager },
];

export default function ParametersPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const ActiveComponent =
    tabs.find((tab) => tab.name === activeTab)?.component || (() => null);
  return (
    <>
      <PageTitle
        title="Parameters"
        subtitle="Manage your store's core settings"
      />
      <div className="mt-8">
        <div className="mb-6 border-b border-neutral-200 dark:border-neutral-700">
          <nav
            className="-mb-px flex space-x-6 overflow-x-auto"
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={` ${
                  activeTab === tab.name
                    ? "border-primary-500 text-primary-500 dark:text-primary-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:hover:text-neutral-300 dark:hover:border-neutral-500"
                } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap`}
              >
                <tab.icon className="-ml-0.5 mr-2 h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="border rounded-lg nc-dark-box-bg-has-hover p-4 md:p-6">
          <ActiveComponent />
        </div>
      </div>
    </>
  );
}
