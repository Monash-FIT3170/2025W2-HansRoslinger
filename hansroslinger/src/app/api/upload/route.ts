import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { uploadBufferToS3 } from "../../../lib/http/uploadBuffer";

// Export configuration for Next.js App Router
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Get email from request cookies
    const email = request.cookies.get("email")?.value || "";

    if (!email) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const uploadResults = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        continue;
      }

      try {
        // Create a unique file name
        const fileName = `${uuidv4()}-${file.name.replace(/\s+/g, "-")}`;

        // Get file content
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload directly to S3
        const result = await uploadBufferToS3(email, fileName, buffer);

        uploadResults.push({
          originalName: file.name,
          fileName: result.fileName,
          location: result.location,
          size: result.size,
          success: true,
        });
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        uploadResults.push({
          originalName: file.name,
          success: false,
          error: "Failed to upload file",
        });
      }
    }

    return NextResponse.json({
      success: true,
      results: uploadResults,
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 },
    );
  }
}
