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
  "Goal: help visitors with short client-facing Q&A about services, pricing direction, timeline, and next steps.",
  "Tone: concise, practical, professional, and helpful.",
  "Only claim what is available on the website: AI automation, business websites, web apps, lead capture, WhatsApp automation, dashboards, and support.",
  "Do NOT generate full website code, architecture, exploit details, scripts, or implementation plans for developers.",
  "If a user asks for full website building or code, refuse politely and guide them to book a consultation.",
  "When users ask for next step, suggest booking an audit or using contact page.",
].join(" ");

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

function isImplementationRequest(input: string) {
  const text = input.toLowerCase();
  const blockedPatterns = [
    "build full website",
    "make full website",
    "write code",
    "generate code",
    "source code",
    "create nextjs app",
    "deploy script",
    "sql injection",
    "exploit",
    "xss",
  ];

  return blockedPatterns.some((pattern) => text.includes(pattern));
}

function fallbackReply(userMessage: string) {
  const text = userMessage.toLowerCase();

  if (text.includes("price") || text.includes("cost") || text.includes("pricing")) {
    return "Pricing depends on scope, timeline, and how much automation you need first. If you share your current setup on the Contact page, IgniteCore can provide a clear scope and practical budget direction.";
  }

  if (text.includes("service") || text.includes("what do you do") || text.includes("offer")) {
    return "IgniteCore helps with AI automation, business websites, web app development, lead capture systems, WhatsApp automation, dashboards, and ongoing support.";
  }

  if (text.includes("course") || text.includes("learn") || text.includes("video")) {
    return "You can explore the Courses section for quick lessons, downloadable notes, and curated public resources. If you want done-for-you implementation, use Contact and request a free audit.";
  }

  if (text.includes("contact") || text.includes("book") || text.includes("audit")) {
    return "You can book a free AI audit from the main CTA or share details on the Contact page. Include your goal and timeline, and IgniteCore will suggest the fastest practical plan.";
  }

  return "Thanks for sharing. I can help with services, pricing direction, timelines, and next steps. Tell me your business type and the main challenge you want to solve first.";
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

    if (isImplementationRequest(lastUserMessage.content)) {
      return NextResponse.json({
        success: true,
        sessionId,
        provider: "guardrail",
        model: "guardrail",
        reply:
          "I can help with quick client Q&A only. For full website builds, technical implementation, or custom coding, please use the Contact page to request a project consultation.",
      });
    }

    let reply = fallbackReply(lastUserMessage.content);
    let provider = "fallback";
    let modelUsed = "rules";

    const apiKey = process.env.AI_PROVIDER_API_KEY;
    const baseUrl = process.env.AI_PROVIDER_BASE_URL ?? "https://api.openai.com/v1";
    const model = process.env.AI_MODEL ?? "gpt-4o-mini";

    if (apiKey) {
      try {
        const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            temperature: 0.4,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...parsed.data.messages.map((item) => ({ role: item.role, content: item.content })),
            ],
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const content = data.choices?.[0]?.message?.content?.trim();
          if (content) {
            reply = content;
            provider = "custom";
            modelUsed = model;
          }
        } else {
          const errorText = await response.text();
          console.error("AI provider error:", response.status, errorText);
        }
      } catch (error) {
        console.error("AI provider request failed:", error);
      }
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
