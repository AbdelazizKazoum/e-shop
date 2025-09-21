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
        1024: { gap: 20, perView: 3.4 },
        768: { gap: 20, perView: 3 },
        640: { gap: 20, perView: 2.3 },
        500: { gap: 20, perView: 1.4 },
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
              <div
                className={`flex-1 relative w-full h-0 rounded-2xl overflow-hidden group aspect-w-1 aspect-h-1 bg-slate-100`}
              >
                <div>
                  <div className="absolute inset-y-6 inset-x-10 flex flex-col sm:items-center justify-center">
                    <div className="flex relative text-slate-900">
                      <span className="text-lg font-semibold ">
                        More Products
                      </span>
                      <svg
                        className="absolute left-full w-5 h-5 ml-2 rotate-45 group-hover:scale-110 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.0701 9.57L12.0001 3.5L5.93005 9.57"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M12 20.4999V3.66992"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-sm mt-1 text-slate-800">
                      Show me more
                    </span>
                  </div>
                </div>
                <Link
                  href={"/filter"}
                  className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"
                ></Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderCategories;
