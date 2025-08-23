export type JsonRecord = Record<string, unknown>;

function composeUrl(inputUrl: string): string {
  // If input is absolute, return as is; otherwise, prefix with public base URL when provided.
  try {
    new URL(inputUrl);
    return inputUrl;
  } catch {
    // Not an absolute URL
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    if (!base) return inputUrl; // relative fetch
    return `${base.replace(/\/$/, "")}/${inputUrl.replace(/^\//, "")}`;
  }
}

async function handleJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Request failed ${response.status} ${response.statusText}${text ? `: ${text}` : ""}`,
    );
  }
  // Some endpoints may return 204 No Content
  if (response.status === 204) return undefined as unknown as T;
  return (await response.json()) as T;
}

export async function getJson<TResponse>(
  url: string,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(composeUrl(url), {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    credentials: init?.credentials ?? "same-origin",
    cache: init?.cache ?? "no-store",
    signal: init?.signal,
  });
  return handleJsonResponse<TResponse>(response);
}

export async function postJson<TBody extends JsonRecord | unknown, TResponse>(
  url: string,
  body: TBody,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(composeUrl(url), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: init?.credentials ?? "same-origin",
    cache: init?.cache ?? "no-store",
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: init?.signal,
  });
  return handleJsonResponse<TResponse>(response);
}

export async function putJson<TBody extends JsonRecord | unknown, TResponse>(
  url: string,
  body: TBody,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(composeUrl(url), {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: init?.credentials ?? "same-origin",
    cache: init?.cache ?? "no-store",
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: init?.signal,
  });
  return handleJsonResponse<TResponse>(response);
}

export async function deleteJson<TResponse>(
  url: string,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(composeUrl(url), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    credentials: init?.credentials ?? "same-origin",
    cache: init?.cache ?? "no-store",
    signal: init?.signal,
  });
  return handleJsonResponse<TResponse>(response);
}
