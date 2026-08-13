"use client";

import { useEffect, useState } from "react";

type Phase = "cover" | "exit" | "done";

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("cover");

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("exit"), 900);
    const t2 = window.setTimeout(() => setPhase("done"), 1900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-transform duration-700 ease-in-out ${
        phase === "exit" ? "-translate-y-full" : ""
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <span className="font-heading text-4xl font-bold tracking-tight text-foreground">
          MF<span className="text-accent">.</span>
        </span>
        <div className="h-0.5 w-28 overflow-hidden rounded-full bg-black/[0.08]">
          <div
            className="h-full w-full origin-left bg-gradient-to-r from-accent via-[#8b5cf6] to-[#22d3ee]"
            style={{ animation: "loadbar 0.9s ease-out forwards" }}
          />
        </div>
      </div>
    </div>
  );
}
