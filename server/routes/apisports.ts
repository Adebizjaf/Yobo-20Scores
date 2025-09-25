import type { RequestHandler } from "express";

const KEY = process.env.APISPORTS_API_KEY ?? "";
const DOMAIN = (process.env.APISPORTS_DOMAIN ?? "https://api-football.com").replace(/\/$/, "");
const FALLBACK_BASE = (process.env.APISPORTS_BASE_URL ?? "").replace(/\/$/, "");

const BASES: Record<string, string> = {
  soccer: `${DOMAIN}/soccer`,
  basketball: `${DOMAIN}/basketball`,
  rugby: `${DOMAIN}/rugby`,
};

export const handleApiSportsStatus: RequestHandler = (_req, res) => {
  const keyPresent = Boolean(KEY);
  res.status(200).json({
    ok: keyPresent,
    keyPresent,
    domain: DOMAIN,
    fallbackBase: FALLBACK_BASE || null,
    supported: Object.keys(BASES),
  });
};

/**
 * Proxy GET requests to API-FOOTBALL family services.
 * Patterns supported by default:
 *   - /api/apisports/soccer/<path>
 *   - /api/apisports/basketball/<path>
 *   - /api/apisports/rugby/<path>
 * Or set APISPORTS_BASE_URL to forward arbitrary paths: /api/apisports/<path>
 */
export const proxyApiSports: RequestHandler = async (req, res) => {
  if (!KEY) {
    res.status(500).json({ error: "APISPORTS_API_KEY is not configured" });
    return;
  }
  if (req.method !== "GET") {
    res.status(405).json({ error: "Only GET is supported by this proxy" });
    return;
  }

  const fullPath = req.path.replace(/^\/+/, ""); // e.g., "soccer/fixtures?date=..." or "v3/..." if FALLBACK_BASE is set
  const [seg1, ...restParts] = fullPath.split("/");

  let base = "";
  let subPath = "";
  if (FALLBACK_BASE) {
    base = FALLBACK_BASE;
    subPath = fullPath;
  } else if (seg1 && BASES[seg1]) {
    base = BASES[seg1];
    subPath = restParts.join("/");
  } else {
    res.status(400).json({ error: "Unknown upstream. Use one of /soccer, /basketball, /rugby or configure APISPORTS_BASE_URL" });
    return;
  }

  const target = new URL(subPath, base.endsWith("/") ? base : base + "/");
  for (const [k, v] of Object.entries(req.query)) {
    if (typeof v === "string") target.searchParams.append(k, v);
    else if (Array.isArray(v)) v.forEach((vv) => target.searchParams.append(k, String(vv)));
  }

  try {
    const upstream = await fetch(target.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-apisports-key": KEY,
      },
    });

    const contentType = upstream.headers.get("content-type") ?? "application/json";
    const text = await upstream.text();
    res.status(upstream.status).setHeader("content-type", contentType).send(text);
  } catch (err) {
    res.status(502).json({ error: "Failed to contact upstream", detail: err instanceof Error ? err.message : String(err) });
  }
};
