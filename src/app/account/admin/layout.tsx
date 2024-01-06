"use client";

import { fetcher } from "@/app/lib/fetcher";
import { TUser } from "@/app/models/User";
import { useRouter } from "next/navigation";
import React from "react";
import useSWR from "swr";

function AdminAccountLayout({ children }: { children: React.ReactNode }) {
  const { data: user } = useSWR<TUser>("/api/profile", fetcher);
  const router = useRouter();

  if (user?.admin === undefined) {
    return null;
  }

  if (user?.admin === false) {
    router.push("/account");
    return null;
  }
  return <>{children}</>;
}

export default AdminAccountLayout;
