import type { RequestHandler } from "express";
import { sports, type LeagueStanding, type LiveScore, type ScoreStatus, type Sport } from "../../shared/live-scores";

const API_KEY = process.env.APISPORTS_API_KEY ?? "";
const HIGHLIGHTLY_KEY = process.env.HIGHLIGHTLY_API_KEY ?? "";
const HIGHLIGHTLY_DOMAIN = "https://sports.highlightly.net";
const FOOTBALL_DOMAIN = (process.env.APISPORTS_DOMAIN ?? "https://api-football.com").replace(/\/$/, "");
const configuredBases = parseBases(process.env.APISPORTS_SPORT_BASES);
const cache = new Map<string, { value: LiveScore[]; expiresAt: number }>();
const teamLogoCache = new Map<string, { teams: Array<{ name: string; logo?: string }>; expiresAt: number }>();

function parseBases(value?: string): Partial<Record<Sport, string>> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([sport, base]) => sports.includes(sport as Sport) && typeof base === "string" && base.startsWith("https://"),
      ),
    ) as Partial<Record<Sport, string>>;
  } catch {
    return {};
  }
}

function baseFor(sport: Sport) {
  if (configuredBases[sport]) return configuredBases[sport]!;
  if (sport === "soccer") return FOOTBALL_DOMAIN.includes("api-football.com") ? `${FOOTBALL_DOMAIN}/v3` : FOOTBALL_DOMAIN;
  return undefined;
}

function isLive(value: unknown) {
  const status = String(value ?? "").trim().toLowerCase();
  return ["live", "in play", "in progress", "1h", "2h", "ht", "halftime", "q1", "q2", "q3", "q4", "ot", "set 1", "set 2", "set 3"].includes(status) || /^(first|second|third|fourth) half$/.test(status);
}

function isCompleted(value: unknown) {
  const status = String(value ?? "").toLowerCase();
  return ["finished", "completed", "final", "ended", "ft", "aet", "pen"].some((completed) => status.includes(completed));
}

function valueAt(source: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function normalizeGame(sport: Sport, raw: unknown): LiveScore | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const fixture = (item.fixture ?? item.game ?? item.event ?? item) as Record<string, unknown>;
  const teams = (item.teams ?? item.competitors ?? {}) as Record<string, unknown>;
  const home = (teams.home ?? item.home ?? item.player ?? item.first) as Record<string, unknown> | undefined;
  const away = (teams.away ?? item.away ?? item.opponent ?? item.second) as Record<string, unknown> | undefined;
  const leagueData = (item.league ?? item.competition ?? {}) as Record<string, unknown>;
  const statusData = (fixture.status ?? item.status ?? {}) as Record<string, unknown>;
  const statusLabel = String(valueAt(statusData, "long", "short", "name") ?? valueAt(item, "status") ?? "Scheduled");
  const status: ScoreStatus = isLive(statusLabel) ? "live" : isCompleted(statusLabel) ? "completed" : "upcoming";
  const scores = (item.score ?? item.scores ?? {}) as Record<string, unknown>;
  const homeScore = (scores.home ?? item.home_score ?? home?.score) as unknown;
  const awayScore = (scores.away ?? item.away_score ?? away?.score) as unknown;
  const homeName = String(valueAt(home ?? {}, "name", "fullname", "displayName") ?? valueAt(item, "home_name", "name") ?? "TBD");
  const awayName = String(valueAt(away ?? {}, "name", "fullname", "displayName") ?? valueAt(item, "away_name", "opponent_name") ?? "TBD");
  const start = valueAt(fixture, "date", "timestamp", "start", "time") ?? valueAt(item, "date", "start");
  const timestamp = typeof start === "number" ? new Date(start * 1000).toISOString() : typeof start === "string" ? start : new Date().toISOString();

  return {
    id: `${sport}:${String(valueAt(fixture, "id") ?? valueAt(item, "id") ?? `${homeName}-${awayName}-${timestamp}`)}`,
    sport,
    league: String(valueAt(leagueData, "name", "title") ?? valueAt(item, "league_name", "tournament") ?? "Competition"),
    venue: String(valueAt((fixture.venue ?? {}) as Record<string, unknown>, "name") ?? valueAt(item, "venue") ?? "") || undefined,
    startTime: timestamp,
    status,
    statusLabel,
    clock: String(valueAt(statusData, "elapsed", "timer", "period") ?? valueAt(fixture, "timer") ?? "") || undefined,
    home: { name: homeName, score: homeScore as string | number | undefined },
    away: awayName === "TBD" ? undefined : { name: awayName, score: awayScore as string | number | undefined },
  };
}

function normalizeHighlightly(raw: unknown, sport: "soccer" | "hockey"): LiveScore | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const state = (item.state ?? {}) as Record<string, unknown>;
  const score = (state.score ?? {}) as Record<string, unknown>;
  const home = (item.homeTeam ?? {}) as Record<string, unknown>;
  const away = (item.awayTeam ?? {}) as Record<string, unknown>;
  const country = (item.country ?? {}) as Record<string, unknown>;
  const league = (item.league ?? {}) as Record<string, unknown>;
  const statusLabel = String(state.description ?? "Scheduled");
  const currentScore = String(score.current ?? "");
  const [homeScore, awayScore] = currentScore.split(/\s*[-:]\s*/).map((value) => value || undefined);
  return {
    id: `${sport}:${String(item.id ?? `${home.name}-${away.name}-${item.date}`)}`,
    sport,
    league: String(sport === "soccer" && league.id === 33973 ? "English Premier League" : league.name ?? country.name ?? (sport === "hockey" ? "Hockey" : "Football")),
    leagueId: String(league.id ?? item.leagueId ?? "") || undefined,
    venue: String(((item.venue ?? {}) as Record<string, unknown>).name ?? "") || undefined,
    startTime: String(item.date ?? new Date().toISOString()),
    status: isLive(statusLabel) ? "live" : isCompleted(statusLabel) ? "completed" : "upcoming",
    statusLabel,
    clock: String(state.clock ?? "") || undefined,
    home: { name: String(home.name ?? "TBD"), score: homeScore, logo: typeof home.logo === "string" ? home.logo : undefined },
    away: { name: String(away.name ?? "TBD"), score: awayScore, logo: typeof away.logo === "string" ? away.logo : undefined },
  };
}

async function fetchHighlightly(sport: "soccer" | "hockey", status: ScoreStatus | "all", leagueId?: string) {
  const cacheKey = `highlightly:${sport}:${status}:${leagueId ?? "all"}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const url = new URL(`${sport === "soccer" ? "football" : "hockey"}/matches`, `${HIGHLIGHTLY_DOMAIN}/`);
  if (leagueId) url.searchParams.set("leagueId", leagueId);
  else url.searchParams.set("date", new Date().toISOString().slice(0, 10));
  const response = await fetch(url, { headers: { Accept: "application/json", "x-rapidapi-key": HIGHLIGHTLY_KEY }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`Highlightly upstream returned ${response.status}`);
  const body = (await response.json()) as { data?: unknown[] };
  const matches = (body.data ?? []).map((game) => normalizeHighlightly(game, sport)).filter((match): match is LiveScore => Boolean(match));
  const filtered = status === "all" ? matches : matches.filter((match) => match.status === status);
  cache.set(cacheKey, { value: filtered, expiresAt: Date.now() + (status === "live" ? 15_000 : 120_000) });
  return filtered;
}

async function fetchSport(sport: Sport, status: ScoreStatus | "all", leagueId?: string) {
  if ((sport === "soccer" || sport === "hockey") && HIGHLIGHTLY_KEY) return fetchHighlightly(sport, status, leagueId);
  const base = baseFor(sport);
  if (!base) return [];
  const cacheKey = `${sport}:${status}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const url = new URL(sport === "soccer" ? "fixtures" : "games", `${base}/`);
  if (sport === "soccer" && status === "live") url.searchParams.set("live", "all");
  else url.searchParams.set("date", new Date().toISOString().slice(0, 10));

  const response = await fetch(url, { headers: { Accept: "application/json", "x-apisports-key": API_KEY }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`${sport} upstream returned ${response.status}`);
  const body = (await response.json()) as { response?: unknown[] };
  const matches = (body.response ?? []).map((game) => normalizeGame(sport, game)).filter((game): game is LiveScore => Boolean(game));
  const filtered = status === "all" ? matches : matches.filter((game) => game.status === status);
  cache.set(cacheKey, { value: filtered, expiresAt: Date.now() + (status === "live" ? 15_000 : 120_000) });
  return filtered;
}

export const handleTeamSearch: RequestHandler = async (req, res) => {
  if (!HIGHLIGHTLY_KEY) return res.status(503).json({ teams: [] });
  const name = typeof req.query.name === "string" ? req.query.name.trim() : "";
  if (name.length < 2) return res.json({ teams: [] });
  const cacheKey = name.toLowerCase();
  const cached = teamLogoCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return res.json({ teams: cached.teams });
  const url = new URL("football/teams", `${HIGHLIGHTLY_DOMAIN}/`);
  url.searchParams.set("name", name);
  url.searchParams.set("limit", "5");
  try {
    const response = await fetch(url, { headers: { Accept: "application/json", "x-rapidapi-key": HIGHLIGHTLY_KEY }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`Highlightly teams returned ${response.status}`);
    const body = (await response.json()) as { data?: Array<{ name?: string; logo?: string }> };
    const teams = (body.data ?? []).filter((team) => team.name).map((team) => ({ name: team.name!, logo: team.logo }));
    teamLogoCache.set(cacheKey, { teams, expiresAt: Date.now() + 86_400_000 });
    res.json({ teams });
  } catch {
    res.status(502).json({ error: "Team search is temporarily unavailable." });
  }
};

export const handleLeagueTable: RequestHandler = async (req, res) => {
  if (!HIGHLIGHTLY_KEY) return res.status(503).json({ error: "League tables are not configured yet." });
  const leagueId = typeof req.query.leagueId === "string" ? req.query.leagueId : "";
  const season = typeof req.query.season === "string" ? req.query.season : String(new Date().getUTCFullYear());
  if (!leagueId) return res.status(400).json({ error: "A league is required." });
  const url = new URL("standings", "https://soccer.highlightly.net/");
  url.searchParams.set("leagueId", leagueId);
  url.searchParams.set("season", season);
  try {
    const response = await fetch(url, { headers: { Accept: "application/json", "x-rapidapi-key": HIGHLIGHTLY_KEY }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`Highlightly standings returned ${response.status}`);
    const body = (await response.json()) as { data?: unknown[]; groups?: unknown[] };
    const groups = body.groups ?? body.data ?? [];
    const rows: LeagueStanding[] = groups.flatMap((group) => {
      const standings = ((group as Record<string, unknown>)?.standings ?? group) as unknown;
      return Array.isArray(standings) ? standings : [];
    }).map((row, index) => {
      const value = row as Record<string, unknown>;
      const team = (value.team ?? {}) as Record<string, unknown>;
      return { rank: Number(value.rank ?? index + 1), team: String(team.name ?? value.name ?? "Team"), logo: typeof team.logo === "string" ? team.logo : undefined, played: Number(value.played ?? value.games ?? value.matches ?? 0), points: Number(value.points ?? 0), goalDifference: value.goalDifference == null ? undefined : Number(value.goalDifference) };
    });
    res.json({ leagueId, season, rows });
  } catch (error) {
    res.status(502).json({ error: error instanceof Error ? error.message : "League table is temporarily unavailable." });
  }
};

export const handleLiveScores: RequestHandler = async (req, res) => {
  if (!API_KEY && !HIGHLIGHTLY_KEY) return res.status(503).json({ error: "Live scores are not configured yet." });
  const requestedSport = typeof req.query.sport === "string" ? req.query.sport : "soccer";
  const requestedStatus = typeof req.query.status === "string" ? req.query.status : "all";
  const league = typeof req.query.league === "string" ? req.query.league : undefined;
  if (requestedSport !== "all" && !sports.includes(requestedSport as Sport)) return res.status(400).json({ error: "Unsupported sport" });
  if (!["all", "live", "upcoming", "completed"].includes(requestedStatus)) return res.status(400).json({ error: "Unsupported status" });

  const selectedSports = requestedSport === "all" ? sports.filter((sport) => baseFor(sport) || (HIGHLIGHTLY_KEY && (sport === "soccer" || sport === "hockey"))) : [requestedSport as Sport];
  try {
    const leagueId = requestedSport === "soccer" && requestedStatus && req.query.league === "English Premier League" ? "33973" : undefined;
    const groups = await Promise.all(selectedSports.map((sport) => fetchSport(sport, requestedStatus as ScoreStatus | "all", leagueId)));
    let matches = groups.flat();
    if (league) matches = matches.filter((match) => match.league === league);
    res.json({ matches, fetchedAt: new Date().toISOString(), cached: false, availableSports: selectedSports });
  } catch (error) {
    res.status(502).json({ error: error instanceof Error ? error.message : "Live scores are temporarily unavailable." });
  }
};
