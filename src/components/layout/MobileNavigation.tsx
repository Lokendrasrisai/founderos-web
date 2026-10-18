"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import type { NavItem } from "@/config/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { isActive } from "@/components/layout/NavLinks";
import { cn } from "@/lib/utilities";

/**
 * MobileNavigation: a native modal <dialog>. The browser provides focus containment,
 * Escape-to-close, and an inert page behind it.
 */
export function MobileNavigation({ items, action }: { items: NavItem[]; action: NavItem }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close on navigation.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  function open() {
    dialogRef.current?.showModal();
  }
  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-controls="mobile-nav"
        className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-fg hover:bg-[color-mix(in_srgb,var(--color-fg)_6%,transparent)]"
      >
        <Menu aria-hidden className="size-5" strokeWidth={1.75} />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        id="mobile-nav"
        ref={dialogRef}
        aria-label="Site menu"
        className="mobile-nav"
        onClick={(e) => {
          // Click on the backdrop (the dialog element itself) closes the menu.
          if (e.target === dialogRef.current) close();
        }}
        onClose={() => triggerRef.current?.focus()}
      >
        <div className="mobile-nav-panel">
          <div className="flex h-[var(--header-height)] items-center justify-between">
            <span className="type-label">Menu</span>
            <button
              type="button"
              onClick={close}
              autoFocus
              className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-fg hover:bg-[color-mix(in_srgb,var(--color-fg)_6%,transparent)]"
            >
              <X aria-hidden className="size-5" strokeWidth={1.75} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Primary" className="mt-4">
            <ul>
              {[{ label: "Home", href: "/" }, ...items].map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-14 items-center justify-between text-[1.375rem] tracking-[-0.02em]",
                        active ? "text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      {item.label}
                      {active && <span aria-hidden className="size-1.5 rounded-full bg-accent" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-8 flex items-center justify-between gap-4">
            <Link href={action.href} onClick={close} className={buttonClasses({ size: "lg" })}>
              {action.label}
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </dialog>
    </>
  );
}
