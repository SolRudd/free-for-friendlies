"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

function getNavItems(hasTeam: boolean) {
  return [
    { href: "/dashboard", label: "Overview" },
    {
      href: hasTeam ? "/dashboard/team" : "/dashboard/team/new",
      label: hasTeam ? "Manage team" : "Create team",
    },
    { href: "/dashboard/matches/new", label: "Post request" },
    { href: "/teams", label: "Public teams" },
    { href: "/matches", label: "Public matches" },
  ];
}

export function DashboardNav({ hasTeam }: { hasTeam: boolean }) {
  const pathname = usePathname();
  const navItems = getNavItems(hasTeam);

  return (
    <nav className="space-y-2" aria-label="Dashboard navigation">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-2xl px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
              isActive
                ? "bg-[var(--accent-soft)] text-[var(--foreground)]"
                : "text-[var(--muted)] hover:bg-white hover:text-[var(--foreground)]",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
