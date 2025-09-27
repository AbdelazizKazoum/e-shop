import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import { StockMovementReason, StockMovementType } from "@/types/stockMovement";
import { ChevronDown, Filter, RefreshCw, Search } from "lucide-react";
import { FormEvent, useState } from "react";

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
      {/* Mobile Layout */}
      <div className="block md:hidden space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by variant ID..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full rounded-md border border-neutral-200 bg-white py-3 pl-10 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-neutral-100 dark:bg-neutral-800 px-4 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 shadow-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-primary-500 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Filter size={18} />
            <span>Filters</span>
            <ChevronDown
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              size={16}
            />
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:justify-between md:items-center">
        {/* Search Input */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by variant ID..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>

        {/* Action Buttons */}
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

      {/* Filter Form (shared between mobile and desktop) */}
      {isOpen && (
        <form
          onSubmit={handleFilterSubmit}
          className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border dark:border-neutral-700/50"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
            <button
              type="reset"
              onClick={() => onFilter({})}
              className="w-full sm:w-auto rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 order-2 sm:order-1"
            >
              Reset
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 order-1 sm:order-2"
            >
              Apply Filters
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FilterHeader;
