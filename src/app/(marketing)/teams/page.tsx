import type { ReactNode } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { requestToJoinTeam } from "@/app/actions/team-membership";
import { SubmitButton } from "@/components/forms/submit-button";
import { SetupNotice } from "@/components/site/setup-notice";
import { TeamBadge } from "@/components/team/team-badge";
import { TeamDirectoryNotice } from "@/components/team/team-directory-notice";
import { buttonStyles } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseSetupMessage } from "@/lib/supabase/env";
import {
  getRegisteredSquadCount,
  getRemainingSquadPlaces,
  TEAM_APPROVED_MEMBER_LIMIT,
} from "@/lib/team";

type MembershipStatus = {
  team_id: string;
  status: string;
};

export default async function TeamsPage() {
  const supabase = await createClient();
  const setupMessage = getSupabaseSetupMessage();
  const isSupabaseConfigured = Boolean(supabase);
  const user = supabase
    ? (
        await supabase.auth.getUser()
      ).data.user
    : null;

  const teamsResponse = supabase
    ? await supabase
        .from("teams")
        .select(
          "id, owner_id, name, slug, logo_url, city, area, age_group, skill_level, preferred_match_day, bio",
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false })
    : { data: [], error: null };
  const { data: teams, error } = teamsResponse;

  const [ownedTeamResponse, membershipsResponse, memberCountsResponse] = supabase
    ? await Promise.all([
        user
          ? supabase
              .from("teams")
              .select("id")
              .eq("owner_id", user.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        user
          ? supabase
              .from("team_members")
              .select("team_id, status")
              .eq("user_id", user.id)
          : Promise.resolve({
              data: [] as MembershipStatus[],
              error: null,
            }),
        supabase.from("team_members").select("team_id, status"),
      ])
    : [
        { data: null, error: null },
        { data: [] as MembershipStatus[], error: null },
        { data: [] as MembershipStatus[], error: null },
      ];

  const ownedTeam = ownedTeamResponse.data;
  const userMemberships = membershipsResponse.data ?? [];
  const membershipByTeamId = new Map(
    userMemberships.map((membership) => [membership.team_id, membership.status]),
  );
  const existingSquadElsewhere = userMemberships.find(
    (membership) =>
      membership.status === "pending" || membership.status === "approved",
  );
  const teamCounts = new Map<string, number>();

  for (const membership of memberCountsResponse.data ?? []) {
    if (membership.status !== "approved") {
      continue;
    }

    teamCounts.set(
      membership.team_id,
      (teamCounts.get(membership.team_id) ?? 0) + 1,
    );
  }

  const teamMemberFeaturesAvailable =
    !membershipsResponse.error && !memberCountsResponse.error;

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Club network
            </p>
            <h1 className="mt-3 text-4xl font-bold text-[var(--foreground)] md:text-5xl">
              Browse active teams
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">
              Active sides publishing a clear squad profile for friendlies and
              player interest. Find the right area, level, and match day.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--surface-alt)] px-5 py-4 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Active teams
              </p>
              <p className="mt-1.5 text-3xl font-bold text-[var(--foreground)]">
                {(teams ?? []).length}
              </p>
            </div>

            {user ? (
              <Link
                href={ownedTeam ? "/dashboard/team" : "/dashboard/team/new"}
                className={buttonStyles({ variant: "secondary", size: "sm" })}
              >
                {ownedTeam ? "Manage your team" : "Create your team"}
              </Link>
            ) : (
              <Link
                href="/signup"
                className={buttonStyles({ variant: "secondary", size: "sm" })}
              >
                Add your team
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mt-6">
        <TeamDirectoryNotice />
      </div>

      {!isSupabaseConfigured ? (
        <div className="mt-6">
          <SetupNotice
            eyebrow="Directory unavailable"
            title="Supabase is not configured yet"
            description={setupMessage}
            ctaHref="/"
            ctaLabel="Return home"
          />
        </div>
      ) : error ? (
        <section className="mt-6 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 text-amber-900">
          We couldn&apos;t load the team directory right now. Refresh the page
          and check Supabase if the problem continues.
        </section>
      ) : (teams ?? []).length === 0 ? (
        <section className="mt-6 rounded-[2rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            No teams listed yet
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Once organisers create their team profile, it will appear here for
            public browsing and squad requests.
          </p>
          <div className="mt-6">
            <Link href="/signup" className={buttonStyles({})}>
              Create the first account
            </Link>
          </div>
        </section>
      ) : (
        <>
          {!teamMemberFeaturesAvailable ? (
            <section className="mt-6 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
              Team listings are available, but squad join requests are disabled
              until the <code>team_members</code> table is available in
              Supabase.
            </section>
          ) : null}

          <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(teams ?? []).map((team) => {
              const approvedMembers = teamCounts.get(team.id) ?? 0;
              const squadCount = getRegisteredSquadCount(approvedMembers);
              const placesLeft = getRemainingSquadPlaces(approvedMembers);
              const membershipStatus = membershipByTeamId.get(team.id);
              const isOwner = ownedTeam?.id === team.id || team.owner_id === user?.id;
              const alreadyCommittedElsewhere =
                Boolean(existingSquadElsewhere) && membershipStatus == null;

              let cta: ReactNode = null;

              if (!user) {
                cta = (
                  <Link href="/login?message=join-team&next=/teams" className={buttonStyles({ size: "sm" })}>
                    Log in to join
                  </Link>
                );
              } else if (!teamMemberFeaturesAvailable) {
                cta = (
                  <button
                    type="button"
                    disabled
                    className={buttonStyles({
                      variant: "secondary",
                      size: "sm",
                    })}
                  >
                    Join requests unavailable
                  </button>
                );
              } else if (isOwner) {
                cta = (
                  <Link
                    href="/dashboard/team"
                    className={buttonStyles({ variant: "secondary", size: "sm" })}
                  >
                    Manage team
                  </Link>
                );
              } else if (ownedTeam) {
                cta = (
                  <button
                    type="button"
                    disabled
                    className={buttonStyles({
                      variant: "secondary",
                      size: "sm",
                    })}
                  >
                    Already managing a team
                  </button>
                );
              } else if (membershipStatus === "approved") {
                cta = (
                  <button
                    type="button"
                    disabled
                    className={buttonStyles({
                      variant: "secondary",
                      size: "sm",
                    })}
                  >
                    Already in this squad
                  </button>
                );
              } else if (membershipStatus === "pending") {
                cta = (
                  <button
                    type="button"
                    disabled
                    className={buttonStyles({
                      variant: "secondary",
                      size: "sm",
                    })}
                  >
                    Request pending
                  </button>
                );
              } else if (membershipStatus === "rejected") {
                cta = (
                  <button
                    type="button"
                    disabled
                    className={buttonStyles({
                      variant: "secondary",
                      size: "sm",
                    })}
                  >
                    Request already reviewed
                  </button>
                );
              } else if (alreadyCommittedElsewhere) {
                cta = (
                  <button
                    type="button"
                    disabled
                    className={buttonStyles({
                      variant: "secondary",
                      size: "sm",
                    })}
                  >
                    Already tied to another squad
                  </button>
                );
              } else if (approvedMembers >= TEAM_APPROVED_MEMBER_LIMIT) {
                cta = (
                  <button
                    type="button"
                    disabled
                    className={buttonStyles({
                      variant: "secondary",
                      size: "sm",
                    })}
                  >
                    Squad full
                  </button>
                );
              } else {
                cta = (
                  <form action={requestToJoinTeam}>
                    <input type="hidden" name="team_id" value={team.id} />
                    <SubmitButton pendingText="Sending..." size="sm">
                      Request to join
                    </SubmitButton>
                  </form>
                );
              }

              return (
                <article
                  key={team.id}
                  className="flex flex-col overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-white shadow-[0_18px_44px_rgba(22,37,30,0.06)] transition hover:shadow-[0_24px_56px_rgba(22,37,30,0.10)]"
                >
                  <div className="border-b border-[color:var(--border)] px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <TeamBadge
                          name={team.name}
                          logoUrl={team.logo_url ?? undefined}
                          size="md"
                        />
                        <div>
                          <h2 className="text-xl font-bold text-[var(--foreground)]">
                            {team.name}
                          </h2>
                          {team.age_group ? (
                            <p className="mt-1 text-xs font-medium text-[var(--muted)]">
                              {team.age_group}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      {team.skill_level ? (
                        <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                          {team.skill_level}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-5 p-6">
                    <div className="space-y-2">
                      {(team.city || team.area) ? (
                        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                          <MapPin size={13} className="shrink-0 text-[var(--accent)]" />
                          <span>
                            {[team.city, team.area].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      ) : null}
                      {team.preferred_match_day ? (
                        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                          <Calendar size={13} className="shrink-0 text-[var(--accent)]" />
                          <span>{team.preferred_match_day}</span>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                        <Users size={13} className="shrink-0 text-[var(--accent)]" />
                        <span>
                          {squadCount} in squad
                          {placesLeft > 0
                            ? ` · ${placesLeft} place${placesLeft === 1 ? "" : "s"} left`
                            : " · squad full"}
                        </span>
                      </div>
                    </div>

                    {team.bio ? (
                      <p className="text-sm leading-7 text-[var(--muted)] line-clamp-4">
                        {team.bio}
                      </p>
                    ) : (
                      <p className="text-sm italic text-[var(--muted)] opacity-70">
                        No team summary added yet.
                      </p>
                    )}

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--border)] pt-5">
                      <p className="text-xs text-[var(--muted)]">
                        {isOwner
                          ? "You manage this team."
                          : "Join requests go to the team owner dashboard."}
                      </p>
                      {cta}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}
