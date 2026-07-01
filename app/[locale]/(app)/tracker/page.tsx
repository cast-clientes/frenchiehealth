import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Plus, Download, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  RealtimeSkinEntries,
  type SkinEntry,
} from "@/components/realtime/RealtimeSkinEntries";

type ModuleFilter = "all" | "skin" | "respiratory" | "ears_eyes" | "joints" | "weight";

type TimelineEntry = {
  id: string;
  module: Exclude<ModuleFilter, "all">;
  date: string;
  icon: string;
  title: string;
  subtitle: string;
  photoUrl?: string | null;
  alert?: boolean;
};

const FILTERS: { key: ModuleFilter; icon: string }[] = [
  { key: "all", icon: "🐾" },
  { key: "skin", icon: "🐾" },
  { key: "respiratory", icon: "🫁" },
  { key: "ears_eyes", icon: "👂" },
  { key: "joints", icon: "🦴" },
  { key: "weight", icon: "⚖️" },
];

export default async function TrackerPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string }>;
}) {
  const t = await getTranslations();
  const locale = await getLocale();
  const supabase = await createClient();
  const es = locale === "es";

  const { module: moduleParam } = await searchParams;
  const validModules = ["skin", "respiratory", "ears_eyes", "joints", "weight"] as const;
  const activeFilter: ModuleFilter = validModules.includes(moduleParam as (typeof validModules)[number])
    ? (moduleParam as ModuleFilter)
    : "all";

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: dogs } = await supabase
    .from("dogs")
    .select("*")
    .eq("user_id", user!.id)
    .limit(1);

  const dog = dogs?.[0];

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user!.id)
    .single();

  const isPaid = sub?.plan === "paid";

  const zoneLabels: Record<string, string> = {
    facial_folds: t("tracker.zones.facial_folds"),
    back: t("tracker.zones.back"),
    paws: t("tracker.zones.paws"),
    ears: t("tracker.zones.ears"),
    other: t("tracker.zones.other"),
  };

  const FILTER_LABEL: Record<ModuleFilter, string> = {
    all: es ? "Todos" : "All",
    skin: es ? "Piel" : "Skin",
    respiratory: es ? "Respiratorio" : "Respiratory",
    ears_eyes: es ? "Oídos/Ojos" : "Ears/Eyes",
    joints: es ? "Articulaciones" : "Joints",
    weight: es ? "Peso" : "Weight",
  };

  let entries: TimelineEntry[] = [];
  let skinRawEntries: SkinEntry[] = [];

  if (dog) {
    const [skinRes, respRes, earEyeRes, jointRes, weightRes] = await Promise.all([
      supabase.from("skin_entries").select("*").eq("dog_id", dog.id).order("entry_date", { ascending: false }).limit(30),
      supabase.from("respiratory_entries").select("*").eq("dog_id", dog.id).order("date", { ascending: false }).limit(30),
      supabase.from("ear_eye_checks").select("*").eq("dog_id", dog.id).order("date", { ascending: false }).limit(30),
      supabase.from("joint_entries").select("*").eq("dog_id", dog.id).order("date", { ascending: false }).limit(30),
      supabase.from("weight_entries").select("*").eq("dog_id", dog.id).order("date", { ascending: false }).limit(30),
    ]);

    // Skin entries are managed by RealtimeSkinEntries (client component)
    skinRawEntries = (skinRes.data as SkinEntry[]) ?? [];

    (respRes.data ?? []).forEach((e) =>
      entries.push({
        id: e.id,
        module: "respiratory",
        date: e.date,
        icon: "🫁",
        title: es ? "Respiratorio" : "Respiratory",
        subtitle: e.episode_occurred
          ? `${es ? "Episodio" : "Episode"} · ${es ? "severidad" : "severity"} ${e.severity ?? "?"}/10`
          : es ? "Sin episodios" : "No episodes",
        alert: e.episode_occurred && (e.severity ?? 0) >= 7,
      })
    );
    (earEyeRes.data ?? []).forEach((e) =>
      entries.push({
        id: e.id,
        module: "ears_eyes",
        date: e.date,
        icon: "👂",
        title: es ? "Oídos/Ojos" : "Ears/Eyes",
        subtitle: e.ear_discharge || e.eye_redness || e.eye_discharge || e.ear_odor
          ? (es ? "Revisión con hallazgos" : "Check with findings")
          : (es ? "Revisados, sin novedad" : "Checked, all clear"),
        photoUrl: e.photo_url,
        alert: Boolean(e.ear_discharge || e.eye_redness || e.eye_discharge),
      })
    );
    (jointRes.data ?? []).forEach((e) =>
      entries.push({
        id: e.id,
        module: "joints",
        date: e.date,
        icon: "🦴",
        title: es ? "Articulaciones" : "Joints",
        subtitle: e.limping
          ? `${es ? "Cojeó" : "Limped"} · ${es ? "dolor" : "pain"} ${e.pain_score ?? "?"}/10`
          : (es ? "Sin novedad" : "All clear"),
        alert: e.limping && (e.pain_score ?? 0) >= 7,
      })
    );
    (weightRes.data ?? []).forEach((e) =>
      entries.push({
        id: e.id,
        module: "weight",
        date: e.date,
        icon: "⚖️",
        title: es ? "Peso" : "Weight",
        subtitle: `${e.weight_kg} kg${e.vomiting ? ` · ${es ? "vómito" : "vomiting"}` : ""}`,
        alert: Boolean(e.vomiting),
      })
    );

    entries.sort((a, b) => b.date.localeCompare(a.date));
  }

  const filteredEntries = activeFilter === "all" ? entries : entries.filter((e) => e.module === activeFilter);

  // Group by date for the timeline
  const grouped: { date: string; items: TimelineEntry[] }[] = [];
  for (const entry of filteredEntries) {
    const group = grouped.find((g) => g.date === entry.date);
    if (group) group.items.push(entry);
    else grouped.push({ date: entry.date, items: [entry] });
  }

  return (
    <div className="px-4 pt-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--brown-800)]">
          {t("tracker.history")}
        </h1>
        <div className="flex items-center gap-2">
          {isPaid && (
            <Link
              href="/tracker/export"
              className="flex items-center gap-1.5 text-xs text-[var(--brown-600)] bg-[var(--brown-100)] px-3 py-2 rounded-xl hover:bg-[var(--brown-200)] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {t("tracker.exportPdf")}
            </Link>
          )}
          <Link
            href="/tracker/new"
            className="flex items-center gap-1.5 text-xs text-white bg-[var(--accent)] px-3 py-2 rounded-xl hover:bg-[var(--accent-dark)] transition-colors font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            {t("tracker.newEntry")}
          </Link>
        </div>
      </div>

      {!dog && (
        <Card>
          <div className="text-center py-8 space-y-3">
            <div className="text-5xl">🐾</div>
            <p className="font-semibold text-[var(--brown-800)]">
              {t("emptyStates.trackerNoDogTitle")}
            </p>
            <p className="text-sm text-[var(--brown-400)]">
              {t("emptyStates.trackerNoDogBody")}
            </p>
            <Link
              href="/dogs/new"
              className="inline-block bg-[var(--accent)] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[var(--accent-dark)] transition-colors"
            >
              {t("emptyStates.trackerNoDogCta")} →
            </Link>
          </div>
        </Card>
      )}

      {dog && entries.length === 0 && skinRawEntries.length === 0 && (
        <Card>
          <div className="text-center py-8 space-y-3">
            <div className="text-5xl">📸</div>
            <p className="font-semibold text-[var(--brown-800)]">
              {t("emptyStates.trackerNoEntriesTitle")}
            </p>
            <p className="text-sm text-[var(--brown-400)]">
              {t("emptyStates.trackerNoEntriesBody")}
            </p>
            <Link
              href="/tracker/new"
              className="inline-block bg-[var(--accent)] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[var(--accent-dark)] transition-colors"
            >
              {t("emptyStates.trackerNoEntriesCta")} →
            </Link>
          </div>
        </Card>
      )}

      {/* Module filter */}
      {dog && (entries.length > 0 || skinRawEntries.length > 0) && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <Link
              key={f.key}
              href={f.key === "all" ? "/tracker" : `/tracker?module=${f.key}`}
              className={`flex-shrink-0 py-1.5 px-3 rounded-full text-xs font-medium border transition-all ${
                activeFilter === f.key
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "bg-white text-[var(--brown-600)] border-[var(--brown-200)]"
              }`}
            >
              {f.icon} {FILTER_LABEL[f.key]}
            </Link>
          ))}
        </div>
      )}

      {/* Skin entries — real-time client component */}
      {dog && (activeFilter === "all" || activeFilter === "skin") && (
        <RealtimeSkinEntries
          dogId={dog.id}
          initialEntries={skinRawEntries}
          locale={locale}
        />
      )}

      {/* Other-module timeline, grouped by date (server-rendered) */}
      {dog && activeFilter !== "skin" && grouped.length > 0 && (
        <div className="space-y-5">
          {grouped.map((group) => (
            <div key={group.date}>
              <p className="text-xs font-semibold text-[var(--brown-400)] uppercase tracking-wide mb-2">
                {formatDate(group.date, locale)}
              </p>
              <div className="space-y-2">
                {group.items.map((entry) => (
                  <div key={`${entry.module}-${entry.id}`}>
                    <Card className="flex items-center gap-3 py-3">
                      <div className="flex-shrink-0">
                        {entry.photoUrl ? (
                          <img src={entry.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-[var(--cream)]">
                            {entry.icon}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-[var(--brown-800)] truncate">{entry.title}</p>
                          {entry.alert && <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-[var(--brown-400)] mt-0.5 truncate">{entry.subtitle}</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isPaid && dog && entries.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-sm text-amber-800 font-medium mb-2">
            {t("tracker.exportPdf")}
          </p>
          <Link
            href="/upgrade"
            className="text-xs font-semibold text-[var(--accent)] underline"
          >
            {t("subscription.upgrade")} →
          </Link>
        </div>
      )}
    </div>
  );
}
