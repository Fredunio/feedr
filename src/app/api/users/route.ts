import { connectMongoose } from "@/app/lib/clients/connectMongoose";
import { isAdmin } from "../auth/[...nextauth]/route";
import { User } from "@/app/models/User";

export async function GET() {
  connectMongoose();
  if (await isAdmin()) {
    const users = await User.find();
    return Response.json(users);
  } else {
    return Response.json([]);
  }
}
