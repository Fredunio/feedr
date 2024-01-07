import { isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoose } from "@/app/lib/clients/connectMongoose";
import { MenuItem } from "@/app/models/MenuItem";

export async function POST(req: Request) {
  connectMongoose();
  const data = await req.json();
  if (await isAdmin()) {
    const menuItemDoc = await MenuItem.create(data);
    return Response.json(menuItemDoc);
  } else {
    return Response.json({});
  }
}

export async function PUT(req: Request) {
  connectMongoose();

  if (await isAdmin()) {
    const { _id, ...data } = await req.json();
    await MenuItem.findByIdAndUpdate(_id, data);
  }
  return Response.json(true);
}

export async function GET(req: Request) {
  connectMongoose();

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");
  const limit = url.searchParams.get("limit");

  if (_id) {
    return Response.json(await MenuItem.findById(_id));
  }
  if (limit) {
    return Response.json(
      await MenuItem.find().sort({ createdAt: -1 }).limit(Number(limit))
    );
  }

  return Response.json(await MenuItem.find());
}

export async function DELETE(req: Request) {
  connectMongoose();

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");
  if (await isAdmin()) {
    await MenuItem.deleteOne({ _id });
  }
  return Response.json(true);
}
