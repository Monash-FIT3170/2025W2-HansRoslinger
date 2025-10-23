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
    // Retrieve files from S3 (keys are `${email}/${collectionID}/${assetId}`)
    const files = await retrieveUserFiles(email, String(collectionId?.id));

    // Convert to the format expected by UploadsDisplay
    const uploads: Uploads = {};

    files.forEach((file, index) => {
      const keyLast = file.key.split("/").pop() || "";
      if (!keyLast) return; // folder placeholder

      const numericId = Number(keyLast);
      let matchedAsset = Number.isFinite(numericId)
        ? assets.find((a) => a.id === numericId)
        : undefined;

      // Fallback: try match by stored original name when keys are full filenames
      if (!matchedAsset) {
        matchedAsset = assets.find((a) => a.name === keyLast);
      }

      const src = `/api/aws-get?email=${encodeURIComponent(email)}&key=${encodeURIComponent(file.key)}`;

      if (matchedAsset) {
        const originalName = matchedAsset.name;
        const ext = path.extname(originalName).toLowerCase();
        const type = ext === ".png" ? FILE_TYPE_PNG : ext === ".json" ? FILE_TYPE_JSON : "unknown";
        if (type === "unknown") return;

        const displayName = originalName.replace(/^[0-9a-f-]+-/, "");
        const uploadProp: UploadProp = {
          name: displayName,
          type,
          src,
          id: matchedAsset.id,
          order: matchedAsset.order,
        };
        if (type === FILE_TYPE_PNG) uploadProp.thumbnailSrc = src;
        uploads[`asset-${matchedAsset.id}`] = uploadProp;
        return;
      }

      // Final fallback: infer by key extension for legacy uploads with original filenames but no DB asset
      const ext = path.extname(keyLast).toLowerCase();
      const type = ext === ".png" ? FILE_TYPE_PNG : ext === ".json" ? FILE_TYPE_JSON : "unknown";
      if (type === "unknown") return;

      const displayName = keyLast.replace(/^[0-9a-f-]+-/, "");
      uploads[`upload-${index}-${keyLast}`] = {
        name: displayName,
        type,
        src,
        ...(type === FILE_TYPE_PNG ? { thumbnailSrc: src } : {}),
      };
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