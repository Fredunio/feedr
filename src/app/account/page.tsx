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

const schemaNames = yup
  .object({
    userName: yup.string().min(3, "Name must be at least 3 characters"),
    email: yup.string().email(),
  })
  .required();

const schemaImage = yup
  .object({
    image: yup.string(),
  })
  .required();

export default function AccountPage() {
  const session = useSession();
  const path = usePathname();

  const {
    data: profileData,
    error: errorProfile,
    isLoading: isLoadingProfile,
  } = useSWR<TUser>("/api/profile", fetcher);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading, isValidating },
  } = useForm({
    disabled:
      session.status === "unauthenticated" ||
      isLoadingProfile ||
      !session.data?.user,

    resolver: yupResolver(schemaNames),
    defaultValues: async () => {
      return {
        userName: user?.name || undefined,
        email: user?.email || undefined,
      };
    },
  });

  const {
    register: registerImage,
    handleSubmit: handleSubmitImage,
    setValue: setValueImage,
    getValues: getValuesImage,
    watch: watchImage,
    formState: {
      errors: errorsImage,
      isSubmitting: isSubmittingImage,
      isLoading: isLoadingImage,
    },
  } = useForm({
    resolver: yupResolver(schemaImage),
  });

  if (session.status === "unauthenticated") {
    return redirect("/login");
  }

  const { status, data } = session;
  const user = data?.user;

  const onSubmit: SubmitHandler<yup.InferType<typeof schemaNames>> = async (
    data
  ) => {
    toast.promise(
      fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: data.userName }),
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
    formData.set("file", getValuesImage("image")![0]);

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
          setValueImage("image", undefined);
        });
      });

    toast.promise(uploadPromise, {
      loading: "Updating profile image...",
      success: "Profile image updated!",
      error: "Error updating profile image",
    });
  };

  const imagePreview =
    watchImage("image") !== undefined && watchImage("image")![0] !== undefined
      ? URL.createObjectURL(watchImage("image")[0])
      : user?.image || "/default-avatar.jpg";

  return (
    <div className="flex flex-col gap-20">
      <div className="">
        <h2 className="text-2xl font-extrabold mb-8">Personal</h2>
        <div className="flex items-start justify-center gap-20">
          <form
            onSubmit={handleSubmitImage(onImageSubmit)}
            className="flex flex-col gap-2"
          >
            <label
              tabIndex={0}
              htmlFor="image"
              title="Avatar"
              className="group relative cursor-pointer"
              // onClick={() => {
              //   document.getElementById("image")?.click();
              // }}
            >
              <Image
                alt="Profile Image"
                src={imagePreview}
                width={200}
                height={200}
                className="rounded-md group-hover:opacity-50 transition-opacity duration-100"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-slate-600 group-hover:opacity-100 opacity-0 transition-opacity duration-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </label>
            <input
              title="Avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              id="image"
              className="border hidden border-gray-300 rounded-md"
              {...registerImage("image")}
            />
            <button
              disabled={
                getValuesImage("image") === undefined ||
                getValuesImage("image")!.length === 0 ||
                isSubmittingImage ||
                isLoadingImage ||
                Boolean(errorsImage.image?.message)
              }
              type="submit"
              className="border-1  text-primaryDark hover:border-primaryLight text-lg px-4 py-2 rounded-md"
            >
              Upload
            </button>
          </form>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-2"
          >
            <label className="input-label" htmlFor="name">
              Name
            </label>
            <input
              disabled={isSubmitting}
              type="text"
              id="name"
              className="border text-input border-gray-300 rounded-md"
              {...register("userName")}
            />
            <label className="input-label" htmlFor="email">
              Email
            </label>
            <div className="flex items-center gap-2">
              <input
                disabled
                type="text"
                id="email"
                className="border text-input border-gray-300 rounded-md"
                {...register("email")}
              />
              <button
                type="button"
                className="border-1  text-primaryDark hover:border-primaryLight text-lg px-4 py-2 rounded-md"
              >
                Verify
              </button>
            </div>
            <div className="flex items-center justify-between mt-8 ">
              <button
                type="reset"
                className="border-1 hover:bg-slate-50 active:bg-slate-100 text-slate-900 text-lg px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primaryLight font-semibold active:bg-primaryDark  text-white text-lg px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </form>
          {/* <DevTool control={control} /> */}
        </div>
      </div>
      <AddressForm />
    </div>
  );
}
