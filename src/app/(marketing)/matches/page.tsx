import Link from "next/link";
import { Calendar, Clock, MapPin, Route, Shield } from "lucide-react";
import { DirectoryFilters } from "@/components/directory/directory-filters";
import { SetupNotice } from "@/components/site/setup-notice";
import { TeamBadge } from "@/components/team/team-badge";
import { buttonStyles } from "@/components/ui/button";
import { getUniqueFilterOptions, VENUE_STATUS_OPTIONS } from "@/lib/football";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseSetupMessage } from "@/lib/supabase/env";

type TeamRelation =
  | {
      name: string | null;
      logo_url: string | null;
    }
  | {
      name: string | null;
      logo_url: string | null;
    }[]
  | null;

type MatchRecord = {
  id: string;
  title: string;
  city: string | null;
  area: string | null;
  age_group: string | null;
  skill_level: string | null;
  match_format: string | null;
  venue_status: string | null;
  travel_willingness: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  description: string | null;
  team: TeamRelation;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Flexible date";
  }

  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getTeam(team: TeamRelation) {
  if (!team) {
    return {
      name: "Team",
      logo_url: null,
    };
  }

  if (Array.isArray(team)) {
    return team[0] ?? { name: "Team", logo_url: null };
  }

  return team;
}

function getSearchValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return typeof value === "string" ? value : "";
}

export default async function MatchesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const filters = {
    age_group: getSearchValue(params, "age_group"),
    area: getSearchValue(params, "area"),
    skill_level: getSearchValue(params, "skill_level"),
    match_format: getSearchValue(params, "match_format"),
    venue_status: getSearchValue(params, "venue_status"),
  };
  const supabase = await createClient();
  const setupMessage = getSupabaseSetupMessage();
  const isSupabaseConfigured = Boolean(supabase);
  const user = supabase
    ? (
        await supabase.auth.getUser()
      ).data.user
    : null;
  const requestsResponse = supabase
    ? await supabase
        .from("match_requests")
        .select(
          "id, title, city, area, age_group, skill_level, match_format, venue_status, travel_willingness, preferred_date, preferred_time, description, team:teams(name, logo_url)",
        )
        .eq("status", "open")
        .order("created_at", { ascending: false })
    : { data: [], error: null };
  const allRequests = (requestsResponse.data ?? []) as MatchRecord[];

  const filteredRequests = allRequests.filter((request) => {
    const areaNeedle = filters.area.trim().toLowerCase();
    const matchesArea = areaNeedle
      ? [request.city, request.area]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(areaNeedle))
      : true;

    return (
      (!filters.age_group || request.age_group === filters.age_group) &&
      (!filters.skill_level || request.skill_level === filters.skill_level) &&
      (!filters.match_format || request.match_format === filters.match_format) &&
      (!filters.venue_status || request.venue_status === filters.venue_status) &&
      matchesArea
    );
  });

  const filterFields = [
    {
      name: "age_group",
      label: "Age group",
      options: getUniqueFilterOptions(
        allRequests.map((request) => request.age_group),
      ),
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
      options: getUniqueFilterOptions(
        allRequests.map((request) => request.skill_level),
      ),
    },
    {
      name: "match_format",
      label: "Format",
      options: getUniqueFilterOptions(
        allRequests.map((request) => request.match_format),
      ),
    },
    {
      name: "venue_status",
      label: "Venue",
      options: getUniqueFilterOptions(
        allRequests
          .map((request) => request.venue_status)
          .concat([...VENUE_STATUS_OPTIONS]),
      ),
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <section className="relative overflow-hidden rounded-[2.2rem] border border-[color:var(--border)] bg-[linear-gradient(140deg,rgba(11,24,16,0.99),rgba(20,52,36,0.95))] p-8 text-white shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.2rem]">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/8" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/8" />
        </div>

        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Live fixture board
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                Early access beta
              </span>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-[-0.035em] text-white md:text-5xl">
              Fixture posts that read like real football opportunities, not generic notices.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[color:var(--pitch-muted)]">
              Age group, level, format, venue situation, travel range, date,
              and kick-off all sit in clear view so organisers can decide
              quickly whether a game looks sensible.
            </p>
            <p className="mt-3 max-w-2xl text-sm uppercase tracking-[0.16em] text-white/52">
              For clubs, schools, youth football, community teams, and local
              organisers trying to fill real dates.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/6 px-5 py-4 text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Live fixture posts
              </p>
              <p className="mt-2 text-3xl font-bold">{allRequests.length}</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/6 px-5 py-4 text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Home or flexible venue
              </p>
              <p className="mt-2 text-3xl font-bold">
                {
                  allRequests.filter(
                    (request) =>
                      request.venue_status === "Can host or travel" ||
                      request.venue_status === "Flexible on venue",
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-8 flex flex-wrap gap-3">
          <Link
            href={user ? "/dashboard/matches/new" : "/signup"}
            className={buttonStyles({
              size: "lg",
              className: "bg-white text-[var(--foreground)] hover:bg-[var(--surface-alt)]",
            })}
          >
            {user ? "Put a fixture on the board" : "Create a team and post"}
          </Link>
          <Link
            href="/teams"
            className={buttonStyles({
              variant: "ghost",
              size: "lg",
              className: "border-white/10 text-white hover:bg-white/10",
            })}
          >
            Browse club profiles
          </Link>
        </div>
      </section>

      {!isSupabaseConfigured ? (
        <div className="mt-6">
          <SetupNotice
            eyebrow="Fixture board unavailable"
            title="Supabase is not configured yet"
            description={setupMessage}
            ctaHref="/"
            ctaLabel="Return home"
          />
        </div>
      ) : requestsResponse.error ? (
        <section className="mt-6 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 text-amber-900">
          We couldn&apos;t load the fixture board right now. Refresh the page
          and check Supabase if the issue continues.
        </section>
      ) : allRequests.length === 0 ? (
        <section className="mt-6 rounded-[2rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            No live fixture posts yet
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            The board is quiet for now. Create a team and post the first
            opponent-needed slot to get the network moving.
          </p>
          <div className="mt-6">
            <Link href="/signup" className={buttonStyles({})}>
              Create account
            </Link>
          </div>
        </section>
      ) : (
        <>
          <div className="mt-6">
            <DirectoryFilters
              action="/matches"
              fields={filterFields}
              filteredCount={filteredRequests.length}
              resultsLabel="fixture posts"
              totalCount={allRequests.length}
              values={filters}
            />
          </div>

          {filteredRequests.length === 0 ? (
            <section className="mt-6 rounded-[2rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-8">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                No fixture posts match those filters
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                Try a broader area or remove one football filter to reveal more
                realistic fixture options.
              </p>
            </section>
          ) : (
            <section className="mt-6 grid gap-5 md:grid-cols-2">
              {filteredRequests.map((request) => {
                const team = getTeam(request.team);

                return (
                  <article
                    key={request.id}
                    className="flex flex-col overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-white shadow-[0_20px_50px_rgba(22,37,30,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(22,37,30,0.12)]"
                  >
                    <div className="border-b border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(15,123,88,0.08),rgba(255,255,255,0))] px-6 py-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <TeamBadge
                            name={team.name || "Team"}
                            logoUrl={team.logo_url ?? undefined}
                            size="md"
                          />
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                              Opponent wanted
                            </p>
                            <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">
                              {request.title}
                            </h2>
                            <p className="mt-1 text-sm text-[var(--muted)]">
                              {team.name || "Team"}
                              {request.city || request.area
                                ? ` · ${[request.city, request.area]
                                    .filter(Boolean)
                                    .join(", ")}`
                                : ""}
                            </p>
                          </div>
                        </div>

                        {request.match_format ? (
                          <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                            {request.match_format}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-5 p-6">
                      <div className="flex flex-wrap gap-2">
                        {request.age_group ? (
                          <span className="rounded-full bg-[var(--surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                            {request.age_group}
                          </span>
                        ) : null}
                        {request.skill_level ? (
                          <span className="rounded-full bg-[var(--surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                            {request.skill_level}
                          </span>
                        ) : null}
                        {request.venue_status ? (
                          <span className="rounded-full bg-[var(--surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                            {request.venue_status}
                          </span>
                        ) : null}
                        {request.travel_willingness ? (
                          <span className="rounded-full bg-[var(--surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                            {request.travel_willingness}
                          </span>
                        ) : null}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[var(--surface)] p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                            <Calendar size={14} className="text-[var(--accent)]" />
                            {formatDate(request.preferred_date)}
                          </div>
                          <p className="mt-2 text-xs text-[var(--muted)]">
                            Matchday target
                          </p>
                        </div>

                        <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[var(--surface)] p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                            <Clock size={14} className="text-[var(--accent)]" />
                            {request.preferred_time || "Flexible time"}
                          </div>
                          <p className="mt-2 text-xs text-[var(--muted)]">
                            Kick-off window
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-sm text-[var(--muted)]">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="shrink-0 text-[var(--accent)]" />
                          <span>
                            {[request.city, request.area].filter(Boolean).join(", ") ||
                              "Location pending"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield size={14} className="shrink-0 text-[var(--accent)]" />
                          <span>
                            {request.venue_status || "Venue detail not added yet"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Route size={14} className="shrink-0 text-[var(--accent)]" />
                          <span>
                            {request.travel_willingness ||
                              "Travel preference not added yet"}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm leading-7 text-[var(--muted)]">
                        {request.description?.trim() ||
                          "No extra fixture notes have been added yet."}
                      </p>
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
