"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Variant = "up" | "fade" | "left";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
};

const hiddenStyles: Record<Variant, React.CSSProperties> = {
  up: { opacity: 0, filter: "blur(8px)", transform: "translateY(12px)" },
  fade: { opacity: 0, filter: "blur(12px)" },
  left: { opacity: 0, transform: "translateX(-12px)" },
};

export default function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...(visible
          ? { opacity: 1, filter: "blur(0px)", transform: "translate(0)" }
          : hiddenStyles[variant]),
        transition: `opacity 0.7s ease ${delay}ms, filter 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
