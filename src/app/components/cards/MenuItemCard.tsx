"use client";

import { TMenuItem } from "@/app/models/MenuItem";
import Image from "next/image";
import React, { useContext } from "react";
import Modal from "../Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CartContext } from "@/app/providers/CartProvider";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  size: yup.object().shape({
    name: yup.string().required(),
    price: yup.number().required(),
  }),
  extras: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required(),
        price: yup.number().required(),
      })
    )
    .required(),
});

type TMenuItemOrder = yup.InferType<typeof schema>;

function MenuItemCardForm({
  menuItem,
  closeModal,
}: {
  menuItem: TMenuItem & { _id: string };
  closeModal?: () => void;
}) {
  const haveSizes = menuItem.sizes && menuItem.sizes.length > 0;

  const {
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TMenuItemOrder>({
    resolver: yupResolver(schema),
    defaultValues: {
      size: haveSizes ? menuItem.sizes[0] : undefined,
      extras: [],
    },
  });

  const { addToCart } = useContext(CartContext);
  const onSubmit: SubmitHandler<TMenuItemOrder> = (data) => {
    console.log("data", data);
    addToCart({
      ...menuItem,
      size: data.size,
      extras: data.extras,
    });
    closeModal && closeModal();
    toast.success(`Added ${menuItem.name} to cart`);
  };

  const calcPrice = React.useCallback(() => {
    const sizePrice = getValues("size")?.price || 0;

    let extrasPrice = 0;
    for (let extraObj of getValues("extras")) {
      extrasPrice += extraObj.price;
    }

    return (menuItem.basePrice + sizePrice + extrasPrice).toFixed(2);
  }, [menuItem, getValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <div>
        <label className="input-label" htmlFor="size">
          Sizes
        </label>
        {haveSizes && (
          <div className="flex items-center gap-16 justify-evenly mt-2">
            {menuItem.sizes?.map((size) => (
              <div
                className="gap-2 flex items-center"
                key={size._id!.toString()}
              >
                <button
                  type="button"
                  title={size.name}
                  onClick={() => {
                    console.log("size", size._id!.toString());
                    console.log(size._id!.toString());
                    setValue("size", size);
                  }}
                  className={` btn-secondary px-2 py-1 ${
                    size.name === watch("size").name &&
                    "font-semibold bg-primaryLight"
                  }`}
                >
                  {size.name}
                </button>
                <p className="text-lg">{size.price}$</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="input-label" htmlFor="extras">
          Extras
        </label>
        <div className="grid grid-cols-2 gap-2 gap-y-4 mt-2 w-full">
          {menuItem.extras?.map((extra) => (
            <div
              className="flex items-center justify-start gap-2 "
              key={extra._id!.toString()}
            >
              <label
                className="flex items-center gap-2"
                htmlFor={extra._id!.toString()}
              >
                <input
                  id={extra._id!.toString()}
                  type="checkbox"
                  className="rounded-md w-6 h-6"
                  onChange={(e) => {
                    console.log(getValues("extras"));
                    if (e.target.checked) {
                      setValue("extras", [
                        ...getValues("extras"),
                        {
                          name: extra.name,
                          price: extra.price,
                        },
                      ]);
                    } else {
                      setValue(
                        "extras",
                        getValues("extras").filter(
                          (extraObj) => extraObj.name !== extra.name
                        )
                      );
                    }
                  }}
                />
                <label
                  className="w-full flex-grow text-lg font-semibold"
                  htmlFor={extra._id!.toString()}
                >
                  {extra.name}
                </label>
              </label>
              <p className="p-1 rounded-md text-sm border-1 ">{extra.price}$</p>
            </div>
          ))}
        </div>
      </div>
      <button
        className="btn-primary transition-colors duration-75 text-lg mt-4 rounded-md px-8 py-2 text-slate-50 font-semibold"
        type="submit"
      >
        Add to cart {calcPrice()}$
      </button>
    </form>
  );
}

function MenuItemCard({ menuItem }: { menuItem: TMenuItem & { _id: string } }) {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <div className="my-8 border-1 bg-slate-50 flex items-center flex-col justify-center p-4 rounded-lg shadow-lg max-w-md">
        <Image
          src={menuItem.image}
          alt={menuItem.name}
          width={200}
          height={200}
          className="mx-auto"
        />
        <h3 className="text-xl font-bold text-center mb-2">{menuItem.name}</h3>
        <p className="text-center text-gray-500 text-sm mb-2">
          {menuItem.description}
        </p>
        <button
          onClick={() => {
            setShowModal(true);
          }}
          className="btn-primary transition-colors duration-75 text-lg mt-4 rounded-full px-8 py-2 text-slate-50 font-medium"
        >
          {menuItem.sizes && menuItem.sizes.length > 0 ? (
            <span>
              Starting at{" "}
              <span className="font-bold">{menuItem.basePrice} $</span>
            </span>
          ) : (
            <span>
              Add to cart
              <span className="font-bold">{menuItem.basePrice}</span> $
            </span>
          )}
        </button>
        {/* <button className="mt-2">Cancel</button> */}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <div>
          <Image
            src={menuItem.image}
            alt={menuItem.name}
            width={200}
            height={200}
            className="mx-auto"
          />
          <h3 className="text-xl font-bold text-center mb-2">
            {menuItem.name}
          </h3>
          <p className="text-center text-gray-500 text-sm mb-2">
            {menuItem.description}
          </p>
        </div>
        <MenuItemCardForm
          closeModal={() => {
            setShowModal(false);
          }}
          menuItem={menuItem}
        />
      </Modal>
    </>
  );
}

export default MenuItemCard;
