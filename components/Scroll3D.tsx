"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
  type CSSProperties,
} from "react";

type Scroll3DProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Max rotation degrees driven by scroll position (default 10) */
  maxTilt?: number;
  /** Extra mouse-driven tilt on hover (default 0 = off) */
  hoverTilt?: number;
  /** translateZ in px driven by scroll (default 40) */
  depth?: number;
};

let prefersReducedMotion = false;
if (typeof window !== "undefined") {
  prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
}

export default function Scroll3D({
  children,
  className,
  style,
  maxTilt = 10,
  hoverTilt = 0,
  depth = 40,
}: Scroll3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const tiltRef = useRef({ maxTilt, hoverTilt, depth });

  useEffect(() => {
    tiltRef.current = { maxTilt, hoverTilt, depth };
  }, [maxTilt, hoverTilt, depth]);

  const applyTransform = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const p = progressRef.current;
    const m = mouseRef.current;
    const { maxTilt, hoverTilt, depth } = tiltRef.current;
    const ry = p * maxTilt + (m.active ? m.x * hoverTilt : 0);
    const rx = -p * maxTilt * 0.4 + (m.active ? -m.y * hoverTilt : 0);
    el.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(${(
      p * depth
    ).toFixed(1)}px)`;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top > vh || rect.bottom < 0) {
        el.style.transform = "";
        return;
      }
      const center = rect.top + rect.height / 2;
      progressRef.current = Math.max(-1, Math.min(1, 0.5 - center / vh));
      applyTransform();
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
  }, [applyTransform]);

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!hoverTilt) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
      active: true,
    };
    applyTransform();
  }

  function onMouseLeave() {
    if (!hoverTilt) return;
    mouseRef.current.active = false;
    applyTransform();
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transformStyle: "preserve-3d",
        willChange: "transform",
        transition: prefersReducedMotion ? "none" : "transform 0.15s ease-out",
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}