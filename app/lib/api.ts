"use client";

import { EP } from "./endpoints";
import { tokenStore } from "./token-store";

export function extractTokenFromResponse(res: Response) {
  const h = res.headers.get("Authorization");
  if (!h) {
    console.log("ℹ️ No Authorization header in response");
    return null;
  }
  const m = /^Bearer\s+(.+)$/i.exec(h.trim());
  const token = m?.[1] || null;
  if (token) {
    console.log(
      "✅ Token extracted from response:",
      token.substring(0, 20) + "..."
    );
  }
  return token;
}

export async function tryRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch(EP.AUTH.refresh, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;

    const fromHeader = extractTokenFromResponse(res);
    if (fromHeader) {
      tokenStore.set(fromHeader);
      return true;
    }
    const body = await res.json().catch(() => ({} as any));
    const t = body?.accessToken || body?.data?.accessToken || null;
    if (!t) return false;
    tokenStore.set(t);
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch(
  url: string,
  options: RequestInit = {},
  {
    skipAuth = false,
    withCredentials = true,
  }: { skipAuth?: boolean; withCredentials?: boolean } = {}
) {
  const headers = new Headers(options.headers || {});
  const sendAuth = !skipAuth;

  if (sendAuth) {
    const t = tokenStore.get();
    if (t) {
      headers.set("Authorization", `Bearer ${t}`);
      console.log(
        "✅ Authorization header added:",
        `Bearer ${t.substring(0, 20)}...`
      );
    } else {
      console.warn("⚠️ No token found in tokenStore");
    }
  }

  let res = await fetch(url, {
    ...options,
    headers,
    credentials: withCredentials ? "include" : "omit",
  });

  const rotated = extractTokenFromResponse(res);
  if (rotated) {
    tokenStore.set(rotated);
    console.log("🔄 Token rotated/updated from response");
  }

  if (res.status === 401 && sendAuth) {
    const ok = await tryRefreshToken();
    if (ok) {
      const retryHeaders = new Headers(options.headers || {});
      const t = tokenStore.get();
      if (t) retryHeaders.set("Authorization", `Bearer ${t}`);
      res = await fetch(url, {
        ...options,
        headers: retryHeaders,
        credentials: withCredentials ? "include" : "omit",
      });
      const rotated2 = extractTokenFromResponse(res);
      if (rotated2) tokenStore.set(rotated2);
    } else {
      tokenStore.clear();
    }
  }

  return res;
}

export async function fetchJSON(
  url: string,
  {
    method = "GET",
    body,
    headers = {},
    ...rest
  }: { method?: string; body?: any; headers?: Record<string, string> } = {},
  opts?: { skipAuth?: boolean; withCredentials?: boolean }
) {
  const h = new Headers(headers);
  h.set("Accept", "application/json");
  if (method !== "GET" && method !== "HEAD") {
    h.set("Content-Type", "application/json; charset=UTF-8");
  }

  const res = await apiFetch(
    url,
    {
      method,
      headers: h,
      body: body ? JSON.stringify(body) : undefined,
      ...rest,
    },
    opts
  );

  const txt = await res.text();
  let json: any = {};
  try {
    json = txt ? JSON.parse(txt) : {};
  } catch {
    console.error(`Invalid JSON from ${url}: ${txt}`);
  }
  if (!res.ok || json?.success === false) {
    console.error(json?.message || `HTTP ${res.status}`);
  }
  return json;
}
