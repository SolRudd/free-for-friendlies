import { redirect } from "next/navigation";
import { TeamForm } from "@/components/forms/team-form";
import { SetupNotice } from "@/components/site/setup-notice";
import {
  getSupabaseSetupMessage,
  hasSupabaseServiceRoleKey,
} from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export default async function NewTeamPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <SetupNotice
        eyebrow="Team setup disabled"
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

  const { data: existingTeam } = await supabase
    .from("teams")
    .select("id")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingTeam) {
    redirect("/dashboard/team?message=team-exists");
  }

  return (
    <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
        Team setup
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
        Create your club profile
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        Each account manages one team in this prototype. Set it up properly so
        your squad, public club card, and fixture posts all stay aligned.
      </p>
      <div className="mt-8">
        <TeamForm
          allowLogoUpload={hasSupabaseServiceRoleKey()}
          defaultContactEmail={user?.email ?? ""}
        />
      </div>
    </section>
  );
}
