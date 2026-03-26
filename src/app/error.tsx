"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16 sm:px-6">
          <div className="w-full rounded-[2rem] border border-[color:var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(22,37,30,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Something broke
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              The page could not be loaded.
            </h1>
            <p className="mt-3 text-[var(--muted)]">
              {error.message || "Try refreshing the page or retry the action."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
