import { NextRequest, NextResponse } from "next/server";
import { retrieveUserFiles } from "../../../lib/http/retrieveFiles";
import { Uploads, UploadProp } from "../../../types/application";
import { FILE_TYPE_JSON, FILE_TYPE_PNG } from "../../../constants/application";
import path from "path";
import { getCollection } from "database/common/collections/getCollection";
import { getAllAssets} from "database/common/collections/getAllAssets";

// Export configuration for Next.js App Router
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    // Get email from request cookies
    const email = request.cookies.get("email")?.value || "";
    const userID: number = +(request.cookies.get("userID")?.value || "");

    const url = new URL(request.url);
    const collection = url.searchParams.get("collection");
    if (!collection) {
      return NextResponse.json(
        { error: "Missing collection parameter" },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }
    const collectionId = await getCollection(collection, userID);
    if (!collectionId) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 401 },
      );
    }
    const assets = await getAllAssets(collectionId.id);
    // Retrieve files from S3
    const files = await retrieveUserFiles(email, String(collectionId?.id));

    // Convert to the format expected by UploadsDisplay
    const uploads: Uploads = {};

    files.forEach((file, index) => {
      const fileName = file.key.split("/").pop() || "";
      const fileExt = path.extname(fileName).toLowerCase();
      const fileType =
        fileExt === ".png"
          ? FILE_TYPE_PNG
          : fileExt === ".json"
            ? FILE_TYPE_JSON
            : "unknown";

      // Only process supported file types
      if (fileType === FILE_TYPE_PNG || fileType === FILE_TYPE_JSON) {
        // Create a unique assetId
        const matchedAsset = assets.find((a) => a.name === fileName);

        const uploadProp: UploadProp = {
          name: fileName.replace(/^[0-9a-f-]+-/, ""), // clean up filename
          type: fileType,
          src: file.url,
          id: matchedAsset?.id, 
          order: matchedAsset?.order, 
        };

        // For PNG files, add a thumbnail
        if (fileType === FILE_TYPE_PNG) {
          // In AWS S3, we need a public URL - for now use default thumbnail
          uploadProp.thumbnailSrc = "/uploads/default-thumbnail.png";
        }
        const key = matchedAsset
          ? `asset-${matchedAsset.id}`
          : `upload-${index}-${fileName}`;
        uploads[key] = uploadProp;
      }
    });

    return NextResponse.json({
      success: true,
      uploads,
    });
  } catch (error) {
    console.error("Error retrieving user files:", error);
    return NextResponse.json(
      { error: "Failed to retrieve files" },
      { status: 500 },
    );
  }
}
