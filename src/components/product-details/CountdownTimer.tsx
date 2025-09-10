// @/components/CountdownTimer.tsx
import React, { useMemo, useState, useEffect } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";

interface CountdownTimerProps {
  endDate: string | Date;
  price: number;
  newPrice?: number | null;
}

const calculateTimeLeft = (endDate: string | Date) => {
  const difference = +new Date(endDate) - +new Date();
  let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endDate,
  price,
  newPrice,
}) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

  // --- DERIVED DATA ---
  const discountPercentage = useMemo(() => {
    if (!newPrice || !price || newPrice >= price) {
      return 0;
    }
    const discount = ((price - newPrice) / price) * 100;
    return Math.round(discount);
  }, [price, newPrice]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    return () => clearTimeout(timer);
  });

  const allPartsZero = Object.values(timeLeft).every((part) => part === 0);

  // --- RENDER FUNCTIONS ---
  const renderTimer = () => {
    if (allPartsZero) {
      return (
        <div className="text-sm font-medium text-amber-600 dark:text-amber-400">
          Offer has ended!
        </div>
      );
    }

    const TimeBox = ({ value, label }: { value: number; label: string }) => (
      <div className="flex flex-col items-center leading-none">
        <span className="text-base font-semibold text-slate-800 dark:text-slate-200">
          {String(value).padStart(2, "0")}
        </span>
        <span className="text-[10px] text-slate-500 uppercase">{label}</span>
      </div>
    );

    return (
      <div className="flex items-center gap-1.5 sm:gap-2 text-center">
        <ClockIcon className="w-5 h-5 text-teal-500" />
        <TimeBox value={timeLeft.days} label="Days" />
        <span className="text-slate-400 -mt-2">:</span>
        <TimeBox value={timeLeft.hours} label="Hours" />
        <span className="text-slate-400 -mt-2">:</span>
        <TimeBox value={timeLeft.minutes} label="Mins" />
        <span className="text-slate-400 -mt-2">:</span>
        <TimeBox value={timeLeft.seconds} label="Secs" />
      </div>
    );
  };

  // If no discount, render nothing
  if (discountPercentage <= 0) {
    return null;
  }

  // Render the full discount banner
  return (
    <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg border border-teal-200 dark:border-teal-800/50 flex items-center justify-between space-x-2">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 bg-teal-500 text-white text-sm font-bold px-3 py-1.5 rounded-md">
          -{discountPercentage}%
        </div>
        <p className="text-teal-700 dark:text-teal-300 font-medium text-sm sm:text-base">
          Limited time offer!
        </p>
      </div>
      {renderTimer()}
    </div>
  );
};

export default CountdownTimer;
