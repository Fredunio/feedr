"use client";

import AddressForm, { TAddressValues } from "@/app/account/AddressForm";
import AvatarForm, { schemaImage } from "@/app/account/AvatarForm";
import UserForm, { TFormUserData } from "@/app/account/UserForm";
import { fetcher } from "@/app/lib/fetcher";
import { TUser } from "@/app/models/User";
import React from "react";
import { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR from "swr";
import * as yup from "yup";

function UserPage({ params }: { params: { id: string } }) {
  const {
    data: userData,
    isLoading: isLoadingUserData,
    mutate: mutateUserData,
  } = useSWR<TUser & { _id: string }>(`/api/profile?_id=${params.id}`, fetcher);

  console.log("userData", userData);

  const onSubmitUserForm: SubmitHandler<TFormUserData> = async (data) => {
    if (!userData) return;

    toast.promise(
      fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: userData._id,
          name: data.name,
        }),
      }).then((res) => res.json()),
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
    if (!userData) {
      return;
    }
    if (!data.image || data.image.length === 0) {
      return;
    }

    const formData = new FormData();

    // TODO: check why data.image is [object File]
    // formData.set("file", getValuesImage("image")![0]);
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
          body: JSON.stringify({
            _id: userData._id,
            image: link,
          }),
        }).then(() => {
          //   setValueImage("image", undefined);
          mutateUserData();
        });
      });

    toast.promise(uploadPromise, {
      loading: "Updating profile image...",
      success: "Profile image updated!",
      error: "Error updating profile image",
    });
  };

  const onAddressSubmit: SubmitHandler<TAddressValues> = async (data: any) => {
    if (!userData) {
      return;
    }
    const savePromise = fetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify({ ...data, _id: userData._id }),
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

  if (isLoadingUserData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-20">
      <div className="">
        <h1 className="text-4xl font-extrabold mb-8">
          {userData?.name || "No name"} ({userData?.email})
        </h1>
        <h2 className="text-2xl font-extrabold mb-8">Personal</h2>
        <div className="flex items-start justify-center gap-20">
          <AvatarForm
            onSubmit={onImageSubmit}
            defaultValues={{ image: userData?.image || undefined }}
          />
          <UserForm
            onSubmit={onSubmitUserForm}
            defaultValues={{
              name: userData?.name || undefined,
              email: userData?.email || undefined,
            }}
          />
        </div>
      </div>
      <AddressForm
        onSubmit={onAddressSubmit}
        defaultValues={{
          streetAddress: userData?.streetAddress || undefined,
          city: userData?.city || undefined,
          zip: userData?.zip || undefined,
          country: userData?.country || undefined,
          phoneNumber: userData?.phoneNumber || undefined,
          state: userData?.state || undefined,
        }}
      />
    </div>
  );
}

export default UserPage;
