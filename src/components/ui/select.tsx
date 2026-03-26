import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:bg-[var(--surface-alt)] aria-[invalid=true]:border-rose-400 aria-[invalid=true]:ring-rose-200",
        props.className,
      )}
    />
  );
}
