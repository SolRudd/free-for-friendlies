import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type BrandLogoProps = {
  href?: string;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  href = "/",
  className,
  priority = false,
}: BrandLogoProps) {
  const image = (
    <Image
      src="/brand/logo.png"
      alt="Free For Friendlies"
      width={1000}
      height={275}
      priority={priority}
      className={cn("h-auto w-[230px] sm:w-[280px]", className)}
    />
  );

  return (
    <Link
      href={href}
      className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
    >
      {image}
    </Link>
  );
}
