"use client";

import React from "react";
import { usePathname } from "next/navigation";
import HeaderLogged from "@/components/Header/HeaderLogged";
import Header from "@/components/Header/Header";
import { useThemeMode } from "@/hooks/useThemeMode";
import { User } from "next-auth";

const SiteHeader = ({ user }: { user: User | null }) => {
  useThemeMode();

  let pathname = usePathname();

  return pathname === "/home-2" ? (
    <Header user={user} />
  ) : (
    <HeaderLogged user={user} />
  );
};

export default SiteHeader;
