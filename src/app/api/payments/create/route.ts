import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import Razorpay from "razorpay";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const schema = z.object({
  provider: z.enum(["stripe", "razorpay"]),
  amount: z.number().int().positive().max(5_000_000),
  currency: z.string().min(3).max(3).transform((value) => value.toUpperCase()),
  description: z.string().min(3).max(200),
  customerEmail: z.string().email().optional(),
  customerName: z.string().min(2).max(80).optional(),
});

const PAYMENT_LIMIT_WINDOW_MS = 60_000;
const PAYMENT_LIMIT_MAX = 10;
const requestLog = new Map<string, number[]>();

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - PAYMENT_LIMIT_WINDOW_MS;
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
    if (isRateLimited(ipKey)) {
      return NextResponse.json({ error: "Too many payment requests. Please retry in a minute." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payment request payload." }, { status: 400 });
    }

    const { provider, amount, currency, description, customerEmail, customerName } = parsed.data;

    if (provider === "stripe") {
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeSecretKey) {
        return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
      }

      const stripe = new Stripe(stripeSecretKey);
      const intent = await stripe.paymentIntents.create({
        amount,
        currency: currency.toLowerCase(),
        description,
        receipt_email: customerEmail,
        metadata: {
          customerName: customerName || "",
          source: "ignitecore_web",
        },
        automatic_payment_methods: { enabled: true },
      });

      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { error } = await supabase.from("payment_requests").insert({
          provider,
          amount,
          currency,
          description,
          customer_name: customerName,
          customer_email: customerEmail,
          provider_reference: intent.id,
          status: "created",
          metadata: { source: "ignitecore_web" },
        });
        if (error) {
          console.error("Supabase payment_requests insert error (stripe):", error);
        }
      }

      return NextResponse.json({
        success: true,
        provider,
        clientSecret: intent.client_secret,
        paymentIntentId: intent.id,
      });
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json({ error: "Razorpay is not configured." }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret });
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `ignitecore_${Date.now()}`,
      notes: {
        description,
        customerEmail: customerEmail || "",
        customerName: customerName || "",
        source: "ignitecore_web",
      },
    });

    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.from("payment_requests").insert({
        provider,
        amount,
        currency,
        description,
        customer_name: customerName,
        customer_email: customerEmail,
        provider_reference: order.id,
        status: "created",
        metadata: { source: "ignitecore_web" },
      });
      if (error) {
        console.error("Supabase payment_requests insert error (razorpay):", error);
      }
    }

    return NextResponse.json({
      success: true,
      provider,
      razorpayOrderId: order.id,
      razorpayKeyId,
      amount: order.amount,
      currency: order.currency,
      description,
    });
  } catch (error) {
    console.error("Payment create route error:", error);
    return NextResponse.json({ error: "Unable to create payment request." }, { status: 500 });
  }
}
