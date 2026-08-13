"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";

type Status = "idle" | "sending" | "success" | "error" | "invalid";

export default function ContactForm() {
  const { dict } = useLocale();
  const f = dict.contact.form;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("contact failed");
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-black/[0.08] bg-white/70 px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/60 backdrop-blur transition-colors focus:border-accent/40 focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 rounded-3xl border border-black/[0.06] bg-white/70 p-7 text-left shadow-[0_8px_30px_rgb(15,23,42,0.04)] backdrop-blur sm:p-9"
    >
      <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
        {f.title}
      </h3>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
            {f.name}
          </span>
          <input
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={f.name}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
            {f.email}
          </span>
          <input
            type="email"
            required
            maxLength={200}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
          {f.message}
        </span>
        <textarea
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={f.message}
          className={`${inputClass} resize-y`}
        />
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="size-4" />
          {status === "sending" ? f.sending : f.submit}
        </button>
        {status === "success" && (
          <p className="text-[13px] font-medium text-emerald-600">{f.success}</p>
        )}
        {status === "error" && (
          <p className="text-[13px] font-medium text-red-500">{f.error}</p>
        )}
        {status === "invalid" && (
          <p className="text-[13px] font-medium text-red-500">{f.invalidEmail}</p>
        )}
      </div>
    </form>
  );
}
