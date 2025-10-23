import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser } from "../../../database/common/user/getUser";
import * as crypto from "crypto";

export type LoginResponse = {
  success: boolean;
  error?: string;
};
export async function POST(
  req: NextRequest,
): Promise<NextResponse<LoginResponse>> {
  try {
    const { email, password, rememberMe } = await req.json();
    const user = await getUser(email);
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (!user || user.password !== hashedPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: "email",
      value: email,
      path: "/",
      // If rememberMe, persist for 30 days; otherwise session cookie
      ...(rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
