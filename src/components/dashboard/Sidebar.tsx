// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import SubMenu from "./SubMenu";

// Define the props for the Sidebar component
type SidebarProps = {
  theme?: "light" | "dark"; // Theme can be 'light' or 'dark'
};

export default function Sidebar({ theme = "light" }: SidebarProps) {
  const pathname = usePathname();

  // Define styles based on the theme
  const isDarkTheme = theme === "dark";

  const sidebarClasses = isDarkTheme
    ? "bg-slate-900 text-white"
    : "bg-neutral-100 dark:bg-neutral-800";

  const titleClasses = isDarkTheme
    ? "text-xl font-bold"
    : "text-xl font-bold text-neutral-800 dark:text-neutral-100";

  const logoColorClass = isDarkTheme ? "text-white" : "text-primary-500";

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;
    if (isActive) return "bg-primary-500 text-white";

    return isDarkTheme
      ? "text-neutral-400 hover:bg-slate-800 hover:text-white"
      : "text-neutral-600 hover:bg-primary-100 dark:text-neutral-300 dark:hover:bg-primary-900";
  };

  return (
    <aside className={`hidden w-72 flex-col p-4 md:flex ${sidebarClasses}`}>
      {/* Logo and App Name - Logo is now always the SVG */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-8 w-8 ${logoColorClass}`}
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
        <h1 className={titleClasses}>Admin Panel</h1>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((link) =>
            link.children ? (
              // Pass the theme prop down to the SubMenu
              <SubMenu key={link.label} item={link} theme={theme} />
            ) : (
              <li key={link.label}>
                <Link
                  href={link.href as any}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all ${getLinkClasses(
                    link.href as string
                  )}`}
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
