import type { APIResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const AUTH_PATHS = new Set(["/auth/login", "/auth/signup"]);

type FetchOptions = RequestInit & { skipRedirect?: boolean };

export async function fetchWithAuth<T>(
  path: string,
  options: FetchOptions = {}
): Promise<APIResponse<T>> {
  const { skipRedirect, ...fetchOpts } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOpts,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOpts.headers,
    },
  });

  // On error, parse FastAPI's {"detail": "..."} or our {"error": "..."}
  if (!res.ok) {
    // 401 on protected routes → redirect to login
    if (
      res.status === 401 &&
      !skipRedirect &&
      !AUTH_PATHS.has(path) &&
      typeof window !== "undefined"
    ) {
      window.location.href = "/login";
      return { success: false, data: null, error: "Not authenticated" };
    }

    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      // FastAPI HTTPException format
      if (typeof body.detail === "string") message = body.detail;
      // Our APIResponse format (rare on error paths)
      else if (typeof body.error === "string") message = body.error;
    } catch {
      // response body not JSON — keep default message
    }
    return { success: false, data: null, error: message };
  }

  const json: APIResponse<T> = await res.json();
  return json;
}

export function get<T>(path: string): Promise<APIResponse<T>> {
  return fetchWithAuth<T>(path, { method: "GET" });
}

export function post<T>(path: string, body: unknown): Promise<APIResponse<T>> {
  return fetchWithAuth<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function put<T>(path: string, body: unknown): Promise<APIResponse<T>> {
  return fetchWithAuth<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function del<T>(path: string): Promise<APIResponse<T>> {
  return fetchWithAuth<T>(path, { method: "DELETE" });
}
