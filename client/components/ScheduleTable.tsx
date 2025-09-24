import { useMemo, useState } from "react";
import TeamLogo from "@/components/TeamLogo";
import { fixtures } from "@/data/fixtures";

type Sport = "Football" | "Basketball" | "Tennis" | "Cricket" | "Rugby";

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

      <div className="overflow-x-auto rounded-xl border shadow-sm">
        <table className="min-w-[720px] divide-y divide-border">
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
