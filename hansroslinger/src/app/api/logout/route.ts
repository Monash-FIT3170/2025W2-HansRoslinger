import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  // Clear the auth cookie by setting it expired
  cookieStore.set({
    name: "email",
    value: "",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}


