import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: "active" | "inactive" | "blacklisted";
}

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

export default SuppliersManager;
