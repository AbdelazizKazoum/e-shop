// src/components/layout/SubMenu.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { NavLink as NavLinkType } from "@/lib/constants"; // Import the type

type SubMenuProps = {
  item: NavLinkType;
  onClick?: () => void; // Optional: for closing mobile menu on nav
};

export default function SubMenu({ item, onClick }: SubMenuProps) {
  const pathname = usePathname();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  // Check if the current path is a child of this submenu
  const isParentActive =
    item.children?.some((child) => pathname === child.href) ?? false;

  // Open submenu by default if a child route is active
  useEffect(() => {
    if (isParentActive) {
      setIsSubMenuOpen(true);
    }
  }, [isParentActive]);

  return (
    <li>
      <button
        onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 transition-all
          ${
            isParentActive
              ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
              : "text-neutral-600 hover:bg-primary-100 dark:text-neutral-300 dark:hover:bg-primary-900"
          }
        `}
      >
        <div className="flex items-center gap-3">
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            isSubMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Animated Submenu */}
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isSubMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="ml-4 mt-2 flex flex-col gap-1 border-l border-neutral-300 pl-4 dark:border-neutral-600">
            {item.children?.map((child) => {
              const isActive = pathname === child.href;
              return (
                <li key={child.label}>
                  <Link
                    href={child.href}
                    onClick={onClick}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all
                      ${
                        isActive
                          ? "bg-primary-500 text-white"
                          : "text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
                      }
                    `}
                  >
                    <child.icon className="h-4 w-4" />
                    <span>{child.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}
