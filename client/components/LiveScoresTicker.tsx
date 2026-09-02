import { useMemo } from "react";
import { Link } from "react-router-dom";
import TeamLogo from "@/components/TeamLogo";
import { useLiveScores } from "@/lib/live-scores";

export default function LiveScoresTicker() {
  const { data, isLoading, error } = useLiveScores("soccer", "live");
  const items = useMemo(() => data?.matches.slice(0, 8) ?? [], [data]);

  if (isLoading) return <div className="h-10 animate-pulse rounded-full bg-muted" aria-label="Loading live scores" />;
  if (error || items.length === 0) return <div className="flex min-h-10 items-center justify-between gap-3 text-sm text-muted-foreground"><span>{error ? "Live scores are temporarily unavailable." : "No soccer matches are live right now."}</span><Link to="/live" className="shrink-0 font-semibold text-blue-600 hover:underline">View all scores</Link></div>;

  const cards = items.map((match) => <div key={match.id} className="flex shrink-0 items-center gap-3 rounded-full border bg-background px-4 py-2 shadow-sm">
    <span className="text-lg">⚽</span><span className="text-xs font-semibold uppercase text-foreground/70">{match.league}</span>
    <span className="flex items-center gap-2 text-sm font-medium"><TeamLogo name={match.home.name} /><span>{match.home.name} <b className="text-blue-600">{match.home.score ?? "–"}</b></span><span className="text-foreground/60">:</span><span><b className="text-green-600">{match.away?.score ?? "–"}</b> {match.away?.name ?? "TBD"}</span><TeamLogo name={match.away?.name ?? "TBD"} /></span>
    <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />{data.cached ? "Demo live" : match.clock ? `Live ${match.clock}` : "Live"}</span>
  </div>);

  return <div className="relative overflow-hidden"><div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent" /><div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent" /><div className="flex w-max animate-[ticker_40s_linear_infinite] gap-4 will-change-transform">{cards}{cards}</div><style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } @media (prefers-reduced-motion: reduce) { .animate-\\[ticker_40s_linear_infinite\\] { animation: none; } }`}</style></div>;
}
