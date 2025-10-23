import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { uploadBufferToS3 } from "../../../lib/http/uploadBuffer";
import { getCollection } from "database/common/collections/getCollection";
import { createAsset } from "database/common/collections/createAsset";
import { getUser } from "database/common/user/getUser";
import { createCollection } from "database/common/collections/createCollection";
import { createUserFolder } from "../../../lib/http/createUserFolder";

// Export configuration for Next.js App Router
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file");
    const collectionName = formData.get("collectionName") as string;

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

    // Get the user by email to retrieve the user ID
    const user = await getUser(email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the collection using the user ID
    let collection;
    if (collectionName) {
      collection = await getCollection(collectionName, user.id);
      if (!collection) {
        return NextResponse.json(
          { error: "Collection does not exist" },
          { status: 400 },
        );
      }
    } else {
      // Try to get the "Home" collection, create it if it doesn't exist
      collection = await getCollection("Home", user.id);
      if (!collection) {
        console.log(
          "Home collection not found, creating it for user:",
          user.id,
        );
        try {
          collection = await createCollection(user.id, "Home");
          // Create the S3 folder for the collection
          await createUserFolder(email, String(collection.id));
          console.log("Home collection created successfully:", collection.id);
        } catch (error) {
          console.error("Error creating Home collection:", error);
          return NextResponse.json(
            { error: "Failed to create Home collection" },
            { status: 500 },
          );
        }
      }
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

        const asset = await createAsset(collection.id, fileName);

        // Upload directly to S3
        const result = await uploadBufferToS3(
          email,
          String(asset.id),
          buffer,
          String(collection.id),
        );

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
