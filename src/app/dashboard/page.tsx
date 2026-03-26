import Link from "next/link";
import { Plus, Users, CalendarClock, ArrowRight } from "lucide-react";
import { DashboardNotice } from "@/components/dashboard/dashboard-notice";
import { createClient } from "@/lib/supabase/server";
import { buttonStyles } from "@/components/ui/button";

function formatDate(value: string | null) {
  if (!value) {
    return "Flexible date";
  }

  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: teams, error: teamsError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user!.id)
        .maybeSingle(),
      supabase
        .from("teams")
        .select("id, name, city, area, skill_level, age_group, preferred_match_day")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false }),
    ]);

  const teamIds = (teams ?? []).map((team) => team.id);
  const { data: requests, error: requestsError } = teamIds.length
    ? await supabase
        .from("match_requests")
        .select(
          "id, title, preferred_date, preferred_time, status, match_format, city",
        )
        .in("team_id", teamIds)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  const displayName =
    profile?.full_name?.trim() ||
    user?.email?.split("@")[0] ||
    "Team organiser";
  const openRequests = (requests ?? []).filter(
    (request) => request.status === "open",
  );
  const hasTeams = (teams ?? []).length > 0;

  const nextPriorityLabel = !hasTeams
    ? "Create your first team"
    : openRequests.length === 0
      ? "Post a match request"
      : "Keep the board current";

  const nextPriorityDetail = !hasTeams
    ? "A team profile is required before you can publish friendlies."
    : openRequests.length === 0
      ? "You already have a team, so the next step is getting a request live."
      : "You have live content on the board. Update it when dates change.";

  const nextPriorityHref = !hasTeams
    ? "/dashboard/team/new"
    : "/dashboard/matches/new";

  return (
    <div className="space-y-8">
      <DashboardNotice />

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
          Overview
        </p>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-[var(--foreground)] md:text-5xl">
              Welcome back, {displayName}.
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">
              Your working area for team setup and match posting. Keep the team
              profile accurate, then publish requests when you need a fixture
              filled.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/team/new" className={buttonStyles({})}>
              <Plus size={15} />
              Create team
            </Link>
            <Link
              href="/dashboard/matches/new"
              className={buttonStyles({ variant: "secondary" })}
            >
              <Plus size={15} />
              Post request
            </Link>
          </div>
        </div>
      </section>

      {(teamsError || requestsError) && (
        <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          Some dashboard data could not be loaded. Refresh the page and check
          your Supabase connection if the problem continues.
        </section>
      )}

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(22,37,30,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-[var(--muted)]">Teams</p>
            <span className="rounded-xl bg-[var(--accent-soft)] p-2 text-[var(--accent)]">
              <Users size={15} />
            </span>
          </div>
          <p className="mt-4 text-4xl font-bold text-[var(--foreground)]">
            {(teams ?? []).length}
          </p>
          <p className="mt-1.5 text-xs text-[var(--muted)]">
            Public team profiles owned by your account.
          </p>
        </article>

        <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(22,37,30,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-[var(--muted)]">
              Open requests
            </p>
            <span className="rounded-xl bg-[var(--accent-soft)] p-2 text-[var(--accent)]">
              <CalendarClock size={15} />
            </span>
          </div>
          <p className="mt-4 text-4xl font-bold text-[var(--foreground)]">
            {openRequests.length}
          </p>
          <p className="mt-1.5 text-xs text-[var(--muted)]">
            Active match requests currently on the public board.
          </p>
        </article>

        {/* Next priority — green accent treatment */}
        <article className="relative overflow-hidden rounded-[1.75rem] bg-[color:var(--pitch-dark)] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem]">
            <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full border border-white opacity-[0.04]" />
          </div>
          <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Next priority
          </p>
          <p className="relative mt-3 text-lg font-bold text-white">
            {nextPriorityLabel}
          </p>
          <p className="relative mt-1.5 text-xs leading-5 text-[color:var(--pitch-muted)]">
            {nextPriorityDetail}
          </p>
          <Link
            href={nextPriorityHref}
            className="relative mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 transition hover:text-emerald-300"
          >
            Go <ArrowRight size={12} />
          </Link>
        </article>
      </section>

      {/* ── TEAMS + REQUESTS ──────────────────────────────────────── */}
      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Your teams */}
        <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-7 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                Your teams
              </h2>
              <p className="mt-1.5 text-sm text-[var(--muted)]">
                Club profiles currently live on the directory.
              </p>
            </div>
            <Link
              href="/dashboard/team/new"
              className={buttonStyles({ variant: "secondary", size: "sm" })}
            >
              Add team
            </Link>
          </div>

          <div className="mt-6 grid gap-3">
            {!hasTeams ? (
              <div className="rounded-[1.5rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  No teams yet
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Create your first team to unlock match posting and appear on
                  the public teams board.
                </p>
                <Link
                  href="/dashboard/team/new"
                  className={buttonStyles({ size: "sm", className: "mt-4" })}
                >
                  Create team
                </Link>
              </div>
            ) : (
              (teams ?? []).map((team) => (
                <article
                  key={team.id}
                  className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--surface)] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-[var(--foreground)]">
                      {team.name}
                    </h3>
                    {team.skill_level && (
                      <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                        {team.skill_level}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
                    <span>
                      {[team.city, team.area].filter(Boolean).join(" · ") ||
                        "Location pending"}
                    </span>
                    {team.age_group && (
                      <>
                        <span className="text-[var(--border)]">·</span>
                        <span>{team.age_group}</span>
                      </>
                    )}
                    {team.preferred_match_day && (
                      <>
                        <span className="text-[var(--border)]">·</span>
                        <span>{team.preferred_match_day}</span>
                      </>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        {/* Recent requests */}
        <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-7 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                Recent requests
              </h2>
              <p className="mt-1.5 text-sm text-[var(--muted)]">
                Your latest friendly posts and their board status.
              </p>
            </div>
            <Link
              href="/dashboard/matches/new"
              className={buttonStyles({ variant: "secondary", size: "sm" })}
            >
              New request
            </Link>
          </div>

          <div className="mt-6 grid gap-3">
            {(requests ?? []).length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  No match requests yet
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Once a team exists, publish a request to start filling open
                  fixture dates.
                </p>
              </div>
            ) : (
              (requests ?? []).slice(0, 5).map((request) => (
                <article
                  key={request.id}
                  className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--surface)] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold text-[var(--foreground)]">
                      {request.title}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        request.status === "open"
                          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                          : "bg-[var(--surface-alt)] text-[var(--muted)]"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
                    <span className="font-medium">
                      {formatDate(request.preferred_date)}
                    </span>
                    {request.preferred_time && (
                      <>
                        <span>·</span>
                        <span>{request.preferred_time}</span>
                      </>
                    )}
                    {request.match_format && (
                      <>
                        <span>·</span>
                        <span>{request.match_format}</span>
                      </>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
