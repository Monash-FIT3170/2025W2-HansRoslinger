import { NextRequest, NextResponse } from "next/server";
import { awsSigV4Fetch } from "../../../lib/http/awsSigV4Fetch";

type ProxyRequest = {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  service?: string;
  region?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProxyRequest;
    if (!body?.url) {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    // Basic guard: only allow https
    if (!/^https:\/\//i.test(body.url)) {
      return NextResponse.json(
        { error: "Only https URLs allowed" },
        { status: 400 },
      );
    }

    const upstream = await awsSigV4Fetch({
      url: body.url,
      method: body.method || "GET",
      headers: body.headers || {},
      body: body.body,
      service: body.service || "execute-api",
      region: body.region,
    });

    // Pass through JSON or text; default to text if not JSON
    const contentType = upstream.headers.get("content-type") || "";
    const responseInit = {
      status: upstream.status,
      headers: {
        "content-type": contentType,
      },
    };
    if (contentType.includes("application/json")) {
      const data = await upstream.json();
      return NextResponse.json(data, responseInit);
    }
    const text = await upstream.text();
    return new NextResponse(text, responseInit);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Proxy error" },
      { status: 500 },
    );
  }
}
