import type { ReactNode } from "react";
import Link from "next/link";
import { Calendar, MapPin, Shield, Users } from "lucide-react";
import { requestToJoinTeam } from "@/app/actions/team-membership";
import { DirectoryFilters } from "@/components/directory/directory-filters";
import { SubmitButton } from "@/components/forms/submit-button";
import { SetupNotice } from "@/components/site/setup-notice";
import { TeamBadge } from "@/components/team/team-badge";
import { TeamDirectoryNotice } from "@/components/team/team-directory-notice";
import { buttonStyles } from "@/components/ui/button";
import {
  getUniqueFilterOptions,
  TEAM_FORMAT_OPTIONS,
} from "@/lib/football";
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

type TeamRecord = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  city: string | null;
  area: string | null;
  age_group: string | null;
  skill_level: string | null;
  team_format: string | null;
  preferred_match_day: string | null;
  pitch_status: string | null;
  travel_willingness: string | null;
  bio: string | null;
};

function getSearchValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return typeof value === "string" ? value : "";
}

export default async function TeamsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const filters = {
    age_group: getSearchValue(params, "age_group"),
    area: getSearchValue(params, "area"),
    skill_level: getSearchValue(params, "skill_level"),
    preferred_match_day: getSearchValue(params, "preferred_match_day"),
    team_format: getSearchValue(params, "team_format"),
  };
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
          "id, owner_id, name, slug, logo_url, city, area, age_group, skill_level, team_format, preferred_match_day, pitch_status, travel_willingness, bio",
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false })
    : { data: [], error: null };
  const allTeams = (teamsResponse.data ?? []) as TeamRecord[];

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

  const filteredTeams = allTeams.filter((team) => {
    const areaNeedle = filters.area.trim().toLowerCase();
    const matchesArea = areaNeedle
      ? [team.city, team.area]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(areaNeedle))
      : true;

    return (
      (!filters.age_group || team.age_group === filters.age_group) &&
      (!filters.skill_level || team.skill_level === filters.skill_level) &&
      (!filters.preferred_match_day ||
        team.preferred_match_day === filters.preferred_match_day) &&
      (!filters.team_format || team.team_format === filters.team_format) &&
      matchesArea
    );
  });

  const teamMemberFeaturesAvailable =
    !membershipsResponse.error && !memberCountsResponse.error;
  const filterFields = [
    {
      name: "age_group",
      label: "Age group",
      options: getUniqueFilterOptions(allTeams.map((team) => team.age_group)),
    },
    {
      name: "area",
      label: "Area",
      type: "text" as const,
      placeholder: "Town, borough, or county",
    },
    {
      name: "skill_level",
      label: "Level",
      options: getUniqueFilterOptions(allTeams.map((team) => team.skill_level)),
    },
    {
      name: "preferred_match_day",
      label: "Preferred day",
      options: getUniqueFilterOptions(
        allTeams.map((team) => team.preferred_match_day),
      ),
    },
    {
      name: "team_format",
      label: "Format",
      options: getUniqueFilterOptions(
        allTeams.map((team) => team.team_format).concat([...TEAM_FORMAT_OPTIONS]),
      ),
    },
  ];
  const openSquadTeams = allTeams.filter((team) => {
    const approvedMembers = teamCounts.get(team.id) ?? 0;
    return approvedMembers < TEAM_APPROVED_MEMBER_LIMIT;
  }).length;
  const hostReadyTeams = allTeams.filter((team) =>
    (team.pitch_status ?? "").toLowerCase().includes("host") ||
    (team.pitch_status ?? "").toLowerCase().includes("flex"),
  ).length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <section className="relative overflow-hidden rounded-[2.2rem] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(11,24,16,0.98),rgba(18,48,33,0.94))] p-8 text-white shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.2rem]">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/8" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
          <div className="absolute bottom-0 left-1/2 h-24 w-52 -translate-x-1/2 rounded-t-full border-x border-t border-white/8" />
        </div>

        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Local club board
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                Early access beta
              </span>
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-[-0.035em] text-white md:text-5xl">
              Club cards that tell you quickly whether a side looks right for the fixture.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[color:var(--pitch-muted)]">
              This is the public side of the network: club profiles shaped
              around the details organisers scan first, from area and level to
              pitch situation, travel range, format, and squad shape.
            </p>
            <p className="mt-3 max-w-2xl text-sm uppercase tracking-[0.16em] text-white/52">
              Built for Sunday sides, youth teams, school staff, academy
              organisers, and community football.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/6 px-5 py-4 text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Active club profiles
              </p>
              <p className="mt-2 text-3xl font-bold">{allTeams.length}</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/6 px-5 py-4 text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Can host or flex
              </p>
              <p className="mt-2 text-3xl font-bold">{hostReadyTeams}</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/6 px-5 py-4 text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Squads open to join
              </p>
              <p className="mt-2 text-3xl font-bold">{openSquadTeams}</p>
            </div>
          </div>
        </div>

        <div className="relative mt-8 flex flex-wrap gap-3">
          {user ? (
            <Link
              href={ownedTeam ? "/dashboard/team" : "/dashboard/team/new"}
              className={buttonStyles({ variant: "inverse", size: "lg" })}
            >
              {ownedTeam ? "Manage your club profile" : "Put your team on the board"}
            </Link>
          ) : (
            <Link
              href="/signup"
              className={buttonStyles({ variant: "inverse", size: "lg" })}
            >
              Put your team on the board
            </Link>
          )}
          <Link
            href="/matches"
            className={buttonStyles({ variant: "inverseGhost", size: "lg" })}
          >
            View fixture board
          </Link>
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
      ) : teamsResponse.error ? (
        <section className="mt-6 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 text-amber-900">
          We couldn&apos;t load the club board right now. Refresh the page and
          check Supabase if the problem continues.
        </section>
      ) : allTeams.length === 0 ? (
        <section className="mt-6 rounded-[2rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            No club profiles yet
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Once organisers create their team profile, it will appear here with
            squad context, pitch status, and matchday information.
          </p>
          <div className="mt-6">
            <Link href="/signup" className={buttonStyles({})}>
              Create the first account
            </Link>
          </div>
        </section>
      ) : (
        <>
          <div className="mt-6">
            <DirectoryFilters
              action="/teams"
              fields={filterFields}
              filteredCount={filteredTeams.length}
              resultsLabel="club profiles"
              totalCount={allTeams.length}
              values={filters}
            />
          </div>

          {!teamMemberFeaturesAvailable ? (
            <section className="mt-6 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
              Club profiles are available, but squad join requests are disabled
              until the <code>team_members</code> table is available in
              Supabase.
            </section>
          ) : null}

          {filteredTeams.length === 0 ? (
            <section className="mt-6 rounded-[2rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-8">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                No teams match those filters
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                Try widening the area or removing one of the football filters to
                reveal more local opposition.
              </p>
            </section>
          ) : (
            <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredTeams.map((team) => {
                const approvedMembers = teamCounts.get(team.id) ?? 0;
                const squadCount = getRegisteredSquadCount(approvedMembers);
                const placesLeft = getRemainingSquadPlaces(approvedMembers);
                const membershipStatus = membershipByTeamId.get(team.id);
                const isOwner =
                  ownedTeam?.id === team.id || team.owner_id === user?.id;
                const alreadyCommittedElsewhere =
                  Boolean(existingSquadElsewhere) && membershipStatus == null;

                let cta: ReactNode = null;

                if (!user) {
                  cta = (
                    <Link
                      href="/login?message=join-team&next=/teams"
                      className={buttonStyles({ size: "sm" })}
                    >
                      Log in to request a place
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
                      Manage profile
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
                      Join request pending
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
                        Request to join squad
                      </SubmitButton>
                    </form>
                  );
                }

                return (
                  <article
                    key={team.id}
                    className="flex flex-col overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-white shadow-[0_20px_50px_rgba(22,37,30,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(22,37,30,0.12)]"
                  >
                    <div className="border-b border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(15,123,88,0.08),rgba(255,255,255,0))] px-6 py-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <TeamBadge
                            name={team.name}
                            logoUrl={team.logo_url ?? undefined}
                            size="md"
                          />
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                              Club profile
                            </p>
                            <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">
                              {team.name}
                            </h2>
                            <p className="mt-1 text-sm text-[var(--muted)]">
                              {[team.city, team.area].filter(Boolean).join(", ") ||
                                "Location pending"}
                            </p>
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
                      <div className="flex flex-wrap gap-2">
                        {team.age_group ? (
                          <span className="rounded-full bg-[var(--surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                            {team.age_group}
                          </span>
                        ) : null}
                        {team.team_format ? (
                          <span className="rounded-full bg-[var(--surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                            {team.team_format}
                          </span>
                        ) : null}
                        {team.preferred_match_day ? (
                          <span className="rounded-full bg-[var(--surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                            {team.preferred_match_day}
                          </span>
                        ) : null}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.35rem] border border-[color:var(--border)] bg-[var(--surface)] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                            Matchday
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                            <Calendar size={14} className="text-[var(--accent)]" />
                            {team.preferred_match_day || "Not added yet"}
                          </div>
                        </div>
                        <div className="rounded-[1.35rem] border border-[color:var(--border)] bg-[var(--surface)] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                            Venue
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                            <MapPin size={14} className="text-[var(--accent)]" />
                            {team.pitch_status || "Not added yet"}
                          </div>
                        </div>
                        <div className="rounded-[1.35rem] border border-[color:var(--border)] bg-[var(--surface)] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                            Travel
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                            <Shield size={14} className="text-[var(--accent)]" />
                            {team.travel_willingness || "Not added yet"}
                          </div>
                        </div>
                        <div className="rounded-[1.35rem] border border-[color:var(--border)] bg-[var(--surface)] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                            Squad
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                            <Users size={14} className="text-[var(--accent)]" />
                            {squadCount} registered
                          </div>
                          <p className="mt-1 text-xs text-[var(--muted)]">
                            {placesLeft > 0
                              ? `${placesLeft} place${placesLeft === 1 ? "" : "s"} left`
                              : "Squad full"}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm leading-7 text-[var(--muted)]">
                        {team.bio?.trim() ||
                          "This team has not added a club summary yet."}
                      </p>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--border)] pt-5">
                        <p className="text-xs text-[var(--muted)]">
                          {isOwner
                            ? "You manage this club profile."
                            : "Join requests land in the organiser dashboard."}
                        </p>
                        {cta}
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </>
      )}
    </main>
  );
}
