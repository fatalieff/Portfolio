"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export default function Magnetic({
  children,
  className,
  strength = 0.25,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * strength;
    const dy = (e.clientY - rect.top - rect.height / 2) * strength;
    el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: "transform 0.2s ease-out",
        willChange: "transform",
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
