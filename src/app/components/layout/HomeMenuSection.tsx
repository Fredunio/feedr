"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import SectionHeaders from "./SectionHeader";
import MenuItem from "../menu/MenuItem";
import useSWR from "swr";
import { TMenuItem } from "@/app/models/MenuItem";
import { fetcher } from "@/app/lib/fetcher";
import MenuItemCard from "../cards/MenuItemCard";

export default function HomeMenuSection() {
  const { data: menuItems } = useSWR<(TMenuItem & { _id: string })[]>(
    "/api/menuItems?limit=3",
    fetcher
  );

  return (
    <section className="mt-20">
      <div className="absolute left-0 right-0 w-full justify-start ">
        <div className="absolute left-0 -top-[70px] text-left -z-10">
          <Image src={"/sallad1.png"} width={109} height={189} alt={"sallad"} />
        </div>
        <div className="absolute -top-[100px] right-0 -z-10">
          <Image src={"/sallad2.png"} width={107} height={195} alt={"sallad"} />
        </div>
      </div>
      <div className="text-center mb-4">
        <SectionHeaders mainHeader={"Our Best Sellers"} />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {menuItems?.map((menuItem) => (
          <MenuItemCard key={menuItem._id} menuItem={menuItem} />
        ))}

        {/* <MenuItem />
        <MenuItem />
        <MenuItem />

        <MenuItem />
        <MenuItem />
        <MenuItem /> */}
      </div>
    </section>
  );
}
