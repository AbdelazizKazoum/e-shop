import { create } from "zustand";

interface FilterState {
  categories: string[];
  sizes: string[];
  priceRange: [number, number];
  isOnSale: boolean;
  sortOrder: string;

  // actions
  setCategories: (categories: string[]) => void;
  setSizes: (sizes: string[]) => void;
  setPriceRange: (range: [number, number]) => void;
  setIsOnSale: (onSale: boolean) => void;
  setSortOrder: (order: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  categories: [],
  sizes: [],
  priceRange: [100, 500],
  isOnSale: true,
  sortOrder: "",

  setCategories: (categories) =>
    set(() => {
      console.log("Selected categories:", categories);
      return { categories };
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

  resetFilters: () =>
    set(() => {
      console.log("Filters reset");
      return {
        categories: [],
        sizes: [],
        priceRange: [100, 500],
        isOnSale: true,
        sortOrder: "",
      };
    }),
}));
