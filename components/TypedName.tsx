"use client";

import { useEffect, useState } from "react";

const TYPE_DELAY = 85;
const DELETE_DELAY = 45;
const PAUSE_FULL = 1600;
const PAUSE_EMPTY = 500;

type Phase = "typing" | "deleting";

export default function TypedName({
  text,
  suffix = ".",
}: {
  text: string;
  suffix?: string;
}) {
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    let t: number;
    if (phase === "typing") {
      if (typed.length < text.length) {
        t = window.setTimeout(
          () => setTyped(text.slice(0, typed.length + 1)),
          TYPE_DELAY
        );
      } else {
        t = window.setTimeout(() => setPhase("deleting"), PAUSE_FULL);
      }
    } else {
      if (typed.length > 0) {
        t = window.setTimeout(
          () => setTyped(typed.slice(0, -1)),
          DELETE_DELAY
        );
      } else {
        t = window.setTimeout(() => setPhase("typing"), PAUSE_EMPTY);
      }
    }
    return () => window.clearTimeout(t);
  }, [typed, phase, text]);

  return (
    <span className="whitespace-pre">
      {typed}
      {typed.length === text.length && <span className="text-accent">{suffix}</span>}
      <span className="caret-blink text-accent">|</span>
    </span>
  );
}