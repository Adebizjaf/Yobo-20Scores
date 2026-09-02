import LiveScoresPanel from "@/components/LiveScoresPanel";
import TVFrame from "@/components/TVFrame";

export default function LiveScores() {
  return (
    <div className="space-y-8 sm:space-y-10 md:space-y-12">
      <LiveScoresPanel />

      <section className="grid gap-6 md:grid-cols-2 md:items-center">
        <TVFrame title="Ad break" variant="ad">
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-xl bg-white/5 p-6 text-center text-white ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-widest text-white/80">Sponsored</p>
              <p className="mt-1 text-xl font-bold">Your brand on Yobo</p>
            </div>
          </div>
        </TVFrame>
        <div className="rounded-2xl border bg-gradient-to-br from-blue-50/60 to-green-50/60 p-6 shadow-sm dark:from-blue-900/10 dark:to-green-900/10">
          <h2 className="text-xl font-bold sm:text-2xl">Upgrade to Yobo Premium</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
            No ads. Dedicated TV screen for live matches. Faster updates. Experience sports like never before.
          </p>
          <div className="flex gap-3 pt-5">
            <a href="/premium" className="rounded-md bg-gradient-to-r from-blue-600 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90">Explore Premium</a>
            <a href="/login" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">I already subscribed</a>
          </div>
        </div>
      </section>
    </div>
  );
}
