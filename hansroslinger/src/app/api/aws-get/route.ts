import { NextRequest, NextResponse } from "next/server";
import { getObject } from "../../../lib/http/getObject";
import { Readable } from "stream";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const key = searchParams.get("key");

  if (!email || !key) {
    return NextResponse.json(
      { error: "Missing email or key" },
      { status: 400 },
    );
  }

  try {
    const { body, contentType, contentLength } = await getObject(email, key);

    if (!(body instanceof Readable)) {
      return NextResponse.json({ error: "Invalid file body" }, { status: 500 });
    }

    const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
      const chunks: Uint8Array[] = [];
      for await (const chunk of stream) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }
      return Buffer.concat(chunks);
    };

    const buffer = await streamToBuffer(body as Readable);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Content-Length": contentLength?.toString() || buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("S3 fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 },
    );
  }
}
