// src/components/ui/Card.tsx
import React from "react";

type CardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  changeType: "increase" | "decrease";
};

export default function StatCard({
  title,
  value,
  icon,
  change,
  changeType,
}: CardProps) {
  const isIncrease = changeType === "increase";

  return (
    <div className="nc-box-has-hover nc-dark-box-bg-has-hover p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            {value}
          </p>
        </div>
        <div className="rounded-full bg-primary-100 p-3 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
          {icon}
        </div>
      </div>
      <div className="mt-2 flex items-center text-sm">
        <span
          className={`${
            isIncrease ? "text-green-500" : "text-red-500"
          } font-semibold`}
        >
          {change}
        </span>
        <span className="ml-1 text-neutral-400">from last month</span>
      </div>
    </div>
  );
}
