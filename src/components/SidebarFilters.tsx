"use client";

import React from "react";
import Checkbox from "@/shared/Checkbox/Checkbox";
import Slider from "rc-slider";
import Radio from "@/shared/Radio/Radio";
import MySwitch from "@/components/MySwitch";
import { Category } from "@/types/product";
import { useFilterStore } from "@/stores/filterStore";

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
  { name: "Price Low - Hight", id: "Price-low-hight" },
  { name: "Price Hight - Low", id: "Price-hight-low" },
];

const PRICE_RANGE = [1, 500];

const SidebarFilters = ({ categories }: { categories: Category[] }) => {
  const {
    categories: selectedCategories,
    sizes: selectedSizes,
    priceRange,
    isOnSale,
    sortOrder,
    setCategories,
    setSizes,
    setPriceRange,
    setIsOnSale,
    setSortOrder,
  } = useFilterStore();

  const handleChangeCategories = (checked: boolean, name: string) => {
    const updated = checked
      ? [...selectedCategories, name]
      : selectedCategories.filter((i) => i !== name);
    setCategories(updated);
  };

  const handleChangeSizes = (checked: boolean, name: string) => {
    const updated = checked
      ? [...selectedSizes, name]
      : selectedSizes.filter((i) => i !== name);
    setSizes(updated);
  };

  const renderTabsCategories = () => {
    const validCategories = categories.filter(
      (c) => c.displayText && c.displayText.trim() !== ""
    );

    return (
      <div className="relative flex flex-col pb-8 space-y-4">
        <h3 className="font-semibold mb-2.5">Categories</h3>
        {validCategories.map((item) => (
          <div key={item.id}>
            <Checkbox
              name={item.displayText || ""}
              label={item.displayText}
              defaultChecked={selectedCategories.includes(item.displayText)}
              sizeClassName="w-5 h-5"
              labelClassName="text-sm font-normal"
              onChange={(checked) =>
                handleChangeCategories(checked, item.displayText)
              }
            />
          </div>
        ))}
      </div>
    );
  };

  const renderTabsSize = () => {
    return (
      <div className="relative flex flex-col py-8 space-y-4">
        <h3 className="font-semibold mb-2.5">Sizes</h3>
        {DATA_sizes.map((item) => (
          <div key={item.name}>
            <Checkbox
              name={item.name}
              label={item.name}
              defaultChecked={selectedSizes.includes(item.name)}
              onChange={(checked) => handleChangeSizes(checked, item.name)}
              sizeClassName="w-5 h-5"
              labelClassName="text-sm font-normal"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderTabsPriceRange = () => {
    return (
      <div className="relative flex flex-col py-8 space-y-5 pr-3">
        <div className="space-y-5">
          <span className="font-semibold">Price range</span>
          <Slider
            range
            min={PRICE_RANGE[0]}
            max={PRICE_RANGE[1]}
            step={1}
            defaultValue={[priceRange[0], priceRange[1]]}
            allowCross={false}
            onChange={(_input: number | number[]) =>
              setPriceRange(_input as [number, number])
            }
          />
        </div>

        <div className="flex justify-between space-x-5">
          <div>
            <label
              htmlFor="minPrice"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Min price
            </label>
            <div className="mt-1 relative rounded-md">
              <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500 sm:text-sm">
                $
              </span>
              <input
                type="text"
                name="minPrice"
                disabled
                id="minPrice"
                className="block w-32 pr-10 pl-4 sm:text-sm border-neutral-200 dark:border-neutral-700 rounded-full bg-transparent"
                value={priceRange[0]}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Max price
            </label>
            <div className="mt-1 relative rounded-md">
              <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500 sm:text-sm">
                $
              </span>
              <input
                type="text"
                disabled
                name="maxPrice"
                id="maxPrice"
                className="block w-32 pr-10 pl-4 sm:text-sm border-neutral-200 dark:border-neutral-700 rounded-full bg-transparent"
                value={priceRange[1]}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabsSortOrder = () => {
    return (
      <div className="relative flex flex-col py-8 space-y-4">
        <h3 className="font-semibold mb-2.5">Sort order</h3>
        {DATA_sortOrderRadios.map((item) => (
          <Radio
            id={item.id}
            key={item.id}
            name="radioNameSort"
            label={item.name}
            defaultChecked={sortOrder === item.id}
            sizeClassName="w-5 h-5"
            onChange={setSortOrder}
            className="!text-sm"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {renderTabsCategories()}
      {renderTabsSize()}
      {renderTabsPriceRange()}
      <div className="py-8 pr-2">
        <MySwitch
          label="On sale!"
          desc="Products currently on sale"
          enabled={isOnSale}
          onChange={setIsOnSale}
        />
      </div>
      {renderTabsSortOrder()}
    </div>
  );
};

export default SidebarFilters;
