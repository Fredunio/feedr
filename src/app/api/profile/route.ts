import { connectMongoose } from "@/app/lib/clients/connectMongoose";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/app/models/User";

export async function PUT(req: Request) {
  connectMongoose();
  const data = await req.json();
  const { _id, name, image, ...otherUserInfo } = data;

  let filter = {};
  if (_id) {
    filter = { _id };
  } else {
    const session = await getServerSession(authOptions);
    if (!session || !session?.user?.email) {
      return Response.json(false);
    }
    const email = session.user.email;
    filter = { email };
  }

  const user = await User.findOne(filter);
  await User.updateOne(filter, { name, image });

  return Response.json(true);
}

export async function GET(req: Request) {
  connectMongoose();

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");

  let filterUser = {};
  if (_id) {
    filterUser = { _id };
  } else {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return Response.json({});
    }
    filterUser = { email };
  }

  const user = await User.findOne(filterUser).lean();

  return Response.json({ ...user });
}
