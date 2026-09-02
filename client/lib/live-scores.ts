import { useQueries, useQuery } from "@tanstack/react-query";
import type { LeagueStanding, LiveScoresResponse, ScoreStatus, Sport, TeamSearchResult } from "@shared/live-scores";

export type ScoreFilter = ScoreStatus | "all";

async function getLiveScores(sport: Sport | "all", status: ScoreFilter, league?: string): Promise<LiveScoresResponse> {
  const params = new URLSearchParams({ sport, status });
  if (league && league !== "all") params.set("league", league);
  const response = await fetch(`/api/live-scores?${params}`);
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || "Live scores are temporarily unavailable.");
  }
  return response.json() as Promise<LiveScoresResponse>;
}

async function fetchTeamSearch(name: string) {
  const response = await fetch(`/api/team-search?name=${encodeURIComponent(name.trim())}`);
  if (!response.ok) throw new Error("Team search is temporarily unavailable.");
  return response.json() as Promise<{ teams: TeamSearchResult[] }>;
}

export function useTeamSearch(name: string) {
  return useQuery({
    queryKey: ["team-search", name.trim().toLowerCase()],
    queryFn: () => fetchTeamSearch(name),
    enabled: name.trim().length >= 2,
    staleTime: 300_000,
  });
}

export function usePopularTeamLogos(names: string[]) {
  return useQueries({
    queries: names.map((name) => ({ queryKey: ["team-search", name.toLowerCase()], queryFn: () => fetchTeamSearch(name), staleTime: 300_000 })),
  });
}

export function useLeagueTable(leagueId?: string) {
  return useQuery({
    queryKey: ["league-table", leagueId],
    queryFn: async () => {
      const response = await fetch(`/api/league-table?leagueId=${encodeURIComponent(leagueId!)}`);
      if (!response.ok) throw new Error("League table is temporarily unavailable.");
      return response.json() as Promise<{ rows: LeagueStanding[] }>;
    },
    enabled: Boolean(leagueId),
    staleTime: 300_000,
  });
}

export function useLiveScores(sport: Sport | "all", status: ScoreFilter = "all", league?: string) {
  return useQuery({
    queryKey: ["live-scores", sport, status, league],
    queryFn: () => getLiveScores(sport, status, league),
    staleTime: status === "live" ? 10_000 : 60_000,
    refetchInterval: status === "live" || status === "all" ? 15_000 : 120_000,
    refetchIntervalInBackground: false,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15_000),
  });
}
