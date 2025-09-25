import type { RequestHandler } from "express";

const env = {
  key: process.env.APISPORTS_API_KEY ?? "",
  baseUrl: (process.env.APISPORTS_BASE_URL ?? "https://api-sports.io/").replace(/\/$/, ""),
};

export const handleApiSportsStatus: RequestHandler = (_req, res) => {
  const ok = Boolean(env.key);
  res.status(200).json({ ok, baseUrl: env.baseUrl, keyPresent: ok });
};

/**
 * Proxies GET requests to API-SPORTS using the configured base URL.
 *
 * Usage: GET /api/apisports/<path>?<query>
 * Example: /api/apisports/status or /api/apisports/v3/football/leagues
 */
export const proxyApiSports: RequestHandler = async (req, res) => {
  if (!env.key) {
    res.status(500).json({ error: "APISPORTS_API_KEY is not configured" });
    return;
  }

  // Compute target URL by appending the request path (after /api/apisports) to baseUrl
  const subPath = req.path.replace(/^\/?/, "");
  const url = new URL(env.baseUrl);
  // Ensure trailing slash in base
  const base = url.toString().replace(/\/?$/, "/");
  const target = new URL(subPath, base);

  // Append query params
  for (const [k, v] of Object.entries(req.query)) {
    if (typeof v === "string") target.searchParams.append(k, v);
    else if (Array.isArray(v)) v.forEach((vv) => target.searchParams.append(k, String(vv)));
  }

  try {
    const upstream = await fetch(target.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-apisports-key": env.key,
      },
    });

    const contentType = upstream.headers.get("content-type") ?? "application/json";
    const text = await upstream.text();
    res.status(upstream.status).setHeader("content-type", contentType).send(text);
  } catch (err) {
    res.status(502).json({ error: "Failed to contact API-SPORTS", detail: err instanceof Error ? err.message : String(err) });
  }
};
