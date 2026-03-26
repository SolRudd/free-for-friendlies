import { BrandLogo } from "@/components/site/brand-logo";
import { SetupNotice } from "@/components/site/setup-notice";
import { SignUpForm } from "@/components/forms/signup-form";
import { getSupabaseSetupMessage, hasSupabasePublicEnv } from "@/lib/supabase/env";

export default function SignUpPage() {
  const isSupabaseConfigured = hasSupabasePublicEnv();

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:rgba(15,123,88,0.94)] p-8 text-white shadow-[0_24px_60px_rgba(15,123,88,0.18)]">
          <BrandLogo className="w-[260px] brightness-[1.08] saturate-[1.1]" />
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100">
            Create your account
          </p>
          <h1 className="mt-3 text-4xl font-semibold">
            Get the MVP workflow live in a few minutes.
          </h1>
          <div className="mt-8 space-y-4 text-sm leading-7 text-emerald-50/90">
            <p>1. Create your organiser account.</p>
            <p>2. Add a team profile with the essentials.</p>
            <p>3. Publish your first friendly request and appear on the board.</p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
          <h2 className="text-3xl font-semibold text-[var(--foreground)]">
            Sign up
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Start with your account. Once you&apos;re in, you&apos;ll be taken
            straight to the dashboard to create your first team.
          </p>
          <div className="mt-8">
            {isSupabaseConfigured ? (
              <SignUpForm />
            ) : (
              <SetupNotice
                eyebrow="Auth disabled"
                title="Supabase is not configured yet"
                description={getSupabaseSetupMessage()}
                ctaHref="/"
                ctaLabel="Return home"
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
