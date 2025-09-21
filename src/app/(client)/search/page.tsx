import React from "react";
import SectionSliderCollections from "@/components/SectionSliderLargeProduct";
import SectionPromo1 from "@/components/SectionPromo1";
import HeaderFilterSearchPage from "@/components/products/HeaderFilterSearchPage";
import { RenderProducts } from "@/components/filter/RenderProducts";
import { fetchCategories, fetchProducts } from "@/lib/actions/products"; // 👈 import fetchBrands
import SearchInput from "@/components/products/SearchInput";
import { fetchAllBrands } from "@/lib/actions/brand";

const PageSearch = async ({}) => {
  const [products, categories, brands] = await Promise.all([
    fetchProducts(1, 10),
    fetchCategories(),
    fetchAllBrands(), // 👈 fetch brands
  ]);

  return (
    <div className={`nc-PageSearch`} data-nc-id="PageSearch">
      <div
        className={`nc-HeadBackgroundCommon h-24 2xl:h-28 top-0 left-0 right-0 w-full bg-primary-50 dark:bg-neutral-800/20 `}
      />
      <div className="container">
        <header className="max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7">
          {/* ✅ Client-side search input */}
          <SearchInput />
        </header>
      </div>

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
        <main>
          {/* FILTER */}
          <HeaderFilterSearchPage
            categories={categories}
            brands={brands}
          />{" "}
          {/* 👈 pass brands */}
          <RenderProducts
            initialProducts={products}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10"
          />
        </main>

        {/* === SECTION 5 === */}
        <hr className="border-slate-200 dark:border-slate-700" />
        <SectionSliderCollections />
        <hr className="border-slate-200 dark:border-slate-700" />

        {/* SUBCRIBES */}
        <SectionPromo1 />
      </div>
    </div>
  );
};

export default PageSearch;
