import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { hasAnyPaidPlan } from "@/lib/subscriptions";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  // Guard: onboarding must be complete
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
    redirect(`/${locale}/onboarding`);
  }

  // Guard: must have completed a paid checkout before entering the app
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isUpgradeRoute = pathname === "/upgrade" || pathname.startsWith("/upgrade/");

  if (!isUpgradeRoute) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, plan_type")
      .eq("user_id", user.id)
      .single();

    if (!hasAnyPaidPlan(sub)) {
      redirect(`/${locale}/upgrade`);
    }
  }

  return <AppShell>{children}</AppShell>;
}
