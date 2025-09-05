import { NextRequest, NextResponse } from "next/server";
import { retrieveUserFiles } from "../../../lib/http/retrieveFiles";
import { Uploads, UploadProp } from "../../../types/application";
import { FILE_TYPE_JSON, FILE_TYPE_PNG } from "../../../constants/application";
import path from "path";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const email = req.cookies.get("email")?.value;

  if (!email) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 },
    );
  }

  try {
    // Retrieve files from S3
    const files = await retrieveUserFiles(email);

    // Convert to the format expected by UploadsDisplay
    const uploads: Uploads = {};

    files.forEach((file, index) => {
      // Extract filename and extension
      const fileName = file.key.split("/").pop() || "";
      const fileExt = path.extname(fileName).toLowerCase();
      const fileType =
        fileExt === ".png"
          ? FILE_TYPE_PNG
          : fileExt === ".json"
            ? FILE_TYPE_JSON
            : "unknown";

      // Skip unsupported file types
      if (fileType === "unknown") return;

      // Create a unique assetId
      const assetId = `user-upload-${index}`;

      // Extract name without UUID prefix if present (from our upload implementation)
      const displayName = fileName.replace(/^[0-9a-f-]+-/, "");

      const uploadProp: UploadProp = {
        name: displayName,
        type: fileType,
        src: `/api/aws-get?email=${encodeURIComponent(email)}&key=${encodeURIComponent(file.key)}`,
      };

      // For PNG files, create thumbnail URL
      if (fileType === FILE_TYPE_PNG) {
        uploadProp.thumbnailSrc = `/api/aws-get?email=${encodeURIComponent(email)}&key=${encodeURIComponent(file.key)}`;
      }

      uploads[assetId] = uploadProp;
    });

    return NextResponse.json({ uploads });
  } catch (error) {
    console.error("Error retrieving user files:", error);
    return NextResponse.json(
      { error: "Failed to retrieve user files" },
      { status: 500 },
    );
  }
}
