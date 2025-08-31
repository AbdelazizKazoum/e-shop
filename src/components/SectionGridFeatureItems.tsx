import React, { FC } from "react";
import HeaderFilterSection from "@/components/HeaderFilterSection";
import ProductCard from "@/components/ProductCard";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { Product, PRODUCTS } from "@/data/data";
import Heading from "./Heading/Heading";
import HeaderFilterSearchPage from "./products/HeaderFilterSearchPage";
import { Category } from "@/types/category";
import { RenderProducts } from "./filter/RenderProducts";

//
export interface SectionGridFeatureItemsProps {
  products: Product[];
  categories: Category[];
}

const SectionGridFeatureItems: FC<SectionGridFeatureItemsProps> = ({
  products,
  categories,
}) => {
  return (
    <div className="nc-SectionGridFeatureItems relative">
      <Heading>{`What's trending now`}</Heading>
      <main>
        {/* FILTER */}
        <HeaderFilterSearchPage categories={categories} />

        {/* LOOP ITEMS */}
        {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
            {PRODUCTS.map((item, index) => (
              <ProductCard data={item} key={index} />
            ))}
          </div> */}

        <RenderProducts
          initialProducts={products}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10"
        />
      </main>
    </div>
  );
};

export default SectionGridFeatureItems;
