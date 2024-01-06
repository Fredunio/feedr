"use client";

import { fetcher } from "@/app/lib/fetcher";
import { TCategory } from "@/app/models/Category";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR from "swr";
import * as yup from "yup";
import { SubmitHandler } from "react-hook-form";
import CategorySingleForm from "./CategorySingleForm";

const schema = yup.object({
  name: yup.string().min(3, "Name must be at least 3 characters"),
});

function CategoriesPage() {
  const {
    data: categoriesData,
    error: errorCategories,
    isLoading: isLoadingCategories,
    mutate: mutateCategories,
  } = useSWR<(TCategory & { _id: string })[]>("/api/categories", fetcher);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isLoading, isValidating },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = async (
    data
  ) => {
    const savePromise = fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Error adding Category");
    });

    await toast.promise(savePromise, {
      loading: "Adding Category...",
      success: (newData) => {
        mutateCategories([categoriesData, newData]);
        return "Category Added";
      },
      error: "Error Adding Category",
    });
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label className="input-label" htmlFor="name">
            Category Name
          </label>
          <div className="flex gap-4 ">
            <input
              {...register("name")}
              type="text"
              id="name"
              className="text-input"
            />
            <button
              type="submit"
              className="bg-primary flex items-center justify-center gap-2 px-4 text-lg font-bold text-slate-50 rounded-md hover:bg-primaryLight active:bg-primaryLight transition-colors "
              disabled={isSubmitting}
            >
              Add
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
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {categoriesData && categoriesData?.length > 0 && (
        <div className="mt-12 flex flex-col gap-2">
          {/* <h2 className="text-2xl font-extrabold  mb-8">Categories</h2> */}
          {categoriesData.map((category) => (
            <CategorySingleForm
              key={category.name}
              category={category}
              mutate={mutateCategories}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
