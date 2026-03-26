import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { SetupNotice } from "@/components/site/setup-notice";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseSetupMessage } from "@/lib/supabase/env";
import { buttonStyles } from "@/components/ui/button";

export default async function TeamsPage() {
  const supabase = await createClient();
  const setupMessage = getSupabaseSetupMessage();
  const isSupabaseConfigured = Boolean(supabase);

  const teamsResponse = supabase
    ? await supabase
        .from("teams")
        .select(
          "id, name, slug, city, area, age_group, skill_level, preferred_match_day, bio",
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false })
    : { data: [], error: null };
  const { data: teams, error } = teamsResponse;

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      {/* ── HEADER ────────────────────────────────────────────────── */}
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
              Active sides publishing their profile for friendly coordination.
              Find the right level, area, and match day.
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
            <Link
              href="/signup"
              className={buttonStyles({ variant: "secondary", size: "sm" })}
            >
              Add your team
            </Link>
          </div>
        </div>
      </section>

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
            Once organisers create their first team profile, it will appear
            here for public browsing.
          </p>
          <div className="mt-6">
            <Link href="/signup" className={buttonStyles({})}>
              Create the first account
            </Link>
          </div>
        </section>
      ) : (
        <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(teams ?? []).map((team) => (
            <article
              key={team.id}
              className="flex flex-col overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-white shadow-[0_18px_44px_rgba(22,37,30,0.06)] transition hover:shadow-[0_24px_56px_rgba(22,37,30,0.10)]"
            >
              {/* Card header strip */}
              <div className="border-b border-[color:var(--border)] px-6 py-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold text-[var(--foreground)]">
                    {team.name}
                  </h2>
                  {team.skill_level && (
                    <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                      {team.skill_level}
                    </span>
                  )}
                </div>
                {team.age_group && (
                  <p className="mt-1 text-xs font-medium text-[var(--muted)]">
                    {team.age_group}
                  </p>
                )}
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="space-y-2">
                  {(team.city || team.area) && (
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <MapPin size={13} className="shrink-0 text-[var(--accent)]" />
                      <span>
                        {[team.city, team.area].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}
                  {team.preferred_match_day && (
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <Calendar size={13} className="shrink-0 text-[var(--accent)]" />
                      <span>{team.preferred_match_day}</span>
                    </div>
                  )}
                </div>

                {team.bio ? (
                  <p className="mt-auto text-sm leading-7 text-[var(--muted)] line-clamp-3">
                    {team.bio}
                  </p>
                ) : (
                  <p className="mt-auto text-sm italic text-[var(--muted)] opacity-60">
                    No bio added yet.
                  </p>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
