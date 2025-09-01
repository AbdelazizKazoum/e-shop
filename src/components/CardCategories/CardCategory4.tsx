"use client";

import React, { FC } from "react";
import NcImage from "@/shared/NcImage/NcImage";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useFilterStore } from "@/stores/filterStore";

export interface CardCategory4Props {
  className?: string;
  featuredImage: StaticImageData | string;
  bgSVG: string;
  name: string; // 👈 category name
  desc: string;
  color?: string;
  count?: number;
}

const CardCategory4: FC<CardCategory4Props> = ({
  className = "",
  featuredImage,
  bgSVG,
  name,
  desc,
  color,
  count,
}) => {
  const router = useRouter();

  // ✅ Select them separately (prevents infinite render loops)
  const categories = useFilterStore((state) => state.categories);
  const setCategories = useFilterStore((state) => state.setCategories);

  const handleSeeCollection = () => {
    // 👇 Add category only if not already included
    if (!categories.includes(name)) {
      setCategories([...categories, name]);
    }
    router.push("/search");
  };

  return (
    <div
      className={`nc-CardCategory4 relative w-full aspect-w-12 aspect-h-11 h-0 rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 group hover:nc-shadow-lg transition-shadow ${className}`}
    >
      <div>
        <div className="absolute bottom-0 right-0 max-w-[280px] opacity-80">
          <Image src={bgSVG} alt="" />
        </div>

        <div className="absolute inset-5 sm:inset-8 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <NcImage
              alt=""
              src={featuredImage}
              containerClassName={`w-20 h-20 rounded-full overflow-hidden z-0 ${color}`}
              width={80}
              height={80}
            />
            <span className="text-xs text-slate-700 dark:text-neutral-300 font-medium">
              {count} products
            </span>
          </div>

          <div>
            <span className="block mb-2 text-sm text-slate-500 dark:text-slate-400">
              {desc}
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold">{name}</h2>
          </div>

          <button
            onClick={handleSeeCollection}
            className="flex items-center text-sm font-medium group-hover:text-primary-500 transition-colors"
          >
            <span>See Collection</span>
            <ArrowRightIcon className="w-4 h-4 ml-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardCategory4;
