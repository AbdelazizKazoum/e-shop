import React, { FC } from "react";

// Import your SVGs
// Import your SVGs
import explore1Svg from "@/images/collections/explore1.svg";
import explore2Svg from "@/images/collections/explore2.svg";
import explore3Svg from "@/images/collections/explore3.svg";
import explore4Svg from "@/images/collections/explore4.svg";
import explore5Svg from "@/images/collections/explore5.svg";
import explore6Svg from "@/images/collections/explore6.svg";
import explore7Svg from "@/images/collections/explore7.svg";
import explore8Svg from "@/images/collections/explore8.svg";
import explore9Svg from "@/images/collections/explore9.svg";

import Heading from "../Heading/Heading";
import CardCategory4 from "../CardCategories/CardCategory4";

// Define a type for the category data coming from your API
export interface ApiCategory {
  id: string;
  category?: string;
  displayText: string;
  imageUrl: string;
}

export interface SectionGridMoreExploreProps {
  className?: string;
  gridClassName?: string;
  data?: ApiCategory[]; // Data will be passed from a parent server component
}

// Create an array of the imported SVGs to easily cycle through them
const svgs = [
  explore1Svg,
  explore2Svg,
  explore3Svg,
  explore4Svg,
  explore5Svg,
  explore6Svg,
  explore7Svg,
  explore8Svg,
  explore9Svg,
];

// This is now a Server Component (no "use client")
const SectionGridMoreExplore: FC<SectionGridMoreExploreProps> = ({
  className = "",
  gridClassName = "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  data = [], // Default to an empty array
}) => {
  // Data processing is done directly. No hooks needed on the server.
  const processedData = data.map((item, index) => ({
    id: item.id,
    name: item.displayText, // Use displayText for the name
    featuredImage: item.imageUrl, // Use imageUrl for the image
    color: "bg-blue-50", // Static color as requested
    // Math.random() is fine on the server; it runs once per page render.
    count: Math.floor(Math.random() * (150 - 20 + 1)) + 20,
    bgSVG: svgs[index % svgs.length], // Cycle through the svgs array
    desc: "Manufacturer", // Corrected typo
  }));

  const renderHeading = () => {
    return (
      <div>
        <Heading
          className="mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50"
          fontClass="text-3xl md:text-4xl 2xl:text-5xl font-semibold"
          isCenter
          desc=""
        >
          Start Exploring By Category
        </Heading>
      </div>
    );
  };

  return (
    <div className={`nc-SectionGridMoreExplore relative ${className}`}>
      {renderHeading()}
      <div className={`grid gap-4 md:gap-7 ${gridClassName}`}>
        {/* We map directly to CardCategory4, simplifying the logic */}
        {processedData.map((item) => (
          <CardCategory4
            key={item.id}
            name={item.name}
            desc={item.desc}
            featuredImage={item.featuredImage}
            color={item.color}
            count={item.count}
            bgSVG={item.bgSVG}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionGridMoreExplore;
