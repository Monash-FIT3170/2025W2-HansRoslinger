import { NextRequest, NextResponse } from "next/server";
import { createUser } from "../../../database/common/user/createUser";
import { createUserFolder } from "lib/http/createUserFolder";

export type SignupResponse = {
  user: { email: string; name: string };
  error?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Code for assigning a unique S3 bucket URL is not included here
    const s3BucketUrl: string = await createUserFolder(email);

    const user = await createUser(name, email, password, s3BucketUrl);

    return NextResponse.json(
      { user: { email: user.email, name: user.name } },
      { status: 201 },
    );
  } catch (error: unknown) {
    let message = "Internal Server Error";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
