import { createClient } from "@/lib/supabase/server";
import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { getDayOfYear } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, string> = {
  fold_cleaning: "🧽",
  nutrition: "🥩",
  temperature: "🌡️",
  ears: "👂",
  seasonal_allergies: "🌿",
  warning_signs: "⚠️",
  post_bath: "🛁",
  weight_control: "⚖️",
};

export default async function TipsPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const supabase = await createClient();

  const { data: tips } = await supabase
    .from("daily_tips")
    .select("*")
    .eq("is_active", true)
    .order("tip_order");

  const dayOfYear = getDayOfYear();
  const todayIndex = tips ? dayOfYear % tips.length : 0;
  const todayTip = tips?.[todayIndex];

  type Tip = {
    id: string;
    category: string;
    content_en: string;
    content_es: string;
    tip_order: number;
    is_active: boolean;
    created_at: string;
  };
  const grouped: Record<string, Tip[]> = {};
  if (tips) {
    for (const tip of tips as Tip[]) {
      if (!grouped[tip.category]) grouped[tip.category] = [];
      grouped[tip.category].push(tip);
    }
  }

  return (
    <div className="px-4 pt-6 space-y-6 pb-6">
      <h1 className="text-2xl font-bold text-[var(--brown-800)]">
        {t("tips.title")}
      </h1>

      {/* Today's highlighted tip */}
      {todayTip && (
        <Card className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] border-0">
          <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-2">
            ✨ {t("dashboard.todaysTip")}
          </p>
          <p className="text-sm text-white leading-relaxed">
            {locale === "es" ? todayTip.content_es : todayTip.content_en}
          </p>
        </Card>
      )}

      {/* Tips by category */}
      {grouped &&
        Object.entries(grouped).map(([category, categoryTips]) => (
          <div key={category}>
            <h2 className="font-semibold text-[var(--brown-800)] flex items-center gap-2 mb-3">
              <span>{CATEGORY_ICONS[category] ?? "🐾"}</span>
              {t(`tips.categories.${category}` as Parameters<typeof t>[0])}
            </h2>

            <div className="space-y-2">
              {categoryTips?.map((tip) => (
                <Card key={tip.id} className="py-3">
                  <p className="text-sm text-[var(--brown-700)] leading-relaxed">
                    {locale === "es" ? tip.content_es : tip.content_en}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        ))}

      <p className="text-xs text-[var(--brown-400)] text-center">
        {t("common.aiDisclaimer")}
      </p>
    </div>
  );
}
