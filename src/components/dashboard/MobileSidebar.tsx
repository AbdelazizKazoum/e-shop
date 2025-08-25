// src/components/layout/MobileSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { X } from "lucide-react";

type MobileSidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function MobileSidebar({
  isOpen,
  setIsOpen,
}: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out md:hidden ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar Panel */}
      <aside
        className={`relative flex h-full w-72 flex-col bg-neutral-100 p-4 transition-transform duration-300 ease-in-out dark:bg-neutral-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary-500" />
            <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
              Admin Panel
            </h1>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav>
          <ul>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)} // Close menu on navigation
                    className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all
                      ${
                        isActive
                          ? "bg-primary-500 text-white"
                          : "text-neutral-600 hover:bg-primary-100 dark:text-neutral-300 dark:hover:bg-primary-900"
                      }
                    `}
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
