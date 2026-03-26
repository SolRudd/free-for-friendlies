import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { BrandLogo } from "@/components/site/brand-logo";
import { SetupNotice } from "@/components/site/setup-notice";
import { buttonStyles } from "@/components/ui/button";
import { getSupabaseSetupMessage } from "@/lib/supabase/env";
import { ensureProfile, getDisplayName } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";

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
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Profile setup issue
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            We couldn&apos;t finish preparing your account.
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            Your auth session is active, but the `profiles` row could not be
            confirmed yet. Refresh the page, or log out and back in to retry.
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, location")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
            <BrandLogo className="w-[220px]" />
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Dashboard
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
              {profile?.full_name || getDisplayName(user)}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {profile?.email || user.email}
            </p>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Keep your team page sharp, post clear requests, and use the public
              boards to find opponents quickly.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-4 shadow-[0_16px_40px_rgba(22,37,30,0.05)]">
            <DashboardNav />
          </div>
        </aside>

        <div>{children}</div>
      </div>
    </main>
  );
}
