import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { StarIcon } from "@heroicons/react/24/solid";

import { getProductById } from "@/lib/actions/products";
import ProductDetailsClient from "@/components/product-details/ProductDetailsClient";
import ReviewItem from "@/components/ReviewItem";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import SectionPromo2 from "@/components/SectionPromo2";
import SectionSliderProductCard from "@/components/SectionSliderProductCard";
import Policy from "../Policy";

// Define props for both the page and metadata function
interface ProductDetailPageProps {
  params: { id: string };
}

// 1. DYNAMIC METADATA GENERATION
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  return {
    title: `${product.name} | Your Store Name`,
    description:
      product.description.substring(0, 155) ||
      `Shop the ${product.name} at Your Store Name.`,
    openGraph: {
      title: product.name,
      description: product.description,
      // FIX: Changed "product" to the valid type "article"
      type: "article",
      url: `https://your-store.com/product-detail/${product.id}`,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

// 2. SEO-ENHANCED SERVER COMPONENT
const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const { rating, reviewCount, description } = product;

  // --- JSON-LD STRUCTURED DATA SCRIPT ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `https://your-store.com/product-detail/${product.id}`,
      priceCurrency: "USD", // Change to your currency
      price: product.newPrice || product.price,
      availability: product.variants.some((v: { qte: number }) => v.qte > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString(),
    },
    aggregateRating:
      reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: rating,
            reviewCount: reviewCount,
          }
        : undefined,
  };

  const renderDetailSection = () => (
    <div>
      <h2 className="text-2xl font-semibold">Product Details</h2>
      <div className="prose prose-sm sm:prose dark:prose-invert sm:max-w-4xl mt-7">
        <p>{description}</p>
        <ul>
          <li>Regular fit, mid-weight t-shirt</li>
          <li>Natural color, 100% premium combed organic cotton</li>
          <li>GOTS certified</li>
          <li>Soft touch water based printed in the USA</li>
        </ul>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div>
      <h2 className="text-2xl font-semibold flex items-center">
        <StarIcon className="w-7 h-7 mb-0.5" />
        <span className="ml-1.5">
          {rating || 0} · {reviewCount || 0} Reviews
        </span>
      </h2>
      <div className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">
          <ReviewItem />
          <ReviewItem />
        </div>
        <ButtonSecondary className="mt-10 border border-slate-300 dark:border-slate-700 ">
          Show me all {reviewCount || 0} reviews
        </ButtonSecondary>
      </div>
    </div>
  );

  return (
    <div className={`nc-ProductDetailPage `}>
      {/* Inject JSON-LD Structured Data into the page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="container mt-5 lg:mt-11">
        <ProductDetailsClient product={product} />

        <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-16">
          <div className="block xl:hidden">
            <Policy />
          </div>

          {renderDetailSection()}
          <hr className="border-slate-200 dark:border-slate-700" />
          {renderReviews()}
          <hr className="border-slate-200 dark:border-slate-700" />

          <SectionSliderProductCard
            heading="Customers also purchased"
            subHeading=""
          />
          <div className="pb-20 xl:pb-28 lg:pt-14">
            <SectionPromo2 />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
