"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "@/lib/anim";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return null;
}
