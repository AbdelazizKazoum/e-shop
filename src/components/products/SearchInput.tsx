"use client";

import { useFilterStore } from "@/stores/filterStore";
import Input from "@/shared/Input/Input";
import ButtonCircle from "@/shared/Button/ButtonCircle";
import { FormEvent, useState } from "react";

export default function SearchInput() {
  const { setName, name } = useFilterStore();
  const [localValue, setLocalValue] = useState(name);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", localValue);
    setName(localValue); // 👈 trigger filter store only here
  };

  return (
    <form className="relative w-full" onSubmit={handleSubmit}>
      <label
        htmlFor="search-input"
        className="text-neutral-500 dark:text-neutral-300"
      >
        <span className="sr-only">Search all products</span>
        <Input
          className="shadow-lg border-0 dark:border"
          id="search-input"
          type="search"
          placeholder="Type your keywords"
          sizeClass="pl-14 py-5 pr-5 md:pl-16"
          rounded="rounded-full"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)} // 👈 only local state changes
        />
        <ButtonCircle
          className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
          size=" w-11 h-11"
          type="submit"
        >
          <i className="las la-arrow-right text-xl"></i>
        </ButtonCircle>
        <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 22L20 20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </label>
    </form>
  );
}
