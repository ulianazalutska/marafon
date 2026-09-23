import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TOPIC_LEADS = process.env.TELEGRAM_TOPIC_LEADS;
const TOPIC_NEWSLETTER = process.env.TELEGRAM_TOPIC_NEWSLETTER;
const SHEETS_URL = process.env.GOOGLE_SHEETS_URL;
const SHEETS_SECRET = process.env.GOOGLE_SHEETS_SECRET;

// Falls back to unprotected (with a one-time warning) rather than throwing,
// so the form keeps working before UPSTASH_REDIS_REST_URL/TOKEN are set up —
// see .env.local.example for where to get them.
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, "10 m"),
        prefix: "armadero:contact",
      })
    : null;

if (!ratelimit) {
  console.warn(
    "[/api/contact] UPSTASH_REDIS_REST_URL/TOKEN not set — rate limiting is disabled."
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s()+-]{7,20}$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Telegram env vars are not configured");
    return NextResponse.json({ error: "Server is not configured" }, { status: 500 });
  }

  if (ratelimit) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot: bots fill every field, real users never see or touch this one.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const isNewsletter = body.type === "newsletter";
  let text: string;
  let sheetPayload: Record<string, string>;

  if (isNewsletter) {
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    text = `📧 <b>Нова підписка на розсилку</b>\n\nEmail: ${escapeHtml(email)}`;
    sheetPayload = { type: "newsletter", email };
  } else {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!PHONE_RE.test(phone)) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }

    text = [
      "🛋 <b>Нова заявка з сайту</b>",
      "",
      `Ім'я: ${escapeHtml(name)}`,
      `Телефон: ${escapeHtml(phone)}`,
      `Email: ${escapeHtml(email)}`,
      message ? `Повідомлення: ${escapeHtml(message)}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    sheetPayload = { type: "contact", name, phone, email, message };
  }

  const messageThreadId = isNewsletter ? TOPIC_NEWSLETTER : TOPIC_LEADS;

  const telegramPromise = fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
      ...(messageThreadId ? { message_thread_id: Number(messageThreadId) } : {}),
    }),
  });

  const sheetsPromise =
    SHEETS_URL && SHEETS_SECRET
      ? fetch(SHEETS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...sheetPayload, secret: SHEETS_SECRET }),
        })
      : Promise.resolve(null);

  const [telegramResponse, sheetsResponse] = await Promise.all([telegramPromise, sheetsPromise]);

  if (!telegramResponse.ok) {
    const errorBody = await telegramResponse.text();
    console.error("Telegram API error:", errorBody);
    return NextResponse.json({ error: "Failed to send message" }, { status: 502 });
  }

  if (sheetsResponse && !sheetsResponse.ok) {
    console.error("Google Sheets error:", await sheetsResponse.text());
  }

  return NextResponse.json({ ok: true });
}
