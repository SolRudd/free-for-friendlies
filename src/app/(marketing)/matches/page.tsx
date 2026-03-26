import Link from "next/link";
import { SetupNotice } from "@/components/site/setup-notice";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseSetupMessage } from "@/lib/supabase/env";
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

function getTeamName(team: { name: string } | { name: string }[] | null) {
  if (!team) {
    return "Team";
  }

  return Array.isArray(team) ? team[0]?.name || "Team" : team.name;
}

export default async function MatchesPage() {
  const supabase = await createClient();
  const setupMessage = getSupabaseSetupMessage();
  const isSupabaseConfigured = Boolean(supabase);
  const requestsResponse = supabase
    ? await supabase
        .from("match_requests")
        .select(
          "id, title, city, area, age_group, skill_level, match_format, preferred_date, preferred_time, description, team:teams(name)",
        )
        .eq("status", "open")
        .order("created_at", { ascending: false })
    : { data: [], error: null };
  const { data: requests, error } = requestsResponse;

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
          Match board
        </p>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold text-[var(--foreground)] md:text-5xl">
              Open friendly requests
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">
              A live list of open requests from teams trying to arrange games.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[var(--surface-alt)] px-5 py-4">
            <p className="text-sm font-medium text-[var(--muted)]">Open posts</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              {(requests ?? []).length}
            </p>
          </div>
        </div>
      </section>

      {!isSupabaseConfigured ? (
        <div className="mt-6">
          <SetupNotice
            eyebrow="Match board unavailable"
            title="Supabase is not configured yet"
            description={setupMessage}
            ctaHref="/"
            ctaLabel="Return home"
          />
        </div>
      ) : error ? (
        <section className="mt-6 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 text-amber-900">
          We couldn&apos;t load the match board right now. Refresh the page and
          check Supabase if the issue continues.
        </section>
      ) : (requests ?? []).length === 0 ? (
        <section className="mt-6 rounded-[2rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-8">
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            No open requests yet
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            The board is empty for now. Create a team and publish the first
            friendly request to get the loop started.
          </p>
          <div className="mt-6">
            <Link href="/signup" className={buttonStyles({})}>
              Create account
            </Link>
          </div>
        </section>
      ) : (
        <section className="mt-6 grid gap-5 md:grid-cols-2">
          {(requests ?? []).map((request) => (
            <article
              key={request.id}
              className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_18px_44px_rgba(22,37,30,0.06)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[var(--accent)]">
                    {getTeamName(request.team)}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {request.title}
                  </h2>
                </div>
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                  {request.match_format || "Friendly"}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                <p>{[request.city, request.area].filter(Boolean).join(" · ") || "Flexible area"}</p>
                <p>{[request.age_group, request.skill_level].filter(Boolean).join(" · ") || "Open level"}</p>
                <p>
                  {formatDate(request.preferred_date)} ·{" "}
                  {request.preferred_time || "Flexible time"}
                </p>
              </div>
              <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
                {request.description || "No extra notes added yet."}
              </p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
