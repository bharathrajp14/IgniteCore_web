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
      const { error } = await supabase.from("lead_magnet_downloads").insert({
        email: parsed.data.email,
        asset: "ai-starter-kit",
      });

      if (error) {
        return NextResponse.json({ error: "Unable to record download" }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      fileUrl: "/ai-starter-kit.pdf",
      message: "Starter kit sent. Download now.",
    });
  } catch (error) {
    console.error("Lead magnet route error:", error);
    return NextResponse.json({ error: "Unable to process request" }, { status: 500 });
  }
}
