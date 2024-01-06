import { Schema, models, model, InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (v: string) => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v),
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => v.length >= 8,
        message: "password must be at least 8 characters",
      },
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => /^\d{10}$/.test(v),
        message: "Please enter a valid phone number",
      },
    },
    streetAddress: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, trim: true },
    country: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
export type TUser = InferSchemaType<typeof UserSchema>;
