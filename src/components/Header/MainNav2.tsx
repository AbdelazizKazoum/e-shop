"use client";

import React, { FC, useState } from "react";
import Logo from "@/shared/Logo/Logo";
import MenuBar from "@/shared/MenuBar/MenuBar";
import LangDropdown from "./LangDropdown";
import AvatarDropdown from "./AvatarDropdown";
import TemplatesDropdown from "./TemplatesDropdown";
import DropdownCategories from "./DropdownCategories";
import CartDropdown from "./CartDropdown";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useFilterStore } from "@/stores/filterStore"; // 👈 import store
import { useSession } from "next-auth/react";
import Link from "next/link";

export interface MainNav2Props {
  className?: string;
}

const MainNav2: FC<MainNav2Props> = ({ className = "" }) => {
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const { setName } = useFilterStore();

  const { data: session, status } = useSession(); // <-- 2. Get session info

  const renderMagnifyingGlassIcon = () => {
    return (
      <svg
        width={22}
        height={22}
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
    );
  };

  const renderSearchForm = () => {
    return (
      <form
        className="flex-1 py-2 text-slate-900 dark:text-slate-100"
        onSubmit={(e) => {
          e.preventDefault();
          setName(searchValue); // 👈 update store only on submit
          router.push("/search"); // 👈 redirect
          setShowSearchForm(false);
        }}
      >
        <div className="bg-slate-50 dark:bg-slate-800 flex items-center space-x-1.5 px-5 h-full rounded">
          <button type="submit" className="flex items-center justify-center">
            {renderMagnifyingGlassIcon()}
          </button>
          <input
            type="text"
            placeholder="Type and press enter"
            className="border-none bg-transparent focus:outline-none focus:ring-0 w-full text-base"
            autoFocus
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)} // 👈 local state only
          />
          <button type="button" onClick={() => setShowSearchForm(false)}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    );
  };
  return (
    <div className="nc-MainNav2 relative z-10 bg-white dark:bg-slate-900 ">
      <div className="container">
        <div className="h-20 flex justify-between">
          {/* ... left side elements unchanged */}

          <div className="flex-1 flex items-center justify-end ">
            {!showSearchForm && <TemplatesDropdown />}
            {!showSearchForm && <LangDropdown />}
            {!showSearchForm && (
              <button
                className="hidden lg:flex w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none items-center justify-center"
                onClick={() => setShowSearchForm(!showSearchForm)}
              >
                {renderMagnifyingGlassIcon()}
              </button>
            )}

            {/* ✅ 3. Conditional rendering based on auth */}
            {status === "loading" ? null : session?.user ? (
              <AvatarDropdown />
            ) : (
              <div className="flex items-center gap-4 ml-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:underline"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-green-600 hover:underline"
                >
                  Register
                </Link>
              </div>
            )}

            <CartDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav2;
