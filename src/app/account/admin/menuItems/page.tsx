"use client";

import React, { useCallback } from "react";
import { fetcher } from "@/app/lib/fetcher";
import useSWR from "swr";
import { TCategory } from "@/app/models/Category";
import { TMenuItem } from "@/app/models/MenuItem";
import Link from "next/link";
import MenuItemLink from "./MenuItemLink";
import toast from "react-hot-toast";

export default function MenuItemsPage() {
  const { data: categoriesData, error: errorCategories } = useSWR<
    (TCategory & { _id: string })[]
  >("/api/categories", fetcher);

  const {
    data: menuItemsData,
    error: errorMenuItems,
    isLoading: isLoadingMenuItems,
    mutate: mutateMenuItems,
  } = useSWR<(TMenuItem & { _id: string })[]>("/api/menuItems", fetcher);

  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  const onDelete = useCallback(
    async (id: string) => {
      const deletePromise = fetch(`/api/menuItems?_id=${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Error deleting Item");
      });

      await toast.promise(deletePromise, {
        loading: "Deleting Item...",
        success: (newData) => {
          mutateMenuItems(
            menuItemsData?.filter((menuItem) => menuItem._id !== id)
          );
          return "Item Deleted";
        },
        error: "Error Deleting Item",
      });
    },
    [menuItemsData, mutateMenuItems]
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center mb-12 justify-between">
        <h2 className="text-4xl font-bold ">All Items</h2>
        <Link
          href={"menuItems/addItem"}
          prefetch={false}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primaryLight active:bg-primaryDark rounded-md px-4 text-lg font-semibold text-slate-50 py-1"
        >
          Add Item
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Link>
      </div>
      {menuItemsData && menuItemsData?.length > 0 && (
        <div>
          <select
            title="Filter by Category"
            className="text-input w-auto px-4 py-2"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option className="px-4 py-2" value="all">
              All
            </option>
            {categoriesData?.map((category) => (
              <option
                className="px-4 py-2"
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <div className="mt-4 grid md:grid-cols-3 grid-cols-2 gap-8 items-stretch justify-stretch">
            {menuItemsData
              .filter((menuItem) => {
                if (categoryFilter === "all") {
                  return true;
                }
                return menuItem.category === categoryFilter;
              })
              .map((menuItem) => (
                <MenuItemLink
                  key={menuItem.name}
                  menuItem={menuItem}
                  onDelete={onDelete}
                />
              ))}

            {/* {menuItemsData.map((menuItem) => (
              <MenuItemLink key={menuItem.name} menuItem={menuItem} />
            ))} */}
          </div>
        </div>
      )}
    </div>
  );
}
