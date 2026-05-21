import { cookies } from "next/headers";
import type { APIResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function serverFetch<T>(path: string): Promise<APIResponse<T>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Cookie: `access_token=${accessToken}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") message = body.detail;
      else if (typeof body.error === "string") message = body.error;
    } catch {
      // non-JSON body
    }
    return { success: false, data: null, error: message };
  }

  return res.json() as Promise<APIResponse<T>>;
}
