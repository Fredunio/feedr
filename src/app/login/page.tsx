"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const session = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    const loginResponse = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
      callbackUrl: "/",
    });

    const redirectTo = searchParams.get("redirectTo");

    if (redirectTo) {
      router.push(redirectTo);
    }

    router.push("/");
  };
  if (session.data?.user) {
    router.back();
  } else
    return (
      <section className="flex flex-col page-container items-center justify-center h-full">
        <div className="border-1 shadow-md px-10 py-10 flex items-center min-w-[26rem] justify-center flex-col">
          <h1 className="text-5xl font-bold flex gap-4 items-center">
            <Image
              src={"/pizza_logo.svg"}
              alt={"logo"}
              width={60}
              height={60}
            />
            Feedr
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex items-center mt-10 gap-4 flex-col w-full"
          >
            <div className="w-full">
              <input
                disabled={loggingIn}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                className="text-input"
                type="email"
                id="email"
              />
            </div>
            <div className="w-full">
              <input
                disabled={loggingIn}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
                className="text-input"
                type="password"
                id="password"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              disabled={loggingIn}
              className="bg-primary rounded-md text-slate-50 px-4 py-2 w-full text-lg font-semibold hover:bg-primaryLight"
              type="submit"
            >
              Login
            </button>
          </form>
          <p className="my-2">or</p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex items-center justify-center gap-4 rounded-md border-1 px-4 py-2 w-full text-lg  "
            type="submit"
          >
            <span>Continue with Google</span>
            <Image src={"/google.png"} alt={"google"} width={20} height={20} />
          </button>

          <p className="text-slate-600 mt-8 ">
            Don&apos;t have an account?
            <Link className="text-primary font-semibold" href="/login">
              {" "}
              Login
            </Link>
          </p>
        </div>
      </section>
    );
}
