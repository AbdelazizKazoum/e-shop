"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import Heading from "@/components/Heading/Heading";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import CardCategory2 from "@/components/CardCategories/CardCategory2";
import Link from "next/link";
import { Category } from "@/types/category";

// Define color palette
const COLORS = [
  "bg-indigo-100",
  "bg-slate-100",
  "bg-sky-100",
  "bg-orange-100",
  "bg-yellow-50",
  "bg-red-50",
  "bg-blue-50",
  "bg-green-50",
];

export interface SectionSliderCategoriesProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  subHeading?: string;
  data?: Category[];
}

const SectionSliderCategories: FC<SectionSliderCategoriesProps> = ({
  heading = "Shop by Category",
  subHeading = "",
  className = "",
  itemClassName = "",
  data = [],
}) => {
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);
  const [productCounts, setProductCounts] = useState<number[]>([]);

  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 4,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: { perView: 4 },
        1024: { gap: 20, perView: 3 },
        768: { gap: 20, perView: 3 },
        640: { gap: 20, perView: 2 },
        500: { gap: 16, perView: 2 },
      },
    };

    if (!sliderRef.current) return;

    let slider = new Glide(sliderRef.current, OPTIONS);
    slider.mount();
    setIsShow(true);
    return () => {
      slider.destroy();
    };
  }, [sliderRef]);

  useEffect(() => {
    // Only run on client
    setProductCounts(data.map(() => Math.floor(Math.random() * 100) + 20));
  }, [data]);

  return (
    <div className={`nc-SectionSliderCategories ${className}`}>
      <div ref={sliderRef} className={`flow-root ${isShow ? "" : "invisible"}`}>
        <Heading desc={subHeading} hasNextPrev>
          {heading}
        </Heading>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {data.map((item, index) => (
              <li
                key={item.id || index}
                className={`glide__slide ${itemClassName}`}
              >
                <CardCategory2
                  featuredImage={item.imageUrl}
                  name={item.displayText || ""}
                  desc={
                    productCounts.length
                      ? `${productCounts[index]}+ products`
                      : "" // Empty until client renders
                  }
                  bgClass={COLORS[index % COLORS.length]}
                />
              </li>
            ))}
            <li className={`glide__slide ${itemClassName}`}>
              <Link href={"/filter"} className="nc-CardCategory2 block">
                <div
                  className={`flex-1 relative w-full h-0 rounded-full overflow-hidden group aspect-w-1 aspect-h-1 bg-slate-100`}
                >
                  <div className="transform group-hover:scale-105 transition-transform duration-300 w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-base sm:text-lg text-neutral-900 dark:text-neutral-100 font-semibold">
                        More categories
                      </h2>
                      <span className="block mt-0.5 sm:mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                        Show me more
                      </span>
                    </div>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity rounded-full"></span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderCategories;
