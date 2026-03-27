import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { BrandLogo } from "@/components/site/brand-logo";
import { buttonStyles } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";

const links = [
  { href: "/teams", label: "Club Board" },
  { href: "/matches", label: "Fixture Board" },
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
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:rgba(244,239,228,0.94)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-7">
          <div className="flex items-center gap-3">
            <div className="space-y-1">
              <BrandLogo priority className="w-[170px] sm:w-[200px]" />
              <p className="hidden pl-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--muted)] xl:block">
                Club profiles, fixture board, organiser dashboard
              </p>
            </div>
            <span className="hidden rounded-full border border-[color:rgba(17,28,21,0.08)] bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)] lg:inline-flex">
              Early access beta
            </span>
          </div>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-[var(--muted)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
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
          ) : (
            <span className="rounded-full border border-[color:rgba(17,28,21,0.08)] bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)] lg:hidden">
              Beta
            </span>
          )}

          <nav className="flex items-center gap-4 text-sm text-[var(--muted)] md:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
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
