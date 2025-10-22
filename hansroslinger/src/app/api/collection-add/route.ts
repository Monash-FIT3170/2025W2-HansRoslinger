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

    if (!email || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const collection = await createCollection(userID, name, description);
    if (!collection) {
      return NextResponse.json("Failed to create collection", { status: 500 });
    }
    const folder = await createUserFolder(email, String(collection.id));
    if (!folder) {
      await deleteCollection(collection.name, email);
      return NextResponse.json("Failed to create user folder", { status: 500 });
    }

    return NextResponse.json({
      success: true,
      results: collection,
    });
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 },
    );
  }
}
