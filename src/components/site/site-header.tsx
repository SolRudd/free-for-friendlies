import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { BrandLogo } from "@/components/site/brand-logo";
import { buttonStyles } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";

const links = [
  { href: "/teams", label: "Teams" },
  { href: "/matches", label: "Matches" },
];

export async function SiteHeader() {
  const supabase = await createClient();
  const isSupabaseConfigured = hasSupabasePublicEnv();
  const user = supabase
    ? (
        await supabase.auth.getUser()
      ).data.user
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:rgba(242,239,232,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <BrandLogo priority />

          <nav className="hidden items-center gap-5 text-sm text-[var(--muted)] md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isSupabaseConfigured ? (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
              Backend setup required
            </span>
          ) : null}

          <nav className="flex items-center gap-3 text-sm text-[var(--muted)] md:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className={buttonStyles({ variant: "secondary", size: "sm" })}
              >
                Dashboard
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className={buttonStyles({ variant: "ghost", size: "sm" })}
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className={buttonStyles({ variant: "secondary", size: "sm" })}
              >
                Sign up
              </Link>
              <Link href="/login" className={buttonStyles({ size: "sm" })}>
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
