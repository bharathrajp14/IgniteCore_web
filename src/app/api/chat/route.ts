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

const AFFIRMATIVE_INPUTS = new Set(["yes", "y", "ok", "okay", "sure", "yep", "yeah", "fine", "continue"]);

const intentMatchers: Array<{ patterns: string[]; reply: string }> = [
  {
    patterns: ["price", "cost", "pricing", "budget"],
    reply:
      "Pricing depends on scope, timeline, and how much automation you need first. Share your current process and goal on the Contact page, and we will suggest a practical budget range.",
  },
  {
    patterns: ["service", "what do you do", "offer", "help with"],
    reply:
      "IgniteCore can help with AI automation, business websites, web apps, lead capture systems, WhatsApp automation, dashboards, and ongoing support.",
  },
  {
    patterns: ["course", "learn", "video", "training"],
    reply:
      "You can explore the Courses section for quick lessons and downloadable resources. If you prefer done-for-you implementation, use Contact and request a free audit.",
  },
  {
    patterns: ["contact", "book", "audit", "call", "consult"],
    reply:
      "You can book a free AI audit from the main CTA or share your details on the Contact page. Include your goal and timeline, and we will suggest the fastest next step.",
  },
  {
    patterns: ["timeline", "how long", "duration", "when"],
    reply:
      "Most first versions launch in about 7 to 14 business days depending on scope. If you share your use case, we can suggest a realistic timeline for your business.",
  },
];

function normalizeMessage(input: string) {
  return input.toLowerCase().trim().replace(/\s+/g, " ");
}

function shouldAskForBusinessContext(previousAssistantMessage: string | undefined) {
  if (!previousAssistantMessage) {
    return false;
  }

  const text = normalizeMessage(previousAssistantMessage);
  return text.includes("business type") && text.includes("main challenge");
}

function parseBusinessContext(input: string) {
  const parts = input
    .split(/\s+-\s+|\s*\|\s*|\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) {
    return null;
  }

  const [businessType, mainChallenge, leadSource] = parts;
  return {
    businessType,
    mainChallenge,
    leadSource,
  };
}

function getRecommendedFocus(businessType: string, challenge: string) {
  const business = normalizeMessage(businessType);
  const issue = normalizeMessage(challenge);

  if (issue.includes("follow") || issue.includes("response") || issue.includes("whatsapp")) {
    return "Start with WhatsApp automation + lead capture tagging so every enquiry is tracked and responded to quickly.";
  }

  if (issue.includes("website") || issue.includes("landing") || issue.includes("conversion")) {
    return "Start with a conversion-focused website or landing page refresh with clearer service positioning and stronger CTAs.";
  }

  if (issue.includes("report") || issue.includes("dashboard") || issue.includes("visibility")) {
    return "Start with a simple dashboard that tracks lead source, response time, and conversion stage so you can fix bottlenecks fast.";
  }

  if (business.includes("clinic") || business.includes("hospital") || business.includes("doctor")) {
    return "Start with enquiry triage and appointment follow-up automation to reduce missed patient opportunities.";
  }

  if (business.includes("coaching") || business.includes("academy") || business.includes("education")) {
    return "Start with admission lead pipeline automation so counsellors can follow up consistently and improve enrollments.";
  }

  if (business.includes("real estate") || business.includes("property")) {
    return "Start with lead routing and follow-up reminders so site visit interest does not drop between handoffs.";
  }

  return "Start with lead capture + response automation first, then improve conversion pages once follow-up consistency is stable.";
}

function fallbackReply(userMessage: string, previousAssistantMessage?: string) {
  const text = normalizeMessage(userMessage);

  if (text.includes("not work") || text.includes("isn't working") || text.includes("error") || text.includes("issue")) {
    return "Sorry you are facing this. Share what is failing (chat, form, payment, or booking), what you expected, and what happened instead. I will suggest the fastest fix path.";
  }

  const context = parseBusinessContext(userMessage);
  if (context) {
    const recommendedFocus = getRecommendedFocus(context.businessType, context.mainChallenge);
    const leadSourceLine = context.leadSource
      ? ` Noted lead source: ${context.leadSource}.`
      : "";

    return `${recommendedFocus}${leadSourceLine} If you want, I can give a starter scope with timeline and budget direction next.`;
  }

  if (AFFIRMATIVE_INPUTS.has(text) && shouldAskForBusinessContext(previousAssistantMessage)) {
    return "Perfect. Start with this format: Business type - Main challenge - Current lead source. Example: 'Dental clinic - slow follow-up on WhatsApp - Instagram and referrals'.";
  }

  for (const matcher of intentMatchers) {
    if (matcher.patterns.some((pattern) => text.includes(pattern))) {
      return matcher.reply;
    }
  }

  if (text.length <= 3) {
    return "I can guide you quickly. Tell me your business type and one main problem first, and I will suggest the best next step.";
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

    const lastAssistantMessage = [...parsed.data.messages]
      .reverse()
      .find((item) => item.role === "assistant")?.content;

    let reply = fallbackReply(lastUserMessage.content, lastAssistantMessage);
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
