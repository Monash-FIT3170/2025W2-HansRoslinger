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
    const { email, password } = await req.json();
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

    (await cookies()).set({
      name: "email",
      value: email,
      path: "/",
    });

    (await cookies()).set({
      name: "userID",
      value: String(user.id),
      path: "/",
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
