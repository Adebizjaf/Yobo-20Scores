import { cn } from "@/lib/utils";

type TVFrameProps = {
  title?: string;
  variant?: "ad" | "live";
  className?: string;
  children?: React.ReactNode;
};

export default function TVFrame({ title, variant = "ad", className, children }: TVFrameProps) {
  return (
    <div className={cn("w-full", className)}>
      {title ? (
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-foreground/80 uppercase">
            {title}
          </h3>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
              variant === "ad"
                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                : "bg-green-100 text-green-700 border border-green-200"
            )}
          >
            {variant === "ad" ? "Ad" : "Live"}
          </span>
        </div>
      ) : null}
      <div className="relative mx-auto aspect-video max-w-full rounded-[22px] bg-neutral-900 p-2 shadow-2xl">
        <div className="absolute inset-0 rounded-[22px] bg-gradient-to-br from-white/8 to-white/0 pointer-events-none" />
        <div className="relative h-full w-full rounded-[16px] bg-black ring-1 ring-white/10 overflow-hidden">
          {/* content area */}
          <div className="absolute inset-0 flex items-center justify-center text-white">
            {children ?? (
              <div className="flex flex-col items-center gap-3">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="opacity-80">
                  <path d="M3 5h18v12H3z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 19h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-sm opacity-80">
                  {variant === "ad" ? "Sponsored" : "Live Match"}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Stand */}
        <div className="mx-auto mt-3 h-1.5 w-24 rounded-full bg-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.5)]" />
      </div>
    </div>
  );
}
