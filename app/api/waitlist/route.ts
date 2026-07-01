import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { email, module, locale } = await req.json();

  if (!email || !module) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist_modules").insert({
    email: email.trim().toLowerCase(),
    module,
    locale: locale ?? "en",
  });

  if (error && !error.message.includes("unique")) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
