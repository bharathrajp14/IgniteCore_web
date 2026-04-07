import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const schema = z.object({
      name: z.string().min(2),
      businessType: z.string().min(2),
      whatsapp: z.string().min(10),
      helpType: z.string().min(2),
      message: z.string().min(10),
    });

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { error } = await supabase.from("contact_submissions").insert({
        name: parsed.data.name,
        business_type: parsed.data.businessType,
        whatsapp: parsed.data.whatsapp,
        help_type: parsed.data.helpType,
        message: parsed.data.message,
      });

      if (error) {
        return NextResponse.json({ error: "Unable to store contact request" }, { status: 500 });
      }
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
      message: "Request received. We will reply within 4 hours on weekdays.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
