// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import SubMenu from "./SubMenu"; // Import the new component

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col bg-neutral-100 p-4 dark:bg-neutral-800 md:flex">
      <div className="mb-10 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary-500" />
        <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
          Admin Panel
        </h1>
      </div>
      <nav>
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((link) =>
            // If the link has children, render the SubMenu component
            link.children ? (
              <SubMenu key={link.label} item={link} />
            ) : (
              // Otherwise, render a regular link
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all
                  ${
                    pathname === link.href
                      ? "bg-primary-500 text-white"
                      : "text-neutral-600 hover:bg-primary-100 dark:text-neutral-300 dark:hover:bg-primary-900"
                  }
                `}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>
    </aside>
  );
}
