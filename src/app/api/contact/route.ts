import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const PHONE_REGEX = /^[+]?\d[\d\s-]{8,16}$/;
const COOLDOWN_MS = 15_000;
const recentSubmissions = new Map<string, number>();

const schema = z.object({
  name: z.string().min(2),
  businessName: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().regex(PHONE_REGEX),
  projectType: z.string().min(2),
  message: z.string().min(10),
  businessType: z.string().min(2).optional(),
  biggestProblem: z.string().min(2).optional(),
  teamSize: z.string().min(1).optional(),
  consent: z.boolean().optional(),
  source: z.string().min(2).optional(),
});

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip") || "unknown";
}

function isAllowedOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN || ""}`,
    "http://localhost:3000",
  ].filter(Boolean);

  return allowedOrigins.some((item) => item === origin);
}

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
    }

    const ipKey = getClientIp(req);
    const now = Date.now();
    const lastSubmissionAt = recentSubmissions.get(ipKey) || 0;

    if (now - lastSubmissionAt < COOLDOWN_MS) {
      return NextResponse.json({ error: "Please wait a few seconds before submitting again." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    if (parsed.data.source === "homepage_qualifier" && parsed.data.consent !== true) {
      return NextResponse.json({ error: "Consent is required to continue." }, { status: 400 });
    }

    recentSubmissions.set(ipKey, now);

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY." },
        { status: 500 }
      );
    }

    const basePayload = {
      name: parsed.data.name,
      business_name: parsed.data.businessName,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp,
      help_type: parsed.data.projectType,
      message: parsed.data.message,
    };

    const payloadWithQualifier = {
      ...basePayload,
      business_type: parsed.data.businessType,
      biggest_problem: parsed.data.biggestProblem,
      team_size: parsed.data.teamSize,
      consent: parsed.data.consent,
      source: parsed.data.source,
    };

    let { error } = await supabase.from("contact_submissions").insert(payloadWithQualifier);

    if (error && error.code === "PGRST204") {
      const fallbackResult = await supabase.from("contact_submissions").insert(basePayload);
      error = fallbackResult.error;
    }

    if (error) {
      console.error("Supabase insert error (contact_submissions):", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      const debugError = process.env.NODE_ENV === "production"
        ? "Unable to store contact request"
        : `Unable to store contact request: ${error.message}`;

      return NextResponse.json({ error: debugError }, { status: 500 });
    }

    const n8nWebhookUrl = process.env.N8N_CONTACT_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Request received. We reply within 24 hours on working days.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
