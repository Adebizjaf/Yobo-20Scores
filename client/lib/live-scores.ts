import { useQuery } from "@tanstack/react-query";
import type { LiveScore, LiveScoresResponse, ScoreStatus, Sport } from "@shared/live-scores";

export type ScoreFilter = ScoreStatus | "all";

const demoScores: LiveScore[] = [
  { id: "demo-soccer", sport: "soccer", league: "Demo Premier League", venue: "Yobo Stadium", startTime: new Date().toISOString(), status: "live", statusLabel: "Live", clock: "36'", home: { name: "Lagos FC", score: 1 }, away: { name: "Accra United", score: 0 } },
  { id: "demo-basketball", sport: "basketball", league: "Demo National League", venue: "Abuja Arena", startTime: new Date().toISOString(), status: "live", statusLabel: "Live", clock: "Q3", home: { name: "Abuja Heat", score: 52 }, away: { name: "Kano Kings", score: 49 } },
  { id: "demo-tennis", sport: "tennis", league: "Demo Open", venue: "Lagos Tennis Club", startTime: new Date().toISOString(), status: "upcoming", statusLabel: "Scheduled", home: { name: "Okoye" }, away: { name: "Bakare" } },
  { id: "demo-cricket", sport: "cricket", league: "Demo T20 Cup", venue: "Ibadan Oval", startTime: new Date().toISOString(), status: "completed", statusLabel: "Completed", home: { name: "Ibadan XI", score: 120 }, away: { name: "Enugu XI", score: 114 } },
  { id: "demo-rugby", sport: "rugby", league: "Demo Rugby Championship", venue: "PH Sports Ground", startTime: new Date().toISOString(), status: "live", statusLabel: "Live", clock: "41'", home: { name: "PH Sharks", score: 13 }, away: { name: "Benin Bulls", score: 13 } },
];

function fallbackScores(sport: Sport | "all", status: ScoreFilter): LiveScoresResponse {
  const matches = demoScores.filter((match) => (sport === "all" || match.sport === sport) && (status === "all" || match.status === status));
  return { matches, fetchedAt: new Date().toISOString(), cached: true, availableSports: sport === "all" ? ["soccer", "basketball", "tennis", "cricket", "rugby"] : [sport] };
}

async function getLiveScores(sport: Sport | "all", status: ScoreFilter): Promise<LiveScoresResponse> {
  const params = new URLSearchParams({ sport, status });
  const response = await fetch(`/api/live-scores?${params}`);
  if (response.status === 503) return fallbackScores(sport, status);
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Live scores are temporarily unavailable.");
  }
  return response.json() as Promise<LiveScoresResponse>;
}

export function useLiveScores(sport: Sport | "all", status: ScoreFilter = "all") {
  return useQuery({
    queryKey: ["live-scores", sport, status],
    queryFn: () => getLiveScores(sport, status),
    staleTime: status === "live" ? 10_000 : 60_000,
    refetchInterval: status === "live" || status === "all" ? 15_000 : 120_000,
    refetchIntervalInBackground: false,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15_000),
  });
}
