"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
};

export default function SpotlightCard({
  children,
  className,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group/spot relative rounded-3xl ${className ?? ""}`}
    >
      <div className="relative z-0">{children}</div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(79 70 229 / 0.12), transparent 65%)",
        }}
      />
    </div>
  );
}
