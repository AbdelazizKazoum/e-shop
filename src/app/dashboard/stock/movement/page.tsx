"use client";

import React, { useState, useEffect, FormEvent, useMemo, useRef } from "react";
import {
  ChevronDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  RefreshCw,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  X,
  User,
  Tag as TagIcon,
  FileText,
  Building,
} from "lucide-react";
import VariantSelect from "@/components/dashboard/stock/VariantSelect";

// --- TYPE DEFINITIONS & ENUMS ---
export enum StockMovementType {
  ADD = "add",
  REMOVE = "remove",
  CORRECTION = "correction",
}

export enum StockMovementReason {
  SUPPLIER_DELIVERY = "supplier_delivery",
  INVENTORY_CORRECTION = "inventory_correction",
  CUSTOMER_RETURN = "customer_return",
  MANUAL_ADJUSTMENT = "manual_adjustment",
}

export interface Supplier {
  id: string;
  name: string;
}

export interface SupplyOrder {
  id: string;
  supplier: Supplier;
}

export interface StockProduct {
  id: string;
  name: string;
  image: string;
}

export interface StockVariant {
  id: string;
  color: string;
  size: string;
  product: StockProduct;
}

export interface StockMovement {
  id: string;
  productDetail: StockVariant;
  type: StockMovementType;
  quantity: number;
  reason: StockMovementReason;
  note?: string;
  supplier?: Supplier | null;
  supplierOrder?: SupplyOrder | null;
  createdAt: string;
}

// --- MOCK DATA ---
const mockSuppliers: Supplier[] = [
  { id: "sup-1", name: "Global Tech Inc." },
  { id: "sup-2", name: "Fashion Forward Ltd." },
  { id: "sup-3", name: "Apparel Co." },
];

const mockSupplyOrders: SupplyOrder[] = [
  { id: "so-123", supplier: mockSuppliers[0] },
  { id: "so-456", supplier: mockSuppliers[1] },
];

const mockVariantsForSearch: StockVariant[] = [
  {
    id: "var-1",
    color: "#417505",
    size: "L",
    product: {
      id: "prod-1",
      name: "PC Gamer Ultra",
      image: "https://placehold.co/100x100/1e293b/ffffff?text=PC",
    },
  },
  {
    id: "var-2",
    color: "#ff0000",
    size: "M",
    product: {
      id: "prod-1",
      name: "PC Gamer Ultra",
      image: "https://placehold.co/100x100/1e293b/ffffff?text=PC",
    },
  },
  {
    id: "var-3",
    color: "#ffffff",
    size: "XL",
    product: {
      id: "prod-2",
      name: "Pro Smartphone",
      image: "https://placehold.co/100x100/3b82f6/ffffff?text=Phone",
    },
  },
  {
    id: "var-4",
    color: "#000000",
    size: "S",
    product: {
      id: "prod-3",
      name: "Classic Hoodie",
      image: "https://placehold.co/100x100/8b5cf6/ffffff?text=Hoodie",
    },
  },
  {
    id: "var-5",
    color: "#fde047",
    size: "XXL",
    product: {
      id: "prod-4",
      name: "Summer T-Shirt",
      image: "https://placehold.co/100x100/f59e0b/ffffff?text=Tee",
    },
  },
];

const mockStockMovements: StockMovement[] = [
  {
    id: "sm-1",
    productDetail: mockVariantsForSearch[0],
    type: StockMovementType.ADD,
    quantity: 50,
    reason: StockMovementReason.SUPPLIER_DELIVERY,
    supplier: mockSuppliers[0],
    supplierOrder: mockSupplyOrders[0],
    createdAt: "2025-09-10T09:20:29.247Z",
  },
  {
    id: "sm-2",
    productDetail: mockVariantsForSearch[1],
    type: StockMovementType.ADD,
    quantity: 30,
    reason: StockMovementReason.SUPPLIER_DELIVERY,
    supplier: mockSuppliers[0],
    supplierOrder: mockSupplyOrders[0],
    createdAt: "2025-09-09T11:15:10.366Z",
  },
  {
    id: "sm-3",
    productDetail: mockVariantsForSearch[2],
    type: StockMovementType.REMOVE,
    quantity: 2,
    reason: StockMovementReason.MANUAL_ADJUSTMENT,
    note: "Damaged item",
    createdAt: "2025-09-08T14:30:10.359Z",
  },
  {
    id: "sm-4",
    productDetail: mockVariantsForSearch[3],
    type: StockMovementType.ADD,
    quantity: 100,
    reason: StockMovementReason.SUPPLIER_DELIVERY,
    supplier: mockSuppliers[1],
    supplierOrder: mockSupplyOrders[1],
    createdAt: "2025-09-07T18:00:00.000Z",
  },
  {
    id: "sm-5",
    productDetail: mockVariantsForSearch[4],
    type: StockMovementType.ADD,
    quantity: 5,
    reason: StockMovementReason.CUSTOMER_RETURN,
    createdAt: "2025-09-06T10:00:00.000Z",
  },
  {
    id: "sm-6",
    productDetail: mockVariantsForSearch[2],
    type: StockMovementType.CORRECTION,
    quantity: -1,
    reason: StockMovementReason.INVENTORY_CORRECTION,
    note: "Stock count mismatch",
    createdAt: "2025-09-05T09:00:00.000Z",
  },
];

// --- HOOKS ---
const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      if (!el || el.contains(event.target as Node)) return;
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
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
>(({ label, id, ...props }, ref) => (
  <div>
    {label && (
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
      </label>
    )}
    <input
      id={id}
      ref={ref}
      {...props}
      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
    />
  </div>
));
Input.displayName = "Input";

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

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) for (let i = 1; i <= totalPages; i++) pages.push(i);
    else {
      if (currentPage <= 3) pages.push(1, 2, 3, 4, "...", totalPages);
      else if (currentPage >= totalPages - 2)
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      else
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
    }
    return pages;
  };
  return (
    <div className="flex items-center justify-center mt-6 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50"
      >
        <ChevronLeft size={20} />
      </button>
      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentPage === page
                ? "bg-primary-500 text-white"
                : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-4 py-2 text-sm">
            ...
          </span>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

const AddMovementModal = ({ onClose }: { onClose: () => void }) => {
  const [selectedVariantId, setSelectedVariantId] = useState<
    string | undefined
  >(undefined);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // Fetch the full variant object when selectedVariantId changes
  useEffect(() => {
    if (!selectedVariantId) {
      setSelectedVariant(null);
      return;
    }
    // Optionally, you can fetch the full variant details here if needed.
    // For now, just set the ID.
    setSelectedVariant({ id: selectedVariantId });
  }, [selectedVariantId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) {
      alert("Please select a product variant.");
      return;
    }
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      variantId: selectedVariantId,
      type: formData.get("type"),
      quantity: formData.get("quantity"),
      reason: formData.get("reason"),
      supplierId: formData.get("supplierId") || undefined,
      supplierOrderId: formData.get("supplierOrderId") || undefined,
      note: formData.get("note") || undefined,
    };
    console.log("New Stock Movement:", data);
    alert("New movement logged! (Check console)");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-lg"
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700">
          <h2 className="text-lg font-semibold">New Stock Movement</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <VariantSelect
            value={selectedVariantId}
            onChange={setSelectedVariantId}
            label="Product Variant"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select name="type" label="Movement Type" required>
              {Object.values(StockMovementType).map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </Select>
            <Input name="quantity" label="Quantity" type="number" required />
          </div>
          <Select name="reason" label="Reason" required>
            {Object.values(StockMovementReason).map((r) => (
              <option key={r} value={r} className="capitalize">
                {r.replace(/_/g, " ")}
              </option>
            ))}
          </Select>
          <Select name="supplierId" label="Supplier (Optional)">
            <option value="">None</option>
            {mockSuppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Select name="supplierOrderId" label="Supply Order (Optional)">
            <option value="">None</option>
            {mockSupplyOrders.map((so) => (
              <option key={so.id} value={so.id}>
                {so.id} ({so.supplier.name})
              </option>
            ))}
          </Select>
          <Input
            name="note"
            label="Notes (Optional)"
            placeholder="e.g., Damaged box"
          />
        </div>
        <div className="flex justify-end p-4 bg-neutral-50 dark:bg-neutral-800/50 border-t dark:border-neutral-700">
          <button
            type="submit"
            className="rounded-md bg-primary-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600"
          >
            Save Movement
          </button>
        </div>
      </form>
    </div>
  );
};

const StockMovementDetailsModal = ({
  movement,
  onClose,
}: {
  movement: StockMovement;
  onClose: () => void;
}) => {
  const typeInfo = (type: StockMovementType) => {
    switch (type) {
      case "add":
        return {
          text: "Add",
          color: "text-green-800 dark:text-green-200",
          bgColor: "bg-green-100 dark:bg-green-900/50",
          icon: <ArrowUp size={20} />,
        };
      case "remove":
        return {
          text: "Remove",
          color: "text-red-800 dark:text-red-200",
          bgColor: "bg-red-100 dark:bg-red-900/50",
          icon: <ArrowDown size={20} />,
        };
      case "correction":
        return {
          text: "Correction",
          color: "text-blue-800 dark:text-blue-200",
          bgColor: "bg-blue-100 dark:bg-blue-900/50",
          icon: <Edit size={20} />,
        };
      default:
        return {
          text: "Unknown",
          color: "text-neutral-800 dark:text-neutral-200",
          bgColor: "bg-neutral-100 dark:bg-neutral-900/50",
          icon: <FileText size={20} />,
        };
    }
  };

  const movementDisplay = typeInfo(movement.type);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700">
          <div>
            <h2 className="text-lg font-semibold">Movement Details</h2>
            <p className="text-sm text-neutral-500 font-mono">{movement.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Product Info */}
          <div>
            <h3 className="font-medium mb-2 text-neutral-700 dark:text-neutral-300">
              Product Variant
            </h3>
            <div className="flex items-center gap-4 p-3 rounded-md bg-neutral-50 dark:bg-neutral-800 border dark:border-neutral-200 dark:border-neutral-700">
              <img
                src={movement.productDetail.product.image}
                alt={movement.productDetail.product.name}
                className="w-16 h-16 rounded-md object-cover"
              />
              <div>
                <p className="font-semibold">
                  {movement.productDetail.product.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <span>Size: {movement.productDetail.size}</span>
                  <span className="flex items-center gap-1.5">
                    / Color:
                    <span
                      className="h-4 w-4 rounded-full border border-neutral-300"
                      style={{ backgroundColor: movement.productDetail.color }}
                    ></span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Movement Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                Movement Details
              </h3>
              <div className="space-y-3 text-sm">
                <div
                  className={`inline-flex items-center gap-3 rounded-lg px-4 py-2 ${movementDisplay.bgColor} ${movementDisplay.color}`}
                >
                  {movementDisplay.icon}
                  <span className="font-bold text-xl">
                    {movement.quantity > 0 ? "+" : ""}
                    {movement.quantity}
                  </span>
                  <span className="text-sm capitalize font-semibold">
                    {movementDisplay.text}
                  </span>
                </div>
                <p className="capitalize">
                  <span className="text-neutral-500">Reason:</span>{" "}
                  {movement.reason.replace(/_/g, " ")}
                </p>
                <p>
                  <span className="text-neutral-500">Date:</span>{" "}
                  {new Date(movement.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                Source & Context
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-neutral-500">Supplier:</span>{" "}
                  {movement.supplier?.name || "N/A"}
                </p>
                <p>
                  <span className="text-neutral-500">Supply Order:</span>{" "}
                  <span className="font-mono">
                    {movement.supplierOrder?.id || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="text-neutral-500">Note:</span>{" "}
                  {movement.note || "None"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 bg-neutral-50 dark:bg-neutral-800/50 border-t dark:border-neutral-700">
          <button
            onClick={onClose}
            className="rounded-md bg-primary-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterHeader = ({
  onFilter,
  onSearch,
}: {
  onFilter: (filters: any) => void;
  onSearch: (term: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filters = Object.fromEntries(formData.entries());
    onFilter(filters);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by product name..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Filter size={16} />
          <span>Filters</span>
          <ChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            size={16}
          />
        </button>
      </div>
      {isOpen && (
        <form
          onSubmit={handleFilterSubmit}
          className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border dark:border-neutral-700/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select name="type" label="Movement Type">
              <option value="">All</option>
              {Object.values(StockMovementType).map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </Select>
            <Select name="reason" label="Reason">
              <option value="">All</option>
              {Object.values(StockMovementReason).map((r) => (
                <option key={r} value={r} className="capitalize">
                  {r.replace(/_/g, " ")}
                </option>
              ))}
            </Select>
            <Select name="supplierId" label="Supplier">
              <option value="">All</option>
              {mockSuppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
            <Input name="startDate" label="Start Date" type="date" />
            <Input name="endDate" label="End Date" type="date" />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="reset"
              className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
            >
              Apply
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const StockMovementListSkeleton = () => (
  <div className="animate-pulse">
    <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 mb-2">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded col-span-2"
        ></div>
      ))}
    </div>
    <div className="space-y-4 md:space-y-0">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg md:grid md:grid-cols-12 items-center gap-4"
        >
          <div className="col-span-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-300 dark:bg-neutral-600 rounded-md"></div>
            <div className="space-y-2 flex-1">
              <div className="h-5 w-3/4 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
              <div className="h-4 w-1/2 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
            </div>
          </div>
          <div className="col-span-2 h-5 w-16 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-2 h-5 w-24 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-2 h-5 w-24 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-2 flex justify-end items-center gap-2 mt-2 md:mt-0">
            <div className="w-8 h-8 bg-neutral-300 dark:bg-neutral-600 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StockMovementList = ({
  movements,
  onViewMovement,
}: {
  movements: StockMovement[];
  onViewMovement: (movement: StockMovement) => void;
}) => {
  const typeInfo = (type: StockMovementType, quantity: number) => {
    const baseClasses =
      "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium";
    switch (type) {
      case "add":
        return (
          <span
            className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`}
          >
            <ArrowUp size={14} /> +{quantity}
          </span>
        );
      case "remove":
        return (
          <span
            className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`}
          >
            <ArrowDown size={14} /> -{quantity}
          </span>
        );
      case "correction":
        return (
          <span
            className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300`}
          >
            <Edit size={14} /> {quantity > 0 ? `+${quantity}` : quantity}
          </span>
        );
    }
  };

  return (
    <div>
      <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 text-sm font-medium text-neutral-500 dark:text-neutral-400 border-b dark:border-neutral-700">
        <div className="col-span-4">Product</div>
        <div className="col-span-2">Quantity</div>
        <div className="col-span-2">Reason</div>
        <div className="col-span-2">Supplier</div>
        <div className="col-span-1">Date</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>
      <div className="space-y-4 md:space-y-0">
        {movements.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white dark:bg-neutral-800/50 rounded-lg md:rounded-none md:grid md:grid-cols-12 md:gap-4 md:items-center border-b dark:border-neutral-700/50 last:border-b-0 md:border-b"
          >
            <div className="md:col-span-4 flex items-center gap-3">
              <img
                src={item.productDetail.product.image}
                alt={item.productDetail.product.name}
                className="h-10 w-10 rounded-md object-cover bg-neutral-100 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-medium text-neutral-800 dark:text-neutral-100 truncate">
                  {item.productDetail.product.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <span>{item.productDetail.size}</span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-3 w-3 rounded-full border border-neutral-300"
                      style={{ backgroundColor: item.productDetail.color }}
                    ></span>
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 md:mt-0 md:col-span-2">
              {typeInfo(item.type, item.quantity)}
            </div>
            <div className="mt-2 md:mt-0 md:col-span-2 text-sm text-neutral-600 dark:text-neutral-300 capitalize">
              {item.reason.replace(/_/g, " ")}
            </div>
            <div className="mt-2 md:mt-0 md:col-span-2 text-sm text-neutral-500">
              {item.supplier?.name || "N/A"}
            </div>
            <div className="mt-2 md:mt-0 md:col-span-1 text-sm text-neutral-500">
              {new Date(item.createdAt).toLocaleDateString()}
            </div>
            <div className="mt-2 md:mt-0 md:col-span-1 flex justify-end">
              <button
                onClick={() => onViewMovement(item)}
                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <FileText size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function StockMovementsPage() {
  const [loading, setLoading] = useState(true);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingMovement, setViewingMovement] = useState<StockMovement | null>(
    null
  );

  const limit = 5;

  const filteredMovements = useMemo(() => {
    return mockStockMovements.filter((item) => {
      const search = searchTerm.toLowerCase();
      const productName = item.productDetail.product.name.toLowerCase();
      const matchesSearch = productName.includes(search);
      const matchesType = !filters.type || item.type === filters.type;
      const matchesReason = !filters.reason || item.reason === filters.reason;
      const matchesSupplier =
        !filters.supplierId || item.supplier?.id === filters.supplierId;
      return matchesSearch && matchesType && matchesReason && matchesSupplier;
    });
  }, [searchTerm, filters]);

  const total = filteredMovements.length;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const paginatedItems = filteredMovements.slice(
        (currentPage - 1) * limit,
        currentPage * limit
      );
      setMovements(paginatedItems);
      setLoading(false);
    }, 500);
  }, [currentPage, filteredMovements]);

  const handleFilter = (newFilters: any) => {
    setCurrentPage(1);
    setFilters(newFilters);
  };
  const handleSearch = (term: string) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <PageTitle
          title="Stock Movements"
          subtitle={`History of all inventory changes (${total} records)`}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
        >
          <PlusCircle size={18} /> Add Movement
        </button>
      </div>
      <div className="mt-8">
        <FilterHeader onFilter={handleFilter} onSearch={handleSearch} />
        <div className="nc-box-has-hover nc-dark-box-bg-has-hover p-0 md:p-6">
          {loading ? (
            <StockMovementListSkeleton />
          ) : (
            <StockMovementList
              movements={movements}
              onViewMovement={setViewingMovement}
            />
          )}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
      {isModalOpen && (
        <AddMovementModal onClose={() => setIsModalOpen(false)} />
      )}
      {viewingMovement && (
        <StockMovementDetailsModal
          movement={viewingMovement}
          onClose={() => setViewingMovement(null)}
        />
      )}
    </>
  );
}
