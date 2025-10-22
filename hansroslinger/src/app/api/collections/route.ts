import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../database/common/client";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const email = req.cookies.get("email")?.value;
    if (!email) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    // Fetch collections for this user via user include to avoid relation filter edge cases
    const user = await prisma.user.findUnique({
      where: { email },
      include: { collections: { select: { id: true, name: true }, orderBy: { id: "asc" } } },
    });
    const normalized = (user?.collections || []).map((c) => ({ id: String(c.id), name: c.name }));

    return NextResponse.json({ collections: normalized });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 },
    );
  }
}


