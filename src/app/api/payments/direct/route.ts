import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const PHONE_REGEX = /^[+]?[0-9][0-9\s-]{7,16}$/;
const TRANS_REF_REGEX = /^[A-Za-z0-9-]{6,40}$/;
const PAYMENT_WINDOW_MS = 60_000;
const PAYMENT_LIMIT_MAX = 12;
const MIN_FILL_TIME_MS = 2_500;
const requestLog = new Map<string, number[]>();

const schema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email(),
  whatsapp: z.string().regex(PHONE_REGEX),
  amount: z.number().int().positive().max(5_000_000),
  paymentMethod: z.enum(["bank_transfer", "upi"]),
  transactionRef: z.string().min(6).max(40).regex(TRANS_REF_REGEX),
  notes: z.string().max(500).optional().default(""),
  consent: z.boolean().refine((value) => value, { message: "Consent is required" }),
  honeypot: z.string().max(0).optional().default(""),
  clientStartedAt: z.number().int().positive(),
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

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - PAYMENT_WINDOW_MS;
  const current = requestLog.get(ip) ?? [];
  const next = current.filter((item) => item >= windowStart);

  if (next.length >= PAYMENT_LIMIT_MAX) {
    requestLog.set(ip, next);
    return true;
  }

  next.push(now);
  requestLog.set(ip, next);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
    }

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please wait and try again." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payment proof submission." }, { status: 400 });
    }

    if (parsed.data.honeypot) {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }

    const elapsed = Date.now() - parsed.data.clientStartedAt;
    if (elapsed < MIN_FILL_TIME_MS) {
      return NextResponse.json({ error: "Please review details carefully before submitting again." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY." },
        { status: 500 }
      );
    }

    const transactionRef = parsed.data.transactionRef.trim().toUpperCase();
    const payload = {
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp,
      amount: parsed.data.amount,
      payment_method: parsed.data.paymentMethod,
      transaction_ref: transactionRef,
      notes: parsed.data.notes?.trim() || "",
      status: "pending_review",
      client_started_at: new Date(parsed.data.clientStartedAt).toISOString(),
      verification_method: "manual_bank_reconciliation",
      source: "contact_page",
      ip_address: ip,
      user_agent: req.headers.get("user-agent") || "unknown",
    };

    const { error } = await supabase.from("payment_submissions").insert(payload);

    if (error) {
      console.error("Supabase payment_submissions insert error:", error);
      const message =
        error.code === "23505"
          ? "This transaction reference has already been submitted. Please check and try again."
          : "Unable to store payment proof.";
      return NextResponse.json({ error: message }, { status: error.code === "23505" ? 409 : 500 });
    }

    const n8nWebhookUrl = process.env.N8N_PAYMENT_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment proof submitted. We will verify it manually and confirm by email / WhatsApp.",
      reference: transactionRef,
      status: "pending_review",
    });
  } catch (error) {
    console.error("Direct payment route error:", error);
    return NextResponse.json({ error: "Unable to process payment proof." }, { status: 500 });
  }
}
