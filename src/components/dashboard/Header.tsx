// src/components/layout/Header.tsx
"use client";

import { useState, useRef } from "react";
import { Menu, Search, Bell, User, LogOut, Settings } from "lucide-react";
import MobileSidebar from "./MobileSidebar";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  return (
    <>
      {/* Render the Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />

      <header className="sticky top-0 z-30 flex w-full items-center justify-between bg-white px-4 py-3 shadow-sm dark:bg-neutral-800 dark:border-b dark:border-neutral-700 md:px-6">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
        </button>

        {/* Search Bar - hidden on mobile */}
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-md border border-neutral-200 bg-neutral-50 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          <button aria-label="Notifications">
            <Bell className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="User menu"
            >
              <User className="h-8 w-8 rounded-full bg-neutral-200 p-1 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300" />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out dark:bg-neutral-800 dark:ring-neutral-700 ${
                isDropdownOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
            >
              <div className="py-1">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
