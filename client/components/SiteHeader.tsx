import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-500" />
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Yobo Scores
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#search" className="transition-colors text-foreground/60 hover:text-foreground">Search</a>
          <NavItem to="/">Scores</NavItem>
          <NavItem to="/premium">Premium</NavItem>
        </nav>
        <div className="flex items-center gap-2">
          <button
            className="md:hidden rounded-md border p-2 text-foreground/70 hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <Link
            to="/login"
            className="hidden md:inline-flex px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="hidden md:inline-flex px-3 py-2 text-sm font-semibold rounded-md text-white bg-gradient-to-r from-blue-600 to-green-600 shadow hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      </div>
      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="container flex flex-col gap-2 py-4 text-sm">
            <a href="#search" onClick={() => setOpen(false)} className="px-1 py-1.5 text-foreground/80">Search</a>
            <Link to="/" onClick={() => setOpen(false)} className="px-1 py-1.5">Scores</Link>
            <Link to="/premium" onClick={() => setOpen(false)} className="px-1 py-1.5">Premium</Link>
            <div className="mt-2 flex gap-2">
              <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-md border px-3 py-2 text-center font-medium hover:bg-muted">Log in</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="flex-1 rounded-md bg-gradient-to-r from-blue-600 to-green-600 px-3 py-2 text-center font-semibold text-white shadow hover:opacity-90">Sign up</Link>
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
