import { useMemo, useState } from "react";
import { AlertCircle, Bike, CalendarClock, Circle, CircleDot, Dumbbell, Flag, Goal, MapPin, Medal, Radio, RefreshCw, Timer, Trophy, type LucideIcon } from "lucide-react";
import { sports, type Sport } from "@shared/live-scores";
import { useLeagueTable, useLiveScores, type ScoreFilter } from "@/lib/live-scores";
import TeamLogo from "@/components/TeamLogo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const labels: Record<Sport, string> = {
  soccer: "Soccer", basketball: "Basketball", "american-football": "American football", baseball: "Baseball", hockey: "Hockey", tennis: "Tennis", cricket: "Cricket", rugby: "Rugby", volleyball: "Volleyball", motorsports: "Motorsports", boxing: "Boxing", mma: "MMA", golf: "Golf", athletics: "Athletics",
};
const statusLabels: Record<ScoreFilter, string> = { all: "All games", live: "Live", upcoming: "Upcoming", completed: "Completed" };
const sportIcons: Record<Sport, LucideIcon> = { soccer: Goal, basketball: CircleDot, "american-football": Trophy, baseball: CircleDot, hockey: Goal, tennis: CircleDot, cricket: Circle, rugby: Medal, volleyball: Circle, motorsports: Bike, boxing: Dumbbell, mma: Medal, golf: Flag, athletics: Timer };
const sportEmojis: Record<Sport, string> = { soccer: "⚽", basketball: "🏀", "american-football": "🏈", baseball: "⚾", hockey: "🏒", tennis: "🎾", cricket: "🏏", rugby: "🏉", volleyball: "🏐", motorsports: "🏎️", boxing: "🥊", mma: "🥋", golf: "⛳", athletics: "🏃" };

function formatStartTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "Time TBD" : new Intl.DateTimeFormat(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" }).format(date);
}

export default function LiveScoresPanel() {
  const [sport, setSport] = useState<Sport | "all">("soccer");
  const [status, setStatus] = useState<ScoreFilter>("all");
  const [league, setLeague] = useState("all");
  const { data, error, isLoading, isFetching, refetch } = useLiveScores(sport, status, league === "English Premier League" ? league : undefined);
  const leagues = useMemo(() => [...new Set(data?.matches.map((match) => match.league) ?? [])], [data]);
  const leagueOptions = useMemo(() => [...new Set(["English Premier League", ...leagues])], [leagues]);
  const [tableLeagueId, setTableLeagueId] = useState<string>();
  const selectedLeague = data?.matches.find((match) => match.league === league);
  const tableQuery = useLeagueTable(tableLeagueId);
  const matches = useMemo(() => data?.matches.filter((match) => league === "all" || match.league === league) ?? [], [data, league]);

  return <section className="space-y-5 sm:space-y-6" aria-labelledby="live-scores-title">
    <div className="rounded-2xl border bg-gradient-to-br from-blue-50/70 via-background to-green-50/70 p-5 shadow-sm dark:from-blue-950/30 dark:via-background dark:to-green-950/20 sm:p-6"><div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-red-600"><Radio className="h-4 w-4" />Live score centre</div>
        <h1 id="live-scores-title" className="mt-1 text-2xl font-extrabold tracking-tight sm:text-4xl">Scores that stay current</h1>
        <p className="mt-2 text-sm text-muted-foreground">Updates automatically while this page is open. Live results refresh every 15 seconds.</p>
      </div>
      <div className="flex flex-wrap gap-2 sm:shrink-0">
        <Button variant="outline" size="sm" onClick={() => { const firstLeague = data?.matches.find((match) => match.leagueId); setSport("soccer"); setLeague(firstLeague?.league ?? "English Premier League"); setTableLeagueId(firstLeague?.leagueId ?? "33973"); }}><CalendarClock />League tables</Button>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}><RefreshCw className={isFetching ? "animate-spin" : ""} />Refresh</Button>
      </div></div>
    </div>

    {data?.cached && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-100"><strong>Demo mode:</strong> live provider access is unavailable, so these sample scores are shown until live events can be loaded.</div>}
    <div className="space-y-4 rounded-2xl border bg-card/90 p-4 shadow-sm backdrop-blur sm:p-5">
      <div><p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sport</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" aria-label="Filter by sport">
        <FilterButton className="w-full justify-center" active={sport === "all"} onClick={() => { setSport("all"); setLeague("all"); }}><span aria-hidden="true">🏆</span><Trophy className="h-4 w-4" aria-hidden="true" />All sports</FilterButton>
        {sports.map((item) => { const Icon = sportIcons[item]; return <FilterButton className="w-full justify-center" key={item} active={sport === item} onClick={() => { setSport(item); setLeague("all"); }}><span aria-hidden="true">{sportEmojis[item]}</span><Icon className="h-4 w-4" aria-hidden="true" />{labels[item]}</FilterButton>; })}
      </div></div>
      <div><p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Game status and league</p><div className="flex max-w-full flex-nowrap gap-2 overflow-x-auto pb-1" aria-label="Filter by game state">
        {(Object.keys(statusLabels) as ScoreFilter[]).map((item) => <FilterButton key={item} active={status === item} onClick={() => setStatus(item)}>{statusLabels[item]}</FilterButton>)}
        {leagueOptions.map((item) => <FilterButton key={item} active={league === item} onClick={() => { setLeague(item); setTableLeagueId(data?.matches.find((match) => match.league === item)?.leagueId); }}>{item}</FilterButton>)}
        {league !== "all" && <button onClick={() => setTableLeagueId(selectedLeague?.leagueId)} disabled={!selectedLeague?.leagueId || tableQuery.isFetching} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"><CalendarClock className="h-3.5 w-3.5" />{tableQuery.isFetching ? "Loading table" : "View league table"}</button>}
      </div></div>
    </div>
    {tableLeagueId && <LeagueTable name={league} rows={tableQuery.data?.rows ?? []} loading={tableQuery.isLoading} error={tableQuery.error} /> }

    {isLoading && <div className="grid gap-3 md:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-44" />)}</div>}
    {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Live scores are unavailable</AlertTitle><AlertDescription>{error.message} <button className="ml-1 underline" onClick={() => refetch()}>Try again</button></AlertDescription></Alert>}
    {!isLoading && !error && matches.length === 0 && <div className="rounded-xl border border-dashed p-10 text-center"><CalendarClock className="mx-auto h-7 w-7 text-muted-foreground" /><h2 className="mt-3 font-semibold">No {status === "all" ? "games" : status + " games"} right now</h2><p className="mt-1 text-sm text-muted-foreground">Choose another sport or status to see available events.</p></div>}
    <div className="grid gap-4 md:grid-cols-2">{matches.map((match) => <article key={match.id} className="min-w-0 rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3 text-xs text-muted-foreground"><span className="min-w-0 truncate font-semibold uppercase tracking-wide text-foreground">{labels[match.sport]} · {match.league}</span><StatusBadge status={match.status} label={match.statusLabel} clock={match.clock} /></div>
      <div className="mt-4 space-y-3"><Competitor name={match.home.name} logo={match.home.logo} score={match.home.score} /><Competitor name={match.away?.name ?? "TBD"} logo={match.away?.logo} score={match.away?.score} /></div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t pt-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" />{formatStartTime(match.startTime)}</span>{match.venue && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{match.venue}</span>}</div>
    </article>)}</div>
  </section>;
}

function LeagueTable({ name, rows, loading, error }: { name: string; rows: Array<{ rank: number; team: string; logo?: string; played: number; points: number; goalDifference?: number }>; loading: boolean; error: Error | null }) {
  return <div className="overflow-hidden rounded-xl border bg-card shadow-sm"><div className="flex items-center justify-between border-b px-4 py-3"><h2 className="font-semibold">{name} table</h2><span className="text-xs text-muted-foreground">Current season</span></div>{loading ? <div className="p-5 text-sm text-muted-foreground">Loading standings…</div> : error ? <div className="p-5 text-sm text-destructive">{error.message}</div> : rows.length === 0 ? <div className="p-5 text-sm text-muted-foreground">Standings are not available for this competition.</div> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Team</th><th className="px-4 py-3">P</th><th className="px-4 py-3">GD</th><th className="px-4 py-3">Pts</th></tr></thead><tbody className="divide-y">{rows.map((row) => <tr key={`${row.rank}-${row.team}`}><td className="px-4 py-3 font-semibold">{row.rank}</td><td className="flex items-center gap-2 px-4 py-3 font-medium"><TeamLogo name={row.team} logo={row.logo} size={24} />{row.team}</td><td className="px-4 py-3">{row.played}</td><td className="px-4 py-3">{row.goalDifference ?? "–"}</td><td className="px-4 py-3 font-bold">{row.points}</td></tr>)}</tbody></table></div>}</div>;
}

function FilterButton({ active, children, onClick, className = "" }: { active: boolean; children: React.ReactNode; onClick: () => void; className?: string }) {
  return <button onClick={onClick} className={`${className} shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${active ? "border-transparent bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-sm shadow-blue-500/20" : "bg-background hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/60 dark:hover:bg-blue-950/30"}`}>{children}</button>;
}
function Competitor({ name, logo, score }: { name: string; logo?: string; score?: string | number }) { return <div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-2"><TeamLogo name={name} logo={logo} /><span className="truncate font-medium">{name}</span></div><span className="text-xl font-bold tabular-nums">{score ?? "–"}</span></div>; }
function StatusBadge({ status, label, clock }: { status: ScoreFilter; label: string; clock?: string }) { return <span className={status === "live" ? "inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 font-bold text-red-600" : "rounded bg-muted px-2 py-1 font-medium"}>{status === "live" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />}{clock ? `${label} ${clock}` : label}</span>; }
