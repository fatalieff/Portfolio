"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n-config";
import { useLocale } from "@/components/LocaleProvider";

const labels: Record<Locale, string> = { az: "AZ", en: "EN", ru: "RU" };

function writeLocaleCookie(next: Locale) {
  document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
}

export default function LanguageSwitcher() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    writeLocaleCookie(next);
    const segments = pathname.split("/");
    segments[1] = next;
    router.replace(segments.join("/") || `/${next}`, { scroll: false });
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex shrink-0 items-center gap-0.5 rounded-full border border-black/[0.07] bg-white/60 p-0.5 backdrop-blur"
    >
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={locale === code}
          onClick={() => switchTo(code)}
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
            locale === code
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-black/[0.05] hover:text-foreground"
          }`}
        >
          {labels[code]}
        </button>
      ))}
    </div>
  );
}
