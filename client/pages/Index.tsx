import LiveScoresTicker from "@/components/LiveScoresTicker";
import ScheduleTable from "@/components/ScheduleTable";
import FixturesGrid from "@/components/FixturesGrid";
import TVFrame from "@/components/TVFrame";
import TeamSearch from "@/components/TeamSearch";

export default function Index() {
  return (
    <div className="space-y-8 sm:space-y-10 md:space-y-12">
      {/* Hero */}
      <section className="grid gap-6 sm:gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Yobo Scores
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/70 leading-relaxed text-pretty hyphens-auto break-words sm:max-w-[50ch] md:max-w-[65ch]">
            Live scores and schedules across your favorite sports. Stay ahead
            with instant updates, clean stats, and a premium ad-free experience.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/premium"
              className="rounded-md bg-gradient-to-r from-blue-600 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90"
            >
              Get Premium
            </a>
            <a
              href="/signup"
              className="rounded-md border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
            >
              Create account
            </a>
          </div>
          <div className="rounded-xl border bg-background p-4 shadow-sm">
            <LiveScoresTicker />
          </div>
        </div>
        <TVFrame title="Ad break" variant="ad">
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-xl bg-white/5 p-6 text-center text-white ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-widest text-white/80">
                Sponsored
              </p>
              <p className="mt-1 text-xl font-bold">Your brand on Yobo</p>
            </div>
          </div>
        </TVFrame>
      </section>

      {/* Team Search */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Search Teams
        </h2>
        <TeamSearch />
      </section>

      {/* Featured Fixtures */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Featured Fixtures
        </h2>
        <FixturesGrid />
      </section>

      {/* Schedule */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              Today & Upcoming
            </h2>
            <p className="text-sm text-foreground/70">
              Schedules for football, basketball, tennis, cricket, and rugby.
            </p>
          </div>
          <a
            href="/premium"
            className="hidden md:inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Go ad-free with Premium
          </a>
        </div>
        <ScheduleTable />
      </section>

      {/* Premium highlight */}
      <section className="grid gap-8 rounded-2xl border bg-gradient-to-br from-blue-50/60 to-green-50/60 p-6 shadow-sm md:grid-cols-2 dark:from-blue-900/10 dark:to-green-900/10">
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
            Upgrade to Yobo Premium
          </h3>
          <p className="text-foreground/70 text-sm sm:text-base leading-relaxed">
            No ads. Dedicated TV screen for live matches. Faster updates.
            Experience sports like never before.
          </p>
          <div className="flex gap-3 pt-2">
            <a
              href="/premium"
              className="rounded-md bg-gradient-to-r from-blue-600 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
            >
              Explore Premium
            </a>
            <a
              href="/login"
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              I already subscribed
            </a>
          </div>
        </div>
        <TVFrame variant="live">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-md bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/20">
              Live view demo
            </div>
          </div>
        </TVFrame>
      </section>
    </div>
  );
}
