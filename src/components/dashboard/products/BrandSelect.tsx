import { useEffect, useRef, useState } from "react";
import { useBrandStore } from "@/stores/brandStore";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
} from "lucide-react";

interface BrandSelectProps {
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  label?: string;
  disabled?: boolean;
}

const BrandSelect: React.FC<BrandSelectProps> = ({
  value,
  onChange,
  required,
  label = "Brand",
  disabled,
}) => {
  const {
    brands,
    fetchBrands,
    page,
    limit,
    total,
    loading: brandsLoading,
  } = useBrandStore();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBrands({ page: currentPage, limit: 10, filter: search });
  }, [fetchBrands, currentPage, search]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBrands({ page: 1, limit: 10, filter: search });
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const totalPages = Math.max(1, Math.ceil((total ?? 0) / (limit ?? 10)));
  const selectedBrand = brands.find((b) => b.id === value);

  return (
    <div className="w-full max-w-xs" ref={selectRef}>
      <label className="block text-sm font-medium mb-1" htmlFor="brand-select">
        {label}
      </label>
      <button
        type="button"
        id="brand-select"
        className={`relative w-full rounded border px-3 py-2 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          disabled ? "bg-neutral-100 cursor-not-allowed" : "bg-white"
        }`}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        style={{ minWidth: "180px" }}
      >
        <span>{selectedBrand ? selectedBrand.name : "Select a brand"}</span>
        <ChevronDown className="h-4 w-4 text-neutral-400" />
      </button>
      {open && (
        <div
          className="absolute z-10 mt-1 rounded border bg-white shadow-lg"
          style={{ width: "100%", minWidth: "180px", maxWidth: "320px" }}
        >
          <div className="p-2 border-b flex items-center gap-2">
            <Search className="h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 border-none outline-none text-sm"
              disabled={brandsLoading}
              autoFocus
            />
            {brandsLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
            )}
          </div>
          <ul
            className="max-h-60 overflow-y-auto"
            role="listbox"
            aria-labelledby="brand-select"
          >
            {brands.length === 0 && !brandsLoading ? (
              <li className="px-4 py-2 text-sm text-neutral-500">
                No brands found
              </li>
            ) : (
              brands.map((brand) => (
                <li
                  key={brand.id}
                  role="option"
                  aria-selected={value === brand.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-primary-50 ${
                    value === brand.id ? "bg-primary-100 font-semibold" : ""
                  }`}
                  onClick={() => {
                    onChange(brand.id);
                    setOpen(false);
                  }}
                >
                  {brand.name}
                </li>
              ))
            )}
          </ul>
          <div className="flex items-center justify-between px-2 py-1 border-t bg-neutral-50">
            <button
              type="button"
              className="px-2 py-1 border rounded disabled:opacity-50 text-xs"
              disabled={currentPage <= 1 || brandsLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs min-w-[60px] text-center">
              {brands.length > 0 ? `Page ${currentPage} / ${totalPages}` : ""}
            </span>
            <button
              type="button"
              className="px-2 py-1 border rounded disabled:opacity-50 text-xs"
              disabled={
                brandsLoading ||
                currentPage >= totalPages ||
                brands.length === 0
              }
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandSelect;
