"use client";
import React, { useContext } from "react";
import { CartContext } from "../providers/CartProvider";
import Image from "next/image";

function CartPage() {
  const {
    cartProducts,
    subtotal,
    cartItemPrice,
    removeCartProduct,
    clearCart,
  } = useContext(CartContext);

  return (
    <div className="page-container py-14">
      <h1 className="text-5xl font-bold text-center mb-10 text-primary">
        Cart
      </h1>
      <div className="flex items-start justify-between">
        <div className="w-[60%] ">
          <h2 className="text-2xl font-bold mb-4">Cart Items</h2>
          <div className="flex flex-col gap-4">
            {cartProducts.map((cartItem) => (
              <div
                key={cartItem._id}
                className="flex items-center justify-between border-1 rounded-md p-4"
              >
                <div className="flex items-center gap-4">
                  <Image
                    width={64}
                    height={64}
                    src={cartItem.image}
                    alt={cartItem.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{cartItem.name}</h3>
                    <p className="text-sm text-gray-500">
                      {cartItem.size?.name}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {cartItem.extras.length > 0 && (
                      <span>{cartItem.extras.length} Extra</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-semibold">
                    {cartItemPrice(cartItem)}$
                  </p>
                  <button
                    type="button"
                    title="Remove from cart"
                    className="text-lg font-semibold text-red-500"
                    onClick={() => removeCartProduct(cartItem._id)}
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
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-2 ">
            <button
              className="text-lg font-semibold text-red-500 btn-secondary py-1 px-2"
              onClick={() => clearCart()}
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="w-1/3 ml-8">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>{subtotal}$</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>0$</p>
            </div>
            <div className="font-bold flex justify-between">
              <p>Total</p>
              <p className="">{subtotal}$</p>
            </div>
          </div>
          <button className="btn-primary py-2 w-full mt-8">Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
