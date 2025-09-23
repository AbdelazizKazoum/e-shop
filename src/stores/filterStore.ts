import { create } from "zustand";

interface FilterState {
  categories: string[];
  brands: string[]; // 👈 Add brands array
  sizes: string[];
  priceRange: [number, number];
  isOnSale: boolean;
  sortOrder: string;
  gender: string;
  name: string;

  // actions
  setCategories: (categories: string[]) => void;
  setBrands: (brands: string[]) => void; // 👈 Add setBrands action
  setSizes: (sizes: string[]) => void;
  setPriceRange: (range: [number, number]) => void;
  setIsOnSale: (onSale: boolean) => void;
  setSortOrder: (order: string) => void;
  setGender: (gender: string) => void;
  setName: (name: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  categories: [],
  brands: [], // 👈 Initialize brands
  sizes: [],
  priceRange: [0, 1000],
  isOnSale: true,
  sortOrder: "",
  gender: "",
  name: "",

  setCategories: (categories) =>
    set(() => {
      console.log("Selected categories:", categories);
      return { categories };
    }),

  setBrands: (brands) =>
    set(() => {
      console.log("Selected brands:", brands);
      return { brands };
    }),

  setSizes: (sizes) =>
    set(() => {
      console.log("Selected sizes:", sizes);
      return { sizes };
    }),

  setPriceRange: (priceRange) =>
    set(() => {
      console.log("Selected price range:", priceRange);
      return { priceRange };
    }),

  setIsOnSale: (isOnSale) =>
    set(() => {
      console.log("On Sale:", isOnSale);
      return { isOnSale };
    }),

  setSortOrder: (sortOrder) =>
    set(() => {
      console.log("Sort order:", sortOrder);
      return { sortOrder };
    }),

  setGender: (gender) =>
    set(() => {
      console.log("Selected gender:", gender);
      return { gender };
    }),

  setName: (name) =>
    set(() => {
      console.log("Product name filter:", name);
      return { name };
    }),

  resetFilters: () =>
    set(() => {
      console.log("Filters reset");
      return {
        categories: [],
        brands: [], // 👈 Reset brands
        sizes: [],
        priceRange: [100, 1000],
        isOnSale: true,
        sortOrder: "",
        gender: "",
        name: "",
      };
    }),
}));
