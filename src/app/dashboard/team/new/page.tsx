import { TeamForm } from "@/components/forms/team-form";
import { SetupNotice } from "@/components/site/setup-notice";
import { getSupabaseSetupMessage } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export default async function NewTeamPage() {
  const supabase = await createClient();
  const user = supabase
    ? (
        await supabase.auth.getUser()
      ).data.user
    : null;

  return (
    <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
        Team setup
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
        Create a team profile
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        This is the main public object in the MVP. Keep it accurate and clear so
        another organiser can tell quickly whether your side is a fit.
      </p>
      <div className="mt-8">
        {supabase ? (
          <TeamForm defaultContactEmail={user?.email ?? ""} />
        ) : (
          <SetupNotice
            eyebrow="Team setup disabled"
            title="Supabase is not configured yet"
            description={getSupabaseSetupMessage()}
            ctaHref="/"
            ctaLabel="Return home"
          />
        )}
      </div>
    </section>
  );
}
