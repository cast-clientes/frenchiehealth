import { createClient } from "@/lib/supabase/server";
import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { Lock } from "lucide-react";

function renderMarkdown(text: string) {
  // Minimal markdown: bold, lists, headings
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h3 key={i} className="font-bold text-[var(--brown-800)] mt-4 mb-2">
          {line.replace("## ", "")}
        </h3>
      );
    }
    if (line.startsWith("• ")) {
      return (
        <li key={i} className="text-sm text-[var(--brown-700)] ml-4 list-disc">
          {line.replace("• ", "").replace(/\*\*(.*?)\*\*/g, "$1")}
        </li>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={i} className="text-sm text-[var(--brown-700)] ml-4 list-disc">
          {line.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}
        </li>
      );
    }
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <p key={i} className="font-semibold text-[var(--brown-800)] mt-3">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }
    if (line.trim() === "") return <br key={i} />;
    return (
      <p key={i} className="text-sm text-[var(--brown-700)] leading-relaxed">
        {line.replace(/\*\*(.*?)\*\*/g, "$1")}
      </p>
    );
  });
}

export default async function FeedingPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user!.id)
    .single();

  const isPaid = sub?.plan === "paid";

  const { data: plans } = await supabase
    .from("feeding_plans")
    .select("*")
    .order("display_order");

  // Free users get first section only
  const visiblePlans = isPaid ? plans : plans?.slice(0, 1);
  const lockedCount = isPaid ? 0 : (plans?.length ?? 0) - 1;

  return (
    <div className="px-4 pt-6 space-y-6 pb-6">
      <h1 className="text-2xl font-bold text-[var(--brown-800)]">
        {t("feeding.title")}
      </h1>
      <p className="text-sm text-[var(--brown-400)]">
        {t("feeding.subtitle")}
      </p>

      {visiblePlans?.map((plan) => (
        <div key={plan.id}>
          <h2 className="font-bold text-[var(--brown-800)] text-lg mb-3">
            {locale === "es" ? plan.title_es : plan.title_en}
          </h2>
          <Card>
            <div className="prose prose-sm max-w-none">
              {renderMarkdown(locale === "es" ? plan.content_es : plan.content_en)}
            </div>
          </Card>
        </div>
      ))}

      {/* Locked sections */}
      {lockedCount > 0 && (
        <Card className="border-2 border-dashed border-[var(--brown-200)]">
          <div className="flex flex-col items-center py-6 gap-3">
            <Lock className="w-8 h-8 text-[var(--brown-300)]" />
            <p className="text-sm font-medium text-[var(--brown-600)] text-center">
              {t("feeding.lockedContent")}
            </p>
            <p className="text-xs text-[var(--brown-400)] text-center">
              {t("feeding.lockedMore", { count: lockedCount })}
            </p>
            <Link
              href="/upgrade"
              className="mt-2 bg-[var(--accent)] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[var(--accent-dark)] transition-colors"
            >
              {t("subscription.upgrade")} →
            </Link>
          </div>
        </Card>
      )}

      <p className="text-xs text-[var(--brown-400)] text-center">
        {t("common.aiDisclaimer")}
      </p>
    </div>
  );
}
