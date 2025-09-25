"use client";

import React, { FC, useState } from "react";
import Next from "@/shared/NextPrev/Next";
import Prev from "@/shared/NextPrev/Prev";
import useInterval from "react-use/lib/useInterval";
import useBoolean from "react-use/lib/useBoolean";
import Image from "next/image";
import Link from "next/link";

// Define the data for the carousel
const SLIDER_DATA = [
  {
    id: 1,
    desktopImage:
      "https://static.tendaglasses.com/media/banner/banner-1-f7ecb28e3a53677559bdd23470c167ab.jpg?x-oss-process=style/banner",
    mobileImage:
      "https://static.tendaglasses.com/media/banner/banner-m-1-6504bb16f128c1704cafc97639d0c84a.jpg?x-oss-process=style/banner",
    href: "/search",
  },
  {
    id: 2,
    desktopImage:
      "https://static.tendaglasses.com/media/banner/banner-2-897a30e9eca0c2edf3d6a485ea2a57ae.jpg?x-oss-process=style/banner",
    mobileImage:
      "https://static.tendaglasses.com/media/banner/banner-m-2-0ce4112ce35b6b1e8fa4195d2fb715df.jpg?x-oss-process=style/banner",
    href: "/search",
  },
];

export interface SectionHero2Props {
  className?: string;
}

let TIME_OUT: NodeJS.Timeout | null = null;

const SectionHero2: FC<SectionHero2Props> = ({ className = "" }) => {
  // =================
  const [indexActive, setIndexActive] = useState(0);
  const [isRunning, toggleIsRunning] = useBoolean(true);

  useInterval(
    () => {
      handleAutoNext();
    },
    isRunning ? 5500 : null
  );
  //

  const handleAutoNext = () => {
    setIndexActive((state) => {
      if (state >= SLIDER_DATA.length - 1) {
        return 0;
      }
      return state + 1;
    });
  };

  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= SLIDER_DATA.length - 1) {
        return 0;
      }
      return state + 1;
    });
    handleAfterClick();
  };

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state === 0) {
        return SLIDER_DATA.length - 1;
      }
      return state - 1;
    });
    handleAfterClick();
  };

  const handleAfterClick = () => {
    toggleIsRunning(false);
    if (TIME_OUT) {
      clearTimeout(TIME_OUT);
    }
    TIME_OUT = setTimeout(() => {
      toggleIsRunning(true);
    }, 1000);
  };
  // =================

  const renderItem = (index: number) => {
    const isActive = indexActive === index;
    const item = SLIDER_DATA[index];
    if (!isActive) {
      return null;
    }
    return (
      <div
        className={`nc-SectionHero2Item nc-SectionHero2Item--animation relative overflow-hidden ${className}`}
        key={index}
      >
        {/* RENDER DOTS */}
        <div className="absolute bottom-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-20 flex justify-center">
          {SLIDER_DATA.map((_, index) => {
            const isActive = indexActive === index;
            return (
              <div
                key={index}
                onClick={() => {
                  setIndexActive(index);
                  handleAfterClick();
                }}
                className={`relative px-1 py-1.5 cursor-pointer`}
              >
                <div
                  className={`relative w-20 h-1 shadow-sm rounded-md bg-white`}
                >
                  {isActive && (
                    <div
                      className={`nc-SectionHero2Item__dot absolute inset-0 bg-slate-900 rounded-md`}
                    ></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* RENDER PREV & NEXT BUTTONS */}
        <Prev
          className="absolute start-1 sm:start-5 top-1/2 -translate-y-1/2 z-10"
          btnClassName="w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400"
          svgSize="w-6 h-6"
          onClickPrev={handleClickPrev}
        />
        <Next
          className="absolute end-1 sm:end-5 top-1/2 -translate-y-1/2 z-10"
          btnClassName="w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400"
          svgSize="w-6 h-6"
          onClickNext={handleClickNext}
        />

        {/* RENDER IMAGES */}
        <Link href={item.href as any}>
          {/* Mobile Image */}
          <div className="block md:hidden aspect-w-1 aspect-h-1">
            <Image
              fill
              className="w-full h-full object-cover"
              src={item.mobileImage}
              alt="slider image"
              priority
            />
          </div>
          {/* Desktop Image */}
          <div className="hidden md:block aspect-w-16 aspect-h-[6.25]">
            <Image
              fill
              className="w-full h-full object-cover"
              src={item.desktopImage}
              alt="slider image"
              priority
            />
          </div>
        </Link>
      </div>
    );
  };

  return <>{SLIDER_DATA.map((_, index) => renderItem(index))}</>;
};

export default SectionHero2;
