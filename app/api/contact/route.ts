import { NextResponse } from "next/server";

const RESEND_URL = "https://api.resend.com/emails";
const TO_EMAIL = "mouradfatalieff@gmail.com";

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactBody | null;

  const name = body?.name?.trim() ?? "";
  const email = body?.email?.trim() ?? "";
  const message = body?.message?.trim() ?? "";

  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Invalid name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }
  if (!message || message.length < 10 || message.length > 5000) {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "your_resend_api_key_here") {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured." },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: [TO_EMAIL],
        reply_to: [email],
        subject: `[Portfolio] ${name} — portfolio contact form`,
        text: `Ad: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Resend API error: ${res.status} ${text}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: `Request failed: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 500 }
    );
  }
}
