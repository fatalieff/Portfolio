"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useLocale } from "@/components/LocaleProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

type NavLink = { id: string; label: string };

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function MobileMenu({ links }: { links: NavLink[] }) {
  const { dict, locale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const isSubPage =
    pathname.includes("/blog") || pathname.includes("/projects/");

  const menuLinks: NavLink[] = [...links, { id: "blog", label: dict.nav.blog }];

  function openMenu() {
    setMounted(true);
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
  }

  function goTo(id: string) {
    setOpen(false);
    if (id === "blog") {
      window.setTimeout(() => router.push(`/${locale}/blog`), 300);
      return;
    }
    window.setTimeout(() => {
      if (isSubPage) {
        router.push(`/${locale}#${id}`);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }, 320);
  }

  useEffect(() => {
    if (!mounted || !open) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    document.body.style.overflow = "hidden";
    const items = overlay.querySelectorAll("[data-menu-item]");
    tlRef.current?.kill();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);

    if (prefersReducedMotion()) {
      gsap.set(overlay, {
        autoAlpha: 1,
        pointerEvents: "auto",
        clipPath: "inset(0% 0 0 0)",
      });
      gsap.set(items, { y: 0, opacity: 1, filter: "blur(0px)" });
      return () => window.removeEventListener("keydown", onKey);
    }

    tlRef.current = gsap
      .timeline()
      .set(overlay, { autoAlpha: 1, pointerEvents: "auto" })
      .fromTo(
        overlay.querySelector(".menu-bg"),
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 0.7, ease: "power4.inOut" }
      )
      .fromTo(
        items,
        { y: 28, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.06,
        },
        "-=0.4"
      );

    return () => window.removeEventListener("keydown", onKey);
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted || open) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    document.body.style.overflow = "";
    tlRef.current?.kill();

    if (prefersReducedMotion()) {
      gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
      return;
    }

    tlRef.current = gsap
      .timeline()
      .to(overlay.querySelectorAll("[data-menu-item]"), {
        y: 14,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.22,
        ease: "power2.in",
        stagger: 0.03,
      })
      .to(
        overlay.querySelector(".menu-bg"),
        { clipPath: "inset(100% 0 0 0)", duration: 0.5, ease: "power3.in" },
        "-=0.12"
      )
      .set(overlay, { autoAlpha: 0, pointerEvents: "none" });
  }, [open, mounted]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label={open ? dict.nav.menuClose : dict.nav.menuOpen}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={open ? closeMenu : openMenu}
        className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-[5px] rounded-full border border-black/[0.07] bg-white/60 text-foreground backdrop-blur transition-colors hover:bg-black/[0.05] md:hidden"
      >
        <span
          className={`h-0.5 w-[18px] rounded-full bg-current transition-transform duration-300 ease-out ${
            open ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-[18px] rounded-full bg-current transition-all duration-300 ease-out ${
            open ? "scale-x-0 opacity-0" : ""
          }`}
        />
        <span
          className={`h-0.5 w-[18px] rounded-full bg-current transition-transform duration-300 ease-out ${
            open ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>

      {typeof document !== "undefined"
        ? createPortal(
            <div
              id="mobile-menu"
              ref={overlayRef}
              role="dialog"
              aria-modal="true"
              aria-hidden={!open}
              style={{ opacity: 0, visibility: "hidden" }}
              className="fixed inset-0 z-40 md:hidden"
            >
              <div className="menu-bg absolute inset-0 bg-background/95 backdrop-blur-2xl" />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/20 blur-[110px]"
              />

              <div className="relative flex h-full flex-col px-7 pb-10 pt-24">
                <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
                  <ul className="space-y-1.5">
                    {menuLinks.map((link, index) => (
                      <li key={link.id} data-menu-item>
                        <button
                          type="button"
                          onClick={() => goTo(link.id)}
                          className="group flex w-full items-center justify-between border-b border-black/[0.06] py-4 text-left transition-colors"
                        >
                          <span className="flex items-baseline gap-4">
                            <span className="font-mono text-[11px] text-muted-foreground/70">
                              0{index + 1}
                            </span>
                            <span className="font-heading text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-3xl">
                              {link.label}
                            </span>
                          </span>
                          <ArrowUpRight className="size-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div
                    data-menu-item
                    className="mt-auto flex items-center justify-between pt-10"
                  >
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
