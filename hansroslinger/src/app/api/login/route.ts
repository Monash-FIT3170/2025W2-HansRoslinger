import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser } from "../../../database/common/user/getUser";
import { updateS3BucketUrl } from "../../../database/common/user/updateS3BucketUrl";
import { createS3UserBucket } from "../../../lib/http/createUserBucket";
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

    // Ensure the user has an S3 bucket/folder. If missing, create and persist it.
    if (!user.s3BucketUrl || user.s3BucketUrl.trim() === "") {
      try {
        const newS3BucketUrl = await createS3UserBucket(email);
        await updateS3BucketUrl(user.id, newS3BucketUrl);
      } catch (bucketError) {
        console.error("Error ensuring user S3 bucket on login:", bucketError);
        return NextResponse.json(
          { success: false, error: "Unable to prepare user storage" },
          { status: 500 },
        );
      }
    }

    (await cookies()).set({
      name: "email",
      value: email,
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
