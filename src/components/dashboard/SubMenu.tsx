// src/components/layout/SubMenu.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { NavLink as NavLinkType } from "@/lib/constants";

type SubMenuProps = {
  item: NavLinkType;
  onClick?: () => void;
  theme?: "light" | "dark"; // Add theme prop
};

export default function SubMenu({
  item,
  onClick,
  theme = "light",
}: SubMenuProps) {
  const pathname = usePathname();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const isParentActive =
    item.children?.some((child) => pathname === child.href) ?? false;

  useEffect(() => {
    if (isParentActive) {
      setIsSubMenuOpen(true);
    }
  }, [isParentActive]);

  const isDarkTheme = theme === "dark";

  // --- Conditional Styles ---
  const buttonClasses = isParentActive
    ? isDarkTheme
      ? "bg-slate-800 text-white"
      : "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
    : isDarkTheme
    ? "text-neutral-400 hover:bg-slate-800 hover:text-white"
    : "text-neutral-600 hover:bg-primary-100 dark:text-neutral-300 dark:hover:bg-primary-900";

  const borderClass = isDarkTheme
    ? "border-slate-700"
    : "border-neutral-300 dark:border-neutral-600";

  const getChildLinkClasses = (href: string) => {
    const isActive = pathname === href;
    if (isActive) return "bg-primary-500 text-white";

    return isDarkTheme
      ? "text-neutral-400 hover:text-white"
      : "text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400";
  };

  return (
    <li>
      <button
        onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 transition-all ${buttonClasses}`}
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

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isSubMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul
            className={`ml-4 mt-2 flex flex-col gap-1 border-l pl-4 ${borderClass}`}
          >
            {item.children?.map((child) => (
              <li key={child.label}>
                <Link
                  href={child.href as any}
                  onClick={onClick}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all ${getChildLinkClasses(
                    child.href as string
                  )}`}
                >
                  <child.icon className="h-4 w-4" />
                  <span>{child.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}
