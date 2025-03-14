import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // // Read the file into a buffer
    // const fileBuffer = await file.arrayBuffer();
    // const fileName = `${Date.now()}-${file.name}`; // Unique filename
    // const filePath = path.join(process.cwd(), "public/files", fileName);

    // Ensure the `public/files/` directory exists
    const filesDir = path.join(process.cwd(), "public/files");
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir, { recursive: true });
    }

    // Define the fixed filename
    const filePath = path.join(filesDir, "file.csv");

    // Delete any existing file before saving the new one
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Read the file into a buffer and save it as "file.csv"
    const fileBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(fileBuffer));

    return NextResponse.json({ fileName: "file.csv" }, { status: 200 });
  } catch (error) {
    console.error("API Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}