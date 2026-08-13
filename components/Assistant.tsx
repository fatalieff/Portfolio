"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";

type Message = { role: "user" | "assistant"; content: string };

export default function Assistant() {
  const { locale, dict } = useLocale();
  const suggestions = dict.assistant.suggestions;
  const replies = dict.assistant.replies;

  const [value, setValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const canSend = value.trim().length > 0 && !thinking;

  function getReply(question: string): string {
    const q = question.toLowerCase();
    if (q.includes("who") || q.includes("about") || q.includes("fatali") || q.includes("fətəliyev") || q.includes("murad") || q.includes("kimdir") || q.includes("кто")) {
      return replies.who;
    }
    if (q.includes("project") || q.includes("portfolio") || q.includes("layih") || q.includes("проект")) {
      return replies.projects;
    }
    if (q.includes("stack") || q.includes("skill") || q.includes("tool") || q.includes("texnolog") || q.includes("стек")) {
      return replies.stack;
    }
    if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("əlaq") || q.includes("контакт")) {
      return replies.contact;
    }
    return replies.default;
  }

  async function askAI(question: string): Promise<string> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, { role: "user", content: question }],
        locale,
      }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    if (typeof data.content !== "string") throw new Error("No content in response");
    return data.content;
  }

  async function submit(question?: string) {
    const text = (question ?? value).trim();
    if (!text || thinking) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setValue("");
    setThinking(true);
    try {
      const reply = await askAI(text);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: getReply(text) }]);
    } finally {
      setThinking(false);
      inputRef.current?.focus();
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit();
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  return (
    <div className="mt-10 w-full max-w-2xl">
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 rounded-2xl border border-black/[0.08] bg-white/80 p-2 pl-3.5 shadow-[0_24px_60px_-30px_rgb(15,23,42,0.3)] backdrop-blur-xl transition-all focus-within:border-accent/40 focus-within:shadow-[0_24px_60px_-30px_rgb(79,70,229,0.35)] sm:pl-4"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Sparkles className="size-4" />
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={dict.assistant.placeholder}
          aria-label={dict.assistant.placeholder}
          className="min-h-[46px] flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground/60"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-all hover:opacity-85 disabled:pointer-events-none disabled:opacity-25"
        >
          <ArrowUp className="size-4" />
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            disabled={thinking}
            onClick={() => submit(s)}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.07] bg-white/60 px-3.5 py-1.5 text-[12.5px] font-medium text-muted-foreground backdrop-blur transition-colors hover:border-accent/30 hover:bg-white hover:text-foreground disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        className="max-h-[50vh] overflow-y-auto pb-16 text-left"
      >
        {messages.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className="mt-8 text-[13px] font-medium text-foreground/90 [overflow-wrap:anywhere]">
              <span className="mr-2 rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                {dict.assistant.you}
              </span>
              {m.content}
            </p>
          ) : (
            <div
              key={i}
              className="mt-4 rounded-2xl border border-black/[0.05] bg-white/70 p-5 backdrop-blur"
            >
              <p className="text-[14px] leading-relaxed text-foreground/80 [overflow-wrap:anywhere]">
                {m.content}
              </p>
            </div>
          )
        )}
        {thinking && (
          <div className="mt-4 flex w-fit items-center gap-1.5 rounded-2xl border border-black/[0.05] bg-white/70 px-5 py-4 backdrop-blur">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}
      </div>
    </div>
  );
}
