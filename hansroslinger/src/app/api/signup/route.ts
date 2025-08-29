import { NextRequest, NextResponse } from "next/server";
import { createUser } from "../../../database/common/user/createUser";
import { createS3UserBucket } from "lib/http/createUserBucket";

export type SignupResponse = {
  user: { email: string; name: string };
  error?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    // Code for assigning a unique S3 bucket URL is not included here
    const s3BucketUrl: string = await createS3UserBucket(email);
    const user = await createUser(email, password, s3BucketUrl);

    return NextResponse.json({ user }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
