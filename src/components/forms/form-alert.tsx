import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type FormAlertProps = {
  children: ReactNode;
  tone?: "error" | "info";
};

export function FormAlert({ children, tone = "error" }: FormAlertProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        tone === "error"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-800",
      )}
    >
      {children}
    </div>
  );
}
