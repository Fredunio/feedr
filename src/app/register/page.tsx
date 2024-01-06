"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (creatingAccount) {
      return;
    }
    setError("");
    setCreatingAccount(true);

    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        passwordConfirmation,
      }),
    });

    const responseJson = await response.json();
    if (responseJson.error) {
      setError(responseJson.message);
      setCreatingAccount(false);
      return;
    }

    if (!response.ok) {
      setError("Something went wrong, please try again later.");
      setCreatingAccount(false);
      return;
    }

    setCreatingAccount(false);
    router.push("/login");
  };

  return (
    <section className="flex flex-col items-center justify-center h-full">
      <div className="border-1 shadow-md px-10 py-10 flex items-center min-w-[26rem] justify-center flex-col">
        <h1 className="text-5xl font-bold flex gap-4 items-center">
          <Image src={"/pizza_logo.svg"} alt={"logo"} width={60} height={60} />
          Feedr
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex items-center mt-10 gap-4 flex-col w-full"
        >
          <div className="w-full">
            <input
              disabled={creatingAccount || userCreated}
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
              disabled={creatingAccount || userCreated}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              className="text-input"
              type="password"
              id="password"
            />
          </div>
          <div className="w-full">
            <input
              disabled={creatingAccount || userCreated}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              value={passwordConfirmation}
              placeholder="Confirm Password"
              className="text-input"
              type="password"
              id="passwordConfirmation"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            disabled={creatingAccount || userCreated}
            className="bg-primary rounded-md text-slate-50 px-4 py-2 w-full text-lg font-semibold hover:bg-primaryLight"
            type="submit"
          >
            Sign Up
          </button>
        </form>
        <p className="my-2">or</p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center justify-center gap-4 rounded-md border-1 px-4 py-2 w-full text-lg  "
          type="submit"
        >
          <span>Sign Up with Google</span>
          <Image src={"/google.png"} alt={"google"} width={20} height={20} />
        </button>

        <p className="text-slate-600 mt-8 ">
          Already have an account?
          <Link className="text-primary font-semibold" href="/login">
            {"/login"}
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
}
