import TeamLogo from "@/components/TeamLogo";
import { usePopularTeamLogos } from "@/lib/live-scores";

const featuredFixtures = [
  { id: "featured-1", sport: "Soccer", home: "Real Madrid", away: "Manchester City", date: "Mar 11, 2026", time: "20:00", league: "UEFA Champions League" },
  { id: "featured-2", sport: "Basketball", home: "Los Angeles Lakers", away: "Boston Celtics", date: "Mar 15, 2026", time: "19:30", league: "NBA" },
  { id: "featured-3", sport: "Baseball", home: "New York Yankees", away: "Los Angeles Dodgers", date: "Mar 18, 2026", time: "18:05", league: "MLB Spring Training" },
  { id: "featured-4", sport: "American football", home: "Kansas City Chiefs", away: "San Francisco 49ers", date: "Mar 21, 2026", time: "20:00", league: "NFL" },
  { id: "featured-5", sport: "Soccer", home: "Bayern Munich", away: "Paris Saint-Germain", date: "Mar 25, 2026", time: "20:00", league: "UEFA Champions League" },
];

export default function FixturesGrid() {
  const soccerNames = [...new Set(featuredFixtures.filter((fixture) => fixture.sport === "Soccer").flatMap((fixture) => [fixture.home, fixture.away]))];
  const logoQueries = usePopularTeamLogos(soccerNames);
  const logos = new Map(logoQueries.flatMap((query) => query.data?.teams ?? []).map((team) => [team.name.toLowerCase(), team.logo]));
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {featuredFixtures.map((fixture) => (
        <div key={fixture.id} className="rounded-xl border bg-background p-4 shadow-sm">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-foreground/60">
            <span className="min-w-0 truncate font-semibold uppercase tracking-wide">{fixture.league}</span>
            <span className="shrink-0">{fixture.date} · {fixture.time}</span>
          </div>
          <div className="mt-2 text-xs font-medium capitalize text-blue-600">{fixture.sport}</div>
          <div className="mt-3 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1">
            <Team name={fixture.home} logo={fixture.sport === "Soccer" ? logos.get(fixture.home.toLowerCase()) : undefined} />
            <span className="px-1 text-sm font-semibold text-foreground/70">vs</span>
            <Team name={fixture.away} logo={fixture.sport === "Soccer" ? logos.get(fixture.away.toLowerCase()) : undefined} align="right" />
          </div>
          <a href="/premium" className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-green-600 px-3 py-2 text-sm font-semibold text-white hover:opacity-90">Watch on Premium</a>
        </div>
      ))}
    </div>
  );
}

function Team({ name, logo, align = "left" as "left" | "right" }) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <TeamLogo name={name} logo={logo} size={36} />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{name}</div>
        <div className="text-xs text-foreground/60">{align === "left" ? "Home" : "Away"}</div>
      </div>
    </div>
  );
}
