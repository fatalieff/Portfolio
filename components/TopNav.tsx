"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { usePathname, useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";

export default function TopNav() {
  const { dict, locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { id: "about", label: dict.nav.about },
    { id: "projects", label: dict.nav.projects },
    { id: "skills", label: dict.nav.skills },
    { id: "focus", label: dict.nav.focus },
    { id: "faq", label: dict.nav.faq },
    { id: "contact", label: dict.nav.contact },
  ];

  const isBlog = pathname.includes("/blog");
  const isProjectDetail = pathname.includes("/projects/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    links.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-black/[0.06] bg-background/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <button
          type="button"
          onClick={() =>
            isBlog || isProjectDetail
              ? router.push(`/${locale}`)
              : document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })
          }
          className="shrink-0 font-heading text-lg font-semibold tracking-tight text-foreground"
        >
          {dict.hero.name}
          <span className="text-accent">.</span>
        </button>
        <div className="flex items-center gap-3">
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 overflow-x-auto py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex"
          >
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                aria-current={active === link.id}
                onClick={() =>
                  isBlog || isProjectDetail
                    ? router.push(`/${locale}#${link.id}`)
                    : document
                        .getElementById(link.id)
                        ?.scrollIntoView({ behavior: "smooth" })
                }
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  active === link.id
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-black/[0.04] hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              aria-current={isBlog}
              onClick={() => router.push(`/${locale}/blog`)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                isBlog
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-black/[0.04] hover:text-foreground"
              }`}
            >
              {dict.nav.blog}
            </button>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <MobileMenu links={links} />
        </div>
      </div>
    </header>
  );
}
