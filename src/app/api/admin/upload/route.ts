import { NextResponse } from "next/server";
import { writeFile, mkdir, access } from "fs/promises";
import { constants } from "fs";
import path from "path";
import { getUploadsDir } from "@/lib/uploads-path";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploadDir = getUploadsDir();
    const filePath = path.join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);
    await access(filePath, constants.F_OK | constants.R_OK);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    const uploadDir = getUploadsDir();
    console.error("Upload failed:", err, { uploadDir, cwd: process.cwd() });
    return NextResponse.json(
      { error: "Upload failed — check server logs and public/uploads permissions" },
      { status: 500 }
    );
  }
}
