import { useEffect, useMemo, useState } from "react";

interface LiveMatch {
  id: string;
  sport: "Football" | "Basketball" | "Tennis" | "Cricket" | "Rugby";
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  minute: number; // generic time marker
}

const initial: LiveMatch[] = [
  { id: "1", sport: "Football", home: "Lagos FC", away: "Accra United", homeScore: 1, awayScore: 0, minute: 36 },
  { id: "2", sport: "Basketball", home: "Abuja Heat", away: "Kano Kings", homeScore: 52, awayScore: 49, minute: 3 },
  { id: "3", sport: "Tennis", home: "Okoye", away: "Bakare", homeScore: 1, awayScore: 1, minute: 2 },
  { id: "4", sport: "Cricket", home: "Ibadan XI", away: "Enugu XI", homeScore: 120, awayScore: 4, minute: 28 },
  { id: "5", sport: "Rugby", home: "PH Sharks", away: "Benin Bulls", homeScore: 7, awayScore: 6, minute: 41 },
];

function sportIcon(sport: LiveMatch["sport"]) {
  switch (sport) {
    case "Football":
      return "⚽";
    case "Basketball":
      return "🏀";
    case "Tennis":
      return "🎾";
    case "Cricket":
      return "🏏";
    case "Rugby":
      return "🏉";
  }
}

export default function LiveScoresTicker() {
  const [matches, setMatches] = useState<LiveMatch[]>(initial);

  // Simulate live updates
  useEffect(() => {
    const t = setInterval(() => {
      setMatches((prev) =>
        prev.map((m, i) => {
          if (i % 2 === 0 && Math.random() > 0.7) {
            return {
              ...m,
              homeScore: m.homeScore + (Math.random() > 0.5 ? 1 : 0),
              awayScore: m.awayScore + (Math.random() > 0.5 ? 1 : 0),
              minute: m.minute + 1,
            };
          }
          return { ...m, minute: m.minute + 1 };
        })
      );
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const items = useMemo(() => {
    return matches.map((m) => (
      <div
        key={m.id}
        className="flex items-center gap-3 rounded-full border bg-background px-4 py-2 shadow-sm"
      >
        <span className="text-lg">{sportIcon(m.sport)}</span>
        <span className="text-xs font-semibold uppercase text-foreground/70">{m.sport}</span>
        <span className="text-sm font-medium">
          {m.home} <span className="font-bold text-blue-600">{m.homeScore}</span>
          {" : "}
          <span className="font-bold text-green-600">{m.awayScore}</span> {m.away}
        </span>
        <span className="ml-2 inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
          Live {m.minute}'
        </span>
      </div>
    ));
  }, [matches]);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />
      <div className="flex animate-[ticker_40s_linear_infinite] gap-4 will-change-transform">
        {items}
        {items}
      </div>
      <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
