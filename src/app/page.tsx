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

const fixtureMarkers = [
  "Open age · 11-a-side · Sunday mornings",
  "U18s · 11-a-side · Midweek under lights",
  "7-a-side · Community football · Flexible venue",
];

const clubSignals = [
  "Area, age group, level, and format in one clear club card",
  "Pitch and travel info visible before anyone starts messaging",
  "Fixture posts that read like real football opportunities, not vague requests",
];

const sections = [
  {
    icon: Shield,
    eyebrow: "Club identity",
    title: "Give your team a proper public profile",
    description:
      "Every side should be able to show who they are, where they play, what level they are at, whether they can host, and what kind of fixture they want.",
  },
  {
    icon: CalendarDays,
    eyebrow: "Fixture board",
    title: "Post a slot the right opponent can actually say yes to",
    description:
      "Date, time, format, venue situation, travel range, and football notes all sit in one clean posting so organisers can make a decision quickly.",
  },
  {
    icon: MapPinned,
    eyebrow: "Local football",
    title: "Build a better grassroots network around real nearby teams",
    description:
      "Clubs, schools, youth sides, colleges, and community teams can all use the same board without the product feeling like generic admin software.",
  },
];

const audience = [
  {
    title: "Saturday and Sunday league clubs",
    description:
      "Show your side properly and keep the fixture list moving when dates open up or drop out.",
  },
  {
    title: "Schools, colleges, and academies",
    description:
      "Find better-suited opposition without relying on patchy spreadsheets or word of mouth.",
  },
  {
    title: "Community teams and local organisers",
    description:
      "Run friendlies, development games, and local football with clearer team identity and better matchday detail.",
  },
];

export default function HomePage() {
  return (
    <main className="pb-20">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[color:var(--border)] bg-[linear-gradient(145deg,rgba(11,24,16,0.99),rgba(19,49,33,0.95))] px-6 py-8 text-white shadow-[0_36px_100px_rgba(0,0,0,0.28)] sm:px-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/6" />
            <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8" />
            <div className="absolute bottom-0 left-1/2 h-28 w-60 -translate-x-1/2 rounded-t-full border-x border-t border-white/8" />
            <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-emerald-400/8 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-[var(--gold-strong)]/10 blur-3xl" />
          </div>

          <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="space-y-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Grassroots football fixture network
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/7 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold-strong)]" />
                  Early access beta
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-[3rem] font-bold leading-[0.98] tracking-[-0.045em] text-white md:text-[4.8rem]">
                  Show your club properly. Find better opposition. Keep the fixture list moving.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[color:var(--pitch-text)]/82">
                  Free For Friendlies is built for grassroots clubs, schools,
                  youth teams, and community organisers who need a football-first
                  place to represent their side, post fixture needs, and find
                  sensible local opponents.
                </p>
                <p className="max-w-2xl text-sm uppercase tracking-[0.18em] text-white/52">
                  Not a generic SaaS board. Not another vague message thread.
                  A clearer football network for real fixture work.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className={buttonStyles({
                    size: "lg",
                    className:
                      "bg-white text-[var(--foreground)] hover:bg-[var(--surface-alt)]",
                  })}
                >
                  Put your club on the board
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/matches"
                  className={buttonStyles({
                    variant: "ghost",
                    size: "lg",
                    className: "border-white/10 text-white hover:bg-white/10",
                  })}
                >
                  Browse live fixture board
                </Link>
                <Link
                  href="/teams"
                  className={buttonStyles({
                    variant: "ghost",
                    size: "lg",
                    className: "border-white/10 text-white/80 hover:bg-white/10 hover:text-white",
                  })}
                >
                  Explore club board
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {clubSignals.map((signal) => (
                  <div
                    key={signal}
                    className="rounded-[1.4rem] border border-white/10 bg-white/[0.055] px-4 py-4"
                  >
                    <p className="text-sm leading-6 text-[color:var(--pitch-text)]/78">
                      {signal}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.9rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                      This week&apos;s football
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-[color:var(--pitch-text)]">
                      A clearer board for real fixture decisions
                    </h2>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/10 bg-white/8 px-3 py-2 text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                      Live beta
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Clubs, schools, teams
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {fixtureMarkers.map((marker, index) => (
                    <div
                      key={marker}
                      className="rounded-[1.25rem] border border-white/10 bg-white/[0.05] p-4"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                        Fixture post {index + 1}
                      </p>
                      <p className="mt-2 text-base font-semibold text-[color:var(--pitch-text)]">
                        {marker}
                      </p>
                      <p className="mt-1.5 text-sm text-[color:var(--pitch-muted)]">
                        Venue and travel information shown before anyone has to
                        chase details.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    Club profile
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-[color:var(--pitch-text)]">
                    Built around the details football people actually use
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Open age", "11-a-side", "Intermediate", "Can host"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-semibold text-white/78"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    Matchday fit
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-[color:var(--pitch-text)]">
                    Pitch status, travel range, format, and day all visible up front
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-[color:var(--pitch-muted)]">
                    Enough detail to judge whether a friendly is worth pursuing,
                    without burying people in admin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.title}
                className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_18px_46px_rgba(22,37,30,0.06)]"
              >
                <div className="inline-flex rounded-[1rem] bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
                  <Icon size={18} />
                </div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  {section.eyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  {section.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2.1rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Why it lands
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
              It feels closer to how grassroots football actually works week to week.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.6rem] bg-[var(--surface-alt)] p-5">
                <Shield className="text-[var(--accent)]" size={18} />
                <h3 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                  Represent the side properly
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  A club card should show crest, area, level, format, pitch
                  status, and matchday preferences before anyone has to ask.
                </p>
              </div>
              <div className="rounded-[1.6rem] bg-[var(--surface-alt)] p-5">
                <Target className="text-[var(--accent)]" size={18} />
                <h3 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                  Make fixture posts easier to trust
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Good fixture notices are specific. The product now makes that
                  detail obvious instead of burying it in vague copy.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.1rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(15,132,88,0.08),rgba(255,255,255,1))] p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Who it is for
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
              Clubs, schools, youth teams, Sunday sides, and community organisers.
            </h2>
            <div className="mt-8 space-y-4">
              {audience.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.55rem] border border-[color:var(--border)] bg-white/88 p-5"
                >
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-[2.2rem] border border-[color:var(--pitch-border)] bg-[linear-gradient(135deg,rgba(11,24,16,1),rgba(20,52,36,0.96))] p-8 text-white shadow-[0_28px_80px_rgba(0,0,0,0.24)]">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
                Serious early product
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Early access, focused scope, and already much closer to the real football job.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--pitch-muted)]">
                Free For Friendlies is deliberately narrow: club profiles,
                fixture posts, local discovery, and a clear organiser dashboard.
                That focus is what makes it useful.
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
                Put your club on the board
              </Link>
              <Link
                href="/matches"
                className={buttonStyles({
                  variant: "ghost",
                  size: "lg",
                  className: "border-white/10 text-white hover:bg-white/10",
                })}
              >
                View the fixture board
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
