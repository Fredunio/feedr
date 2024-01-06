"use client";

import React from "react";
import MenuItemForm, { TMenuItemValues } from "../MenuItemForm";
import Link from "next/link";
import useSWR from "swr";
import { TMenuItem } from "@/app/models/MenuItem";
import { fetcher } from "@/app/lib/fetcher";
import toast from "react-hot-toast";

function MenuItemPage({ params }: { params: { id: string } }) {
  const { data: menuItemData } = useSWR<TMenuItem & { _id: string }>(
    `/api/menuItems?_id=${params.id}`,
    fetcher
  );

  const onSubmit = async (data: TMenuItemValues) => {
    if (!menuItemData) return;

    let newImageUrl = undefined;
    if (data.image?.length === 0 || data.image === undefined) {
    } else {
      const formData = new FormData();
      formData.set("file", data.image[0]);
      newImageUrl = await fetch("/api/uploadImage", {
        method: "POST",
        body: formData,
      }).then((res) => {
        if (res.ok) {
          return res.json();
        }
        toast.error("Error uploading image");
        return;
      });
    }

    const { image, ...rest } = data;
    const body = newImageUrl
      ? { ...rest, image: newImageUrl, _id: menuItemData._id }
      : { ...rest, image: menuItemData.image, _id: menuItemData._id };

    await fetch("/api/menuItems", {
      method: "PUT",
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }

      toast.error("Error adding Menu Item");
      return;
    });

    toast.success("Item Edited");
    // const uploadPromise = fetch("/api/uploadImage", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((res) => {
    //     if (res.ok) {
    //       return res.json();
    //     }
    //     throw new Error("Error uploading image");
    //   })
    //   .then((link) => {

    //     const { image, ...rest } = data;

    //     fetch("/api/menuItems", {
    //       method: "POST",
    //       body: JSON.stringify({ ...rest, image: link }),
    //     }).then((res) => {
    //       if (res.ok) {
    //         return res.json();
    //       }
    //       throw new Error("Error adding Menu Item");
    //     });
    //   });

    // await toast.promise(uploadPromise, {
    //   loading: "Adding Menu Item...",
    //   success: "Menu Item Added",
    //   error: "Error Adding Menu Item",
    // });
  };

  return (
    <div>
      <div className="flex items-center mb-20 justify-between">
        <Link
          href={"/account/admin/menuItems"}
          prefetch={false}
          className="flex items-center justify-center gap-2 border-1 hover:bg-slate-50 active:bg-slate-100 rounded-md px-4 text-lg font-semibold  py-1"
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
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Go Back
        </Link>
        <h2 className="text-4xl font-bold ">Edit Item</h2>
      </div>
      {menuItemData && (
        <MenuItemForm
          defaultValues={{
            category: String(menuItemData?.category),
            basePrice: menuItemData?.basePrice,
            name: menuItemData?.name,
            description: menuItemData?.description || undefined,
            image: undefined,
            sizes: menuItemData?.sizes,
            extras: menuItemData?.extras,
          }}
          edit={true}
          editImageUrl={menuItemData?.image || undefined}
          onSubmitHandler={onSubmit}
        />
      )}
    </div>
  );
}

export default MenuItemPage;
