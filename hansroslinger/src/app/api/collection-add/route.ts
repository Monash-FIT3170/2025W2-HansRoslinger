import { NextRequest, NextResponse } from "next/server";
import { createUserFolder } from "lib/http/createUserFolder";
import { createCollection } from "database/common/collections/createCollection";
import { deleteCollection } from "database/common/collections/deleteCollection";

// Export configuration for Next.js App Router
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name: string = body.name;
    const description: string | undefined = body.description;

    const email = request.cookies.get("email")?.value || "";
    const userID: number = +(request.cookies.get("userID")?.value || "");

    console.log("Collection creation request:", { email, userID, name, description });

    if (!email || !name) {
      console.error("Missing required fields:", { email: !!email, name: !!name });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!userID || isNaN(userID)) {
      console.error("Invalid userID:", userID);
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 },
      );
    }

    const collection = await createCollection(userID, name, description);
    if (!collection) {
      console.error("createCollection returned null/undefined");
      return NextResponse.json({ error: "Failed to create collection" }, { status: 500 });
    }
    
    console.log("Collection created successfully:", collection);
    
    const folder = await createUserFolder(email, String(collection.id));
    if (!folder) {
      console.error("createUserFolder returned null/undefined");
      await deleteCollection(collection.name, email);
      return NextResponse.json({ error: "Failed to create user folder" }, { status: 500 });
    }
    
    console.log("User folder created successfully:", folder);
    
    return NextResponse.json({
      success: true,
      results: collection,
    });
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create collection" },
      { status: 500 },
    );
  }
}
