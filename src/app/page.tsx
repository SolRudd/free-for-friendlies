import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPinned,
  Shield,
  Target,
  Users,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   FREE FOR FRIENDLIES — Homepage
   ═══════════════════════════════════════════════════════════════ */

/* ── Button system ──────────────────────────────────────────
   Shared constants so every button on the page matches exactly.
   Two contexts: dark (pitch surfaces) and light (warm surfaces).
   Two weights: primary (filled) and secondary (outlined).
   Two sizes: default (50px) and sm (44px).
   ─────────────────────────────────────────────────────────── */

const btn = {
  primaryDark:
    "inline-flex h-[50px] items-center justify-center gap-2.5 whitespace-nowrap rounded-[11px] bg-white px-7 text-[15px] font-semibold tracking-[-0.01em] text-[#0b1810] shadow-[0_2px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-150 hover:bg-[#f5f3ee] hover:shadow-[0_2px_0_rgba(255,255,255,0.1),0_12px_32px_rgba(0,0,0,0.3)]",
  secondaryDark:
    "inline-flex h-[50px] items-center justify-center whitespace-nowrap rounded-[11px] border border-white/[0.22] bg-white/[0.06] px-7 text-[15px] font-medium tracking-[-0.01em] text-white/90 transition-all duration-150 hover:border-white/[0.35] hover:bg-white/[0.1] hover:text-white",
  primaryDarkSm:
    "inline-flex h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-white px-5 text-[14px] font-semibold tracking-[-0.01em] text-[#0b1810] shadow-[0_2px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-150 hover:bg-[#f5f3ee] hover:shadow-[0_2px_0_rgba(255,255,255,0.1),0_12px_32px_rgba(0,0,0,0.3)]",
  secondaryDarkSm:
    "inline-flex h-[44px] items-center justify-center whitespace-nowrap rounded-[10px] border border-white/[0.22] bg-white/[0.06] px-5 text-[14px] font-medium tracking-[-0.01em] text-white/90 transition-all duration-150 hover:border-white/[0.35] hover:bg-white/[0.1] hover:text-white",
};

/* ─────────────────────────────────────────
   HERO
   ───────────────────────────────────────── */

function PitchLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-[52%] h-px bg-white/[0.035]" />
      <div className="absolute left-[58%] top-[52%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]" />
      <div className="absolute left-[58%] top-[52%] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06]" />
      <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-emerald-400/[0.035] blur-[120px]" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[var(--gold-strong)]/[0.05] blur-[100px]" />
    </div>
  );
}

function FixtureCardHero() {
  return (
    <div className="relative w-full max-w-[310px] rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.07] to-white/[0.025] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-sm">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-[6px] w-[6px] rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
            Fixture request
          </span>
        </div>
        <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[9px] font-medium text-white/30">
          Preview
        </span>
      </div>

      {/* Match heading */}
      <p
        className="mt-4 text-[19px] font-semibold leading-snug text-white/90"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Open age · 11-a-side
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-white/45">
        Sunday morning · SE London · Can host
      </p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {["Intermediate", "3G pitch", "Travel flexible"].map((tag) => (
          <span
            key={tag}
            className="rounded-[6px] border border-white/[0.08] bg-white/[0.04] px-2.5 py-[3px] text-[10px] font-medium text-white/50"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="my-4 h-px bg-white/[0.06]" />

      {/* Club identity */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-emerald-500/[0.12] ring-1 ring-emerald-400/[0.1]">
          <Shield size={13} className="text-emerald-300/80" />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-white/80">
            Riverside Athletic
          </p>
          <p className="text-[10px] text-white/35">Open age · Sunday side</p>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#091410] via-[#0d1c14] to-[#112519]">
      <PitchLines />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:py-[6.5rem]">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Left */}
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-[8px] border border-white/[0.07] bg-white/[0.035] px-3 py-1.5">
              <span className="h-[5px] w-[5px] rounded-full bg-emerald-400/80" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Grassroots football
              </span>
            </div>

            {/* H1 */}
            <h1
              className="mt-7 text-[2.5rem] leading-[1.04] tracking-[-0.03em] text-white sm:text-[3.1rem] lg:text-[3.75rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Create your team.
              <br />
              <span className="text-white/50">Find the right fixture.</span>
            </h1>

            {/* Body */}
            <p className="mt-6 max-w-[480px] text-[15px] leading-[1.8] text-white/50 sm:text-[16px]">
              Post what you need — format, level, venue, availability — and let
              the right opponent find you. Built for clubs, schools, and youth
              teams who want to sort games with less back-and-forth.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/signup" className={btn.primaryDark}>
                Create your team
                <ArrowRight size={16} strokeWidth={2.2} />
              </Link>
              <Link href="/matches" className={btn.secondaryDark}>
                Browse fixtures
              </Link>
            </div>

            {/* Trust line */}
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-medium text-white/30">
              <span className="flex items-center gap-1.5">
                <Users size={12} strokeWidth={2} className="text-white/25" />
                Teams &amp; schools
              </span>
              <span className="text-white/[0.1]">·</span>
              <span>Free to use</span>
              <span className="text-white/[0.1]">·</span>
              <span>Early access</span>
            </div>
          </div>

          {/* Right — visual composition */}
          <div className="relative flex items-center justify-center py-6 lg:justify-end lg:py-0">
            {/* Ambient glow */}
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.05] blur-[80px]" />

            {/* Primary card */}
            <div className="relative z-10">
              <FixtureCardHero />
            </div>

            {/* Club badge chip */}
            <div className="absolute -bottom-2 -left-3 z-20 hidden rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-4 py-3 shadow-[0_10px_32px_rgba(0,0,0,0.3)] sm:block lg:-left-14">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--gold-strong)]/[0.12] ring-1 ring-[var(--gold-strong)]/[0.1]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 text-[var(--gold-strong)]"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path d="M12 2L3 7v6c0 5.25 3.75 10.13 9 11.25C17.25 23.13 21 18.25 21 13V7l-9-5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white/70">
                    Southgate Town U18
                  </p>
                  <p className="text-[9px] text-white/30">
                    Saturday · 11-a-side
                  </p>
                </div>
              </div>
            </div>

            {/* Floating week indicator */}
            <div className="absolute -right-2 top-4 z-10 hidden rounded-[8px] border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 sm:block lg:-right-8">
              <div className="flex items-center gap-2">
                <CalendarDays size={11} strokeWidth={2} className="text-emerald-400/70" />
                <span className="text-[10px] font-semibold text-white/35">
                  3 this week
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </section>
  );
}

/* ─────────────────────────────────────────
   FEATURES
   ───────────────────────────────────────── */

const features = [
  {
    icon: Shield,
    eyebrow: "Team profile",
    title: "Show who you are before anyone has to ask",
    description:
      "Area, age group, level, format, venue situation, and matchday preferences — all visible in one team page.",
  },
  {
    icon: CalendarDays,
    eyebrow: "Fixture posts",
    title: "Post what you need in a format people can act on",
    description:
      "Date, format, venue, level, and travel detail sit in one clear post. Other organisers can judge fit at a glance.",
  },
  {
    icon: MapPinned,
    eyebrow: "Local discovery",
    title: "Find nearby teams without chasing messages",
    description:
      "Browse teams and fixture needs in one place instead of piecing things together through group chats and spreadsheets.",
  },
];

function Features() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="mb-12 max-w-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          How it works
        </p>
        <h2
          className="mt-3 text-[1.65rem] leading-[1.12] tracking-[-0.025em] text-[var(--foreground)] sm:text-[2.1rem]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The details organisers actually need, shown properly.
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <article
              key={f.title}
              className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-200 hover:border-[var(--accent-line)] hover:shadow-[0_8px_32px_rgba(17,28,21,0.06)]"
            >
              <div className="inline-flex rounded-[9px] bg-[var(--accent-soft)] p-2.5 text-[var(--accent)] transition-colors duration-200 group-hover:bg-[var(--accent)]/[0.12]">
                <Icon size={16} strokeWidth={2} />
              </div>
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                {f.eyebrow}
              </p>
              <h3 className="mt-2 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-[var(--foreground)]">
                {f.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-[1.72] text-[var(--muted)]">
                {f.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PROOF
   ───────────────────────────────────────── */

const audiences = [
  {
    title: "Saturday and Sunday league teams",
    text: "Keep friendlies moving when dates open up, drop out, or need replacing at short notice.",
  },
  {
    title: "Schools, colleges, and academies",
    text: "Find suitable opposition without relying on patchy contact lists or informal chains of messages.",
  },
  {
    title: "Community sides and organisers",
    text: "Set up development games and local friendlies with clearer team detail and better fixture information.",
  },
];

function Proof() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Why */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Why it works
          </p>
          <h2
            className="mt-3 text-[1.5rem] leading-[1.14] tracking-[-0.02em] text-[var(--foreground)] sm:text-[1.85rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            It matches the real job: show your side, post what you need, sort a game.
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[10px] bg-[var(--surface-alt)] p-5">
              <Shield className="text-[var(--accent)]" size={16} strokeWidth={2} />
              <h3 className="mt-3 text-[15px] font-semibold text-[var(--foreground)]">
                Better team context
              </h3>
              <p className="mt-2 text-[13px] leading-[1.7] text-[var(--muted)]">
                A proper team page gives people the basics up front — age group,
                level, format, area, and whether you can host or need to travel.
              </p>
            </div>
            <div className="rounded-[10px] bg-[var(--surface-alt)] p-5">
              <Target className="text-[var(--accent)]" size={16} strokeWidth={2} />
              <h3 className="mt-3 text-[15px] font-semibold text-[var(--foreground)]">
                Clearer fixture posts
              </h3>
              <p className="mt-2 text-[13px] leading-[1.7] text-[var(--muted)]">
                Good fixture requests are specific. That makes it easier to
                judge fit quickly instead of wasting time on vague back-and-forth.
              </p>
            </div>
          </div>
        </div>

        {/* Who */}
        <div className="rounded-xl border border-[var(--border)] bg-gradient-to-b from-[var(--accent-soft)]/30 to-[var(--surface)] p-7 sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Who it&rsquo;s for
          </p>
          <h2
            className="mt-3 text-[1.5rem] leading-[1.14] tracking-[-0.02em] text-[var(--foreground)] sm:text-[1.85rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built for the people actually arranging the games.
          </h2>
          <div className="mt-7 space-y-3">
            {audiences.map((item) => (
              <article
                key={item.title}
                className="rounded-[10px] border border-[var(--border)] bg-white/70 p-4"
              >
                <h3 className="text-[14px] font-semibold text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-[1.65] text-[var(--muted)]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FIXTURE BOARD PREVIEW
   ───────────────────────────────────────── */

const fixtureExamples = [
  {
    format: "Open age · 11-a-side · Sunday mornings",
    detail: "Can host on 3G · Intermediate · SE London",
  },
  {
    format: "U18s · 11-a-side · Midweek under lights",
    detail: "Away fixture needed · Development · North London",
  },
  {
    format: "7-a-side · Community football · Flexible",
    detail: "Mixed format · All welcome · East London",
  },
];

function FixtureBoardPreview() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="relative overflow-hidden rounded-xl border border-[var(--pitch-border)] bg-gradient-to-br from-[#091410] via-[#0d1c14] to-[#133020] p-7 text-white shadow-[0_16px_48px_rgba(0,0,0,0.2)] sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-400/[0.03] blur-[80px]" />

        <div className="relative grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300/55">
              Fixture posts
            </p>
            <h2
              className="mt-3 text-[1.5rem] leading-[1.12] tracking-[-0.02em] text-white sm:text-[1.85rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What a clear fixture request looks like.
            </h2>
            <p className="mt-4 max-w-md text-[13px] leading-[1.72] text-white/40">
              Format, venue, level, and travel expectations visible up front.
              Other organisers can decide whether a game works without chasing
              basic details.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/matches" className={btn.primaryDarkSm}>
                Browse fixtures
                <ArrowRight size={14} strokeWidth={2.2} />
              </Link>
              <Link href="/signup" className={btn.secondaryDarkSm}>
                Create your team
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {fixtureExamples.map((fx) => (
              <div
                key={fx.format}
                className="rounded-[10px] border border-white/[0.06] bg-white/[0.025] p-4 transition-colors duration-150 hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-2">
                  <div className="h-[5px] w-[5px] rounded-full bg-emerald-400/60" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-300/45">
                    Example
                  </span>
                </div>
                <p className="mt-2.5 text-[14px] font-semibold leading-snug text-white/80">
                  {fx.format}
                </p>
                <p className="mt-1 text-[12px] text-white/35">{fx.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CTA
   ───────────────────────────────────────── */

function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
      <div className="overflow-hidden rounded-xl border border-[var(--pitch-border)] bg-gradient-to-br from-[#0a1510] to-[#132a1c] p-7 text-white shadow-[0_16px_48px_rgba(0,0,0,0.16)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="max-w-md">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300/45">
              Early access
            </p>
            <h2
              className="mt-3 text-[1.4rem] leading-[1.14] tracking-[-0.02em] text-white sm:text-[1.75rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Start with a team profile. Post the fixtures you need.
            </h2>
            <p className="mt-3 text-[13px] leading-[1.7] text-white/38">
              Free to use. Focused on one job — helping organisers represent
              their side properly and arrange games with less friction.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className={btn.primaryDark}>
              Create your team
            </Link>
            <Link href="/matches" className={btn.secondaryDark}>
              Browse fixtures
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PAGE
   ───────────────────────────────────────── */

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <Proof />
      <FixtureBoardPreview />
      <CtaBanner />
    </main>
  );
}