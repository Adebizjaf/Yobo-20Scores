import { Link, NavLink } from "react-router-dom";

export default function SiteHeader() {
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
          <Link
            to="/login"
            className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-3 py-2 text-sm font-semibold rounded-md text-white bg-gradient-to-r from-blue-600 to-green-600 shadow hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      </div>
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
