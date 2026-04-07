import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const schema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
  sessionId: z.string().min(3).max(128).optional(),
});

const SYSTEM_PROMPT = [
  "You are IgniteCore Assistant.",
  "Goal: help visitors understand IgniteCore services, courses, and how to start.",
  "Tone: concise, practical, professional, and helpful.",
  "Only claim what is available on the website: AI automation, business websites, web apps, lead capture, WhatsApp automation, dashboards, and support.",
  "When users ask for next step, suggest booking an audit or using contact page.",
].join(" ");

function fallbackReply(userMessage: string) {
  const text = userMessage.toLowerCase();

  if (text.includes("price") || text.includes("cost") || text.includes("pricing")) {
    return "Pricing depends on scope and timeline. Typical projects start from targeted implementation packages and scale based on complexity. Share your requirement in Contact and you will get a clear scope and quote.";
  }

  if (text.includes("service") || text.includes("what do you do") || text.includes("offer")) {
    return "IgniteCore provides AI automation systems, business websites, web app development, lead capture systems, WhatsApp automation, dashboards, and maintenance support.";
  }

  if (text.includes("course") || text.includes("learn") || text.includes("video")) {
    return "You can visit the Courses section for video lessons, downloadable notes, and curated public resources. If you want implementation help, book a free audit from the Contact page.";
  }

  if (text.includes("contact") || text.includes("book") || text.includes("audit")) {
    return "You can book a free AI audit from the main CTA or submit details on the Contact page. If you share your goal and timeline, IgniteCore can suggest the fastest execution plan.";
  }

  return "Thanks for your message. I can help with services, project scope, pricing direction, courses, and next steps. Tell me what you want to build or improve.";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid chat payload" }, { status: 400 });
    }

    const sessionId = parsed.data.sessionId ?? crypto.randomUUID();
    const lastUserMessage = [...parsed.data.messages].reverse().find((item) => item.role === "user");

    if (!lastUserMessage) {
      return NextResponse.json({ error: "User message required" }, { status: 400 });
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
