"use client";

import type { CSSProperties } from "react";

type MarqueeProps = {
  items: string[];
  reverse?: boolean;
  duration?: number;
  className?: string;
};

export default function Marquee({
  items,
  reverse = false,
  duration = 32,
  className,
}: MarqueeProps) {
  const row = (ariaHidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {items.map((item) => (
        <span
          key={item}
          className="mx-7 flex items-center gap-14 whitespace-nowrap font-heading text-2xl font-semibold tracking-tight text-foreground/60 sm:text-3xl"
        >
          {item}
          <span className="text-[13px] text-accent/70">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`marquee ${reverse ? "marquee-reverse" : ""} ${className ?? ""}`}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
