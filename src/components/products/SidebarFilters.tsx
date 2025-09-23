"use client";

import React from "react";
import Checkbox from "@/shared/Checkbox/Checkbox";
import Slider from "rc-slider";
import Radio from "@/shared/Radio/Radio";
import MySwitch from "@/components/MySwitch";
import { useFilterStore } from "@/stores/filterStore";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand"; // <-- Import Brand type

const DATA_sizes = [
  { name: "XS" },
  { name: "S" },
  { name: "M" },
  { name: "L" },
  { name: "XL" },
  { name: "2XL" },
];

const DATA_sortOrderRadios = [
  { name: "Most Popular", id: "Most-Popular" },
  { name: "Best Rating", id: "Best-Rating" },
  { name: "Newest", id: "Newest" },
  { name: "Price Low - High", id: "Price-low-high" },
  { name: "Price High - Low", id: "Price-high-low" },
];

const DATA_genders = [
  { name: "Male", id: "male" },
  { name: "Female", id: "female" },
  { name: "Unisex", id: "unisex" },
];

const PRICE_RANGE = [0, 1000];

interface SidebarFiltersProps {
  categories: Category[];
  brands: Brand[]; // <-- Add brands prop
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  categories,
  brands,
}) => {
  console.log("🚀 ~ SidebarFilters ~ brands:", brands);
  const {
    categories: selectedCategories,
    brands: selectedBrands, // <-- Get selected brands from store
    sizes: selectedSizes,
    priceRange,
    isOnSale,
    sortOrder,
    gender,
    setCategories,
    setBrands, // <-- Add setBrands
    setSizes,
    setPriceRange,
    setIsOnSale,
    setSortOrder,
    setGender,
  } = useFilterStore();

  // Handlers
  const handleChangeCategories = (checked: boolean, name: string) => {
    const updated = checked
      ? [...selectedCategories, name]
      : selectedCategories.filter((i) => i !== name);
    setCategories(updated);
  };

  const handleChangeBrands = (checked: boolean, name: string) => {
    const updated = checked
      ? [...selectedBrands, name]
      : selectedBrands.filter((i) => i !== name);
    setBrands(updated);
  };

  const handleChangeSizes = (checked: boolean, name: string) => {
    const updated = checked
      ? [...selectedSizes, name]
      : selectedSizes.filter((i) => i !== name);
    setSizes(updated);
  };

  // Render functions
  const renderCategories = () => (
    <div className="flex flex-col pb-8 space-y-4">
      <h3 className="font-semibold mb-2.5">Categories</h3>
      {categories
        .filter((c) => c.displayText?.trim() !== "")
        .map((item) => (
          <Checkbox
            key={item.id}
            name={item.displayText || ""}
            label={item.displayText}
            defaultChecked={selectedCategories.includes(item.displayText || "")}
            sizeClassName="w-5 h-5"
            labelClassName="text-sm font-normal"
            onChange={(checked) =>
              handleChangeCategories(checked, item.displayText || "")
            }
          />
        ))}
    </div>
  );

  const renderBrands = () => (
    <div className="flex flex-col pb-8 space-y-4">
      <h3 className="font-semibold mb-2.5">Brands</h3>
      {brands.map((brand) => (
        <Checkbox
          key={brand.id}
          name={brand.name}
          label={brand.name}
          defaultChecked={selectedBrands.includes(brand.name)}
          sizeClassName="w-5 h-5"
          labelClassName="text-sm font-normal"
          onChange={(checked) => handleChangeBrands(checked, brand.name)}
        />
      ))}
    </div>
  );

  const renderSizes = () => (
    <div className="flex flex-col py-8 space-y-4">
      <h3 className="font-semibold mb-2.5">Sizes</h3>
      {DATA_sizes.map((item) => (
        <Checkbox
          key={item.name}
          name={item.name}
          label={item.name}
          defaultChecked={selectedSizes.includes(item.name)}
          onChange={(checked) => handleChangeSizes(checked, item.name)}
          sizeClassName="w-5 h-5"
          labelClassName="text-sm font-normal"
        />
      ))}
    </div>
  );

  const renderPriceRange = () => (
    <div className="flex flex-col py-8 space-y-5 pr-3">
      <span className="font-semibold">Price range</span>
      <Slider
        range
        min={PRICE_RANGE[0]}
        max={PRICE_RANGE[1]}
        step={1}
        defaultValue={[priceRange[0], priceRange[1]]}
        allowCross={false}
        onChange={(value: number | number[]) =>
          setPriceRange(value as [number, number])
        }
      />
      <div className="flex justify-between space-x-5 mt-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Min price
          </label>
          <input
            type="text"
            disabled
            className="block w-32 pr-10 pl-4 sm:text-sm border-neutral-200 dark:border-neutral-700 rounded-full bg-transparent"
            value={priceRange[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Max price
          </label>
          <input
            type="text"
            disabled
            className="block w-32 pr-10 pl-4 sm:text-sm border-neutral-200 dark:border-neutral-700 rounded-full bg-transparent"
            value={priceRange[1]}
          />
        </div>
      </div>
    </div>
  );

  const renderSortOrder = () => (
    <div className="flex flex-col py-8 space-y-4">
      <h3 className="font-semibold mb-2.5">Sort order</h3>
      {DATA_sortOrderRadios.map((item) => (
        <Radio
          key={item.id}
          id={item.id}
          name="sortOrder"
          label={item.name}
          defaultChecked={sortOrder === item.id}
          sizeClassName="w-5 h-5"
          onChange={setSortOrder}
          className="!text-sm"
        />
      ))}
    </div>
  );

  const renderGender = () => (
    <div className="flex flex-col py-8 space-y-4">
      <h3 className="font-semibold mb-2.5">Gender</h3>
      {DATA_genders.map((item) => (
        <Radio
          key={item.id}
          id={item.id}
          name="gender"
          label={item.name}
          defaultChecked={gender === item.id}
          sizeClassName="w-5 h-5"
          onChange={setGender}
          className="!text-sm"
        />
      ))}
    </div>
  );

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {renderCategories()}
      {renderBrands()} {/* <-- Add brands filter here */}
      {renderSizes()}
      {renderPriceRange()}
      {renderGender()}
      <div className="py-8 pr-2">
        <MySwitch
          label="On sale!"
          desc="Products currently on sale"
          enabled={isOnSale}
          onChange={setIsOnSale}
        />
      </div>
      {renderSortOrder()}
    </div>
  );
};

export default SidebarFilters;
