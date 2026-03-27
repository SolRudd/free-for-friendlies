import { cn } from "@/lib/utils/cn";
import { getTeamInitials } from "@/lib/team";

type TeamBadgeProps = {
  name: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-12 w-12 text-sm",
  md: "h-16 w-16 text-base",
  lg: "h-20 w-20 text-lg",
};

export function TeamBadge({
  name,
  logoUrl,
  size = "md",
  className,
}: TeamBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(230,224,212,0.92))] font-semibold text-[var(--foreground)] shadow-[0_10px_30px_rgba(22,37,30,0.08)]",
        sizeClasses[size],
        className,
      )}
      aria-hidden="true"
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{getTeamInitials(name)}</span>
      )}
    </div>
  );
}
