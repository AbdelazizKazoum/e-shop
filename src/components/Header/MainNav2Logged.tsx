"use client";

import React, { FC, useState } from "react";
import Logo from "@/shared/Logo/Logo";
import MenuBar from "@/shared/MenuBar/MenuBar";
import AvatarDropdown from "./AvatarDropdown";
import Navigation from "@/shared/Navigation/Navigation";
import CartDropdown from "./CartDropdown";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useFilterStore } from "@/stores/filterStore"; // 👈 import store
import Link from "next/link";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { User } from "next-auth";

export interface MainNav2LoggedProps {}

const MainNav2Logged = ({ user }: { user: User | null }) => {
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const { setName } = useFilterStore();

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

  const renderContent = () => {
    return (
      <div className="h-20 flex justify-between">
        {/* Left: Logo and Menu */}
        <div className="flex items-center lg:hidden flex-1">
          <MenuBar user={user} />
        </div>
        <div className="lg:flex-1 flex items-center">
          <Logo className="flex-shrink-0" />
        </div>

        {/* Center: Search or Navigation */}
        <div className="flex-[2] hidden lg:flex justify-center mx-4">
          {showSearchForm ? renderSearchForm() : <Navigation />}
        </div>

        {/* Right: Icons + Auth */}
        <div className="flex-1 flex items-center justify-end text-slate-700 dark:text-slate-100">
          {/* ✅ Conditional Auth Rendering */}
          {user ? (
            <AvatarDropdown user={user} />
          ) : (
            <div className="hidden sm:flex items-center gap-2 ml-4 mr-2">
              <ButtonSecondary href="/login" sizeClass="px-4 py-2 sm:px-5">
                Login
              </ButtonSecondary>
              <ButtonPrimary href="/signup" sizeClass="px-4 py-2 sm:px-5">
                Register
              </ButtonPrimary>
            </div>
          )}

          {!showSearchForm && (
            <button
              className="hidden lg:flex w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none items-center justify-center"
              onClick={() => setShowSearchForm(!showSearchForm)}
            >
              {renderMagnifyingGlassIcon()}
            </button>
          )}

          <CartDropdown />
        </div>
      </div>
    );
  };

  return (
    <div className="nc-MainNav2Logged relative z-10 bg-white dark:bg-neutral-900 border-b border-slate-100 dark:border-slate-700">
      <div className="container">{renderContent()}</div>
    </div>
  );
};

export default MainNav2Logged;
