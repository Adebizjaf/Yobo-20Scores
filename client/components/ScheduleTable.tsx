import { useMemo, useState } from "react";
import TeamLogo from "@/components/TeamLogo";
import { useLiveScores, usePopularTeamLogos } from "@/lib/live-scores";

type ScheduleSport = "Soccer" | "Basketball" | "Tennis" | "Cricket" | "Baseball" | "Hockey";
type ScheduleFixture = { id: string; sport: ScheduleSport; home: string; away: string; date: string; time: string; league: string; homeLogo?: string; awayLogo?: string };

const filters: ("All" | ScheduleSport)[] = ["All", "Soccer", "Basketball", "Tennis", "Cricket", "Baseball", "Hockey"];
const marchFixtures: ScheduleFixture[] = [
  { id: "march-basketball", sport: "Basketball", home: "Los Angeles Lakers", away: "Boston Celtics", date: "Mar 15, 2026", time: "19:30", league: "NBA" },
  { id: "march-tennis", sport: "Tennis", home: "Carlos Alcaraz", away: "Jannik Sinner", date: "Mar 17, 2026", time: "14:00", league: "ATP Masters" },
  { id: "march-cricket", sport: "Cricket", home: "India", away: "Australia", date: "Mar 19, 2026", time: "09:30", league: "ICC T20 World Cup" },
  { id: "march-baseball", sport: "Baseball", home: "New York Yankees", away: "Los Angeles Dodgers", date: "Mar 21, 2026", time: "18:05", league: "MLB Spring Training" },
  { id: "march-hockey", sport: "Hockey", home: "Toronto Maple Leafs", away: "Boston Bruins", date: "Mar 23, 2026", time: "19:00", league: "NHL" },
  { id: "march-soccer", sport: "Soccer", home: "Real Madrid", away: "Manchester City", date: "Mar 25, 2026", time: "20:00", league: "UEFA Champions League" },
  { id: "march-premier-league", sport: "Soccer", home: "Arsenal", away: "Liverpool", date: "Mar 29, 2026", time: "16:30", league: "English Premier League" },
];

function formatProviderDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "Today" : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
}
function formatProviderTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "Time TBD" : new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
}

export default function ScheduleTable() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const { data: liveData } = useLiveScores("soccer", "all");
  const soccerNames = [...new Set(marchFixtures.filter((fixture) => fixture.sport === "Soccer").flatMap((fixture) => [fixture.home, fixture.away]))];
  const logoQueries = usePopularTeamLogos(soccerNames);
  const logos = new Map(logoQueries.flatMap((query) => query.data?.teams ?? []).map((team) => [team.name.toLowerCase(), team.logo]));
  const schedule = useMemo<ScheduleFixture[]>(() => {
    const providerSoccer = (liveData?.matches ?? []).slice(0, 1).map((match) => ({ id: match.id, sport: "Soccer" as const, home: match.home.name, away: match.away?.name ?? "TBD", date: formatProviderDate(match.startTime), time: formatProviderTime(match.startTime), league: match.league, homeLogo: match.home.logo ?? logos.get(match.home.name.toLowerCase()), awayLogo: match.away?.logo ?? logos.get((match.away?.name ?? "TBD").toLowerCase()) }));
    const datedFixtures = marchFixtures.map((fixture) => ({ ...fixture, homeLogo: fixture.homeLogo ?? (fixture.sport === "Soccer" ? logos.get(fixture.home.toLowerCase()) : undefined), awayLogo: fixture.awayLogo ?? (fixture.sport === "Soccer" ? logos.get(fixture.away.toLowerCase()) : undefined) }));
    return providerSoccer.length ? [...providerSoccer, ...datedFixtures.filter((fixture) => fixture.sport !== "Soccer" || fixture.league === "English Premier League")] : datedFixtures;
  }, [liveData, logoQueries]);
  const data = useMemo(() => schedule.filter((fixture) => filter === "All" || fixture.sport === filter), [filter, schedule]);

  return <div className="w-full">
    <div className="mb-4 flex flex-wrap gap-2">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${filter === item ? "bg-gradient-to-r from-blue-600 to-green-600 text-white" : "bg-muted hover:bg-muted/70"}`}>{item}</button>)}</div>
    <div className="grid gap-3 md:hidden">{data.map((fixture) => <div key={fixture.id} className="rounded-xl border bg-background p-3 shadow-sm"><div className="flex items-center justify-between text-xs text-foreground/60"><span className="font-semibold uppercase tracking-wide">{fixture.sport}</span><span>{fixture.date} • {fixture.time}</span></div><div className="mt-3 flex items-center justify-between gap-2"><div className="flex min-w-0 items-center gap-2"><TeamLogo name={fixture.home} logo={fixture.homeLogo} /><span className="truncate text-sm font-medium">{fixture.home}</span></div><span className="px-2 text-sm font-semibold text-foreground/70">vs</span><div className="flex min-w-0 items-center gap-2"><span className="truncate text-sm font-medium">{fixture.away}</span><TeamLogo name={fixture.away} logo={fixture.awayLogo} /></div></div><div className="mt-2 text-xs text-foreground/60">{fixture.league}</div></div>)}</div>
    <div className="hidden overflow-hidden rounded-xl border shadow-sm md:block"><table className="min-w-full divide-y divide-border"><thead className="bg-muted/50"><tr><Th>Sport</Th><Th>Match</Th><Th>Date</Th><Th>Time</Th><Th>League</Th></tr></thead><tbody className="divide-y divide-border bg-background">{data.map((fixture) => <tr key={fixture.id} className="hover:bg-muted/30"><Td>{fixture.sport}</Td><Td><div className="flex items-center gap-3"><TeamLogo name={fixture.home} logo={fixture.homeLogo} /><span className="truncate font-medium">{fixture.home}</span><span className="mx-1 text-foreground/60">vs</span><span className="truncate font-medium">{fixture.away}</span><TeamLogo name={fixture.away} logo={fixture.awayLogo} /></div></Td><Td>{fixture.date}</Td><Td>{fixture.time}</Td><Td>{fixture.league}</Td></tr>)}</tbody></table></div>
  </div>;
}
function Th({ children }: { children: React.ReactNode }) { return <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground/70">{children}</th>; }
function Td({ children }: { children: React.ReactNode }) { return <td className="px-4 py-3 text-sm text-foreground/90">{children}</td>; }
