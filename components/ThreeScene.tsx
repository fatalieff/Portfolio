"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const SceneCanvas = dynamic(() => import("@/components/three/SceneCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function ThreeScene({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      progressRef.current = p * 2 - 1;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <SceneCanvas progressRef={progressRef} />
    </div>
  );
}