import { BrandLogo } from "@/components/site/brand-logo";
import { SetupNotice } from "@/components/site/setup-notice";
import { SignUpForm } from "@/components/forms/signup-form";
import { getSupabaseSetupMessage, hasSupabasePublicEnv } from "@/lib/supabase/env";

export default function SignUpPage() {
  const isSupabaseConfigured = hasSupabasePublicEnv();

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        {/* Left — dark pitch panel with white logo */}
        <section className="relative overflow-hidden rounded-[2rem] bg-[color:var(--pitch-dark)] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
          {/* Pitch geometry */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white opacity-[0.04]" />
            <div className="absolute top-1/2 left-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white opacity-[0.04]" />
            <div className="absolute -bottom-10 -right-10 h-52 w-52 rounded-full border border-white opacity-[0.03]" />
          </div>

          <div className="relative">
            <BrandLogo variant="white" className="w-[210px]" />

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Create your account
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">
              Get on the board in a few minutes.
            </h1>

            <div className="mt-8 space-y-3.5">
              {[
                "Create your organiser account.",
                "Add a team profile with the essentials.",
                "Publish your first friendly request and appear on the board.",
              ].map((text, i) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 text-[10px] font-bold text-emerald-400">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-6 text-[color:var(--pitch-muted)]">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right — form */}
        <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
          <h2 className="text-3xl font-bold text-[var(--foreground)]">
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
