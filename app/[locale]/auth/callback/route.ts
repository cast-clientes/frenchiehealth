import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has completed onboarding (accepted all consents)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: consents } = await supabase
          .from("consents")
          .select("consent_type")
          .eq("user_id", user.id);

        const types = consents?.map((c) => c.consent_type) ?? [];
        const hasAll =
          types.includes("terms") &&
          types.includes("privacy") &&
          types.includes("medical_disclaimer");

        if (!hasAll) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
