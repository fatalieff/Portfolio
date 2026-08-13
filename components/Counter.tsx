"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";

type CounterProps = {
  to: number;
  className?: string;
};

export default function Counter({ to, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = String(to);
      return;
    }
    const state = { v: 0 };
    const tween = gsap.to(state, {
      v: to,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
      onUpdate: () => {
        el.textContent = String(Math.round(state.v));
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [to]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
