import { TeamForm } from "@/components/forms/team-form";

export default function NewTeamPage() {
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
        <TeamForm />
      </div>
    </section>
  );
}
