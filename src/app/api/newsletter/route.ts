import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email: parsed.data.email,
      });

      if (error) {
        return NextResponse.json({ error: "Unable to save subscriber" }, { status: 500 });
      }
    }

    const beehiivEndpoint = process.env.BEEHIIV_SUBSCRIBE_ENDPOINT;
    if (beehiivEndpoint) {
      await fetch(beehiivEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data.email }),
      });
    }

    const convertKitEndpoint = process.env.CONVERTKIT_SUBSCRIBE_ENDPOINT;
    if (convertKitEndpoint) {
      await fetch(convertKitEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data.email }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter route error:", error);
    return NextResponse.json({ error: "Unable to subscribe" }, { status: 500 });
  }
}
