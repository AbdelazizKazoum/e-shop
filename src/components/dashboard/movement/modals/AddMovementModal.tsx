import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import VariantSelect from "../VariantSelect";
import { FormEvent, useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import {
  StockMovementReason,
  StockMovementType,
  Supplier,
  SupplyOrder,
} from "@/types/stockMovement";
import { useMovementStore } from "@/stores/movementStore";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

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

const AddMovementModal = ({ onClose }: { onClose: () => void }) => {
  const { createNewMovement, loading } = useMovementStore();
  const [selectedVariantId, setSelectedVariantId] = useState<
    string | undefined
  >(undefined);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const modalRef = useRef<HTMLFormElement>(null);

  // Close modal when clicking outside (only when not loading)
  useOnClickOutside(modalRef, () => {
    if (!loading) {
      onClose();
    }
  });

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) {
      alert("Please select a product variant.");
      return;
    }

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      variantId: selectedVariantId,
      type: formData.get("type") as string,
      quantity: parseInt(formData.get("quantity") as string),
      reason: formData.get("reason") as string,
      supplierId: (formData.get("supplierId") as string) || undefined,
      supplierOrderId: (formData.get("supplierOrderId") as string) || undefined,
      note: (formData.get("note") as string) || undefined,
    };

    try {
      await createNewMovement(data);
      onClose();
    } catch (error) {
      // Error is already handled by the store (toast notification)
      console.error("Failed to create movement:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <form
        ref={modalRef}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-lg"
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700">
          <h2 className="text-lg font-semibold">New Stock Movement</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
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
            disabled={loading}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              name="type"
              label="Movement Type"
              required
              disabled={loading}
            >
              {Object.values(StockMovementType).map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </Select>
            <Input
              name="quantity"
              label="Quantity"
              type="number"
              required
              disabled={loading}
            />
          </div>
          <Select name="reason" label="Reason" required disabled={loading}>
            {Object.values(StockMovementReason).map((r) => (
              <option key={r} value={r} className="capitalize">
                {r.replace(/_/g, " ")}
              </option>
            ))}
          </Select>
          <Select
            name="supplierId"
            label="Supplier (Optional)"
            disabled={loading}
          >
            <option value="">None</option>
            {mockSuppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Select
            name="supplierOrderId"
            label="Supply Order (Optional)"
            disabled={loading}
          >
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
            disabled={loading}
          />
        </div>
        <div className="flex justify-end p-4 bg-neutral-50 dark:bg-neutral-800/50 border-t dark:border-neutral-700">
          <button
            type="submit"
            disabled={loading || !selectedVariantId}
            className="rounded-md bg-primary-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Saving..." : "Save Movement"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMovementModal;
