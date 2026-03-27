import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarClock, Users } from "lucide-react";
import { TeamForm } from "@/components/forms/team-form";
import { FormAlert } from "@/components/forms/form-alert";
import { TeamBadge } from "@/components/team/team-badge";
import { buttonStyles } from "@/components/ui/button";
import { getRegisteredSquadCount, getRemainingSquadPlaces } from "@/lib/team";
import {
  getSupabaseSetupMessage,
  hasSupabaseServiceRoleKey,
} from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { SetupNotice } from "@/components/site/setup-notice";

function getPageMessage(message: string | undefined) {
  if (message === "team-updated") {
    return "Your team details are live. The public directory and dashboard now reflect the latest changes.";
  }

  if (message === "team-exists") {
    return "This prototype supports one managed team per account. Edit your current team here.";
  }

  return "";
}

export default async function ManageTeamPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const messageParam =
    typeof params.message === "string" ? params.message : undefined;
  const showLogoWarning =
    typeof params.logo === "string" && params.logo === "warning";
  const supabase = await createClient();

  if (!supabase) {
    return (
      <SetupNotice
        eyebrow="Team management unavailable"
        title="Supabase is not configured yet"
        description={getSupabaseSetupMessage()}
        ctaHref="/"
        ctaLabel="Return home"
      />
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select(
      "id, name, slug, logo_url, city, area, age_group, skill_level, team_format, preferred_match_day, pitch_status, travel_willingness, contact_email, bio",
    )
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false });

  const managedTeam = teams?.[0] ?? null;

  if (teamsError) {
    return (
      <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 text-amber-900">
        We couldn&apos;t load your team right now. Refresh the page and check
        Supabase if the problem continues.
      </section>
    );
  }

  if (!managedTeam) {
    redirect("/dashboard/team/new");
  }

  const [
    approvedCountResponse,
    pendingCountResponse,
  ] = await Promise.all([
    supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("team_id", managedTeam.id)
      .eq("status", "approved"),
    supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("team_id", managedTeam.id)
      .eq("status", "pending"),
  ]);

  const approvedMembers = approvedCountResponse.count ?? 0;
  const pendingMembers = pendingCountResponse.count ?? 0;
  const squadCount = getRegisteredSquadCount(approvedMembers);
  const placesLeft = getRemainingSquadPlaces(approvedMembers);
  const infoMessage = getPageMessage(messageParam);
  const hasLegacyExtraTeams = (teams?.length ?? 0) > 1;

  return (
    <div className="space-y-6">
      {infoMessage ? <FormAlert tone="info">{infoMessage}</FormAlert> : null}
      {showLogoWarning ? (
        <FormAlert tone="info">
          The team details were saved, but the crest upload did not complete.
          Check that <code>SUPABASE_SERVICE_ROLE_KEY</code> is configured and
          the <code>team-assets</code> bucket exists.
        </FormAlert>
      ) : null}

      {hasLegacyExtraTeams ? (
        <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          This account has more than one team from an earlier prototype state.
          The newest team is treated as your managed team and new team creation
          is now locked to one team per account.
        </section>
      ) : null}

      <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Team management
            </p>
            <div className="mt-4 flex items-center gap-4">
              <TeamBadge
                name={managedTeam.name}
                logoUrl={managedTeam.logo_url ?? undefined}
                size="lg"
              />
              <div>
                <h1 className="text-3xl font-semibold text-[var(--foreground)]">
                  {managedTeam.name}
                </h1>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {[managedTeam.city, managedTeam.area]
                    .filter(Boolean)
                    .join(" · ") || "Location pending"}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Keep one clear team identity in the prototype. This profile drives
              your public club listing, squad join requests, and live fixture
              posting context.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/matches/new"
              className={buttonStyles({ variant: "secondary" })}
            >
              <CalendarClock size={15} />
              Post request
            </Link>
            <Link href="/teams" className={buttonStyles({})}>
              <Users size={15} />
              View directory
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(22,37,30,0.05)]">
            <p className="text-sm font-medium text-[var(--muted)]">
              Registered squad
            </p>
            <p className="mt-4 text-4xl font-bold text-[var(--foreground)]">
              {squadCount}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              One manager plus approved players. This prototype caps squads at
              roughly 11 people.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(22,37,30,0.05)]">
            <p className="text-sm font-medium text-[var(--muted)]">
              Pending join requests
            </p>
            <p className="mt-4 text-4xl font-bold text-[var(--foreground)]">
              {pendingMembers}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              {placesLeft > 0
                ? `${placesLeft} squad place${placesLeft === 1 ? "" : "s"} still open.`
                : "Your prototype squad is full."}
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(22,37,30,0.05)]">
            <p className="text-sm font-medium text-[var(--muted)]">
              Match identity
            </p>
            <div className="mt-4 space-y-3 text-sm text-[var(--foreground)]">
              <p className="font-semibold">
                {managedTeam.team_format || "Format not added yet"}
              </p>
              <p className="text-[var(--muted)]">
                {managedTeam.pitch_status || "Pitch situation not added yet"}
              </p>
              <p className="text-[var(--muted)]">
                {managedTeam.travel_willingness || "Travel range not added yet"}
              </p>
            </div>
          </article>
        </div>

        <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            Edit team details
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Update the essentials that matter when another organiser is checking
            whether your team is the right fit.
          </p>
          <div className="mt-8">
            <TeamForm
              allowLogoUpload={hasSupabaseServiceRoleKey()}
              defaultContactEmail={user?.email ?? ""}
              initialValues={managedTeam}
              mode="update"
            />
          </div>
        </section>
      </section>
    </div>
  );
}
