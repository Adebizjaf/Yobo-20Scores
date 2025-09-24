import { useEffect, useMemo, useState } from "react";
import TeamLogo from "@/components/TeamLogo";
import { teams, getAcronym } from "@/data/teams";

export default function TeamSearch() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string") {
        setQ(detail);
        setSubmitted(true);
      }
    };
    window.addEventListener("yobo:search", handler as EventListener);
    return () => window.removeEventListener("yobo:search", handler as EventListener);
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return teams;
    return teams.filter(
      (t) =>
        t.name.toLowerCase().includes(term) ||
        getAcronym(t.name).toLowerCase().includes(term),
    );
  }, [q]);

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
          <p className="col-span-full text-sm text-foreground/70">No teams found. Try another name or acronym.</p>
        ) : (
          results.map((t) => (
            <div key={t.name} className="flex items-center justify-between rounded-xl border bg-background p-3 shadow-sm">
              <div className="flex min-w-0 items-center gap-3">
                <TeamLogo name={t.name} size={32} />
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
