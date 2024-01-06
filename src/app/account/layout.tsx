"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { TUser } from "../models/User";
import AccountLinks from "./AccountLinks";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const router = useRouter();
  const { data: user } = useSWR<TUser>("/api/profile", fetcher);

  if (session.status === "unauthenticated") {
    router.push("/login");
    return null;
  } else
    return (
      <section className="md:w-[50rem] flex flex-col px-4 mx-auto py-12">
        <AccountLinks isAdmin={user?.admin} />
        {children}
      </section>
    );
}
