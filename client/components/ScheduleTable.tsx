import { useMemo, useState } from "react";
import TeamLogo from "@/components/TeamLogo";
import { fixtures } from "@/data/fixtures";

type Sport = "Football" | "Basketball" | "Tennis" | "Cricket" | "Rugby";

const filters: ("All" | Sport)[] = [
  "All",
  "Football",
  "Basketball",
  "Tennis",
  "Cricket",
  "Rugby",
];

export default function ScheduleTable() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const data = useMemo(() => {
    return fixtures.filter((f) =>
      filter === "All" ? true : f.sport === filter,
    );
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

      {/* Mobile/Tablet cards */}
      <div className="grid gap-3 md:hidden">
        {data.map((f) => (
          <div
            key={f.id}
            className="rounded-xl border bg-background p-3 shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-foreground/60">
              <span className="font-semibold uppercase tracking-wide">
                {f.sport}
              </span>
              <span>
                {f.date} • {f.time}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <TeamLogo name={f.home} />
                <span className="truncate text-sm font-medium">{f.home}</span>
              </div>
              <span className="px-2 text-sm font-semibold text-foreground/70">
                vs
              </span>
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm font-medium">{f.away}</span>
                <TeamLogo name={f.away} />
              </div>
            </div>
            <div className="mt-2 text-xs text-foreground/60">{f.league}</div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border shadow-sm md:block">
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
                  <div className="flex items-center gap-3">
                    <TeamLogo name={f.home} />
                    <span className="font-medium truncate">{f.home}</span>
                    <span className="mx-1 text-foreground/60">vs</span>
                    <span className="font-medium truncate">{f.away}</span>
                    <TeamLogo name={f.away} />
                  </div>
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
