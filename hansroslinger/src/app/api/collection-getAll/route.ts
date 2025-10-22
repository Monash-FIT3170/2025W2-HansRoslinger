import { NextRequest, NextResponse } from "next/server";
import { getAllCollections } from "database/common/collections/getAllCollections";

// Export configuration for Next.js App Router
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    // Get user info from request cookies
    const email = request.cookies.get("email")?.value || "";
    const userID: number = +(request.cookies.get("userID")?.value || "");


    if (!email || !userID) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }
    const collections = await getAllCollections(userID);
  

    return NextResponse.json({
      success: true,
      collections,
    });
  } catch (error) {
    console.error("Error retrieving user collections:", error);
    return NextResponse.json(
      { error: "Failed to retrieve collections" },
      { status: 500 },
    );
  }
}
