"use client";

import type { ReactNode } from "react";
import type Lenis from "lenis";

type ScrollLinkProps = {
  target: string;
  className?: string;
  children: ReactNode;
};

export default function ScrollLink({
  target,
  className,
  children,
}: ScrollLinkProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const targetEl = document.getElementById(target);
        if (!targetEl) return;
        const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
        if (lenis) lenis.scrollTo(targetEl, { offset: -72 });
        else targetEl.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {children}
    </button>
  );
}
