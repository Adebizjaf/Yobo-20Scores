export default function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-10 text-sm text-foreground/70 grid gap-6 md:flex md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Yobo Scores. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a className="hover:text-foreground" href="#">Privacy</a>
          <a className="hover:text-foreground" href="#">Terms</a>
          <a className="hover:text-foreground" href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}
