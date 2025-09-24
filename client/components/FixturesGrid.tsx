import TeamLogo from "@/components/TeamLogo";
import { fixtures } from "@/data/fixtures";

export default function FixturesGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {fixtures.map((f) => (
        <div
          key={f.id}
          className="rounded-xl border bg-background p-4 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-foreground/60">
            <span className="font-semibold uppercase tracking-wide">
              {f.league}
            </span>
            <span>
              {f.date} • {f.time}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <Team name={f.home} />
            <span className="px-2 text-sm font-semibold text-foreground/70">
              vs
            </span>
            <Team name={f.away} align="right" />
          </div>
          <a
            href="/premium"
            className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-green-600 px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Watch on Premium
          </a>
        </div>
      ))}
    </div>
  );
}

function Team({ name, align = "left" as "left" | "right" }) {
  return (
    <div
      className={`flex min-w-0 items-center gap-3 ${align === "right" ? "flex-row-reverse text-right" : ""}`}
    >
      <TeamLogo name={name} size={36} />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{name}</div>
        <div className="text-xs text-foreground/60">
          {align === "left" ? "Home" : "Away"}
        </div>
      </div>
    </div>
  );
}
