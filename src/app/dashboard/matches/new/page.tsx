import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MatchRequestForm } from "@/components/forms/match-request-form";
import { SetupNotice } from "@/components/site/setup-notice";
import { buttonStyles } from "@/components/ui/button";
import { getSupabaseSetupMessage } from "@/lib/supabase/env";

export default async function NewMatchRequestPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <SetupNotice
        eyebrow="Match posting disabled"
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
  const { data: managedTeam, error } = user
    ? await supabase
        .from("teams")
        .select("id, name, logo_url, city, area")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null, error: null };

  if (error) {
    return (
      <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-amber-900">
        <h1 className="text-3xl font-semibold">Couldn&apos;t load your teams</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7">
          Refresh the page and check the Supabase connection if this keeps
          happening.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
        Fixture board
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
        Post a fixture need
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        Make the football detail obvious so another organiser can decide fast.
      </p>

      {!managedTeam ? (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Create a team first
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Fixture posts must belong to your managed team. Set up the club
            profile first, then come back here to publish the slot.
            </p>
          <div className="mt-6">
            <Link href="/dashboard/team/new" className={buttonStyles({})}>
              Create team
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <MatchRequestForm team={managedTeam} />
        </div>
      )}
    </section>
  );
}
