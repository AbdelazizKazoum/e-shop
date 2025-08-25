// src/components/ui/PageTitle.tsx
import React from "react";

type PageTitleProps = {
  title: string;
  subtitle?: string;
};

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 md:text-3xl">
        {title}
      </h1>
      {subtitle && <p className="text-neutral-500">{subtitle}</p>}
    </div>
  );
}
