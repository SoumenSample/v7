import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.formData();
    const file = data.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return Response.json({ error: "No file received" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const sanitizedName = String(file.name || "document")
      .trim()
      .replace(/[^a-zA-Z0-9._-]+/g, "-");
    const name = `${Date.now()}_${sanitizedName}`;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          public_id: name,
          folder: "uploads",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return Response.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: error?.message || "Upload failed" }, { status: 500 });
  }
}