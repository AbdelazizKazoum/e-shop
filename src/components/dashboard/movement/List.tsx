import { ArrowDown, ArrowUp, Edit, FileText } from "lucide-react";
import Image from "next/image";

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
                <Image
                  src={
                    item.productDetail?.product?.image ||
                    "/placeholder-product.jpg"
                  }
                  alt={item.productDetail?.product?.name || "Product"}
                  width={48}
                  height={48}
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

export default StockMovementList;
