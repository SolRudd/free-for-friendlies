import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
          <h1 className="text-3xl font-semibold text-[var(--foreground)]">
            Log in
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Access your teams, keep match requests current, and manage the MVP
            workflow from one dashboard.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </section>

        <section className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-8 shadow-[0_24px_60px_rgba(22,37,30,0.05)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            What happens next
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-[var(--foreground)]">
            Back into your working flow.
          </h2>
          <div className="mt-8 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <p>Review your existing teams and keep their details accurate.</p>
            <p>Post a new request when you need to fill a fixture date.</p>
            <p>Browse the live teams and matches boards to check positioning.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
