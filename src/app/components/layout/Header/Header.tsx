"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import AvatarButton from "./AvatarButton";

export default function Header() {
  const session = useSession();

  return (
    <header className=" text-lg z-10 relative bg-white flex font-semibold px-4 py-4 items-center justify-between border-b-2 shadow-sm">
      <div className="flex items-center gap-24">
        <Link className="font-bold text-2xl group" href={"/"}>
          <div className="flex items-center gap-2">
            <Image
              src={"/pizza_logo.svg"}
              alt={"Feedr Logo"}
              width={30}
              height={30}
            />
            <span className="group-hover:underline underline-offset-4">
              Feedr
            </span>
          </div>
        </Link>
        <nav className="flex text-slate-700 items-center gap-4">
          <HeaderLink href={""}>Menu</HeaderLink>
          <HeaderLink href={""}>About</HeaderLink>
          <HeaderLink href={""}>Contact</HeaderLink>
        </nav>
      </div>
      {session.status === "authenticated" ? (
        <div>
          <AvatarButton user={session.data.user} />
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            className=" shadow-md transition-colors duration-100 px-4 py-1 rounded-md hover:bg-primaryLight active:bg-primaryDark"
            href={"/login"}
          >
            Login
          </Link>
          <Link
            className="bg-primary shadow-md transition-colors duration-100 px-4 py-1 text-slate-100 rounded-md hover:bg-primaryLight active:bg-primaryDark"
            href={"/register"}
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}

function HeaderLink({ href, children }: { href: string; children: any }) {
  return (
    <Link
      href={href}
      className="hover:text-primary hover:shadow-md transition-all shadow-sm border-1 border-slate-100 rounded-md px-2 "
    >
      {children}
    </Link>
  );
}
