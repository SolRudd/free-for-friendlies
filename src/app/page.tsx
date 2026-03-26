import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Globe,
  MapPinned,
  Shield,
  Users,
} from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    title: "Create your club profile",
    description:
      "Sign up, add your team, and publish the basics that matter: area, level, age group, and preferred match day.",
  },
  {
    step: "02",
    title: "Post a friendly request",
    description:
      "Add one clear request with date, time, format, and notes so other organisers can assess it quickly.",
  },
  {
    step: "03",
    title: "Browse local opposition",
    description:
      "Use the public team and match boards to find relevant opponents without wading through noise.",
  },
];

const audience = [
  {
    icon: Users,
    title: "Clubs and academies",
    description:
      "Maintain public profiles for all your sides, keep match requests up to date, and let the right teams find you without extra admin.",
  },
  {
    icon: BookOpen,
    title: "Schools and colleges",
    description:
      "Find suitable opposition quickly by browsing by age group, area, and level — without going through club admin.",
  },
  {
    icon: Globe,
    title: "Community leagues",
    description:
      "Run park fixtures, 5-a-side setups, and local leagues with a simple coordination loop everyone can access.",
  },
];

const features = [
  {
    title: "Built for grassroots organisers",
    description:
      "Designed around the real weekly jobs: find a game, fill a date, and keep coordination simple.",
    icon: CalendarDays,
  },
  {
    title: "Public boards, clean workflow",
    description:
      "Teams and friendly requests are visible in clear browseable directories from day one.",
    icon: Shield,
  },
  {
    title: "Focused scope",
    description:
      "No payments, bookings, chat, or forum clutter. Just the core coordination loop done properly.",
    icon: MapPinned,
  },
];

export default function HomePage() {
  return (
    <main className="pb-16">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:py-20">
        <div className="space-y-8">
          <div className="inline-flex rounded-full border border-[color:var(--accent-line)] bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Grassroots football coordination
          </div>

          <div className="space-y-5">
            <h1 className="max-w-xl text-[3rem] font-bold leading-[1.08] tracking-[-0.02em] text-[var(--foreground)] md:text-[4.2rem] md:leading-[1.06]">
              Organise friendlies without the usual admin mess.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[var(--muted)]">
              Free For Friendlies gives clubs, schools, and community
              organisers a clean space to post match requests and find local
              opposition — fast.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className={buttonStyles({ size: "lg" })}>
              Create account
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/teams"
              className={buttonStyles({ variant: "secondary", size: "lg" })}
            >
              Browse teams
            </Link>
            <Link
              href="/matches"
              className={buttonStyles({ variant: "ghost", size: "lg" })}
            >
              View match board
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Team profiles
              </p>
              <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
                Publish the details another organiser actually needs.
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Match requests
              </p>
              <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
                One clear post with date, format, and notes.
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Public boards
              </p>
              <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
                Browse local teams and requests without noise.
              </p>
            </div>
          </div>
        </div>

        {/* Dark pitch panel — coordination flow */}
        <div className="relative overflow-hidden rounded-[2.25rem] bg-[color:var(--pitch-dark)] p-px shadow-[0_28px_80px_rgba(0,0,0,0.30)]">
          <div className="relative rounded-[2.2rem] bg-[linear-gradient(155deg,var(--pitch-surface)_0%,var(--pitch-dark)_100%)] p-6">
            {/* Pitch geometry overlay */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.2rem]">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white opacity-[0.04]" />
              <div className="absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white opacity-[0.04]" />
            </div>
            <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
              The coordination flow
            </p>
            <div className="relative mt-5 space-y-3">
              {steps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-[1.25rem] border border-[color:var(--pitch-border)] bg-white/[0.05] p-4"
                >
                  <p className="text-xs font-bold tracking-widest text-emerald-400">
                    {step.step}
                  </p>
                  <h3 className="mt-1.5 text-base font-semibold text-[color:var(--pitch-text)]">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-[color:var(--pitch-muted)]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BUILT FOR ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Built for
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
            Clubs, schools, and community organisers.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {audience.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_16px_40px_rgba(22,37,30,0.05)]"
              >
                <div className="mb-4 inline-flex rounded-xl bg-[var(--accent-soft)] p-2.5 text-[var(--accent)]">
                  <Icon size={18} />
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-7 text-[var(--muted)]">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── WHY IT WORKS ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Why it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
            Clean product scope for the real weekly job.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(22,37,30,0.04)]"
              >
                <div className="mb-4 inline-flex rounded-xl bg-[var(--accent-soft)] p-2.5 text-[var(--accent)]">
                  <Icon size={18} />
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)]">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-sm leading-7 text-[var(--muted)]">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Built for local organising
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
              Publish the essentials and let the right teams find you.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] bg-[var(--surface-alt)] p-5">
                <Users className="text-[var(--accent)]" size={18} />
                <h3 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                  Better team profiles
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Surface the basics organisers actually use to decide whether
                  a fixture is worth pursuing.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-[var(--surface-alt)] p-5">
                <MapPinned className="text-[var(--accent)]" size={18} />
                <h3 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                  Local-first discovery
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Browse teams and requests by area, level, and timing without
                  getting dragged into a bloated feed.
                </p>
              </div>
            </div>
          </div>

          {/* Dark CTA panel with pitch geometry */}
          <div className="relative overflow-hidden rounded-[2rem] bg-[color:var(--pitch-dark)] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
              <div className="absolute inset-x-0 bottom-0 h-px bg-white opacity-[0.05]" />
              <div className="absolute bottom-0 left-1/2 h-20 w-44 -translate-x-1/2 rounded-t-full border-t border-x border-white opacity-[0.05]" />
            </div>
            <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Ready to use
            </p>
            <h2 className="relative mt-3 text-3xl font-bold leading-tight">
              Set up your account and publish your first request today.
            </h2>
            <p className="relative mt-4 text-sm leading-7 text-[color:var(--pitch-muted)]">
              The platform covers the full core loop: account creation, team
              setup, match posting, and public browsing.
            </p>
            <div className="relative mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className={buttonStyles({
                  variant: "secondary",
                  className: "border-white/10 bg-white text-[var(--foreground)]",
                })}
              >
                Create account
              </Link>
              <Link
                href="/dashboard"
                className={buttonStyles({
                  variant: "ghost",
                  className: "border-white/10 text-white hover:bg-white/10",
                })}
              >
                Open dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
