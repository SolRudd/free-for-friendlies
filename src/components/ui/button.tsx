import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]",
  secondary:
    "border-[color:var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--surface-alt)]",
  ghost:
    "border-transparent bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-alt)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-60",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  size,
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
