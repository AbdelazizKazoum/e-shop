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
import VariantSelect from "@/components/dashboard/movement/VariantSelect";
import {
  StockMovement,
  StockMovementReason,
  StockMovementType,
  Supplier,
  SupplyOrder,
} from "@/types/stockMovement";
import { StockVariant } from "@/types/stock";
import PageTitle from "@/components/dashboard/PageTitle";
import Select from "@/components/ui/form/Select";
import Input from "@/components/ui/form/Input";
import Pagination from "@/components/dashboard/Pagination";
import AddMovementModal from "@/components/dashboard/movement/modals/AddMovementModal";
import { useMovementStore } from "@/stores/movementStore";

// --- MOCK DATA ---
export const mockSuppliers: Supplier[] = [
  { id: "sup-1", name: "Global Tech Inc." },
  { id: "sup-2", name: "Fashion Forward Ltd." },
  { id: "sup-3", name: "Apparel Co." },
];

const mockSupplyOrders: SupplyOrder[] = [
  { id: "so-123", supplier: mockSuppliers[0] },
  { id: "so-456", supplier: mockSuppliers[1] },
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

const StockMovementDetailsModal = ({
  movement,
  onClose,
}: {
  movement: any;
  onClose: () => void;
}) => {
  const typeInfo = (type: string) => {
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
          {/* Product Information */}
          <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <img
                src={
                  movement.productDetail?.product?.image ||
                  "/placeholder-product.jpg"
                }
                alt={movement.productDetail?.product?.name || "Product"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                {movement.productDetail?.product?.name || "Unknown Product"}
              </h3>
              <p className="text-sm text-neutral-500 mt-1">
                {movement.productDetail?.product?.description ||
                  "No description"}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-500">Color:</span>
                  <div
                    className="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-600"
                    style={{
                      backgroundColor: movement.productDetail?.color || "#ccc",
                    }}
                  />
                  <span className="text-xs text-neutral-600 dark:text-neutral-300">
                    {movement.productDetail?.color || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-500">Size:</span>
                  <span className="text-xs bg-neutral-100 dark:bg-neutral-700 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                    {movement.productDetail?.size || "N/A"}
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
                  {new Date(movement.createdAt || Date.now()).toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                Additional Information
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-neutral-500">Variant ID:</span>{" "}
                  <span className="font-mono">
                    {movement.productDetail?.id || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="text-neutral-500">Current Stock:</span>{" "}
                  {movement.productDetail?.qte || 0}
                </p>
                <p>
                  <span className="text-neutral-500">Supplier:</span>{" "}
                  {movement.supplier?.name || "N/A"}
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
  onRefresh,
}: {
  onFilter: (filters: any) => void;
  onSearch: (term: string) => void;
  onRefresh: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filters = Object.fromEntries(formData.entries());
    // Remove empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
    onFilter(cleanFilters);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by variant ID..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 rounded-md bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 shadow-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
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
            <Input
              name="variantId"
              label="Variant ID"
              placeholder="Enter variant ID"
            />
            <Input name="startDate" label="Start Date" type="date" />
            <Input name="endDate" label="End Date" type="date" />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="reset"
              onClick={() => onFilter({})}
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
          <div className="col-span-3 h-5 w-24 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
          <div className="col-span-2 h-5 w-16 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-2 h-5 w-24 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-2 h-5 w-24 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-2 h-5 w-24 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-1 flex justify-end items-center gap-2 mt-2 md:mt-0">
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
  movements: any[];
  onViewMovement: (movement: any) => void;
}) => {
  const typeInfo = (type: string, quantity: number) => {
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
            <ArrowDown size={14} /> -{Math.abs(quantity)}
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
      default:
        return (
          <span
            className={`${baseClasses} bg-neutral-100 text-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300`}
          >
            <FileText size={14} /> {quantity}
          </span>
        );
    }
  };

  if (movements.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText size={48} className="mx-auto text-neutral-400 mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          No stock movements found
        </h3>
        <p className="text-neutral-500">
          No movements match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Row */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 text-sm font-medium text-neutral-500 dark:text-neutral-400 border-b dark:border-neutral-700">
        <div className="col-span-4">Product</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Quantity</div>
        <div className="col-span-2">Reason</div>
        <div className="col-span-1">Date</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Movement Rows */}
      <div className="space-y-4 md:space-y-0">
        {movements.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white dark:bg-neutral-800/50 rounded-lg md:rounded-none md:grid md:grid-cols-12 md:gap-4 md:items-center border-b dark:border-neutral-700/50 last:border-b-0 md:border-b"
          >
            {/* Product Information Column */}
            <div className="md:col-span-4 flex items-center gap-3">
              {/* Product Image */}
              <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={
                    item.productDetail?.product?.image ||
                    "/placeholder-product.jpg"
                  }
                  alt={item.productDetail?.product?.name || "Product"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                  {item.productDetail?.product?.name || "Unknown Product"}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  {/* Color indicator */}
                  <div
                    className="w-3 h-3 rounded-full border border-neutral-300 dark:border-neutral-600"
                    style={{
                      backgroundColor: item.productDetail?.color || "#ccc",
                    }}
                    title={`Color: ${item.productDetail?.color || "Unknown"}`}
                  />

                  {/* Size */}
                  <span className="text-xs bg-neutral-100 dark:bg-neutral-700 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                    {item.productDetail?.size || "N/A"}
                  </span>

                  {/* Variant ID (small) */}
                  <span className="text-xs text-neutral-400 font-mono truncate">
                    #{item.productDetail?.id?.slice(-8) || "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            {/* Type Column */}
            <div className="mt-2 md:mt-0 md:col-span-2 text-sm font-medium capitalize">
              {item.type}
            </div>

            {/* Quantity Column */}
            <div className="mt-2 md:mt-0 md:col-span-2">
              {typeInfo(item.type, item.quantity)}
            </div>

            {/* Reason Column */}
            <div className="mt-2 md:mt-0 md:col-span-2 text-sm text-neutral-600 dark:text-neutral-300 capitalize">
              {item.reason.replace(/_/g, " ")}
            </div>

            {/* Date Column */}
            <div className="mt-2 md:mt-0 md:col-span-1 text-sm text-neutral-500">
              {new Date(item.createdAt || Date.now()).toLocaleDateString()}
            </div>

            {/* Actions Column */}
            <div className="mt-2 md:mt-0 md:col-span-1 flex justify-end">
              <button
                onClick={() => onViewMovement(item)}
                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                title="View details"
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
  const {
    movements,
    loading,
    error,
    currentPage,
    totalMovements,
    totalPages,
    fetchAllMovements,
    setPage,
  } = useMovementStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingMovement, setViewingMovement] = useState<any>(null);

  // Initial data fetch
  useEffect(() => {
    fetchAllMovements();
  }, [fetchAllMovements]);

  // Handle search and filter changes
  useEffect(() => {
    const searchFilters = { ...filters };
    if (searchTerm) {
      searchFilters.variantId = searchTerm;
    }
    fetchAllMovements({ ...searchFilters, page: 1 });
  }, [searchTerm, filters, fetchAllMovements]);

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleRefresh = () => {
    fetchAllMovements({
      ...filters,
      ...(searchTerm && { variantId: searchTerm }),
    });
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleMovementCreated = () => {
    // Refresh the list after creating a new movement
    handleRefresh();
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          Error loading movements: {error}
        </div>
        <button
          onClick={handleRefresh}
          className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <PageTitle
          title="Stock Movements"
          subtitle={`History of all inventory changes (${totalMovements} records)`}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
        >
          <PlusCircle size={18} /> Add Movement
        </button>
      </div>
      <div className="mt-8">
        <FilterHeader
          onFilter={handleFilter}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
        />
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
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
      {isModalOpen && (
        <AddMovementModal
          onClose={() => {
            setIsModalOpen(false);
            handleMovementCreated();
          }}
        />
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
