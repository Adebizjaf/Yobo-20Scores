import { useMemo, useState } from "react";

type Sport = "Football" | "Basketball" | "Tennis" | "Cricket" | "Rugby";

interface Fixture {
  id: string;
  sport: Sport;
  home: string;
  away: string;
  date: string; // ISO or human readable
  time: string; // local time string
  league: string;
}

const fixtures: Fixture[] = [
  { id: "f1", sport: "Football", home: "Lagos FC", away: "Abuja Stars", date: "Today", time: "18:00", league: "Premier League" },
  { id: "f2", sport: "Basketball", home: "Kano Kings", away: "PH Clippers", date: "Today", time: "19:30", league: "NBP" },
  { id: "f3", sport: "Tennis", home: "Okoye", away: "Adeyemi", date: "Tomorrow", time: "14:00", league: "ATP Abuja" },
  { id: "f4", sport: "Cricket", home: "Enugu XI", away: "Ibadan XI", date: "Tomorrow", time: "11:00", league: "NCL" },
  { id: "f5", sport: "Rugby", home: "Benin Bulls", away: "Jos Giants", date: "Sat", time: "16:00", league: "NRL" },
];

const filters: ("All" | Sport)[] = ["All", "Football", "Basketball", "Tennis", "Cricket", "Rugby"];

export default function ScheduleTable() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const data = useMemo(() => {
    return fixtures.filter((f) => (filter === "All" ? true : f.sport === filter));
  }, [filter]);

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors " +
              (filter === f
                ? "bg-gradient-to-r from-blue-600 to-green-600 text-white"
                : "bg-muted hover:bg-muted/70")
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border shadow-sm">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <Th>Sport</Th>
              <Th>Match</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>League</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {data.map((f) => (
              <tr key={f.id} className="hover:bg-muted/30">
                <Td>{f.sport}</Td>
                <Td>
                  <span className="font-medium">{f.home}</span>
                  <span className="mx-1 text-foreground/60">vs</span>
                  <span className="font-medium">{f.away}</span>
                </Td>
                <Td>{f.date}</Td>
                <Td>{f.time}</Td>
                <Td>{f.league}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground/70">
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-sm text-foreground/90">{children}</td>;
}
