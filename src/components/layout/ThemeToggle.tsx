"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utilities";

export const THEME_STORAGE_KEY = "theme";

/** Runs in <head> before paint so the stored theme applies without a flash. */
export const themeScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

function currentTheme(): "light" | "dark" {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/**
 * ThemeToggle: switches between dark and light and remembers the choice in localStorage.
 * Both icons are rendered; CSS shows the relevant one, so server and client markup always match.
 */
export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable (private mode): the choice lasts for this page view */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className={cn(
        "theme-toggle inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-muted",
        "transition-colors duration-[var(--duration-fast)] hover:bg-[color-mix(in_srgb,var(--color-fg)_6%,transparent)] hover:text-fg",
        className,
      )}
    >
      <Sun aria-hidden className="theme-icon-sun size-[18px]" strokeWidth={1.75} />
      <Moon aria-hidden className="theme-icon-moon size-[18px]" strokeWidth={1.75} />
    </button>
  );
}
