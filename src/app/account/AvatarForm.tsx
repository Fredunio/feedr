import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

export const schemaImage = yup
  .object({
    image: yup.mixed(
      (input): input is FileList | string =>
        input instanceof FileList || typeof input === "string"
    ),
  })
  .required();

type TImageValues = yup.InferType<typeof schemaImage>;

function AvatarForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues: TImageValues;
  onSubmit: SubmitHandler<TImageValues>;
}) {
  const {
    register: registerImage,
    handleSubmit: handleSubmitImage,
    getValues: getValuesImage,
    watch: watchImage,
    formState: {
      errors: errorsImage,
      isSubmitting: isSubmittingImage,
      isLoading: isLoadingImage,
    },
  } = useForm({
    resolver: yupResolver(schemaImage),
    defaultValues: defaultValues,
  });

  const imagePreview =
    watchImage("image") instanceof FileList && watchImage("image")!.length > 0
      ? URL.createObjectURL(watchImage("image")![0])
      : defaultValues.image?.toString();

  return (
    <form
      onSubmit={handleSubmitImage(onSubmit)}
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
        {imagePreview && (
          <Image
            alt="Profile Image"
            src={imagePreview}
            width={200}
            height={200}
            className="rounded-md group-hover:opacity-50 transition-opacity duration-100"
          />
        )}
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
  );
}

export default AvatarForm;
