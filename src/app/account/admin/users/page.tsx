"use client";

import { fetcher } from "@/app/lib/fetcher";
import { TUser } from "@/app/models/User";
import React from "react";
import useSWR from "swr";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import UserTable from "./UserTable";

function UsersPage() {
  const { data: users } = useSWR<TUser[]>("/api/users", fetcher);

  return (
    <div>
      <UserTable users={users} />
    </div>
  );
}

export default UsersPage;
