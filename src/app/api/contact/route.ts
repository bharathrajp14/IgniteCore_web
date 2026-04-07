import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const schema = z.object({
  name: z.string().min(2),
  businessName: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().min(10),
  projectType: z.string().min(2),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY." },
        { status: 500 }
      );
    }

    const payload = {
      name: parsed.data.name,
      business_name: parsed.data.businessName,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp,
      help_type: parsed.data.projectType,
      message: parsed.data.message,
    };

    const { error } = await supabase.from("contact_submissions").insert(payload);

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
