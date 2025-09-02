import React, { FC } from "react";
import MainNav2Logged from "./MainNav2Logged";
import { User } from "next-auth";

const HeaderLogged = ({ user }: { user: User | null }) => {
  return (
    <div className="nc-HeaderLogged sticky top-0 w-full z-40 ">
      <MainNav2Logged user={user} />
    </div>
  );
};

export default HeaderLogged;
