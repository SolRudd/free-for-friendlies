import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-[color:rgba(17,28,21,0.14)] bg-[color:rgba(255,255,255,0.92)] px-4 py-3 text-sm text-[var(--foreground)] shadow-[0_8px_24px_rgba(22,37,30,0.04)] transition placeholder:text-[color:rgba(79,95,86,0.78)] hover:border-[color:rgba(17,28,21,0.22)] focus-visible:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:rgba(15,132,88,0.16)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:border-[color:rgba(17,28,21,0.08)] disabled:bg-[color:rgba(231,223,208,0.65)] disabled:text-[color:rgba(17,28,21,0.48)] aria-[invalid=true]:border-rose-400 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-rose-200",
        props.className,
      )}
    />
  );
}
