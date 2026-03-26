import Link from "next/link";
import { BrandLogo } from "@/components/site/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-[var(--muted)] sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md space-y-2">
          <BrandLogo className="w-[220px]" />
          <p>
            A focused MVP for grassroots football organisers to create teams,
            post friendly requests, and find local opposition faster.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link className="hover:text-[var(--foreground)]" href="/teams">
            Browse teams
          </Link>
          <Link className="hover:text-[var(--foreground)]" href="/matches">
            Browse matches
          </Link>
          <Link className="hover:text-[var(--foreground)]" href="/signup">
            Create account
          </Link>
        </div>
      </div>
    </footer>
  );
}
