import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  PenSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import { reviewJoinRequest } from "@/app/actions/team-membership";
import { DashboardNotice } from "@/components/dashboard/dashboard-notice";
import { TeamBadge } from "@/components/team/team-badge";
import { buttonStyles } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getRegisteredSquadCount, getRemainingSquadPlaces } from "@/lib/team";

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

type JoinRequestProfile =
  | {
      full_name: string | null;
      email: string | null;
      location: string | null;
    }
  | {
      full_name: string | null;
      email: string | null;
      location: string | null;
    }[]
  | null;

function getJoinRequestProfile(profile: JoinRequestProfile) {
  if (!profile) {
    return null;
  }

  return Array.isArray(profile) ? profile[0] ?? null : profile;
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
        .select(
          "id, name, slug, logo_url, city, area, skill_level, age_group, team_format, preferred_match_day, pitch_status, travel_willingness, bio",
        )
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false }),
    ]);

  const managedTeam = teams?.[0] ?? null;
  const hasLegacyExtraTeams = (teams?.length ?? 0) > 1;

  const [requestsResponse, pendingRequestsResponse, approvedMembersResponse] =
    managedTeam
      ? await Promise.all([
          supabase
            .from("match_requests")
            .select(
              "id, title, preferred_date, preferred_time, status, match_format, venue_status, travel_willingness, city",
            )
            .eq("team_id", managedTeam.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("team_members")
            .select(
              "id, created_at, profiles!team_members_user_id_fkey(full_name, email, location)",
            )
            .eq("team_id", managedTeam.id)
            .eq("status", "pending")
            .order("created_at", { ascending: false }),
          supabase
            .from("team_members")
            .select("id", { count: "exact", head: true })
            .eq("team_id", managedTeam.id)
            .eq("status", "approved"),
        ])
      : [
          { data: [], error: null },
          { data: [], error: null },
          { count: 0, error: null },
        ];

  const requests = requestsResponse.data ?? [];
  const pendingJoinRequests = pendingRequestsResponse.data ?? [];
  const displayName =
    profile?.full_name?.trim() ||
    user?.email?.split("@")[0] ||
    "Team organiser";
  const openRequests = requests.filter((request) => request.status === "open");
  const approvedMembers = approvedMembersResponse.count ?? 0;
  const squadCount = managedTeam ? getRegisteredSquadCount(approvedMembers) : 0;
  const placesLeft = managedTeam ? getRemainingSquadPlaces(approvedMembers) : 0;

  const nextPriorityLabel = !managedTeam
    ? "Create your team"
    : pendingJoinRequests.length > 0
      ? "Review join requests"
      : openRequests.length === 0
        ? "Post a match request"
        : "Keep your team board current";

  const nextPriorityDetail = !managedTeam
    ? "Set up one clear team profile before you start posting fixtures or accepting join requests."
    : pendingJoinRequests.length > 0
      ? "There are players waiting for a decision in your dashboard."
      : openRequests.length === 0
        ? "Your team is live. The next step is publishing an open fixture request."
        : "You already have live activity. Tighten the team page or refresh posts as dates change.";

  const nextPriorityHref = !managedTeam
    ? "/dashboard/team/new"
    : pendingJoinRequests.length > 0
      ? "#pending-requests"
      : "/dashboard/matches/new";

  const hasDataError =
    Boolean(teamsError) ||
    Boolean(requestsResponse.error) ||
    Boolean(pendingRequestsResponse.error) ||
    Boolean(approvedMembersResponse.error);

  return (
    <div className="space-y-8">
      <DashboardNotice />

      <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Matchday operations
          </p>
          <span className="rounded-full border border-[color:rgba(17,28,21,0.08)] bg-[var(--surface-alt)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Early access beta
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-[var(--foreground)] md:text-5xl">
              Welcome back, {displayName}.
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">
              Your team operations home for club profile updates, squad demand,
              and live fixture needs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={managedTeam ? "/dashboard/team" : "/dashboard/team/new"}
              className={buttonStyles({})}
            >
              <PenSquare size={15} />
              {managedTeam ? "Manage team" : "Create team"}
            </Link>
            <Link
              href="/dashboard/matches/new"
              className={buttonStyles({ variant: "secondary" })}
            >
              <CalendarClock size={15} />
              Post request
            </Link>
          </div>
        </div>
      </section>

      {hasLegacyExtraTeams ? (
        <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          This account still has more than one team from an earlier prototype
          state. The newest team is now treated as your managed team.
        </section>
      ) : null}

      {hasDataError ? (
        <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          Some dashboard data could not be loaded. Refresh the page and check
          your Supabase connection if the problem continues.
        </section>
      ) : null}

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(22,37,30,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-[var(--muted)]">Managed team</p>
            <span className="rounded-xl bg-[var(--accent-soft)] p-2 text-[var(--accent)]">
              <ShieldCheck size={15} />
            </span>
          </div>
          <p className="mt-4 text-4xl font-bold text-[var(--foreground)]">
            {managedTeam ? 1 : 0}
          </p>
          <p className="mt-1.5 text-xs text-[var(--muted)]">
            One club profile per account in this MVP.
          </p>
        </article>

        <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(22,37,30,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-[var(--muted)]">
              Registered squad
            </p>
            <span className="rounded-xl bg-[var(--accent-soft)] p-2 text-[var(--accent)]">
              <Users size={15} />
            </span>
          </div>
          <p className="mt-4 text-4xl font-bold text-[var(--foreground)]">
            {squadCount}
          </p>
          <p className="mt-1.5 text-xs text-[var(--muted)]">
            {managedTeam
              ? `${placesLeft} place${placesLeft === 1 ? "" : "s"} left before the prototype squad cap is reached.`
              : "Create your team first to start building a squad."}
          </p>
        </article>

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

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-7 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                Club context
              </h2>
              <p className="mt-1.5 text-sm text-[var(--muted)]">
                The single club profile your account currently manages.
              </p>
            </div>
            <Link
              href={managedTeam ? "/dashboard/team" : "/dashboard/team/new"}
              className={buttonStyles({ variant: "secondary", size: "sm" })}
            >
              {managedTeam ? "Edit team" : "Create team"}
            </Link>
          </div>

          <div className="mt-6">
            {!managedTeam ? (
              <div className="rounded-[1.5rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  No team set up yet
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Create one proper club profile first. That unlocks public
                  board visibility, squad join requests, and live fixture posts.
                </p>
                <Link
                  href="/dashboard/team/new"
                  className={buttonStyles({ size: "sm", className: "mt-4" })}
                >
                  Create team
                </Link>
              </div>
            ) : (
              <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--surface)] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <TeamBadge
                      name={managedTeam.name}
                      logoUrl={managedTeam.logo_url ?? undefined}
                      size="lg"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-[var(--foreground)]">
                        {managedTeam.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
                        <span>
                          {[managedTeam.city, managedTeam.area]
                            .filter(Boolean)
                            .join(" · ") || "Location pending"}
                        </span>
                        {managedTeam.age_group ? (
                          <>
                            <span className="text-[var(--border)]">·</span>
                            <span>{managedTeam.age_group}</span>
                          </>
                        ) : null}
                        {managedTeam.preferred_match_day ? (
                          <>
                            <span className="text-[var(--border)]">·</span>
                            <span>{managedTeam.preferred_match_day}</span>
                          </>
                        ) : null}
                        {managedTeam.team_format ? (
                          <>
                            <span className="text-[var(--border)]">·</span>
                            <span>{managedTeam.team_format}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {managedTeam.skill_level ? (
                    <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                      {managedTeam.skill_level}
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-white px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      Squad
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                      {squadCount}
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-white px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      Pending joins
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                      {pendingJoinRequests.length}
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-white px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      Open requests
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                      {openRequests.length}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-white px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      Pitch situation
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                      {managedTeam.pitch_status || "Not added yet"}
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-white px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      Travel range
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                      {managedTeam.travel_willingness || "Not added yet"}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
                  {managedTeam.bio?.trim() ||
                    "Add a short football summary so other organisers know your level, area, and ideal fixture setup."}
                </p>
              </article>
            )}
          </div>
        </div>

        <div
          id="pending-requests"
          className="rounded-[2rem] border border-[color:var(--border)] bg-white p-7 shadow-[0_24px_60px_rgba(22,37,30,0.08)]"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                Pending join requests
              </h2>
              <p className="mt-1.5 text-sm text-[var(--muted)]">
                Logged-in players asking to join your squad.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {!managedTeam ? (
              <div className="rounded-[1.5rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  No team yet
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Create your team first before squad requests can appear here.
                </p>
              </div>
            ) : pendingJoinRequests.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  No pending requests
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  When a logged-in player requests to join from the team
                  directory, it will show up here for a quick approve or reject
                  decision.
                </p>
              </div>
            ) : (
              pendingJoinRequests.map((request) => {
                const requestProfile = getJoinRequestProfile(request.profiles);

                return (
                  <article
                    key={request.id}
                    className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--surface)] p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-bold text-[var(--foreground)]">
                          {requestProfile?.full_name?.trim() ||
                            requestProfile?.email ||
                            "Unnamed player"}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
                          {requestProfile?.email ? (
                            <span>{requestProfile.email}</span>
                          ) : null}
                          {requestProfile?.location ? (
                            <>
                              <span className="text-[var(--border)]">·</span>
                              <span>{requestProfile.location}</span>
                            </>
                          ) : null}
                          <span className="text-[var(--border)]">·</span>
                          <span>Requested {formatDate(request.created_at)}</span>
                        </div>
                      </div>

                      <form action={reviewJoinRequest} className="flex flex-wrap gap-2">
                        <input
                          type="hidden"
                          name="membership_id"
                          value={request.id}
                        />
                        <button
                          type="submit"
                          name="decision"
                          value="approve"
                          className={buttonStyles({ size: "sm" })}
                        >
                          Approve
                        </button>
                        <button
                          type="submit"
                          name="decision"
                          value="reject"
                          className={buttonStyles({
                            variant: "secondary",
                            size: "sm",
                          })}
                        >
                          Reject
                        </button>
                      </form>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-7 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Recent requests
            </h2>
              <p className="mt-1.5 text-sm text-[var(--muted)]">
                Your latest fixture needs and their board status.
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
          {!managedTeam ? (
            <div className="rounded-[1.5rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                Create a team first
              </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Fixture posts belong to your managed team profile, so get that
                  set up before posting.
                </p>
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  No fixture posts yet
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Once your team is ready, publish a fixture need to start
                  filling open dates.
                </p>
              </div>
            ) : (
            requests.slice(0, 5).map((request) => (
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
                  {request.preferred_time ? (
                    <>
                      <span>·</span>
                      <span>{request.preferred_time}</span>
                    </>
                  ) : null}
                  {request.match_format ? (
                    <>
                      <span>·</span>
                      <span>{request.match_format}</span>
                    </>
                  ) : null}
                  {request.venue_status ? (
                    <>
                      <span>·</span>
                      <span>{request.venue_status}</span>
                    </>
                  ) : null}
                  {request.travel_willingness ? (
                    <>
                      <span>·</span>
                      <span>{request.travel_willingness}</span>
                    </>
                  ) : null}
                  {request.city ? (
                    <>
                      <span>·</span>
                      <span>{request.city}</span>
                    </>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
