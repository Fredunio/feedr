"use client";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import AddressForm from "./AddressForm";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { TUser } from "../models/User";
import AvatarForm, { schemaImage } from "./AvatarForm";
import UserForm, { TFormUserData } from "./UserForm";

export default function AccountPage() {
  const session = useSession();

  const {
    data: profileData,
    error: errorProfile,
    isLoading: isLoadingProfile,
    mutate: mutateProfile,
  } = useSWR<TUser>("/api/profile", fetcher);

  console.log("profileData", profileData);

  if (session.status === "unauthenticated") {
    return redirect("/login");
  }

  const { status, data } = session;
  const user = data?.user;

  const onSubmit: SubmitHandler<TFormUserData> = async (data) => {
    toast.promise(
      fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: data.name }),
      })
        .then((res) => res.json())
        .then((res) => {}),
      {
        loading: "Updating profile...",
        success: "Profile updated!",
        error: "Error updating profile",
      }
    );
  };

  const onImageSubmit: SubmitHandler<
    yup.InferType<typeof schemaImage>
  > = async (data) => {
    if (!data.image || data.image.length === 0) {
      return;
    }
    const formData = new FormData();

    // TODO: check why data.image is [object File]
    formData.set("file", data.image[0]);

    const uploadPromise = fetch("/api/uploadImage", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Error uploading image");
      })
      .then((link) => {
        fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: link }),
        }).then(() => {
          mutateProfile();
        });
      });

    toast.promise(uploadPromise, {
      loading: "Updating profile image...",
      success: "Profile image updated!",
      error: "Error updating profile image",
    });
  };

  const onAddressSubmit = async (data: any) => {
    const savePromise = fetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Error updating Address Information");
    });

    toast.promise(savePromise, {
      loading: "Updating addess...",
      success: "Address updated!",
      error: "Error updating address",
    });
  };

  if (isLoadingProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-20">
      <div className="">
        <h2 className="text-2xl font-extrabold mb-8">Personal</h2>
        <div className="flex items-start justify-center gap-20">
          <AvatarForm
            onSubmit={onImageSubmit}
            defaultValues={{ image: profileData?.image || undefined }}
          />
          <UserForm
            onSubmit={onSubmit}
            defaultValues={{
              name: profileData?.name || undefined,
              email: profileData?.email || undefined,
            }}
          />
        </div>
      </div>
      <AddressForm
        onSubmit={onAddressSubmit}
        defaultValues={{
          streetAddress: profileData?.streetAddress || undefined,
          city: profileData?.city || undefined,
          zip: profileData?.zip || undefined,
          country: profileData?.country || undefined,
          phoneNumber: profileData?.phoneNumber || undefined,
          state: profileData?.state || undefined,
        }}
      />
    </div>
  );
}
