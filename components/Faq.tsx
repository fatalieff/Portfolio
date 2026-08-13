"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";

export default function Faq() {
  const { dict } = useLocale();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto mt-12 max-w-3xl space-y-3">
      {dict.faq.items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div
            key={item.q}
            className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white/70 backdrop-blur transition-colors"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="min-w-0 text-[15px] font-semibold text-foreground [overflow-wrap:anywhere]">
                {item.q}
              </span>
              <ChevronDown
                className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div className={isOpen ? "block" : "hidden"}>
              <p className="px-6 pb-6 text-[14px] leading-[1.8] text-foreground/70 [overflow-wrap:anywhere]">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
