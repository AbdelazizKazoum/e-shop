import React, { FC } from "react";
import NcImage from "@/shared/NcImage/NcImage";
import Link from "next/link";
import { StaticImageData } from "next/image";
import { useFilterStore } from "@/stores/filterStore"; // 👈 import

export interface CardCategory2Props {
  className?: string;
  ratioClass?: string;
  bgClass?: string;
  featuredImage?: string | StaticImageData;
  name: string;
  desc: string;
}

const CardCategory2: FC<CardCategory2Props> = ({
  className = "",
  ratioClass = "aspect-w-1 aspect-h-1",
  bgClass = "bg-orange-50",
  featuredImage = ".",
  name,
  desc,
}) => {
  // Handler to set category filter before navigation
  const handleClick = () => {
    if (name) {
      useFilterStore.getState().setCategories([name]);
    }
  };

  return (
    <Link
      href={"/filter"}
      className={`nc-CardCategory2 ${className}`}
      data-nc-id="CardCategory2"
      onClick={handleClick} // 👈 add handler
    >
      <div
        className={`flex-1 relative w-full h-0 rounded-full overflow-hidden group ${ratioClass} ${bgClass}`}
      >
        <div className="transform group-hover:scale-105 transition-transform duration-300">
          <NcImage
            alt=""
            containerClassName="w-full h-full flex justify-center"
            src={featuredImage}
            className="object-cover rounded-full"
            sizes="400px"
            height={400}
            width={400}
          />
        </div>
        <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity rounded-full"></span>
      </div>
      <div className="mt-4 flex-1 text-center">
        <h2 className="text-base sm:text-lg text-neutral-900 dark:text-neutral-100 font-semibold">
          {name}
        </h2>
        <span className="block mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {desc}
        </span>
      </div>
    </Link>
  );
};

export default CardCategory2;
