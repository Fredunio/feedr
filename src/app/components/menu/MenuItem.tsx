import Image from "next/image";

export default function MenuItem() {
  return (
    <div className="my-8 bg-slate-50 flex items-center flex-col justify-center p-4 rounded-lg shadow-lg max-w-md">
      <Image
        src={"/pizza.png"}
        alt={"pizza"}
        width={200}
        height={200}
        className="mx-auto"
      />
      <h3 className="text-xl font-bold text-center mb-2">Pizza Margherita</h3>
      <p className="text-center text-gray-500 text-sm mb-2">
        Tomato sauce, mozzarella, and oregano
      </p>

      <button className="bg-primary hover:bg-primaryLight transition-colors duration-75 text-lg mt-4 rounded-full px-4 py-1 text-slate-50 font-semibold">
        Add to cart 15${" "}
      </button>
      {/* <button className="mt-2">Cancel</button> */}
    </div>
  );
}
