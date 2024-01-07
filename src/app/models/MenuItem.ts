import mongoose, { Schema, models, model, InferSchemaType } from "mongoose";

const ExtraPriceSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const MenuItemSchema = new Schema(
  {
    image: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    category: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    basePrice: { type: Number, required: true },
    sizes: { type: [ExtraPriceSchema] },
    extras: { type: [ExtraPriceSchema] },
  },
  { timestamps: true }
);

export const MenuItem = models?.MenuItem || model("MenuItem", MenuItemSchema);
export type TMenuItem = InferSchemaType<typeof MenuItemSchema> & {
  _id: string;
};

// export type CartItem = {
//   _id: string;
//   name: string;
//   image: string;
//   basePrice: number;
//   size: string;
// };
