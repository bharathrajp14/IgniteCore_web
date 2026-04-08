import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { isAllowedRequestOrigin } from "@/lib/requestOrigin";

const REQUEST_LIMIT_WINDOW_MS = 60_000;
const REQUEST_LIMIT_MAX = 25;
const requestLog = new Map<string, number[]>();

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const schema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
  sessionId: z.string().min(3).max(128).nullable().optional(),
});

const SYSTEM_PROMPT = [
  "You are IgniteCore Assistant.",
  "Goal: help visitors with practical Q&A about services, pricing direction, timeline, and next steps.",
  "Tone: friendly, clear, practical, and non-robotic.",
  "Prefer short answers (2-5 lines) with one concrete recommendation.",
  "If user shares business type and challenge, suggest a best first step and an optional next step.",
  "Only mention services available on the site: AI automation, business websites, web apps, lead capture, WhatsApp automation, dashboards, and support.",
  "When useful, ask one focused follow-up question.",
].join(" ");

const OPENROUTER_DEFAULT_MODEL = "openrouter/auto";

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - REQUEST_LIMIT_WINDOW_MS;
  const current = requestLog.get(ip) ?? [];
  const next = current.filter((item) => item >= windowStart);

  if (next.length >= REQUEST_LIMIT_MAX) {
    requestLog.set(ip, next);
    return true;
  }

  next.push(now);
  requestLog.set(ip, next);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedRequestOrigin(req)) {
      return NextResponse.json({ error: "Request blocked by security policy." }, { status: 403 });
    }

    const ipKey = getClientIp(req);
    if (isRateLimited(ipKey)) {
      return NextResponse.json({ error: "Too many requests. Please retry in a minute." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid chat payload" }, { status: 400 });
    }

    const sessionId = (parsed.data.sessionId && parsed.data.sessionId.trim()) || crypto.randomUUID();
    const lastUserMessage = [...parsed.data.messages].reverse().find((item) => item.role === "user");

    if (!lastUserMessage) {
      return NextResponse.json({ error: "User message required" }, { status: 400 });
    }

    let reply = "";
    let provider = "custom";
    let modelUsed = "";

    const apiKey = process.env.AI_PROVIDER_API_KEY;
    const baseUrl = process.env.AI_PROVIDER_BASE_URL ?? "https://api.openai.com/v1";
    const configuredModel = process.env.AI_MODEL?.trim();
    const model = !configuredModel || configuredModel === "openrouter/free"
      ? OPENROUTER_DEFAULT_MODEL
      : configuredModel;

    if (!apiKey) {
      return NextResponse.json({ error: "Chatbot AI provider is not configured." }, { status: 503 });
    }

    const refererHeader =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_DOMAIN ||
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "ignitecoreai.tech"}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": refererHeader,
          "X-Title": "IgniteCore Chatbot",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          temperature: 0.5,
          max_tokens: 350,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...parsed.data.messages.map((item) => ({ role: item.role, content: item.content })),
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI provider error:", response.status, errorText);
        return NextResponse.json({ error: "Chatbot AI provider request failed." }, { status: 502 });
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) {
        return NextResponse.json({ error: "Chatbot AI returned an empty response." }, { status: 502 });
      }

      reply = content;
      modelUsed = model;
    } catch (error) {
      console.error("AI provider request failed:", error);
      return NextResponse.json({ error: "Chatbot AI is temporarily unavailable." }, { status: 503 });
    } finally {
      clearTimeout(timeoutId);
    }

    const supabase = getSupabaseServerClient();
    if (supabase) {
      const rows = [
        {
          session_id: sessionId,
          role: "user",
          content: lastUserMessage.content,
          provider,
          model: modelUsed,
        },
        {
          session_id: sessionId,
          role: "assistant",
          content: reply,
          provider,
          model: modelUsed,
        },
      ];

      const { error } = await supabase.from("chat_messages").insert(rows);
      if (error) {
        console.error("Supabase chat_messages insert error:", error);
      }
    }

    return NextResponse.json({
      success: true,
      reply,
      sessionId,
      provider,
      model: modelUsed,
    });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({ error: "Unable to process chat request" }, { status: 500 });
  }
}
