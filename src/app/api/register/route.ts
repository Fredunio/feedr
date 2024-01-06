import { User } from "@/app/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be defined");
  }
  mongoose.connect(process.env.DATABASE_URL);

  const body = await req.json();
  const pass = body.password;
  const passConfirm = body.passwordConfirmation;

  if (!pass?.length || pass.length < 8) {
    return Response.json({
      message: "Password must be at least 8 characters",
      error: true,
    });
  }

  if (!passConfirm?.length || pass !== passConfirm) {
    return Response.json({
      message: "Passwords do not match",
      error: true,
    });
  }

  const notHashedPassword = pass;
  const salt = bcrypt.genSaltSync(10);
  body.password = bcrypt.hashSync(notHashedPassword, salt);

  let createdUser = undefined;
  try {
    createdUser = await User.create({
      email: body.email,
      password: body.password,
    });
  } catch (err) {
    return Response.json({
      message: "Email already in use",
      error: true,
    });
  }

  return Response.json({
    user: createdUser,
    message: "Account Created",
    error: false,
  });
}
