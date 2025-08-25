// src/components/ui/form/Input.tsx
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Input({ label, id, ...props }: InputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
      </label>
      <input
        id={id}
        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
        {...props}
      />
    </div>
  );
}
