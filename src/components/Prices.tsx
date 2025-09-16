import React, { FC } from "react";

export interface PricesProps {
  className?: string;
  price?: number;
  newPrice?: number;
  contentClass?: string;
}

const Prices: FC<PricesProps> = ({
  className = "",
  price = 33,
  newPrice,
  contentClass = "py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium",
}) => {
  const showDiscount = typeof newPrice === "number" && newPrice < price;

  return (
    <div className={className}>
      <div
        className={`inline-flex items-center border-2 border-green-500 rounded-lg gap-2 ${contentClass}`}
      >
        {showDiscount && (
          <span className="text-slate-400 line-through text-xs">
            ${price.toFixed(2)}
          </span>
        )}
        <span className="text-green-500  !leading-none text-base">
          ${showDiscount ? newPrice!.toFixed(2) : price.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default Prices;
