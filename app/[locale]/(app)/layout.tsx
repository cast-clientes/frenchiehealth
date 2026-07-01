import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";

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

  return <AppShell>{children}</AppShell>;
}
