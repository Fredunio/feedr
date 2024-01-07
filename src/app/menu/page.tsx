"use client";

import React from "react";
import useSWR from "swr";
import { TMenuItem } from "../models/MenuItem";
import { fetcher } from "../lib/fetcher";
import MenuItemCard from "../components/cards/MenuItemCard";

export default function MenuPage() {
  const { data: menuItems, isLoading } = useSWR<TMenuItem[]>(
    "/api/menuItems",
    fetcher
  );
  const { data: categories } = useSWR<TMenuItem[]>("/api/categories", fetcher);

  return (
    <div className="page-container py-12">
      <h1 className="text-5xl font-bold text-center mb-10 text-primary">
        Menu
      </h1>
      <div>
        {!isLoading &&
          menuItems &&
          categories?.map((category) => {
            const itemsInCategory = menuItems.filter(
              (menuItem) => menuItem.category.toString() === category._id
            );

            return itemsInCategory.length > 0 ? (
              <div key={category._id}>
                <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {itemsInCategory.map((menuItem) => (
                    <MenuItemCard key={menuItem._id} menuItem={menuItem} />
                  ))}
                </div>
              </div>
            ) : null;
          })}
      </div>
    </div>
  );
}
