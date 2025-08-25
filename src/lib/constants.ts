// src/lib/constants.ts
import { Home, ShoppingBag, Package, Users } from "lucide-react";

export const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
];
