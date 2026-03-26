import Link from "next/link";
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

  const [{ data: profile }, { data: teams, error: teamsError }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user!.id).maybeSingle(),
    supabase
      .from("teams")
      .select("id, name, city, area, skill_level, preferred_match_day")
      .eq("owner_id", user!.id)
      .order("created_at", { ascending: false }),
  ]);

  const teamIds = (teams ?? []).map((team) => team.id);
  const { data: requests, error: requestsError } = teamIds.length
    ? await supabase
        .from("match_requests")
        .select("id, title, preferred_date, preferred_time, status, match_format, city")
        .in("team_id", teamIds)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  const displayName =
    profile?.full_name?.trim() || user?.email?.split("@")[0] || "Team organiser";
  const openRequests = (requests ?? []).filter((request) => request.status === "open");
  const hasTeams = (teams ?? []).length > 0;

  return (
    <div className="space-y-8">
      <DashboardNotice />

      <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
          Overview
        </p>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold text-[var(--foreground)] md:text-5xl">
              Welcome back, {displayName}.
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">
              This is your working area for team setup and match posting. Keep
              the team profile accurate, then publish requests when you need a
              fixture filled.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/team/new" className={buttonStyles({})}>
              Create team
            </Link>
            <Link
              href="/dashboard/matches/new"
              className={buttonStyles({ variant: "secondary" })}
            >
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

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_44px_rgba(22,37,30,0.05)]">
          <p className="text-sm font-medium text-[var(--muted)]">Teams</p>
          <p className="mt-3 text-4xl font-semibold text-[var(--foreground)]">
            {(teams ?? []).length}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Public team profiles owned by your account.
          </p>
        </article>
        <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_44px_rgba(22,37,30,0.05)]">
          <p className="text-sm font-medium text-[var(--muted)]">Open requests</p>
          <p className="mt-3 text-4xl font-semibold text-[var(--foreground)]">
            {openRequests.length}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Active match requests currently on the public board.
          </p>
        </article>
        <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_44px_rgba(22,37,30,0.05)]">
          <p className="text-sm font-medium text-[var(--muted)]">Next priority</p>
          <p className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            {!hasTeams ? "Create your first team" : openRequests.length === 0 ? "Post a match request" : "Keep the board current"}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {!hasTeams
              ? "A team profile is required before you can publish friendlies."
              : openRequests.length === 0
                ? "You already have a team, so the next step is getting a request live."
                : "You have live content on the board. Update it when dates change."}
          </p>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-7 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                Your teams
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Review the club profiles currently live on the directory.
              </p>
            </div>
            <Link
              href="/dashboard/team/new"
              className={buttonStyles({ variant: "secondary", size: "sm" })}
            >
              Add team
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {!hasTeams ? (
              <div className="rounded-[1.5rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  No teams yet
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Create your first team to unlock match posting and appear on
                  the public teams board.
                </p>
              </div>
            ) : (
              (teams ?? []).map((team) => (
                <article
                  key={team.id}
                  className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--surface)] p-5"
                >
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">
                    {team.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    Team context
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {[team.city, team.area].filter(Boolean).join(" · ") ||
                      "Location pending"}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {[team.skill_level, team.preferred_match_day]
                      .filter(Boolean)
                      .join(" · ") || "Details pending"}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-7 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                Recent requests
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Your latest friendly posts and whether they are live.
              </p>
            </div>
            <Link
              href="/dashboard/matches/new"
              className={buttonStyles({ variant: "secondary", size: "sm" })}
            >
              New request
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
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
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">
                        {request.title}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        {[request.city, request.match_format]
                          .filter(Boolean)
                          .join(" · ") || "Friendly request"}
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                      {request.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    {formatDate(request.preferred_date)} ·{" "}
                    {request.preferred_time || "Flexible time"}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
