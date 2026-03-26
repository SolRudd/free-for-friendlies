import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPinned,
  Shield,
  Users,
} from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

const steps = [
  {
    title: "Create your club profile",
    description:
      "Sign up, add your team, and publish the basics that matter: area, level, age group, and preferred match day.",
  },
  {
    title: "Post a friendly request",
    description:
      "Add one clear request with date, time, format, and notes so other organisers can assess it quickly.",
  },
  {
    title: "Browse local opposition",
    description:
      "Use the public team and match boards to find relevant opponents without wading through noise.",
  },
];

const features = [
  {
    title: "Built for grassroots organisers",
    description:
      "Designed around the real weekly jobs: find a game, fill a date, and keep coordination simple.",
    icon: Users,
  },
  {
    title: "Public boards, clean workflow",
    description:
      "Teams and friendly requests are visible in clear browseable directories from day one.",
    icon: CalendarDays,
  },
  {
    title: "Focused MVP scope",
    description:
      "No payments, bookings, chat, or forum clutter. Just the core coordination loop done properly.",
    icon: Shield,
  },
];

export default function HomePage() {
  return (
    <main className="pb-16">
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:py-20">
        <div className="space-y-8">
          <div className="inline-flex rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)] shadow-sm">
            Grassroots football coordination
          </div>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[var(--foreground)] md:text-7xl">
              Organise friendlies without the usual admin mess.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Free For Friendlies is a focused MVP for organisers who need to
              sign up, create a team, post match requests, and browse local
              opposition quickly.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
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

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-white p-5 shadow-[0_16px_40px_rgba(22,37,30,0.06)]">
              <p className="text-sm font-medium text-[var(--muted)]">
                Create a team
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
                Publish the details that matter to another organiser.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-white p-5 shadow-[0_16px_40px_rgba(22,37,30,0.06)]">
              <p className="text-sm font-medium text-[var(--muted)]">
                Post requests
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
                Keep each match need clear, simple, and date-specific.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-white p-5 shadow-[0_16px_40px_rgba(22,37,30,0.06)]">
              <p className="text-sm font-medium text-[var(--muted)]">
                Browse boards
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
                Use the public routes to spot local fits fast.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2.25rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(239,232,220,0.92))] p-6 shadow-[0_28px_80px_rgba(22,37,30,0.10)]">
          <div className="rounded-[1.75rem] border border-[color:rgba(15,123,88,0.18)] bg-[linear-gradient(180deg,rgba(216,237,227,0.62),rgba(255,255,255,0.9))] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Core MVP flow
            </p>
            <div className="mt-6 space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[1.35rem] border border-[color:var(--border)] bg-white/90 p-4"
                >
                  <p className="text-sm font-semibold text-[var(--accent)]">
                    Step {index + 1}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)] md:text-4xl">
            Three steps. No filler.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_18px_44px_rgba(22,37,30,0.06)]"
            >
              <p className="text-sm font-semibold text-[var(--accent)]">
                0{index + 1}
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Why it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)] md:text-4xl">
            Clean product scope for the real weekly job.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_44px_rgba(22,37,30,0.05)]"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
                  <Icon size={20} />
                </div>
                <h3 className="text-2xl font-semibold text-[var(--foreground)]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Built for local organising
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)] md:text-4xl">
              Publish the essentials and let the right teams find you.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] bg-[var(--surface-alt)] p-5">
                <Users className="text-[var(--accent)]" size={18} />
                <h3 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                  Better team profiles
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Surface the basics organisers actually use to decide whether a
                  fixture is worth pursuing.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-[var(--surface-alt)] p-5">
                <MapPinned className="text-[var(--accent)]" size={18} />
                <h3 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                  Local-first discovery
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Browse teams and requests by area, level, and timing without
                  getting dragged into a bloated community feed.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:rgba(15,123,88,0.94)] p-8 text-white shadow-[0_24px_60px_rgba(15,123,88,0.22)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100">
              Ready to demo
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Set up your account and publish your first request today.
            </h2>
            <p className="mt-4 text-sm leading-7 text-emerald-50/90">
              The MVP already covers the core loop: auth, team creation, match
              posting, and public browsing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
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
                  className: "text-white hover:bg-white/10",
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
