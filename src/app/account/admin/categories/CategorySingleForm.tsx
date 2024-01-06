import React from "react";
import { TCategory } from "@/app/models/Category";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

const schema = yup.object({
  name: yup.string().min(3, "Name must be at least 3 characters"),
});

function CategorySingleForm({
  category,
  mutate,
}: {
  category: TCategory & { _id: string };
  mutate: any;
}) {
  const [isEditing, setIsEditing] = React.useState(false);

  const {
    reset,
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: category.name,
    },
  });

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = async (
    data
  ) => {
    const savePromise = fetch("/api/categories", {
      method: "PUT",
      body: JSON.stringify({ ...data, _id: category._id }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Error adding Category");
    });

    await toast.promise(savePromise, {
      loading: "Adding Category...",
      success: () => {
        mutate();
        return "Category Edited";
      },
      error: "Error Adding Category",
    });
    setIsEditing(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      key={category.name}
      className="flex justify-between items-center py-2 border-1 px-4 rounded-md border-gray-200"
    >
      <input
        {...register("name")}
        title="category name"
        type="text"
        disabled={!isEditing}
        className="text-lg py-2 disabled:bg-white px-2 font-semibold border-0"
      />
      <div className="flex gap-4">
        {!isEditing ? (
          <button
            onClick={() => {
              setIsEditing(true);
              setFocus("name");
            }}
            type="button"
            className="text-primaryDark hover:text-primaryLight active:text-primaryDark transition-colors"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                reset();
              }}
              type="reset"
              className="text-primaryDark hover:text-primaryLight active:text-primaryDark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-primaryDark hover:text-primaryLight active:text-primaryDark transition-colors"
            >
              Save
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={async () => {
            const deletePromise = fetch("/api/categories", {
              method: "DELETE",
              body: JSON.stringify({ _id: category._id }),
            }).then((res) => {
              if (res.ok) {
                return res.json();
              }
              throw new Error("Error deleting Category");
            });

            await toast.promise(deletePromise, {
              loading: "Deleting Category...",
              success: () => {
                mutate();
                return "Category Deleted";
              },
              error: "Error Deleting Category",
            });
          }}
          className="text-red-500 hover:text-red-600 active:text-red-500 transition-colors"
        >
          Delete
        </button>
      </div>
    </form>
  );
}

export default CategorySingleForm;
