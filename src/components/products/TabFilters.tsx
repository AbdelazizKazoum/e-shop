"use client";

import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Popover, Transition } from "@/app/headlessui";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonClose from "@/shared/ButtonClose/ButtonClose";
import Checkbox from "@/shared/Checkbox/Checkbox";
import Slider from "rc-slider";
import Radio from "@/shared/Radio/Radio";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import MySwitch from "@/components/MySwitch";
import { useFilterStore } from "@/stores/filterStore";
import ButtonThird from "@/shared/Button/ButtonThird";
import { Category } from "@/types/product";

// --- MOCK DATA (Replace with data from your API if needed) ---

const DATA_categories = [
  { id: "new-arrivals", displayText: "New Arrivals" },
  { id: "sale", displayText: "Sale" },
  { id: "backpacks", displayText: "Backpacks" },
  { id: "travel-bags", displayText: "Travel Bags" },
  { id: "laptop-sleeves", displayText: "Laptop Sleeves" },
  { id: "organization", displayText: "Organization" },
  { id: "accessories", displayText: "Accessories" },
];

const DATA_sizes = [
  { name: "XXS" },
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

const TabFilters = ({ categories }: { categories: Category[] }) => {
  // 1. Get setters and initial values from the Zustand store
  const {
    categories: storeCategories,
    sizes: storeSizes,
    priceRange: storePriceRange,
    isOnSale: storeIsOnSale,
    sortOrder: storeSortOrder,
    setCategories,
    setSizes,
    setPriceRange,
    setIsOnSale,
    setSortOrder,
  } = useFilterStore();

  // 2. Create local state to hold filter changes temporarily
  const [localCategories, setLocalCategories] = useState(storeCategories);
  const [localSizes, setLocalSizes] = useState(storeSizes);
  const [localPriceRange, setLocalPriceRange] = useState(storePriceRange);
  const [localIsOnSale, setLocalIsOnSale] = useState(storeIsOnSale);
  const [localSortOrder, setLocalSortOrder] = useState(storeSortOrder);

  const [isOpenMoreFilter, setIsOpenMoreFilter] = useState(false);

  // 3. Sync local state if global store changes from elsewhere
  useEffect(() => {
    setLocalCategories(storeCategories);
    setLocalSizes(storeSizes);
    setLocalPriceRange(storePriceRange);
    setLocalIsOnSale(storeIsOnSale);
    setLocalSortOrder(storeSortOrder);
  }, [
    storeCategories,
    storeSizes,
    storePriceRange,
    storeIsOnSale,
    storeSortOrder,
  ]);

  // 4. Function to apply all local changes to the Zustand store
  const handleApplyFilters = () => {
    setCategories(localCategories);
    setSizes(localSizes);
    setPriceRange(localPriceRange);
    setIsOnSale(localIsOnSale);
    setSortOrder(localSortOrder);
  };

  // 5. Handlers to modify ONLY the LOCAL state
  const handleChangeCategories = (checked: boolean, name: string) => {
    const updated = checked
      ? [...localCategories, name]
      : localCategories.filter((i) => i !== name);
    setLocalCategories(updated);
  };

  const handleChangeSizes = (checked: boolean, name: string) => {
    const updated = checked
      ? [...localSizes, name]
      : localSizes.filter((i) => i !== name);
    setLocalSizes(updated);
  };

  // 6. Reset all LOCAL filters to their default state
  const handleResetAllLocalFilters = () => {
    setLocalCategories([]);
    setLocalSizes([]);
    setLocalPriceRange(PRICE_RANGE as [number, number]);
    setLocalIsOnSale(false);
    setLocalSortOrder("");
  };

  const closeModalMoreFilter = () => setIsOpenMoreFilter(false);
  const openModalMoreFilter = () => setIsOpenMoreFilter(true);

  // --- RENDER FUNCTIONS ---
  // ... (renderXClear, renderTabsCategories, renderTabsSize, renderTabsPriceRage, renderTabIsOnsale, renderTabsSortOrder functions are unchanged) ...
  const renderXClear = () => (
    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-500 text-white flex items-center justify-center ml-3 cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );

  const renderTabsCategories = () => (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border focus:outline-none select-none
               ${open ? "!border-primary-500 " : ""}
                ${
                  !!storeCategories.length
                    ? "!border-primary-500 bg-primary-50 text-primary-900"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
                }`}
          >
            {/* ... SVG Icon ... */}
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 2V5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 2V5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 13H15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 17H12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 3.5C19.33 3.68 21 4.95 21 9.65V15.83C21 19.95 20 22.01 15 22.01H9C4 22.01 3 19.95 3 15.83V9.65C3 4.95 4.67 3.69 8 3.5H16Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2">Categories</span>
            {!storeCategories.length ? (
              <ChevronDownIcon className="w-4 h-4 ml-3" />
            ) : (
              <span onClick={() => setCategories([])}>{renderXClear()}</span>
            )}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-40 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-md">
              <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                <div className="relative flex flex-col px-5 py-6 space-y-5">
                  {categories &&
                    categories.map((item) => (
                      <Checkbox
                        key={item.id}
                        name={item.displayText || ""}
                        label={item.displayText || ""}
                        defaultChecked={localCategories.includes(
                          item.displayText || ""
                        )}
                        onChange={(checked) =>
                          handleChangeCategories(
                            checked,
                            item.displayText || ""
                          )
                        }
                      />
                    ))}
                </div>
                <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                  <ButtonThird
                    onClick={() => setLocalCategories([])}
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    Clear
                  </ButtonThird>
                  <ButtonPrimary
                    onClick={() => {
                      handleApplyFilters();
                      close();
                    }}
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    Apply
                  </ButtonPrimary>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );

  const renderTabsSize = () => (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border focus:outline-none select-none
              ${open ? "!border-primary-500 " : ""}
                ${
                  !!storeSizes.length
                    ? "!border-primary-500 bg-primary-50 text-primary-900"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
                }`}
          >
            {/* ... SVG Icon ... */}
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 9V3H15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 15V21H9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 3L13.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 13.5L3 21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2">Sizes</span>
            {!storeSizes.length ? (
              <ChevronDownIcon className="w-4 h-4 ml-3" />
            ) : (
              <span onClick={() => setSizes([])}>{renderXClear()}</span>
            )}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-40 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-sm">
              <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                <div className="relative flex flex-col px-5 py-6 space-y-5">
                  {DATA_sizes.map((item) => (
                    <Checkbox
                      key={item.name}
                      name={item.name}
                      label={item.name}
                      defaultChecked={localSizes.includes(item.name)}
                      onChange={(checked) =>
                        handleChangeSizes(checked, item.name)
                      }
                    />
                  ))}
                </div>
                <div className="p-5 bg-slate-50 dark:bg-slate-900 dark:border-t dark:border-slate-800 flex items-center justify-between">
                  <ButtonThird
                    onClick={() => setLocalSizes([])}
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    Clear
                  </ButtonThird>
                  <ButtonPrimary
                    onClick={() => {
                      handleApplyFilters();
                      close();
                    }}
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    Apply
                  </ButtonPrimary>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );

  const renderTabsPriceRage = () => (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border focus:outline-none 
              ${
                storePriceRange[0] === PRICE_RANGE[0] &&
                storePriceRange[1] === PRICE_RANGE[1]
                  ? "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
                  : "border-primary-500 bg-primary-50 text-primary-900"
              }`}
          >
            {/* ... SVG Icon ... */}
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.67188 14.3298C8.67188 15.6198 9.66188 16.6598 10.8919 16.6598H13.4019C14.4719 16.6598 15.3419 15.7498 15.3419 14.6298C15.3419 13.4098 14.8119 12.9798 14.0219 12.6998L9.99187 11.2998C9.20187 11.0198 8.67188 10.5898 8.67188 9.36984C8.67188 8.24984 9.54187 7.33984 10.6119 7.33984H13.1219C14.3519 7.33984 15.3419 8.37984 15.3419 9.66984"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6V18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2 min-w-[90px]">{`$${storePriceRange[0]} - $${storePriceRange[1]}`}</span>
            {storePriceRange[0] === PRICE_RANGE[0] &&
            storePriceRange[1] === PRICE_RANGE[1] ? null : (
              <span
                onClick={(e) => {
                  e.stopPropagation(); // prevent popover from opening
                  setPriceRange(PRICE_RANGE as [number, number]);
                }}
              >
                {renderXClear()}
              </span>
            )}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-40 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 ">
              <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                <div className="relative flex flex-col px-5 py-6 space-y-8">
                  <div className="space-y-5">
                    <span className="font-medium">Price range</span>
                    <Slider
                      range
                      min={PRICE_RANGE[0]}
                      max={PRICE_RANGE[1]}
                      step={1}
                      defaultValue={localPriceRange}
                      allowCross={false}
                      onChange={(value) =>
                        setLocalPriceRange(value as [number, number])
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
                      <input
                        type="text"
                        disabled
                        className="block w-32 pr-10 pl-4 sm:text-sm border-neutral-200 dark:border-neutral-700 rounded-full bg-transparent"
                        value={`$${localPriceRange[0]}`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="maxPrice"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        Max price
                      </label>
                      <input
                        type="text"
                        disabled
                        className="block w-32 pr-10 pl-4 sm:text-sm border-neutral-200 dark:border-neutral-700 rounded-full bg-transparent"
                        value={`$${localPriceRange[1]}`}
                      />
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                  <ButtonThird
                    onClick={() =>
                      setLocalPriceRange(PRICE_RANGE as [number, number])
                    }
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    Clear
                  </ButtonThird>
                  <ButtonPrimary
                    onClick={() => {
                      handleApplyFilters();
                      close();
                    }}
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    Apply
                  </ButtonPrimary>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );

  const renderTabIsOnsale = () => (
    <div
      onClick={() => setIsOnSale(!storeIsOnSale)}
      className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border focus:outline-none cursor-pointer select-none
        ${
          storeIsOnSale
            ? "border-primary-500 bg-primary-50 text-primary-900"
            : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
        }
      `}
    >
      {/* ... SVG Icon ... */}
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.9889 14.6604L2.46891 13.1404C1.84891 12.5204 1.84891 11.5004 2.46891 10.8804L3.9889 9.36039C4.2489 9.10039 4.4589 8.59038 4.4589 8.23038V6.08036C4.4589 5.20036 5.1789 4.48038 6.0589 4.48038H8.2089C8.5689 4.48038 9.0789 4.27041 9.3389 4.01041L10.8589 2.49039C11.4789 1.87039 12.4989 1.87039 13.1189 2.49039L14.6389 4.01041C14.8989 4.27041 15.4089 4.48038 15.7689 4.48038H17.9189C18.7989 4.48038 19.5189 5.20036 19.5189 6.08036V8.23038C19.5189 8.59038 19.7289 9.10039 19.9889 9.36039L21.5089 10.8804C22.1289 11.5004 22.1289 12.5204 21.5089 13.1404L19.9889 14.6604C19.7289 14.9204 19.5189 15.4304 19.5189 15.7904V17.9403C19.5189 18.8203 18.7989 19.5404 17.9189 19.5404H15.7689C15.4089 19.5404 14.8989 19.7504 14.6389 20.0104L13.1189 21.5304C12.4989 22.1504 11.4789 22.1504 10.8589 21.5304L9.3389 20.0104C9.0789 19.7504 8.5689 19.5404 8.2089 19.5404H6.0589C5.1789 19.5404 4.4589 18.8203 4.4589 17.9403V15.7904C4.4589 15.4204 4.2489 14.9104 3.9889 14.6604Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 15L15 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.4945 14.5H14.5035"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.49451 9.5H9.50349"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="line-clamp-1 ml-2">On sale</span>
    </div>
  );

  const renderTabsSortOrder = () => (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`flex items-center justify-center px-4 py-2 text-sm border rounded-full focus:outline-none select-none
              ${open ? "!border-primary-500 " : ""}
                ${
                  !!storeSortOrder.length
                    ? "!border-primary-500 bg-primary-50 text-primary-900"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
                }`}
          >
            {/* ... SVG Icon ... */}
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
              <path
                d="M11.5166 5.70834L14.0499 8.24168"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.5166 14.2917V5.70834"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.48327 14.2917L5.94995 11.7583"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.48315 5.70834V14.2917"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.0001 18.3333C14.6025 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6025 1.66667 10.0001 1.66667C5.39771 1.66667 1.66675 5.39763 1.66675 10C1.66675 14.6024 5.39771 18.3333 10.0001 18.3333Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2">
              {storeSortOrder
                ? DATA_sortOrderRadios.find((i) => i.id === storeSortOrder)
                    ?.name
                : "Sort order"}
            </span>
            {!storeSortOrder.length ? (
              <ChevronDownIcon className="w-4 h-4 ml-3" />
            ) : (
              <span onClick={() => setSortOrder("")}>{renderXClear()}</span>
            )}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-40 w-screen max-w-sm px-4 mt-3 right-0 sm:px-0 lg:max-w-sm">
              <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                <div className="relative flex flex-col px-5 py-6 space-y-5">
                  {DATA_sortOrderRadios.map((item) => (
                    <Radio
                      id={item.id}
                      key={item.id}
                      name="radioNameSort"
                      label={item.name}
                      defaultChecked={localSortOrder === item.id}
                      onChange={setLocalSortOrder}
                    />
                  ))}
                </div>
                <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                  <ButtonThird
                    onClick={() => setLocalSortOrder("")}
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    Clear
                  </ButtonThird>
                  <ButtonPrimary
                    onClick={() => {
                      handleApplyFilters();
                      close();
                    }}
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    Apply
                  </ButtonPrimary>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );

  const renderTabMobileFilter = () => (
    <div>
      <div className="flex-shrink-0">
        <div
          className="flex flex-shrink-0 items-center justify-center px-4 py-2 text-sm rounded-full border border-primary-500 bg-primary-50 text-primary-900 focus:outline-none cursor-pointer"
          onClick={openModalMoreFilter}
        >
          {/* ... SVG Icon ... */}
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 6.5H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6.5H2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 10C11.933 10 13.5 8.433 13.5 6.5C13.5 4.567 11.933 3 10 3C8.067 3 6.5 4.567 6.5 6.5C6.5 8.433 8.067 10 10 10Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 17.5H18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 17.5H2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 21C15.933 21 17.5 19.433 17.5 17.5C17.5 15.567 15.933 14 14 14C12.067 14 10.5 15.567 10.5 17.5C10.5 19.433 12.067 21 14 21Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="ml-2">Filters</span>
        </div>
      </div>

      <Transition appear show={isOpenMoreFilter} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModalMoreFilter}
        >
          <div className="min-h-screen text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60" />
            </Transition.Child>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              className="inline-block h-screen w-full max-w-4xl"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-flex flex-col w-full text-left align-middle transition-all transform bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 h-full">
                <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-neutral-900 dark:text-neutral-200"
                  >
                    Filters
                  </Dialog.Title>
                  <span className="absolute left-3 top-3">
                    <ButtonClose onClick={closeModalMoreFilter} />
                  </span>
                </div>

                <div className="flex-grow overflow-y-auto">
                  <div className="px-6 sm:px-8 md:px-10 divide-y divide-neutral-200 dark:divide-neutral-800">
                    {/* ... other filter sections ... */}
                    <div className="py-7">
                      <h3 className="text-xl font-medium">Categories</h3>
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        {categories.map((item) => (
                          <Checkbox
                            key={item.id}
                            name={item.displayText || ""}
                            label={item.displayText || ""}
                            defaultChecked={localCategories.includes(
                              item.displayText || ""
                            )}
                            onChange={(checked) =>
                              handleChangeCategories(
                                checked,
                                item.displayText || ""
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>
                    {/* SIZES */}
                    <div className="py-7">
                      <h3 className="text-xl font-medium">Size</h3>
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        {DATA_sizes.map((item) => (
                          <Checkbox
                            key={item.name}
                            name={item.name}
                            label={item.name}
                            defaultChecked={localSizes.includes(item.name)}
                            onChange={(checked) =>
                              handleChangeSizes(checked, item.name)
                            }
                          />
                        ))}
                      </div>
                    </div>
                    {/* PRICE RANGE */}
                    <div className="py-7">
                      <h3 className="text-xl font-medium">Price Range</h3>
                      <div className="mt-6 relative ">
                        <div className="relative flex flex-col space-y-8">
                          <div className="space-y-5">
                            <Slider
                              range
                              min={PRICE_RANGE[0]}
                              max={PRICE_RANGE[1]}
                              defaultValue={localPriceRange}
                              allowCross={false}
                              onChange={(value) =>
                                setLocalPriceRange(value as [number, number])
                              }
                            />
                          </div>
                          <div className="flex justify-between space-x-5">
                            <div>
                              <label className="block text-sm font-medium">
                                Min price
                              </label>
                              <input
                                type="text"
                                disabled
                                className="block w-full mt-1 sm:text-sm border-neutral-200 dark:border-neutral-700 rounded-full bg-transparent"
                                value={`$${localPriceRange[0]}`}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium">
                                Max price
                              </label>
                              <input
                                type="text"
                                disabled
                                className="block w-full mt-1 sm:text-sm border-neutral-200 dark:border-neutral-700 rounded-full bg-transparent"
                                value={`$${localPriceRange[1]}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SORT ORDER - UPDATED DESIGN */}
                    <div className="py-7">
                      <h3 className="text-xl font-medium">Sort Order</h3>
                      <div className="mt-6 relative">
                        <div className="relative flex flex-col space-y-5">
                          {DATA_sortOrderRadios.map((item) => (
                            <Radio
                              id={`mobile-${item.id}`}
                              key={item.id}
                              name="radioSortOrder"
                              label={item.name}
                              defaultChecked={localSortOrder === item.id}
                              onChange={setLocalSortOrder}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ON SALE */}
                    <div className="py-7">
                      <h3 className="text-xl font-medium">On sale!</h3>
                      <div className="mt-6 relative ">
                        <MySwitch
                          label="On sale!"
                          desc="Products currently on sale"
                          enabled={localIsOnSale}
                          onChange={setLocalIsOnSale}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-shrink-0 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                  <ButtonThird
                    onClick={handleResetAllLocalFilters}
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    Clear
                  </ButtonThird>
                  <ButtonPrimary
                    onClick={() => {
                      handleApplyFilters();
                      closeModalMoreFilter();
                    }}
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    Apply
                  </ButtonPrimary>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );

  return (
    <div className="flex lg:space-x-4">
      <div className="hidden lg:flex flex-1 space-x-4 items-center">
        {renderTabsCategories()}
        {renderTabsSize()}
        {renderTabsPriceRage()}
        {renderTabIsOnsale()}
        <div className="!ml-auto">{renderTabsSortOrder()}</div>
      </div>
      <div className="flex lg:hidden">
        <div className="flex-shrink-0">{renderTabMobileFilter()}</div>
      </div>
    </div>
  );
};

export default TabFilters;
