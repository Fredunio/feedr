import Image from "next/image";
import React from "react";
import Right from "../icons/Right";

function Hero() {
  return (
    <section className="hero  gap-20 flex items-center">
      <div className="py-8 md:py-12 ">
        <h1 className="text-5xl font-semibold">
          <span className="font-bold relative">Hot</span>
          , delicious
          <br />
          and hassle-free
          <br />
          Pizza
          {/* <br />
          right to your door!
          <br /> */}
        </h1>
        <p className="my-6 text-slate-600">
          Pick yout ideal pie, from crust to toppings, and enjoy speedy, hot
          deliveries right to your doorstep. Your go-to for easy, delicious
          pizza on demand!
        </p>
        <div className="flex gap-4 text-xl mt-8">
          <button
            type="button"
            className="px-6 py-2 rounded-full flex border-1 items-center gap-2  text-slate-600 font-semibold"
          >
            Learn more
          </button>
          <button
            type="button"
            className="font-semibold flex justify-center items-center bg-primary hover:bg-primaryLight uppercase  gap-2 text-white px-6 py-2 rounded-full"
          >
            Order now
            <Right />
          </button>
        </div>
      </div>
      <div className="relative hidden md:block">
        <Image src={"/pizza.png"} alt={"pizza"} width={600} height={600} />
      </div>
    </section>
  );
}

export default Hero;
