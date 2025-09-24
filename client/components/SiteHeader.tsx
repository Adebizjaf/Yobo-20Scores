import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search as SearchIcon, Sun, Moon } from "lucide-react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial =
      (stored as "light" | "dark") || (prefersDark ? "dark" : "light");
    applyTheme(initial);
  }, []);

  function applyTheme(next: "light" | "dark") {
    setTheme(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  }

  function submitSearch() {
    const q = query.trim();
    if (!q) return;
    const ev = new CustomEvent("yobo:search", { detail: q });
    window.dispatchEvent(ev);
    location.hash = "#search";
    document
      .getElementById("search")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-500" />
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Yobo Scores
          </span>
        </Link>

        {/* Desktop search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch();
          }}
          className="hidden md:flex relative ml-auto w-full max-w-md items-center"
          role="search"
        >
          <div className="pointer-events-none absolute left-2 flex h-full items-center text-foreground/50">
            <SearchIcon size={18} />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams (e.g., Lagos, LF)"
            className="w-full rounded-lg border bg-background/60 px-8 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:bg-background"
            aria-label="Search teams"
          />
          <button
            type="submit"
            className="ml-2 rounded-md bg-gradient-to-r from-blue-600 to-green-600 px-3 py-2 text-xs font-semibold text-white shadow hover:opacity-90"
          >
            Search
          </button>
        </form>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button
            onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md border p-2 text-foreground/70 hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="md:hidden rounded-md border p-2 text-foreground/70 hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <Link
            to="/login"
            className="hidden md:inline-flex rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="hidden md:inline-flex rounded-md bg-gradient-to-r from-blue-600 to-green-600 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="container flex flex-col gap-3 py-4 text-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch();
                setOpen(false);
              }}
              className="relative flex items-center"
              role="search"
            >
              <div className="pointer-events-none absolute left-2 flex h-full items-center text-foreground/50">
                <SearchIcon size={18} />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search teams (e.g., Lagos, LF)"
                className="w-full rounded-lg border bg-background/60 px-8 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:bg-background"
                aria-label="Search teams"
              />
              <button
                type="submit"
                className="ml-2 rounded-md bg-gradient-to-r from-blue-600 to-green-600 px-3 py-2 text-xs font-semibold text-white shadow hover:opacity-90"
              >
                Go
              </button>
            </form>

            <Link to="/" onClick={() => setOpen(false)} className="px-1 py-1.5">
              Scores
            </Link>
            <Link
              to="/premium"
              onClick={() => setOpen(false)}
              className="px-1 py-1.5"
            >
              Premium
            </Link>
            <div className="mt-2 flex gap-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-md border px-3 py-2 text-center font-medium hover:bg-muted"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-md bg-gradient-to-r from-blue-600 to-green-600 px-3 py-2 text-center font-semibold text-white shadow hover:opacity-90"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "transition-colors hover:text-foreground/80",
          isActive ? "text-foreground" : "text-foreground/60",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}
