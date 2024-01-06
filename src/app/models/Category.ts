import { Schema, models, model, InferSchemaType } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
  },

  { timestamps: true }
);

export const Category = models.Category || model("Category", CategorySchema);
export type TCategory = InferSchemaType<typeof CategorySchema>;
