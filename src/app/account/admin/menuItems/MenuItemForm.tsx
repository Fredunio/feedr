"use client";

import { fetcher } from "@/app/lib/fetcher";
import { TCategory } from "@/app/models/Category";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import React from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR from "swr";
import * as yup from "yup";

const extraPriceSchema = yup.object({
  name: yup.string().required().min(3, "Name must be at least 3 characters"),
  price: yup
    .number()
    .required()
    .test("decimalTest", "Must be a decimal with 2 decimal places", (value) => {
      // Check if the value is a decimal number with 2 decimal places
      const decimalRegex = /^\d+(\.\d{1,2})?$/;
      return Number.isInteger(value) || decimalRegex.test(value.toString());
    }),
});

const schema = yup.object({
  name: yup.string().required().min(3, "Name must be at least 3 characters"),
  category: yup
    .string()
    .required()
    .min(3, "Category must be at least 3 characters"),
  basePrice: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be greater than 0")
    .test("decimalTest", "Must be a decimal with 2 decimal places", (value) => {
      // Check if the value is a decimal number with 2 decimal places
      const decimalRegex = /^\d+(\.\d{1,2})?$/;
      return Number.isInteger(value) || decimalRegex.test(value.toString());
    }),
  description: yup.string().min(3, "Description must be at least 3 characters"),
  image: yup.mixed((input): input is FileList => input instanceof FileList),
  sizes: yup.array().of(extraPriceSchema),
  extras: yup.array().of(extraPriceSchema),
});

export type TMenuItemValues = yup.InferType<typeof schema>;

function MenuItemForm({
  defaultValues,
  edit = false,
  editImageUrl,
  onSubmitHandler,
}: {
  defaultValues?: TMenuItemValues;
  edit?: boolean;
  editImageUrl?: string;
  onSubmitHandler?: SubmitHandler<yup.InferType<typeof schema>>;
}) {
  const { data: categoriesData } = useSWR<(TCategory & { _id: string })[]>(
    "/api/categories",
    fetcher
  );

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    reset,
    control,
    formState: { errors, isSubmitting, isLoading },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues || {
      name: "",
      category: "",
      basePrice: 0,
      description: "",
      image: undefined,
    },
  });

  const {
    fields: sizes,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: "sizes",
  });

  const {
    fields: extras,
    append: appendExtra,
    remove: removeExtra,
  } = useFieldArray({
    control,
    name: "extras",
  });

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = async (
    data
  ) => {
    if (!data.image || data.image.length === 0) {
      return;
    }
    const formData = new FormData();

    // TODO: check why data.image is [object File]
    formData.set("file", getValues("image")![0]);

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
        const { image, ...rest } = data;

        fetch("/api/menuItems", {
          method: "POST",
          body: JSON.stringify({ ...rest, image: link }),
        }).then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Error adding Menu Item");
        });
      });

    await toast.promise(uploadPromise, {
      loading: "Adding Menu Item...",
      success: "Menu Item Added",
      error: "Error Adding Menu Item",
    });
  };

  const imagePreviewUrl =
    watch("image") !== undefined && watch("image")![0] !== undefined
      ? URL.createObjectURL(watch("image")![0])
      : editImageUrl
      ? editImageUrl
      : "/image_placeholder.png";

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler || onSubmit)}
      className="flex gap-12 w-full"
    >
      <div>
        <label htmlFor="image" className="input-label cursor-pointer">
          Image
        </label>
        <label
          htmlFor="image"
          className="p-2 border-2 bg-slate-50 rounded-md block hover:bg-slate-100 cursor-pointer"
        >
          <Image
            src={imagePreviewUrl}
            alt={"Food Image"}
            width={200}
            height={200}
            objectFit="contain"
          />
        </label>
        <input
          className="hidden"
          id="image"
          type="file"
          {...register("image")}
        />
        {errors.image && <p>{errors.image.message}</p>}
      </div>
      <div className="flex flex-col w-full gap-4">
        <div>
          <label className="input-label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="text-input"
            type="text"
            {...register("name")}
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        {categoriesData && (
          <div>
            <label className="input-label" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="text-input"
              {...register("category")}
            >
              <option value="">Select Category</option>
              {categoriesData?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p>{errors.category.message}</p>}
          </div>
        )}
        <div>
          <label className="input-label" htmlFor="basePrice">
            Base Price
          </label>
          <input
            id="basePrice"
            className="text-input"
            type="text"
            {...register("basePrice")}
          />
          {errors.basePrice && <p>{errors.basePrice.message}</p>}
        </div>
        <div>
          <label className="input-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="text-input"
            {...register("description")}
          />
          {errors.description && <p>{errors.description.message}</p>}
        </div>

        <div className="mt-4">
          <div className="flex gap-4 items-center">
            <label className="input-label" htmlFor="sizes">
              Sizes
            </label>
            <button
              title="Add Size"
              aria-label="Add Size"
              type="button"
              onClick={() => appendSize({ name: "", price: 0 })}
              className="btn-primary w-6 h-6 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={4}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {sizes.map((size, index) => (
              <div key={size.id}>
                <div key={size.id} className="flex gap-4 mt-2">
                  <input
                    placeholder="eg. Small, Medium, Large"
                    className="text-input"
                    type="text"
                    {...register(`sizes.${index}.name` as const)}
                  />
                  <input
                    placeholder="Price"
                    className="text-input"
                    type="text"
                    {...register(`sizes.${index}.price` as const)}
                  />
                  <button
                    title="Delete Size"
                    aria-label="Delete Size"
                    type="button"
                    onClick={() => removeSize(index)}
                    className="btn-secondary px-4 py-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
                {errors.sizes && errors.sizes[index] && (
                  <p>{errors.sizes[index]?.message}</p>
                )}
              </div>
            ))}
            {sizes.length === 0 && (
              <p className="text-gray-500 text-center border-1 rounded-md py-4 mt-2">
                No Sizes Added
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex gap-4 items-center">
            <label className="input-label" htmlFor="extras">
              Extras
            </label>
            <button
              title="Add Extra"
              aria-label="Add Extra"
              type="button"
              onClick={() => appendExtra({ name: "", price: 0 })}
              className="btn-primary w-6 h-6 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={4}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-4 ">
            {extras.map((extra, index) => (
              <div key={extra.id} className="flex gap-4 mt-2">
                <input
                  placeholder="eg. Extra Cheese, Extra Meat"
                  className="text-input"
                  type="text"
                  {...register(`extras.${index}.name` as const)}
                />
                <input
                  placeholder="Price"
                  className="text-input"
                  type="text"
                  {...register(`extras.${index}.price` as const)}
                />
                <button
                  title="Delete Extra"
                  aria-label="Delete Extra"
                  type="button"
                  onClick={() => removeExtra(index)}
                  className="btn-secondary px-4 py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            ))}
            {extras.length === 0 && (
              <p className="text-gray-500 text-center border-1 rounded-md py-4 mt-2">
                No Extras Added
              </p>
            )}
            {errors.extras && <p>{errors.extras.message}</p>}
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button
            disabled={isSubmitting}
            type={edit ? "button" : "reset"}
            onClick={() => {
              if (edit) {
                reset();
              }
            }}
            className="btn-secondary px-4 py-2 "
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn-primary px-4 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

export default MenuItemForm;
