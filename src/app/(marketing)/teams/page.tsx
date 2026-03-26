import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonStyles } from "@/components/ui/button";

export default async function TeamsPage() {
  const supabase = await createClient();
  const { data: teams, error } = await supabase
    .from("teams")
    .select(
      "id, name, slug, city, area, age_group, skill_level, preferred_match_day, bio",
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
          Public directory
        </p>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold text-[var(--foreground)] md:text-5xl">
              Browse active teams
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">
              A simple public board of active sides looking for relevant
              friendlies. No profiles buried inside plugin clutter.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[var(--surface-alt)] px-5 py-4">
            <p className="text-sm font-medium text-[var(--muted)]">Active teams</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              {(teams ?? []).length}
            </p>
          </div>
        </div>
      </section>

      {error ? (
        <section className="mt-6 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 text-amber-900">
          We couldn&apos;t load the team directory right now. Refresh the page
          and check Supabase if the problem continues.
        </section>
      ) : (teams ?? []).length === 0 ? (
        <section className="mt-6 rounded-[2rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-8">
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            No teams listed yet
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Once organisers create their first team profile, it will appear here
            for public browsing.
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
              className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_18px_44px_rgba(22,37,30,0.06)]"
            >
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                {team.name}
              </h2>
              <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                <p>{[team.city, team.area].filter(Boolean).join(" · ") || "Location pending"}</p>
                <p>{[team.age_group, team.skill_level].filter(Boolean).join(" · ") || "Level pending"}</p>
                <p>{team.preferred_match_day || "Preferred day pending"}</p>
              </div>
              {team.bio ? (
                <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
                  {team.bio}
                </p>
              ) : (
                <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
                  This team has not added a bio yet.
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
