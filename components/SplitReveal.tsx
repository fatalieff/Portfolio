"use client";

import { Fragment, useEffect, useRef, useState } from "react";

type SplitRevealProps = {
  text: string;
  className?: string;
};

export default function SplitReveal({ text, className }: SplitRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            className="inline-block"
            style={{
              opacity: visible ? 1 : 0,
              filter: visible ? "blur(0px)" : "blur(6px)",
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.7s ease ${0.08 * i + 0.05}s, filter 0.7s ease ${
                0.08 * i + 0.05
              }s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${
                0.08 * i + 0.05
              }s`,
            }}
          >
            {word}
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}
