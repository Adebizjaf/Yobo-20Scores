import { cn } from "@/lib/utils";

function hashHue(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h << 5) - h + input.charCodeAt(i);
  return Math.abs(h) % 360;
}

export default function TeamLogo({
  name,
  size = 28,
  className,
  squared = false,
}: {
  name: string;
  size?: number;
  className?: string;
  squared?: boolean;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  const hue = hashHue(name);
  const style: React.CSSProperties = {
    width: size,
    height: size,
    background: `conic-gradient(from 180deg at 50% 50%, hsl(${hue} 80% 55%), hsl(${(hue + 60) % 360} 70% 45%))`,
  };
  return (
    <div
      className={cn(
        "grid place-items-center text-white shadow-inner ring-1 ring-black/10",
        squared ? "rounded-md" : "rounded-full",
        className,
      )}
      style={style}
      aria-label={`${name} logo`}
      title={name}
    >
      <span className="text-[10px] font-extrabold tracking-wide drop-shadow-sm">
        {initials}
      </span>
    </div>
  );
}
