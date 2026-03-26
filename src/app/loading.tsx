export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-56 rounded-full bg-[var(--surface-alt)]" />
        <div className="grid gap-5 md:grid-cols-3">
          <div className="h-48 rounded-[2rem] bg-[var(--surface-alt)]" />
          <div className="h-48 rounded-[2rem] bg-[var(--surface-alt)]" />
          <div className="h-48 rounded-[2rem] bg-[var(--surface-alt)]" />
        </div>
        <div className="h-72 rounded-[2rem] bg-[var(--surface-alt)]" />
      </div>
    </main>
  );
}
