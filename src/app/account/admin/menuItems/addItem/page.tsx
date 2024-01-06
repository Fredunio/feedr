import React from "react";
import AddItemForm from "../MenuItemForm";
import Link from "next/link";
import MenuItemForm from "../MenuItemForm";

export default function AddMenuItem() {
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
        <h2 className="text-4xl font-bold ">Add Item</h2>
      </div>
      <MenuItemForm />
    </div>
  );
}
