import { BrandLogo } from "@/components/site/brand-logo";
import { LoginForm } from "@/components/forms/login-form";
import { SetupNotice } from "@/components/site/setup-notice";
import { getSupabaseSetupMessage, hasSupabasePublicEnv } from "@/lib/supabase/env";

export default function LoginPage() {
  const isSupabaseConfigured = hasSupabasePublicEnv();

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        {/* Left — form */}
        <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
          <BrandLogo className="w-[230px]" />
          <h1 className="mt-6 text-3xl font-bold text-[var(--foreground)]">
            Log in
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Access your teams, keep match requests current, and manage the
            coordination loop from your dashboard.
          </p>
          <div className="mt-8">
            {isSupabaseConfigured ? (
              <LoginForm />
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

        {/* Right — dark atmospheric panel */}
        <section className="relative overflow-hidden rounded-[2rem] bg-[color:var(--pitch-dark)] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.20)]">
          {/* Pitch geometry */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white opacity-[0.04]" />
            <div className="absolute top-1/2 left-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white opacity-[0.04]" />
            <div className="absolute -top-12 -right-12 h-52 w-52 rounded-full border border-white opacity-[0.03]" />
          </div>

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Back to the pitch
            </p>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-white">
              Pick up where you left off.
            </h2>
            <div className="mt-8 space-y-4">
              {[
                "Review your existing teams and keep their details accurate.",
                "Post a new request when you need to fill a fixture date.",
                "Browse the live teams and matches boards to find relevant opponents.",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-start gap-3 text-sm leading-6 text-[color:var(--pitch-muted)]"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
