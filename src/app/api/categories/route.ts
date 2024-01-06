// import {isAdmin} from "@/app/api/auth/[...nextauth]/route";
import { connectMongoose } from "@/app/lib/clients/connectMongoose";
import { Category } from "@/app/models/Category";
import { isAdmin } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  connectMongoose();
  const { name } = await req.json();
  if (await isAdmin()) {
    const categoryDoc = await Category.create({ name });
    return Response.json(categoryDoc);
  } else {
    return Response.json({});
  }
}

export async function PUT(req: Request) {
  connectMongoose();
  const { _id, name } = await req.json();
  if (await isAdmin()) {
    await Category.updateOne({ _id }, { name });
  }
  return Response.json(true);
}

export async function GET() {
  connectMongoose();
  return Response.json(await Category.find());
}

export async function DELETE(req: Request) {
  connectMongoose();
  const { _id } = await req.json();

  if (await isAdmin()) {
    await Category.deleteOne({ _id });
  }
  return Response.json(true);
}
