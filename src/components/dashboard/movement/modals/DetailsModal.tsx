import { ArrowDown, ArrowUp, Edit, FileText, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

const StockMovementDetailsModal = ({
  movement,
  onClose,
}: {
  movement: any;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useOnClickOutside(modalRef, onClose);

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
      <div
        ref={modalRef}
        className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
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
              <Image
                src={
                  movement.productDetail?.product?.image ||
                  "/placeholder-product.jpg"
                }
                alt={movement.productDetail?.product?.name || "Product"}
                width={64}
                height={64}
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

export default StockMovementDetailsModal;
