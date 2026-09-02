import { useEffect, useMemo, useState } from "react";
import TeamLogo from "@/components/TeamLogo";
import { teams, getAcronym, type TeamInfo } from "@/data/teams";
import { useLiveScores, useTeamSearch } from "@/lib/live-scores";

const popularTeams = ["Real Madrid", "Manchester United", "Los Angeles Lakers", "New York Yankees", "Kansas City Chiefs"];
const popularTeamRecords: TeamInfo[] = popularTeams.map((name) => ({ name, acronym: getAcronym(name) }));

export default function TeamSearch() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { data } = useLiveScores("soccer", "all");
  const { data: searchedData } = useTeamSearch(q);
  const currentTeams = useMemo(() => {
    const liveTeams: TeamInfo[] = (data?.matches ?? []).flatMap((match) => [
      { name: match.home.name, acronym: getAcronym(match.home.name), logo: match.home.logo },
      ...(match.away ? [{ name: match.away.name, acronym: getAcronym(match.away.name), logo: match.away.logo }] : []),
    ]);
    const searchedTeams: TeamInfo[] = (searchedData?.teams ?? []).map((team) => ({ name: team.name, acronym: getAcronym(team.name), logo: team.logo }));
    return Array.from(new Map([...popularTeamRecords, ...teams, ...liveTeams, ...searchedTeams].map((team) => [team.name.toLowerCase(), team])).values());
  }, [data, searchedData]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string") {
        setQ(detail);
        setSubmitted(true);
      }
    };
    window.addEventListener("yobo:search", handler as EventListener);
    return () =>
      window.removeEventListener("yobo:search", handler as EventListener);
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = term
      ? currentTeams.filter(
          (t) =>
            t.name.toLowerCase().includes(term) ||
            getAcronym(t.name).toLowerCase().includes(term),
        )
      : currentTeams;
    return [...filtered]
      .sort((a, b) => {
        const aRank = popularTeams.indexOf(a.name);
        const bRank = popularTeams.indexOf(b.name);
        return (aRank < 0 ? popularTeams.length : aRank) - (bRank < 0 ? popularTeams.length : bRank);
      })
      .slice(0, 5);
  }, [q, currentTeams]);

  return (
    <div id="search" className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search teams by name or acronym (e.g., LF, Lagos)"
          className="flex-1 rounded-md border bg-background px-3 py-2 outline-none focus:border-blue-500"
          aria-label="Search teams"
        />
        <button
          type="submit"
          className="rounded-md bg-gradient-to-r from-blue-600 to-green-600 px-4 py-2 font-semibold text-white shadow hover:opacity-90"
        >
          Search
        </button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.length === 0 && submitted ? (
          <p className="col-span-full text-sm text-foreground/70">
            No teams found. Try another name or acronym.
          </p>
        ) : (
          results.map((t) => (
            <div
              key={t.name}
              className="flex items-center justify-between rounded-xl border bg-background p-3 shadow-sm"
            >
              <div className="flex min-w-0 items-center gap-3">
                <TeamLogo name={t.name} logo={t.logo} size={32} />
                <div className="min-w-0">
                  <div className="truncate font-semibold">{t.name}</div>
                  <div className="text-xs text-foreground/60">{t.acronym}</div>
                </div>
              </div>
              <a
                href="/premium"
                className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
              >
                Follow
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
