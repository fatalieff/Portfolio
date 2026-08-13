import { NextResponse } from "next/server";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n-config";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

type ChatMessage = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(locale: Locale): string {
  const d = getDictionary(locale);

  const langRule =
    locale === "az"
      ? "Cavabları həmişə Azərbaycan dilində yaz."
      : locale === "ru"
        ? "Отвечай всегда на русском языке."
        : "Always reply in English.";

  return `${langRule}

You are a friendly portfolio assistant for Murad Fətəliyev (frontend developer). Answer questions about him, his work, projects, skills, and how to contact him. Use only the context below. Keep answers concise, warm, and natural. If asked something unrelated or not covered by the context, politely say you don't know.

CONTEXT:
- Name: ${d.hero.name}
- Role: ${d.hero.role}
- Location: ${d.contact.location}
- About: ${d.about.body}
- Skills: ${d.skills.groups.map((g) => `${g.label}: ${g.rows.map((r) => `${r.label} — ${r.value}`).join("; ")}`).join(" | ")}
- Focus: ${d.focus.pitch} ${d.focus.quote}
- Featured project: ${d.projects.featured.title} — ${d.projects.featured.description} (${d.projects.featured.href})
- Projects: ${d.projects.items.map((p) => `${p.title} — ${p.description} (${p.href})`).join(" | ")}
- FAQ: ${d.faq.items.map((i) => `${i.q} — ${i.a}`).join(" | ")}
- Email: ${d.contact.email}
- GitHub: https://github.com/fatalieff
- LinkedIn: https://www.linkedin.com/in/mourad-fatalief`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { messages?: ChatMessage[]; locale?: string }
    | null;

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const requestedLocale = body?.locale ?? "";
  const locale: Locale = isLocale(requestedLocale) ? requestedLocale : "en";

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured." },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt(locale) },
          ...messages.slice(-10),
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Groq API error: ${res.status} ${text}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return NextResponse.json({ error: "Empty response from Groq." }, { status: 502 });
    }

    return NextResponse.json({ content });
  } catch (err) {
    return NextResponse.json(
      { error: `Request failed: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 500 }
    );
  }
}
