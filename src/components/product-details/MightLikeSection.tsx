// MightLikeSection.tsx

"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import NextPrev from "@/shared/NextPrev/NextPrev";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import ProductCardSmall from "../products/ProductCardSmall";

// Mock data for demonstration
const mockSuggestedProducts: any[] = [
  {
    id: "61dcf9d6-8584-40ab-a96f-4aebf69ec366",
    name: "Glass summer",
    description: "test",
    brand: "Ray-Ban",
    gender: "Female",
    quantity: 0,
    image:
      "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/main/1757501819239-_afflelou_core_07630629442788_679321273a5b7.jpg",
    rating: 0,
    reviewCount: 0,
    price: 60,
    newPrice: 30,
    status: "active",
    trending: false,
    tags: null,
    createAt: "9/10/2025",
    averageRating: 0,
    category: {
      id: "2",
      category: "accessoires",
      displayText: "Accessoires",
      imageUrl:
        "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/categories/1756718462082-UI-community.png",
    },
    variants: [
      {
        id: "52f97565-f8cd-488d-90ae-9ebbc9d63c98",
        color: "#ff0000",
        size: "M",
        qte: 10,
        images: [
          {
            id: "e6f9e173-92f9-41e6-b15e-5ce4fbb570e4",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757501869122-0_1__afflelou_core_07630629442351_67664ffbd12bf.jpg",
          },
          {
            id: "ea33eddc-b694-400e-a1f9-66bb14c6c75f",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757501868704-0_0__afflelou_core_07630629442399_67664ff796e96.jpg",
          },
        ],
      },
      {
        id: "c4b849c2-5772-48b5-bfcf-56b8c92dec0c",
        color: "#8b572a",
        size: "XL",
        qte: 20,
        images: [
          {
            id: "35e67986-ac1d-46f0-aae3-e4012e35c80f",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757501869563-1_0__afflelou_core_07630629438897_67664ffa19361.jpg",
          },
          {
            id: "ea25d39d-8e48-4a10-8fce-013ee82cbddd",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757501869920-1_1__afflelou_core_07630629442351_67664ffbd12bf.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "16e6dce7-0e48-4983-94eb-f51f9873939a",
    name: "PC Gamer",
    description: "test",
    brand: "samsung",
    gender: "Male",
    quantity: 0,
    image:
      "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/main/1757501912509-_afflelou_core_07630629438897_67664ff9ef6fc.jpg",
    rating: 0,
    reviewCount: 0,
    price: 10,
    newPrice: 5,
    status: "active",
    trending: false,
    tags: null,
    createAt: "9/10/2025",
    averageRating: 0,
    category: {
      id: "2",
      category: "accessoires",
      displayText: "Accessoires",
      imageUrl:
        "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/categories/1756718462082-UI-community.png",
    },
    variants: [
      {
        id: "17d753e9-17c4-4f00-b499-00bbe7053e05",
        color: "#ff0000",
        size: "XL",
        qte: 10,
        images: [
          {
            id: "b918ad00-5128-46e9-bff4-9277de7a94b4",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757503138441-_afflelou_core_07630629442931_6793212a05018.jpg",
          },
          {
            id: "086e68b6-e206-4bde-9b8b-0816d4a4b79d",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757503138734-_afflelou_core_07630629442931_6793212a385ed.jpg",
          },
        ],
      },
      {
        id: "7a16183e-c86f-45a4-b036-3f53cb2c5f73",
        color: "#417505",
        size: "L",
        qte: 20,
        images: [
          {
            id: "62661d3b-f3a9-4eb9-b2a6-1a265272ec4d",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757503161977-_afflelou_core_07630629442399_67664ff796e96.jpg",
          },
          {
            id: "dac265de-187c-409c-b493-627b8b175dcd",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757503161726-_afflelou_core_07630629442399_67664ff77e7b5.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "b355ab36-b995-409a-9798-e4d2af047d8e",
    name: "Phone",
    description: "test",
    brand: "apple",
    gender: "Male",
    quantity: 0,
    image:
      "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/main/1757514337343-3.png",
    rating: 0,
    reviewCount: 0,
    price: 50,
    newPrice: 40,
    status: "active",
    trending: false,
    tags: null,
    createAt: "9/10/2025",
    averageRating: 0,
    category: {
      id: "1",
      category: "sport",
      displayText: "Sport",
      imageUrl:
        "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/categories/1756718454005-Schema-Diagram.png",
    },
    variants: [
      {
        id: "e38d47a4-9d10-4074-a0b4-57c13ce255ac",
        color: "#f5a623",
        size: "XXL",
        qte: 10,
        images: [
          {
            id: "24396170-b3c8-45ea-b1b9-39f58ba06d68",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757514406414-0_1_2.jpg",
          },
          {
            id: "23446ee7-acd2-4699-b0cf-45a1a4edc646",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757514406087-0_0_3.jpg",
          },
        ],
      },
      {
        id: "03b4deae-5fcf-4e52-8da6-b633a3693914",
        color: "#b70000",
        size: "M",
        qte: 10,
        images: [
          {
            id: "2495480f-4515-445c-ac14-9ffa858c98e0",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757514406746-1_0_1.png",
          },
        ],
      },
    ],
  },
  {
    id: "6d9fcc89-f379-4f89-98e1-0c55b8f625c8",
    name: "Phone",
    description: "THis is the best smartphone ever",
    brand: "apple",
    gender: "Male",
    quantity: 0,
    image:
      "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/main/1757502052540-_afflelou_core_07630629442351_67664ffbd12bf.jpg",
    rating: 0,
    reviewCount: 0,
    price: 1020,
    newPrice: 1050,
    status: "active",
    trending: false,
    tags: null,
    createAt: "9/10/2025",
    averageRating: 0,
    category: {
      id: "1",
      category: "sport",
      displayText: "Sport",
      imageUrl:
        "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/categories/1756718454005-Schema-Diagram.png",
    },
    variants: [
      {
        id: "a0332640-0338-40fc-ab23-23ed3f90836e",
        color: "#b8e986",
        size: "M",
        qte: 10,
        images: [
          {
            id: "6c1ae26e-fcef-48af-9fc2-6de2ef144055",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757502915824-_afflelou_core_07630629446915_679473167b9bb.jpg",
          },
          {
            id: "1a095e05-fe61-40f8-960c-3f734f9c2ebf",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757502915388-_afflelou_core_07630629442399_67664ff77e7b5.jpg",
          },
        ],
      },
      {
        id: "02d7455c-b390-4e9c-9cea-b9725a702742",
        color: "white",
        size: "XL",
        qte: 12,
        images: [
          {
            id: "b0d50d8d-7e8c-4fa4-b052-5d49662fff6a",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757502871792-_afflelou_core_07630629438897_67664ff9ef6fc.jpg",
          },
          {
            id: "1781e379-23aa-4de7-a462-2308b10a0cc4",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757502871328-_afflelou_core_07630629442399_67664ff77e7b5.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "a19ab4e2-2625-4641-83d7-eef08ae42283",
    name: "Rban-glass ",
    description: "test",
    brand: "Ray-Ban",
    gender: "Male",
    quantity: 0,
    image:
      "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/main/1757501695974-_afflelou_core_07630629446915_679473167b9bb.jpg",
    rating: 0,
    reviewCount: 0,
    price: 50,
    newPrice: 20,
    status: "active",
    trending: false,
    tags: null,
    createAt: "9/10/2025",
    averageRating: 0,
    category: {
      id: "2",
      category: "accessoires",
      displayText: "Accessoires",
      imageUrl:
        "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/categories/1756718462082-UI-community.png",
    },
    variants: [
      {
        id: "2b9cef6c-1adf-412f-89ff-52bcba9b9feb",
        color: "#c9bebe",
        size: "M",
        qte: 10,
        images: [
          {
            id: "19923b7f-11bf-4fc2-8e3b-b8caad6ec1bd",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757501760587-0_0__afflelou_core_07630629446915_679473164e0ba.jpg",
          },
          {
            id: "2fe0de0e-204f-46c4-89b2-a40f4e859505",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757501761044-0_1__afflelou_core_07630629442931_6793212a05018.jpg",
          },
        ],
      },
      {
        id: "8aa9b04d-7adb-436a-a764-d7ac02d6f353",
        color: "#4a90e2",
        size: "M",
        qte: 10,
        images: [
          {
            id: "33833694-a2e2-4b54-99ae-268cb3dbd053",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757501762078-1_1__afflelou_core_07630629442931_6793212a05018.jpg",
          },
          {
            id: "f7e3def8-04cc-4bff-a005-53cb249a729f",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/variants/1757501761394-1_0__afflelou_core_07630629442931_6793212a385ed.jpg",
          },
        ],
      },
    ],
  },
];

const MightLikeSection: FC = () => {
  const [slider, setSlider] = useState<any>(null);
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const OPTIONS = {
      perView: 4,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: { perView: 3 },
        1024: { gap: 20, perView: 3 },
        768: { gap: 20, perView: 2 },
        640: { gap: 20, perView: 1.5 },
        500: { gap: 20, perView: 1.3 },
      },
    };
    if (!sliderRef.current) return;
    let glideSlider = new Glide(sliderRef.current, OPTIONS);
    glideSlider.mount();
    setSlider(glideSlider);
    setIsShow(true);
    return () => {
      glideSlider.destroy();
    };
  }, [sliderRef]);

  // If there are no products to suggest, don't render the section
  if (!mockSuggestedProducts || mockSuggestedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          Accessories you might like
        </h2>
        <NextPrev
          onClickNext={() => slider && slider.go(">")}
          onClickPrev={() => slider && slider.go("<")}
        />
      </div>
      <div ref={sliderRef} className={`flow-root ${isShow ? "" : "invisible"}`}>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {mockSuggestedProducts.map((product, index) => (
              <li key={product.id} className="glide__slide">
                <ProductCardSmall data={product} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MightLikeSection;
