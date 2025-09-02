import React, { FC } from "react";
import MainNav2 from "./MainNav2";
import { User } from "next-auth";

export interface HeaderProps {}

const Header = ({ user }: { user: User | null }) => {
  return (
    <div className="nc-Header relative w-full z-40 ">
      <MainNav2 />
    </div>
  );
};

export default Header;
