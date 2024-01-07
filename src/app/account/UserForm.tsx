import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

export const schemaUserData = yup
  .object({
    name: yup.string().min(3, "Name must be at least 3 characters"),
    email: yup.string().email(),
  })
  .required();

export type TFormUserData = yup.InferType<typeof schemaUserData>;

function UserForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues: TFormUserData;
  onSubmit: SubmitHandler<TFormUserData>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading, isValidating },
  } = useForm({
    resolver: yupResolver(schemaUserData),
    defaultValues: async () => {
      return {
        name: defaultValues?.name || undefined,
        email: defaultValues?.email || undefined,
      };
    },
  });

  return (
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
        {...register("name")}
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
  );
}

export default UserForm;
