// src/components/ui/form/Select.tsx
import React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: React.ReactNode;
};

export default function Select({ label, id, children, ...props }: SelectProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
      </label>
      <select
        id={id}
        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
