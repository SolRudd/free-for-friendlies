import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "inverse"
  | "inverseGhost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-[var(--accent)] text-white shadow-[0_14px_34px_rgba(15,132,88,0.22)] hover:bg-[var(--accent-strong)] hover:shadow-[0_16px_38px_rgba(15,132,88,0.28)]",
  secondary:
    "border-[color:rgba(17,28,21,0.14)] bg-[var(--surface-alt)] text-[var(--foreground)] shadow-[0_10px_24px_rgba(22,37,30,0.06)] hover:border-[color:rgba(17,28,21,0.2)] hover:bg-white",
  ghost:
    "border-[color:rgba(17,28,21,0.12)] bg-transparent text-[var(--foreground)] hover:border-[color:rgba(17,28,21,0.18)] hover:bg-[color:rgba(255,255,255,0.72)]",
  inverse:
    "border-transparent bg-white text-[color:var(--pitch-dark)] shadow-[0_14px_34px_rgba(0,0,0,0.22)] hover:bg-[#f4efe5] hover:shadow-[0_16px_38px_rgba(0,0,0,0.28)]",
  inverseGhost:
    "border-white/14 bg-white/6 text-white shadow-none hover:border-white/24 hover:bg-white/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-4.5 py-2.5 text-sm",
  lg: "px-5.5 py-3 text-base",
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
    "inline-flex items-center justify-center gap-2 rounded-full border font-semibold tracking-[0.01em] transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none",
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
