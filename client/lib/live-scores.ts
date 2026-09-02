import { useQuery } from "@tanstack/react-query";
import type { LiveScoresResponse, ScoreStatus, Sport } from "@shared/live-scores";

export type ScoreFilter = ScoreStatus | "all";

async function getLiveScores(sport: Sport | "all", status: ScoreFilter): Promise<LiveScoresResponse> {
  const params = new URLSearchParams({ sport, status });
  const response = await fetch(`/api/live-scores?${params}`);
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
