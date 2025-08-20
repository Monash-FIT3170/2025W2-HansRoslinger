/**
 * Server-only helper to call AWS API Gateway or AWS services signed with SigV4.
 * Requires env vars: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, (optional) AWS_SESSION_TOKEN,
 * AWS_REGION, and API host. Do not import this in client components.
 */
import aws4 from "aws4";

type AwsSigV4Params = {
	url: string;
	method?: string;
	body?: string | Uint8Array;
	headers?: Record<string, string>;
	service?: string; // e.g. 'execute-api'
	region?: string; // defaults to env
};

function assertServer() {
	if (typeof window !== "undefined") {
		throw new Error("awsSigV4Fetch must only be used on the server.");
	}
}

export async function awsSigV4Fetch(params: AwsSigV4Params): Promise<Response> {
	assertServer();
	const { url, method = "GET", body, headers = {}, service = "execute-api" } = params;
	const region = params.region || process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";

	const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN } = process.env;
	if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
		throw new Error("Missing AWS credentials in environment.");
	}

	const urlObj = new URL(url);
	const opts: aws4.Request = {
		host: urlObj.host,
		path: urlObj.pathname + (urlObj.search || ""),
		method,
		headers: { ...headers },
		service,
		region,
		body: typeof body === "string" ? body : body ? Buffer.from(body) : undefined,
	};

	const signed = aws4.sign(opts, {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY,
		sessionToken: AWS_SESSION_TOKEN,
	});

	// aws4 may add 'Host' header; fetch in Next.js prefers lowercase
	const signedHeaders: Record<string, string> = {};
	Object.entries(signed.headers || {}).forEach(([k, v]) => {
		if (typeof v === "string") signedHeaders[k] = v;
	});

	return fetch(url, {
		method,
		headers: signedHeaders,
		body: body as BodyInit | null,
		cache: "no-store",
	});
}


