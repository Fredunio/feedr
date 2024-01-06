import { S3ClientFeedr } from "@/app/lib/clients/s3ClientFeedr";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";

export async function POST(req: Request) {
  const data = await req.formData();

  if (data.get("file") !== null) {
    // upload the file
    const file = data.get("file") as File;

    const s3Client = S3ClientFeedr;

    const ext = file.name.split(".").slice(-1)[0];
    const newFileName = uniqid() + "." + ext;

    // Convert the image to a buffer
    const imageBlob = new Blob([file]);
    const imageArrayBuffer = await imageBlob.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);

    const bucket = "feedr";
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: newFileName,
        ACL: "public-read",
        ContentType: file.type,
        Body: imageBuffer,
      })
    );

    const link = "https://" + bucket + ".s3.amazonaws.com/" + newFileName;
    return Response.json(link);
  }
  return Response.json(true);
}
