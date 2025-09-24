import TVFrame from "@/components/TVFrame";

export default function Premium() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Yobo Premium</h1>
        <p className="text-foreground/70">
          Enjoy every match ad-free with a dedicated live TV screen, real-time
          scores, and priority updates. Perfect for superfans who want the best
          experience.
        </p>
        <ul className="list-inside list-disc text-foreground/80">
          <li>Ad-free browsing across Yobo Scores</li>
          <li>Watch live match screen alongside stats</li>
          <li>Priority score refresh and alerts</li>
        </ul>
        <div className="flex gap-3 pt-2">
          <a
            href="#"
            className="rounded-md bg-gradient-to-r from-blue-600 to-green-600 px-4 py-2 font-semibold text-white shadow hover:opacity-90"
          >
            Subscribe Now
          </a>
          <a
            href="/"
            className="rounded-md border px-4 py-2 font-medium hover:bg-muted"
          >
            Go back
          </a>
        </div>
      </div>
      <TVFrame title="Live Match" variant="live">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.3),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(74,222,128,0.25),transparent_50%)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-md bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/20">
              Streaming Preview
            </div>
          </div>
        </div>
      </TVFrame>
    </div>
  );
}
