"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "theme";
const LIGHT_BG = "#f7f8fb";
const DARK_BG = "#0b0e17";
const WIPE_MS = 520;

type Anim = { color: string };

function initialTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">(initialTheme);
  const [anim, setAnim] = useState<Anim | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const next = theme === "dark" ? "light" : "dark";

  function toggle() {
    if (anim) return;

    if (prefersReducedMotion()) {
      setTheme(next);
      return;
    }

    setAnim({ color: next === "dark" ? DARK_BG : LIGHT_BG });
    document.documentElement.classList.add("theme-switching");
    setTheme(next);
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-switching");
      setAnim(null);
    }, WIPE_MS);
  }

  const curtain =
    typeof document !== "undefined" ? (
      createPortal(
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            backgroundColor: anim?.color ?? "transparent",
            clipPath:
              anim === null ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
            transition: anim ? `clip-path ${WIPE_MS}ms ease-in-out` : "none",
          }}
        />,
        document.body
      )
    ) : null;

  return (
    <>
      <button
        type="button"
        aria-label={`Switch to ${next} mode`}
        onClick={toggle}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/[0.07] bg-white/60 text-muted-foreground transition-colors hover:bg-black/[0.05] hover:text-foreground"
      >
        {theme === "dark" ? (
          <Sun className="h-3.5 w-3.5" />
        ) : (
          <Moon className="h-3.5 w-3.5" />
        )}
      </button>

      {curtain}
    </>
  );
}
