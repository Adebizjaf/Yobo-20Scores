import type { ApiSportsStatusResponse } from "@shared/api";

const API_PREFIX = "/api/apisports";

export async function getApiSportsStatus(): Promise<ApiSportsStatusResponse> {
  const r = await fetch(`${API_PREFIX}/status`);
  if (!r.ok) throw new Error(`Status check failed: ${r.status}`);
  return (await r.json()) as ApiSportsStatusResponse;
}

export async function apisportsGet<T = unknown>(path: string, params?: Record<string, string | number | boolean>) {
  const url = new URL(path.replace(/^\//, ""), `${API_PREFIX}/`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  }
  const r = await fetch(url.toString());
  if (!r.ok) throw new Error(`API-SPORTS request failed: ${r.status}`);
  const ct = r.headers.get("content-type") || "application/json";
  if (ct.includes("application/json")) return (await r.json()) as T;
  return (await r.text()) as unknown as T;
}
