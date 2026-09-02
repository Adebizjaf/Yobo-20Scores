export const sports = [
  "soccer",
  "basketball",
  "american-football",
  "baseball",
  "hockey",
  "tennis",
  "cricket",
  "rugby",
  "volleyball",
  "motorsports",
  "boxing",
  "mma",
  "golf",
  "athletics",
] as const;

export type Sport = (typeof sports)[number];
export type ScoreStatus = "live" | "upcoming" | "completed";

export interface LiveScore {
  id: string;
  sport: Sport;
  league: string;
  leagueId?: string;
  venue?: string;
  startTime: string;
  status: ScoreStatus;
  statusLabel: string;
  clock?: string;
  home: { name: string; score?: string | number; logo?: string };
  away?: { name: string; score?: string | number; logo?: string };
}

export interface LeagueStanding {
  rank: number;
  team: string;
  logo?: string;
  played: number;
  points: number;
  goalDifference?: number;
}

export interface LiveScoresResponse {
  matches: LiveScore[];
  fetchedAt: string;
  cached: boolean;
  availableSports: Sport[];
}
