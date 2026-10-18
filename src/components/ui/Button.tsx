import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn, isExternalUrl } from "@/lib/utilities";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none " +
  "rounded-[var(--radius-sm)] transition-[background-color,border-color,color,transform] " +
  "duration-[var(--duration-fast)] ease-[var(--ease-out)] active:translate-y-px " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-accent-solid text-white hover:bg-[color-mix(in_srgb,var(--color-accent-solid)_86%,white)]",
  secondary:
    "border border-line-strong text-fg hover:border-[color-mix(in_srgb,var(--color-fg)_45%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-fg)_4%,transparent)]",
  ghost: "text-fg hover:bg-[color-mix(in_srgb,var(--color-fg)_6%,transparent)]",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[0.9375rem]",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonLinkProps extends Omit<ComponentPropsWithoutRef<"a">, "href"> {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

/** A link styled as a button. External links open safely in a new tab. */
export function ButtonLink({ href, variant, size, className, children, ...rest }: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, className });
  if (isExternalUrl(href) || href.startsWith("mailto:")) {
    const external = isExternalUrl(href);
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant, size, className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...rest} />;
}
