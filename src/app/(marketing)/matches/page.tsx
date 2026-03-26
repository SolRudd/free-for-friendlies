import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
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
      {/* ── HEADER ────────────────────────────────────────────────── */}
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Match board
              </p>
              <span className="flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Live
              </span>
            </div>
            <h1 className="mt-3 text-4xl font-bold text-[var(--foreground)] md:text-5xl">
              Open friendly requests
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">
              Active match requests from teams looking to arrange games. Contact
              the organiser directly via their team profile.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--surface-alt)] px-5 py-4 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Open posts
              </p>
              <p className="mt-1.5 text-3xl font-bold text-[var(--foreground)]">
                {(requests ?? []).length}
              </p>
            </div>
            <Link
              href="/signup"
              className={buttonStyles({ variant: "secondary", size: "sm" })}
            >
              Post a request
            </Link>
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
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
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
              className="flex flex-col overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-white shadow-[0_18px_44px_rgba(22,37,30,0.06)] transition hover:shadow-[0_24px_56px_rgba(22,37,30,0.10)]"
            >
              {/* Card header */}
              <div className="border-b border-[color:var(--border)] px-6 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                      {getTeamName(request.team)}
                    </p>
                    <h2 className="mt-1.5 text-xl font-bold text-[var(--foreground)]">
                      {request.title}
                    </h2>
                  </div>
                  {request.match_format && (
                    <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                      {request.match_format}
                    </span>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Date/time — fixture board prominence */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                    <Calendar size={14} className="text-[var(--accent)]" />
                    {formatDate(request.preferred_date)}
                  </div>
                  {request.preferred_time && (
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <Clock size={14} className="text-[var(--accent)]" />
                      {request.preferred_time}
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="space-y-1.5 text-sm text-[var(--muted)]">
                  {(request.city || request.area) && (
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="shrink-0 text-[var(--accent)]" />
                      <span>
                        {[request.city, request.area]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                  {(request.age_group || request.skill_level) && (
                    <p className="pl-5">
                      {[request.age_group, request.skill_level]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>

                {request.description && (
                  <p className="mt-auto text-sm leading-7 text-[var(--muted)] line-clamp-3">
                    {request.description}
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
