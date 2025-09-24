import { useEffect, useRef, useState, memo } from "react";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
} from "lucide-react";
import { getVariantsByProductName } from "@/services/movementService";

interface VariantSelectProps {
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  label?: string;
  disabled?: boolean;
}

const VariantDropdown = memo(function VariantDropdown({
  open,
  setOpen,
  value,
  onChange,
  variants,
  loading,
  pendingSearch,
  setPendingSearch,
  onSearch,
  currentPage,
  setCurrentPage,
  total,
  limit,
}: any) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const totalPages = Math.max(1, Math.ceil((total ?? 0) / (limit ?? 10)));

  return (
    <div
      className={`absolute w-full z-10 mt-1 rounded border bg-white shadow-lg`}
      style={{ display: open ? "block" : "none" }}
    >
      <div className="p-2 border-b flex items-center gap-2">
        <Search className="h-4 w-4 text-neutral-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search product name..."
          value={pendingSearch}
          onChange={(e) => setPendingSearch(e.target.value)}
          className="w-full px-2 py-1 border-none outline-none text-sm rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSearch();
            }
          }}
        />
        <button
          type="button"
          className="ml-2 px-2 py-1 rounded bg-primary-500 text-white text-xs hover:bg-primary-600 transition"
          onClick={onSearch}
          disabled={loading}
        >
          Search
        </button>
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
        )}
      </div>
      <ul
        className="max-h-60 overflow-y-auto"
        role="listbox"
        aria-labelledby="variant-select"
      >
        {variants.length === 0 && !loading ? (
          <li className="px-4 py-2 text-sm text-neutral-500">
            No variants found
          </li>
        ) : (
          variants.map((variant: any) => (
            <li
              key={variant.id}
              role="option"
              aria-selected={value === variant.id}
              className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-primary-50 transition ${
                value === variant.id ? "bg-primary-100 font-semibold" : ""
              }`}
              onClick={() => {
                onChange(variant.id);
                setOpen(false);
              }}
            >
              <img
                src={variant.product?.image}
                alt={variant.product?.name}
                className="w-8 h-8 rounded object-cover border"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="truncate text-sm font-medium">
                  {variant.product?.name}
                </span>
                <span className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <span
                      className="inline-block w-4 h-4 rounded-full border"
                      style={{ backgroundColor: variant.color }}
                    />
                    <span className="uppercase">{variant.size}</span>
                  </span>
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
      <div className="flex items-center justify-between px-2 py-1 border-t bg-neutral-50">
        <button
          type="button"
          className="px-2 py-1 border rounded disabled:opacity-50 text-xs"
          disabled={currentPage <= 1 || loading}
          onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs min-w-[60px] text-center">
          {variants.length > 0 ? `Page ${currentPage} / ${totalPages}` : ""}
        </span>
        <button
          type="button"
          className="px-2 py-1 border rounded disabled:opacity-50 text-xs"
          disabled={
            loading || currentPage >= totalPages || variants.length === 0
          }
          onClick={() =>
            setCurrentPage((p: number) => Math.min(totalPages, p + 1))
          }
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});

const VariantSelect: React.FC<VariantSelectProps> = ({
  value,
  onChange,
  required,
  label = "Variant",
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const [pendingSearch, setPendingSearch] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [variants, setVariants] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);

  // Fetch variants when search/page changes
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getVariantsByProductName({ productName: search, page: currentPage, limit })
      .then((res: any) => {
        if (ignore) return;
        setVariants(res.data?.data || []);
        setTotal(res.data?.total || 0);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [search, currentPage, limit]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
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

  const selectedVariant = variants.find((v) => v.id === value);

  const handleSearch = () => {
    setSearch(pendingSearch);
    setCurrentPage(1);
  };

  return (
    <div className="w-full relative" ref={selectRef}>
      <label
        className="block text-sm font-medium mb-1"
        htmlFor="variant-select"
      >
        {label}
      </label>
      <button
        type="button"
        id="variant-select"
        className={`relative w-full rounded border px-3 py-2 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          disabled ? "bg-neutral-100 cursor-not-allowed" : "bg-white"
        }`}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        style={{ minWidth: "220px" }}
      >
        {selectedVariant ? (
          <span className="flex items-center gap-3 min-w-0">
            <img
              src={selectedVariant.product?.image}
              alt={selectedVariant.product?.name}
              className="w-8 h-8 rounded object-cover border"
            />
            <span className="flex flex-col min-w-0">
              <span className="truncate text-sm font-medium">
                {selectedVariant.product?.name}
              </span>
              <span className="flex items-center gap-2 text-xs text-neutral-500">
                <span
                  className="inline-block w-4 h-4 rounded-full border"
                  style={{ backgroundColor: selectedVariant.color }}
                />
                <span className="uppercase">{selectedVariant.size}</span>
              </span>
            </span>
          </span>
        ) : (
          <span className="text-neutral-400">Select a variant</span>
        )}
        <ChevronDown className="h-4 w-4 text-neutral-400 ml-auto" />
      </button>
      <VariantDropdown
        open={open}
        setOpen={setOpen}
        value={value}
        onChange={onChange}
        variants={variants}
        loading={loading}
        pendingSearch={pendingSearch}
        setPendingSearch={setPendingSearch}
        onSearch={handleSearch}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        total={total}
        limit={limit}
      />
    </div>
  );
};

export default VariantSelect;
