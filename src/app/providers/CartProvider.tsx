"use client";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TMenuItem } from "../models/MenuItem";

export const CartContext = createContext<{
  cartProducts: TCartItem[];
  cartItemPrice: (cartItem: TCartItem) => string;
  subtotal: string;
  setCartProducts: React.Dispatch<React.SetStateAction<TCartItem[]>>;
  addToCart: (item: TCartItem) => void;
  removeCartProduct: (id: string) => void;
  clearCart: () => void;
}>({
  cartProducts: [],
  subtotal: "0",
  cartItemPrice: () => "0",
  setCartProducts: () => {},
  addToCart: () => {},
  removeCartProduct: () => {},
  clearCart: () => {},
});

export type TCartItem = Omit<TMenuItem, "extras"> & {
  size?: {
    name: string;
    price: number;
  };
  extras: {
    name: string;
    price: number;
  }[];
};

export function cartItemPrice(cartItem: TCartItem) {
  let price = cartItem.basePrice;
  if (cartItem.size) {
    price += cartItem.size.price;
  }
  if (cartItem.extras?.length > 0) {
    for (const extra of cartItem.extras) {
      price += extra.price;
    }
  }
  return price.toFixed(2);
}

export function subtotal(cartProducts: TCartItem[]) {
  let subtotal = 0;
  for (const cartItem of cartProducts) {
    subtotal += parseFloat(cartItemPrice(cartItem));
  }
  return subtotal.toFixed(2);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartProducts, setCartProducts] = useState<TCartItem[]>([]);

  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const localStorageCart = ls && ls.getItem("cart");

  useEffect(() => {
    if (localStorageCart) {
      setCartProducts(JSON.parse(localStorageCart));
    }
  }, [localStorageCart]);

  function clearCart() {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  }

  function removeCartProduct(_id: string) {
    setCartProducts((prevCartProducts) => {
      const newCartProducts = prevCartProducts.filter(
        (item, index) => item._id !== _id
      );
      saveCartProductsToLocalStorage(newCartProducts);
      return newCartProducts;
    });
    toast.success("Product removed");
  }

  function saveCartProductsToLocalStorage(cartProducts: TCartItem[]) {
    if (ls) {
      ls.setItem("cart", JSON.stringify(cartProducts));
    }
  }

  function addToCart(item: TCartItem) {
    setCartProducts((prevProducts) => {
      const newProducts = [...prevProducts, item];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        cartItemPrice,
        subtotal: subtotal(cartProducts),
        setCartProducts,
        addToCart,
        removeCartProduct,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
