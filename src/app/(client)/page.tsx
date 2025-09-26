import React from "react";
import SectionHowItWork from "@/components/SectionHowItWork/SectionHowItWork";
import BackgroundSection from "@/components/BackgroundSection/BackgroundSection";
import SectionPromo1 from "@/components/SectionPromo1";
import SectionHero2 from "@/components/SectionHero/SectionHero2";
import SectionSliderLargeProduct from "@/components/SectionSliderLargeProduct";
import DiscoverMoreSlider from "@/components/DiscoverMoreSlider";
import SectionGridMoreExplore from "@/components/SectionGridMoreExplore/SectionGridMoreExplore";
import SectionPromo2 from "@/components/SectionPromo2";
import SectionSliderCategories from "@/components/SectionSliderCategories/SectionSliderCategories";
import SectionPromo3 from "@/components/SectionPromo3";
import SectionClientSay from "@/components/SectionClientSay/SectionClientSay";
import Heading from "@/components/Heading/Heading";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { PRODUCTS, SPORT_PRODUCTS } from "@/data/data";
import SectionGridFeatureItems from "@/components/SectionGridFeatureItems";
import { fetchLandingPageData } from "@/lib/actions/landingPage";
import SectionSliderProductCard from "@/components/landing-page/SectionSliderProductCard";
import DiscoverBrands from "@/components/DiscoverBrands";

async function PageHome() {
  const { newArrivals, bestSellers, featuredProducts, categories, topBrands } =
    await fetchLandingPageData();

  return (
    <div className="nc-PageHome relative overflow-hidden">
      <SectionHero2 />

      <div className="container mt-16 lg:mt-24">
        <SectionSliderCategories data={categories} />
      </div>

      <div className="container mt-16 lg:mt-24">
        <SectionSliderProductCard data={newArrivals} />
      </div>

      <div className="mt-16 lg:mt-24">
        {/* <DiscoverMoreSlider /> */}
        <DiscoverBrands brands={topBrands} />
      </div>

      <div className="container relative space-y-16 my-16 lg:space-y-24 lg:my-24">
        {/* <SectionPromo1 />
        <div className="relative py-24 lg:py-32">
          <BackgroundSection />
          <SectionGridMoreExplore data={categories} />
        </div> */}
        <SectionSliderProductCard
          heading="Best Sellers"
          subHeading="Best selling of the month"
          data={bestSellers}
        />
        {/* HOW IT WORKS */}{" "}
        <div className="py-16 lg:py-24 border-t border-b border-slate-200 dark:border-slate-700">
          <SectionHowItWork />
        </div>
        <SectionPromo2 />
        <SectionSliderLargeProduct cardStyle="style2" />
        <SectionPromo3 />
        <SectionGridFeatureItems
          products={featuredProducts}
          categories={categories}
        />
        <div className="relative py-16 lg:py-24">
          <BackgroundSection />
          <div>
            <Heading rightDescText="From the Ciseco blog">
              The latest news
            </Heading>
            <div className="flex mt-16 justify-center">
              <ButtonSecondary>Show all blog articles</ButtonSecondary>
            </div>
          </div>
        </div>
        <SectionClientSay />
      </div>
    </div>
  );
}

export default PageHome;
