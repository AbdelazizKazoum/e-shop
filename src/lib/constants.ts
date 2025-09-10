// src/lib/constants.ts
import {
  Home,
  ShoppingBag,
  Package,
  Users,
  PlusCircle,
  List,
  Archive,
} from "lucide-react";

// Define the type for a single navigation link
export type NavLink = {
  href: string;
  label: string;
  icon: React.ElementType;
  children?: NavLink[]; // Add optional children for submenus
};

export const NAV_LINKS: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  {
    href: "/products", // Parent link
    label: "Products",
    icon: Package,
    children: [
      // Submenu items
      { href: "/dashboard/products", label: "All Products", icon: List },
      { href: "/dashboard/products/new", label: "Add New", icon: PlusCircle },
    ],
  },

  // Parameters
  // {
  //   href: "/parameters", // Parent link
  //   label: "Parameters",
  //   icon: Package,
  //   children: [
  //     // Submenu items
  //     { href: "/dashboard/parameters", label: "All Parameters", icon: List },
  //     { href: "/dashboard/parameters/new", label: "Add New", icon: PlusCircle },
  //   ],
  // },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/stock", label: "Stock", icon: Archive },
  { href: "/dashboard/parameters", label: "Parameters", icon: Users },
];
