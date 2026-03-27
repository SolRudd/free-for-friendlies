import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPinned,
  Shield,
  Target,
  Users,
} from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    title: "Build a proper club profile",
    description:
      "Show the details that matter in grassroots football: area, level, format, pitch situation, preferred day, and the kind of fixture you want.",
  },
  {
    step: "02",
    title: "Post a live fixture need",
    description:
      "Publish an opponent-needed slot with date, venue status, travel range, and matchday notes so other organisers can make a quick call.",
  },
  {
    step: "03",
    title: "Find better opposition",
    description:
      "Browse club profiles and fixture posts through a football-first board instead of relying on scattered messages and guesswork.",
  },
];

const proofPoints = [
  {
    icon: Shield,
    title: "Club identity first",
    description:
      "Crests, format, area, level, and pitch situation all live in one clean public profile.",
  },
  {
    icon: CalendarDays,
    title: "Fixture board, not generic classifieds",
    description:
      "Requests are structured around real football variables: age group, venue, travel, day, and match format.",
  },
  {
    icon: MapPinned,
    title: "Local football network",
    description:
      "Built for clubs, schools, colleges, and community organisers trying to fill real dates with sensible opponents.",
  },
];

const audience = [
  "Saturday and Sunday league clubs",
  "Schools, colleges, and academies",
  "Community organisers and park football setups",
];

export default function HomePage() {
  return (
    <main className="pb-20">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-20">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full border border-[color:var(--accent-line)] bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Grassroots football network
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:rgba(17,28,21,0.08)] bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold-strong)]" />
              Early access beta
            </span>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-[3rem] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--foreground)] md:text-[4.6rem]">
              The fixture network for grassroots football teams that want to represent themselves properly.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Free For Friendlies helps clubs, schools, and organisers publish a
              credible team profile, post real fixture needs, and find better
              opposition without chasing endless messages.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className={buttonStyles({ size: "lg" })}>
              Create your club profile
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/matches"
              className={buttonStyles({ variant: "secondary", size: "lg" })}
            >
              Browse fixture board
            </Link>
            <Link
              href="/teams"
              className={buttonStyles({ variant: "ghost", size: "lg" })}
            >
              Explore club profiles
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {proofPoints.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-[1.6rem] border border-[color:var(--border)] bg-white/85 p-4 shadow-[0_16px_40px_rgba(22,37,30,0.05)]"
                >
                  <div className="inline-flex rounded-xl bg-[var(--accent-soft)] p-2.5 text-[var(--accent)]">
                    <Icon size={16} />
                  </div>
                  <h2 className="mt-3 text-base font-semibold text-[var(--foreground)]">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2.3rem] bg-[color:var(--pitch-dark)] p-px shadow-[0_32px_90px_rgba(0,0,0,0.28)]">
          <div className="relative rounded-[2.25rem] bg-[linear-gradient(155deg,var(--pitch-surface)_0%,var(--pitch-dark)_100%)] p-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.25rem]">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/6" />
              <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8" />
              <div className="absolute bottom-0 left-1/2 h-24 w-56 -translate-x-1/2 rounded-t-full border-x border-t border-white/8" />
            </div>

            <div className="relative grid gap-4">
              <div className="rounded-[1.6rem] border border-[color:var(--pitch-border)] bg-white/[0.06] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                      Club profile
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-[color:var(--pitch-text)]">
                      Show what your side is really about
                    </h2>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/8 px-3 py-2 text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
                      Built for
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      5, 6, 7, 9, 11
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.05] px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                      Matchday fit
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[color:var(--pitch-text)]">
                      Preferred Sunday mornings
                    </p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.05] px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                      Venue
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[color:var(--pitch-text)]">
                      Can host on some dates
                    </p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.05] px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                      Travel
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[color:var(--pitch-text)]">
                      Short trips are fine
                    </p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.05] px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                      Fixture level
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[color:var(--pitch-text)]">
                      Open age · Intermediate
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-[color:var(--pitch-border)] bg-white/[0.06] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                      Fixture board
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-[color:var(--pitch-text)]">
                      Post the slot. Let the right opponent find it.
                    </h2>
                  </div>
                  <Target className="text-emerald-400" size={18} />
                </div>

                <div className="mt-5 space-y-3">
                  {steps.map((step) => (
                    <div
                      key={step.step}
                      className="rounded-[1.2rem] border border-white/10 bg-white/[0.05] p-4"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                        {step.step}
                      </p>
                      <h3 className="mt-1.5 text-base font-semibold text-[color:var(--pitch-text)]">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-[color:var(--pitch-muted)]">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Built for the real weekly job
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
              Less generic admin. More football decisions made quickly.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] bg-[var(--surface-alt)] p-5">
                <Shield className="text-[var(--accent)]" size={18} />
                <h3 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                  Represent the team properly
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Show crest, area, level, format, pitch situation, and travel
                  range instead of leaving organisers to guess.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-[var(--surface-alt)] p-5">
                <CalendarDays className="text-[var(--accent)]" size={18} />
                <h3 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                  Keep the fixture board useful
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Make each post feel like a real slot on the football calendar,
                  not a vague generic request.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(15,123,88,0.08),rgba(255,255,255,1))] p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Who it suits
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
              Built for organisers who live in the grassroots football week.
            </h2>
            <div className="mt-8 space-y-3">
              {audience.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[1.4rem] border border-[color:var(--border)] bg-white/80 px-4 py-4"
                >
                  <Users size={16} className="text-[var(--accent)]" />
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--pitch-dark)] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
                Customer-ready beta
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Early, focused, and already useful for the real fixture loop.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--pitch-muted)]">
                Free For Friendlies is intentionally narrow: club profile,
                fixture board, squad join requests, and a clear dashboard for
                organisers. That focus is the point.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className={buttonStyles({
                  variant: "secondary",
                  size: "lg",
                  className: "border-white/10 bg-white text-[var(--foreground)]",
                })}
              >
                Start your team profile
              </Link>
              <Link
                href="/dashboard"
                className={buttonStyles({
                  variant: "ghost",
                  size: "lg",
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
