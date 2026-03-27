import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { BrandLogo } from "@/components/site/brand-logo";
import { SetupNotice } from "@/components/site/setup-notice";
import { buttonStyles } from "@/components/ui/button";
import { getSupabaseSetupMessage } from "@/lib/supabase/env";
import { ensureProfile, getDisplayName } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { TeamBadge } from "@/components/team/team-badge";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <SetupNotice
          eyebrow="Dashboard unavailable"
          title="Supabase is not configured yet"
          description={getSupabaseSetupMessage()}
          ctaHref="/"
          ctaLabel="Return home"
        />
      </main>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=session-expired&next=/dashboard");
  }

  const { error: profileError } = await ensureProfile(supabase, user);

  if (profileError) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Profile setup issue
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--foreground)]">
            We couldn&apos;t finish preparing your account.
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Your auth session is active, but the <code>profiles</code> row
            could not be confirmed yet. Refresh the page, or log out and back
            in to retry.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className={buttonStyles({ variant: "secondary" })}>
              Back to home
            </Link>
            <Link href="/login" className={buttonStyles({})}>
              Go to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const [{ data: profile }, { data: managedTeam }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email, location")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("teams")
      .select("id, name, logo_url")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[272px_1fr]">
        <aside className="space-y-4">
          {/* Profile card */}
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
            <BrandLogo className="w-[190px]" />
            <div className="mt-5 border-t border-[color:var(--border)] pt-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  Dashboard
                </p>
                <span className="rounded-full border border-[color:rgba(17,28,21,0.08)] bg-[var(--surface-alt)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Beta
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-[var(--foreground)]">
                {profile?.full_name || getDisplayName(user)}
              </h2>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {profile?.email || user.email}
              </p>
            </div>
            <p className="mt-4 text-xs leading-6 text-[var(--muted)]">
              Keep your club profile sharp, post clear fixture needs, and use
              the public boards to find better opponents.
            </p>

            {managedTeam ? (
              <div className="mt-5 rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--surface)] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  Managing
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <TeamBadge
                    name={managedTeam.name}
                    logoUrl={managedTeam.logo_url ?? undefined}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {managedTeam.name}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      One active team profile per account
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Nav */}
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-4 shadow-[0_16px_40px_rgba(22,37,30,0.05)]">
            <DashboardNav hasTeam={Boolean(managedTeam)} />
          </div>
        </aside>

        <div>{children}</div>
      </div>
    </main>
  );
}
