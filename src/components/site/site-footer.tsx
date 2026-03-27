import Link from "next/link";
import { BrandLogo } from "@/components/site/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--pitch-border)] bg-[color:var(--pitch-dark)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs space-y-4">
            <BrandLogo variant="white" className="w-[190px] sm:w-[210px]" />
            <p className="text-sm leading-6 text-[color:var(--pitch-muted)]">
              Early-access software for grassroots football people trying to
              represent their side properly and keep the fixture list moving.
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Clubs, schools, youth teams, community football
            </p>
          </div>

          <div className="flex flex-wrap gap-10 text-sm">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--pitch-muted)]">
                Platform
              </p>
              <nav className="flex flex-col gap-2.5">
                <Link
                  className="text-[color:var(--pitch-text)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
                  href="/teams"
                >
                  Club board
                </Link>
                <Link
                  className="text-[color:var(--pitch-text)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
                  href="/matches"
                >
                  Fixture board
                </Link>
                <Link
                  className="text-[color:var(--pitch-text)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
                  href="/signup"
                >
                  Start your club profile
                </Link>
              </nav>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--pitch-muted)]">
                Account
              </p>
              <nav className="flex flex-col gap-2.5">
                <Link
                  className="text-[color:var(--pitch-text)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
                  href="/login"
                >
                  Log in
                </Link>
                <Link
                  className="text-[color:var(--pitch-text)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[color:var(--pitch-border)] pt-6">
          <p className="text-xs text-[color:var(--pitch-muted)]">
            Free For Friendlies &mdash; early-access fixture coordination for
            grassroots football.
          </p>
        </div>
      </div>
    </footer>
  );
}
