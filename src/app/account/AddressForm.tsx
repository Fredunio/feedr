import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { TUser } from "../models/User";

const schema = yup.object({
  streetAddress: yup.string(),
  city: yup.string(),
  country: yup.string(),
  state: yup.string(),
  phoneNumber: yup.string(),
  zip: yup.string(),
});

type TAddressValues = yup.InferType<typeof schema>;
function AddressForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading, isValidating },
  } = useForm({
    resolver: yupResolver(schema),
    // disabled: isSubmitting,
    defaultValues: async () =>
      fetch("/api/profile", {
        method: "GET",
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Error getting Address Information");
        })
        .then((data) => {
          return data;
        }),
  });

  const onSubmitForm: SubmitHandler<yup.InferType<typeof schema>> = async (
    data
  ) => {
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Address</h2>
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="flex flex-col w-full gap-2 "
      >
        <label className="input-label" htmlFor="street">
          Street Address
        </label>
        <input
          disabled={isSubmitting}
          type="text"
          id="street"
          className="border text-input border-gray-300 rounded-md"
          {...register("streetAddress")}
        />
        <div className="flex justify-between w-full gap-4">
          <div className="w-full">
            <label className="input-label" htmlFor="zip">
              Zip Code
            </label>
            <input
              disabled={isSubmitting}
              type="text"
              id="zip"
              className="border text-input border-gray-300 rounded-md"
              {...register("zip")}
            />
          </div>
          <div className="w-full">
            <label className="input-label" htmlFor="city">
              City
            </label>
            <input
              disabled={isSubmitting}
              type="text"
              id="city"
              className="border text-input border-gray-300 rounded-md"
              {...register("city")}
            />
          </div>
        </div>

        <div className="flex justify-between w-full gap-4">
          <div className="w-full">
            <label className="input-label" htmlFor="country">
              Country
            </label>
            <input
              disabled={isSubmitting}
              type="text"
              id="country"
              className="border text-input border-gray-300 rounded-md"
              {...register("country")}
            />
          </div>
          <div className="w-full">
            <label className="input-label" htmlFor="state">
              State
            </label>
            <input
              disabled={isSubmitting}
              type="text"
              id="state"
              className="border text-input border-gray-300 rounded-md"
              {...register("state")}
            />
          </div>
        </div>
        <div className="w-full">
          <label className="input-label" htmlFor="phone">
            Phone Number
          </label>
          <input
            disabled={isSubmitting}
            type="text"
            id="phone"
            className="border text-input border-gray-300 rounded-md"
            {...register("phoneNumber")}
          />
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
    </div>
  );
}

export default AddressForm;
