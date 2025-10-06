import { NextRequest, NextResponse } from "next/server";
import { createUserFolder } from "lib/http/createUserFolder";
import { createCollection } from "database/common/collections/createCollection";

// Export configuration for Next.js App Router
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    const email = request.cookies.get("email")?.value || "";

    if (!email || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const collection = await createCollection(email, name);
    await createUserFolder(email, String(collection.id));
    
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
