import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

type SetupNoticeProps = {
  eyebrow?: string;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function SetupNotice({
  eyebrow = "Configuration required",
  title,
  description,
  ctaHref = "/",
  ctaLabel = "Back to home",
}: SetupNoticeProps) {
  return (
    <section className="rounded-[2rem] border border-amber-200 bg-[linear-gradient(180deg,rgba(255,251,235,1),rgba(255,247,237,0.96))] p-8 shadow-[0_24px_60px_rgba(120,53,15,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        {description}
      </p>
      <div className="mt-6">
        <Link href={ctaHref} className={buttonStyles({ variant: "secondary" })}>
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
