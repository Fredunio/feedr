import { Schema, models, model } from "mongoose";

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
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
