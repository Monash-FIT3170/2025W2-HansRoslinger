import { NextRequest, NextResponse } from "next/server";
import { setCollectionSelection } from "database/common/collections/setCollectionSelection";
// Export configuration for Next.js App Router
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Get user info from request cookies
    const email = request.cookies.get("email")?.value || "";
    const userID: number = +(request.cookies.get("userID")?.value || "");

    const {collectionID, state } = await request.json();
    const colID: number = Number(collectionID);

    if (!email || !userID) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }
    const collections = await setCollectionSelection(colID, state);
  

    return NextResponse.json({
      success: true,
      collections,
    });
  } catch (error) {
    console.error("Error updating collection selection:", error);
    return NextResponse.json(
      { error: "Failed to update collection" },
      { status: 500 },
    );
  }
}
