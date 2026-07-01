import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import { getDayOfYear } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { greet, interpolateDogText } from "@/lib/parentDisplay";
import Image from "next/image";

const MODULES = [
  { key: "skin", icon: "🐾", href: "/tracker", available: true, image: "/images/dashboard/module-skin.webp", color: "#E8714A" },
  { key: "respiratory", icon: "🫁", href: "/respiratory", available: true, image: "/images/dashboard/module-respiratory.webp", color: "#7BB8D4" },
  { key: "ears_eyes", icon: "👂", href: "/ears-eyes", available: true, image: "/images/dashboard/module-ears-eyes.webp", color: "#F0A500" },
  { key: "joints", icon: "🦴", href: "/joints", available: true, image: "/images/dashboard/module-joints.webp", color: "#7BAF7B" },
  { key: "weight", icon: "⚖️", href: "/weight", available: true, image: "/images/dashboard/module-weight.webp", color: "#B07BBF" },
  { key: "health_calendar", icon: "📅", href: "/health-calendar", available: true, image: "/images/dashboard/module-calendar.webp", color: "#E87A6A" },
] as const;

const MOTIVATIONAL_BANNERS = [
  { key: "streak", image: "/images/dashboard/banner-streak.webp" },
  { key: "ears", image: "/images/dashboard/banner-ears.webp" },
  { key: "heat", image: "/images/dashboard/banner-heat.webp" },
  { key: "community", image: "/images/dashboard/banner-community.webp" },
  { key: "vet", image: "/images/dashboard/banner-vet.webp" },
] as const;

import { AlertTriangle, Star, Settings, ChevronRight } from "lucide-react";

function daysAgo(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

type TimelineItem = { date: string; icon: string; summary: string };

export default async function DashboardPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, parent_role, parent_role_custom")
    .eq("id", user.id)
    .single();

  // Fetch first dog
  const { data: dogs } = await supabase
    .from("dogs")
    .select("*")
    .eq("user_id", user.id)
    .limit(1);

  const dog = dogs?.[0];

  // Fetch recent entries (for display)
  const { data: recentEntries } = dog
    ? await supabase
        .from("skin_entries")
        .select("*")
        .eq("dog_id", dog.id)
        .order("entry_date", { ascending: false })
        .limit(3)
    : { data: [] };

  // Fetch streak entries (last 30 for accurate streak calculation)
  const { data: streakEntries } = dog
    ? await supabase
        .from("skin_entries")
        .select("entry_date")
        .eq("dog_id", dog.id)
        .order("entry_date", { ascending: false })
        .limit(30)
    : { data: [] };

  // Fetch total entry count for free plan banner
  const { count: totalEntryCount } = dog
    ? await supabase
        .from("skin_entries")
        .select("*", { count: "exact", head: true })
        .eq("dog_id", dog.id)
    : { count: 0 };

  // Fetch subscription info
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .single();

  // Fetch today's tip
  const dayOfYear = getDayOfYear();
  const { count: totalTips } = await supabase
    .from("daily_tips")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  const tipIndex = totalTips ? dayOfYear % totalTips : 0;
  const { data: tips } = await supabase
    .from("daily_tips")
    .select("*")
    .eq("is_active", true)
    .order("tip_order")
    .range(tipIndex, tipIndex);

  const tip = tips?.[0];

  const isPaid = sub?.plan === "paid";
  const entryCount = totalEntryCount ?? 0;
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  const parentOpts = dog ? {
    parentRole: profile?.parent_role ?? "parent",
    parentRoleCustom: profile?.parent_role_custom ?? null,
    dogName: dog.name,
    dogNickname: dog.nickname ?? null,
    dogPronoun: (dog.pronoun === "ella" ? "ella" : "el") as "el" | "ella",
    language: (locale === "es" ? "es" : "en") as "es" | "en",
  } : null;

  const greeting = parentOpts
    ? greet(parentOpts, dayOfYear)
    : locale === "es" ? `Hola ${firstName} 💛` : `Hi ${firstName} 💛`;

  const dogRef = dog?.nickname?.trim?.() || dog?.name || (locale === "es" ? "tu Frenchie" : "your Frenchie");

  const tipContentRaw = locale === "es" ? tip?.content_es : tip?.content_en;
  const tipContent = (tipContentRaw && parentOpts)
    ? interpolateDogText(tipContentRaw, parentOpts)
    : tipContentRaw;

  const today = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const hasEntryToday = recentEntries?.some((e) => e.entry_date === today) ?? false;

  let streak = 0;
  if (streakEntries && streakEntries.length > 0) {
    const sortedDates = streakEntries.map((e) => e.entry_date).sort((a, b) => b.localeCompare(a));
    let checkDate = today;
    for (const d of sortedDates) {
      if (d === checkDate) {
        streak++;
        const dt = new Date(checkDate);
        dt.setDate(dt.getDate() - 1);
        checkDate = dt.toISOString().split("T")[0];
      } else break;
    }
  }

  const zoneLabels: Record<string, string> = {
    facial_folds: t("tracker.zones.facial_folds"),
    back: t("tracker.zones.back"),
    paws: t("tracker.zones.paws"),
    ears: t("tracker.zones.ears"),
    other: t("tracker.zones.other"),
  };

  // Weekly summary + next event + mixed timeline (only when there's a dog)
  let weekSkinEntries: { entry_date: string; itch_score: number }[] = [];
  let weekRespCount = 0;
  let lastEarEyeCheck: { date: string } | null = null;
  let weekJointCount = 0;
  let lastTwoWeights: { date: string; weight_kg: number }[] = [];
  let nextEvent: { event_name: string; next_due_date: string | null; event_date: string; vet_name: string | null } | null = null;
  let timeline: TimelineItem[] = [];

  if (dog) {
    const [
      weekSkinRes,
      weekRespRes,
      lastEarEyeRes,
      weekJointRes,
      weightsRes,
      eventRes,
      tlResp,
      tlEarEye,
      tlJoint,
      tlWeight,
    ] = await Promise.all([
      supabase.from("skin_entries").select("entry_date, itch_score").eq("dog_id", dog.id).gte("entry_date", sevenDaysAgo),
      supabase.from("respiratory_entries").select("date").eq("dog_id", dog.id).eq("episode_occurred", true).gte("date", sevenDaysAgo),
      supabase.from("ear_eye_checks").select("date").eq("dog_id", dog.id).order("date", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("joint_entries").select("date").eq("dog_id", dog.id).eq("limping", true).gte("date", sevenDaysAgo),
      supabase.from("weight_entries").select("date, weight_kg").eq("dog_id", dog.id).order("date", { ascending: false }).limit(2),
      supabase.from("health_events").select("event_name, next_due_date, event_date, vet_name").eq("dog_id", dog.id).gte("next_due_date", today).order("next_due_date", { ascending: true }).limit(1).maybeSingle(),
      supabase.from("respiratory_entries").select("date, episode_occurred, severity").eq("dog_id", dog.id).order("date", { ascending: false }).limit(3),
      supabase.from("ear_eye_checks").select("date, ear_discharge, eye_redness").eq("dog_id", dog.id).order("date", { ascending: false }).limit(3),
      supabase.from("joint_entries").select("date, limping").eq("dog_id", dog.id).order("date", { ascending: false }).limit(3),
      supabase.from("weight_entries").select("date, weight_kg").eq("dog_id", dog.id).order("date", { ascending: false }).limit(3),
    ]);

    weekSkinEntries = weekSkinRes.data ?? [];
    weekRespCount = weekRespRes.data?.length ?? 0;
    lastEarEyeCheck = lastEarEyeRes.data ?? null;
    weekJointCount = weekJointRes.data?.length ?? 0;
    lastTwoWeights = weightsRes.data ?? [];
    nextEvent = eventRes.data ?? null;

    const items: TimelineItem[] = [];
    (recentEntries ?? []).forEach((e) =>
      items.push({
        date: e.entry_date,
        icon: "🐾",
        summary: locale === "es"
          ? `Piel · Score ${e.itch_score}/10 · ${zoneLabels[e.affected_zone] ?? e.affected_zone}`
          : `Skin · Score ${e.itch_score}/10 · ${zoneLabels[e.affected_zone] ?? e.affected_zone}`,
      })
    );
    (tlResp.data ?? []).forEach((e) =>
      items.push({
        date: e.date,
        icon: "🫁",
        summary: e.episode_occurred
          ? (locale === "es" ? `Respiratorio · Episodio, severidad ${e.severity ?? "?"}/10` : `Respiratory · Episode, severity ${e.severity ?? "?"}/10`)
          : (locale === "es" ? "Respiratorio · Sin episodios" : "Respiratory · No episodes"),
      })
    );
    (tlEarEye.data ?? []).forEach((e) =>
      items.push({
        date: e.date,
        icon: "👂",
        summary: e.ear_discharge || e.eye_redness
          ? (locale === "es" ? "Oídos/Ojos · Revisión con hallazgos" : "Ears/Eyes · Check with findings")
          : (locale === "es" ? "Oídos/Ojos · Revisados, sin novedad" : "Ears/Eyes · Checked, all clear"),
      })
    );
    (tlJoint.data ?? []).forEach((e) =>
      items.push({
        date: e.date,
        icon: "🦴",
        summary: e.limping
          ? (locale === "es" ? "Articulaciones · Cojeó hoy" : "Joints · Limped today")
          : (locale === "es" ? "Articulaciones · Sin novedad" : "Joints · All clear"),
      })
    );
    (tlWeight.data ?? []).forEach((e) =>
      items.push({ date: e.date, icon: "⚖️", summary: `${locale === "es" ? "Peso" : "Weight"} · ${e.weight_kg} kg` })
    );

    items.sort((a, b) => b.date.localeCompare(a.date));
    timeline = items.slice(0, 3);
  }

  const skinAvg = weekSkinEntries.length > 0
    ? Math.round((weekSkinEntries.reduce((s, e) => s + e.itch_score, 0) / weekSkinEntries.length) * 10) / 10
    : null;

  const earEyeStatus = !lastEarEyeCheck
    ? t("dashboard.neverChecked")
    : daysAgo(lastEarEyeCheck.date) >= 3
    ? t("dashboard.notCheckedDays", { count: daysAgo(lastEarEyeCheck.date) })
    : null;

  let weightStatus: string | null = null;
  if (lastTwoWeights.length >= 1) {
    const latest = lastTwoWeights[0];
    if (lastTwoWeights.length >= 2) {
      const diff = latest.weight_kg - lastTwoWeights[1].weight_kg;
      weightStatus = Math.abs(diff) < 0.1
        ? t("dashboard.stableWeight", { weight: latest.weight_kg })
        : diff > 0
        ? t("dashboard.weightUp", { weight: latest.weight_kg })
        : t("dashboard.weightDown", { weight: latest.weight_kg });
    } else {
      weightStatus = t("dashboard.stableWeight", { weight: latest.weight_kg });
    }
  }

  const nextEventDate = nextEvent?.next_due_date ?? nextEvent?.event_date ?? null;

  const { count: memberCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const todaysBanner = MOTIVATIONAL_BANNERS[dayOfYear % MOTIVATIONAL_BANNERS.length];
  const bannerText: Record<(typeof MOTIVATIONAL_BANNERS)[number]["key"], string> = {
    streak: streak > 0
      ? (locale === "es" ? `🔥 ¡${streak} día${streak !== 1 ? "s" : ""} seguidos registrando! ${dogRef} tiene suerte de tenerte` : `🔥 ${streak} day${streak !== 1 ? "s" : ""} in a row! ${dogRef} is lucky to have you`)
      : (locale === "es" ? `🔥 ¡Empezá tu racha hoy con ${dogRef}!` : `🔥 Start your streak with ${dogRef} today!`),
    ears: locale === "es" ? `👂 ¿Ya revisaste los oídos de ${dogRef} esta semana?` : `👂 Have you checked ${dogRef}'s ears this week?`,
    heat: locale === "es" ? `🌡️ ¿Tiene agua fresca ${dogRef} hoy?` : `🌡️ Does ${dogRef} have fresh water today?`,
    community: locale === "es" ? `🐾 ${memberCount ?? 0} papás y mamás de Frenchie están en la comunidad` : `🐾 ${memberCount ?? 0} Frenchie parents are in the community`,
    vet: nextEventDate
      ? (locale === "es" ? `📅 La próxima cita de ${dogRef} es en ${Math.max(0, daysUntil(nextEventDate))} días` : `📅 ${dogRef}'s next visit is in ${Math.max(0, daysUntil(nextEventDate))} days`)
      : (locale === "es" ? `📅 Agendale una cita a ${dogRef} pronto` : `📅 Schedule ${dogRef}'s next visit soon`),
  };

  return (
    <div className="px-4 pt-6 space-y-5">
      {/* Greeting — photo banner */}
      <div className="relative h-48 rounded-3xl overflow-hidden">
        <Image
          src="/images/dashboard/banner-welcome.webp"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Link
          href="/profile"
          className="absolute top-3 right-3 p-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
          aria-label={locale === "es" ? "Perfil" : "Profile"}
        >
          <Settings className="w-5 h-5" />
        </Link>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-2xl font-bold drop-shadow-sm">{greeting}</h1>
          {dog ? (
            <p className="text-sm text-white/90 mt-1 drop-shadow-sm">
              {locale === "es" ? "Seguimiento de" : "Tracking"}: <strong>{dog.name}</strong>
              {streak > 0 && (
                <span className="ml-2">
                  🔥 {locale === "es" ? `${streak} día${streak !== 1 ? "s" : ""} seguidos` : `${streak} day${streak !== 1 ? "s" : ""} streak`}
                </span>
              )}
            </p>
          ) : (
            <Link href="/dogs/new" className="text-sm text-white underline mt-1 inline-block">
              {t("dashboard.addDog")} →
            </Link>
          )}
        </div>
      </div>

      {/* Motivational banner — rotates daily */}
      {dog && (
        <div className="relative h-20 rounded-2xl overflow-hidden">
          <Image src={todaysBanner.image} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-center px-4">
            <p className="text-white font-medium text-sm drop-shadow-sm">
              {bannerText[todaysBanner.key]}
            </p>
          </div>
        </div>
      )}

      {/* Free plan limit banner */}
      {!isPaid && entryCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
          <Star className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-amber-800">
              {t("dashboard.freeLimit", { count: entryCount })}
            </p>
          </div>
          <Link
            href="/upgrade"
            className="text-xs font-semibold text-[var(--accent)] whitespace-nowrap"
          >
            {t("subscription.upgrade")} →
          </Link>
        </div>
      )}

      {/* Weekly health summary across all modules */}
      {dog && (
        <Card>
          <h2 className="font-semibold text-[var(--brown-800)] mb-3">
            {t("dashboard.weekSummaryTitle", { dogName: dogRef })}
          </h2>
          <div className="space-y-2.5">
            <Link href="/tracker" className="flex items-center justify-between text-sm">
              <span className="text-[var(--brown-700)]">🐾 {locale === "es" ? "Piel" : "Skin"}</span>
              <span className="text-[var(--brown-500)]">
                {skinAvg !== null ? t("dashboard.avgScore", { score: skinAvg }) : t("dashboard.moduleNoData")}
              </span>
            </Link>
            <Link href="/respiratory" className="flex items-center justify-between text-sm">
              <span className="text-[var(--brown-700)]">🫁 {locale === "es" ? "Respiratorio" : "Respiratory"}</span>
              <span className="text-[var(--brown-500)]">
                {weekRespCount > 0
                  ? `⚠️ ${weekRespCount} ${locale === "es" ? "episodio(s)" : "episode(s)"}`
                  : `✓ ${t("dashboard.noEpisodes")}`}
              </span>
            </Link>
            <Link href="/ears-eyes" className="flex items-center justify-between text-sm">
              <span className="text-[var(--brown-700)]">👂 {locale === "es" ? "Oídos/Ojos" : "Ears/Eyes"}</span>
              <span className="text-[var(--brown-500)]">{earEyeStatus ? `⚠️ ${earEyeStatus}` : "✓"}</span>
            </Link>
            <Link href="/joints" className="flex items-center justify-between text-sm">
              <span className="text-[var(--brown-700)]">🦴 {locale === "es" ? "Articulaciones" : "Joints"}</span>
              <span className="text-[var(--brown-500)]">
                {weekJointCount > 0 ? `⚠️ ${weekJointCount} ${locale === "es" ? "episodio(s)" : "episode(s)"}` : "✓"}
              </span>
            </Link>
            <Link href="/weight" className="flex items-center justify-between text-sm">
              <span className="text-[var(--brown-700)]">⚖️ {locale === "es" ? "Peso" : "Weight"}</span>
              <span className="text-[var(--brown-500)]">{weightStatus ?? t("dashboard.moduleNoData")}</span>
            </Link>
            <Link href="/health-calendar" className="flex items-center justify-between text-sm">
              <span className="text-[var(--brown-700)]">📅 {locale === "es" ? "Calendario" : "Calendar"}</span>
              <span className="text-[var(--brown-500)]">
                {nextEventDate
                  ? `⚠️ ${t("dashboard.daysUntil", { count: Math.max(0, daysUntil(nextEventDate)) })}`
                  : t("dashboard.moduleNoData")}
              </span>
            </Link>
          </div>
        </Card>
      )}

      {/* Daily tip card */}
      {tip && (
        <div className="relative rounded-2xl overflow-hidden">
          <Image src="/images/dashboard/banner-tip-bg.webp" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/85 to-[var(--accent-dark)]/85" />
          <div className="relative p-5">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-2">
              {t("dashboard.todaysTip")}
            </p>
            <p className="text-sm text-white leading-relaxed">{tipContent}</p>
          </div>
        </div>
      )}

      {/* Quick action */}
      {!dog ? (
        <Link
          href="/dogs/new"
          className="flex items-center gap-4 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-dashed border-[var(--accent)] rounded-3xl p-5 no-underline"
        >
          <div className="text-4xl">🐾</div>
          <div>
            <p className="font-extrabold text-[var(--brown-800)] text-base">
              {locale === "es" ? "Paso 1: Agrega tu Frenchie" : "Step 1: Add your Frenchie"}
            </p>
            <p className="text-[var(--accent)] text-sm font-semibold">
              {locale === "es" ? "¡Empecemos! →" : "Let's get started! →"}
            </p>
          </div>
        </Link>
      ) : hasEntryToday ? (
        <div className="flex items-center gap-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-300 rounded-3xl p-5">
          <div className="text-4xl">🎉</div>
          <div>
            <p className="font-extrabold text-green-800 text-base">
              {locale === "es" ? "¡Chequeo de hoy completado!" : "Today's check is done!"}
            </p>
            <p className="text-green-700 text-sm">
              {locale === "es"
                ? `${streak} día${streak !== 1 ? "s" : ""} seguido${streak !== 1 ? "s" : ""} ✨`
                : `${streak} day${streak !== 1 ? "s" : ""} in a row ✨`}
            </p>
          </div>
        </div>
      ) : (
        <Link
          href="/tracker/new"
          className="flex items-center gap-4 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-[var(--accent)] rounded-3xl p-5 no-underline"
          style={{ boxShadow: "0 4px 16px rgba(232,115,74,0.15)" }}
        >
          <div className="text-4xl">📸</div>
          <div>
            <p className="font-extrabold text-[var(--brown-800)] text-base">
              {locale === "es" ? `¡${dogRef} te espera hoy!` : `${dogRef} is waiting for you!`}
            </p>
            <p className="text-[var(--accent)] text-sm font-semibold">
              {locale === "es" ? "Registrar chequeo de hoy →" : "Log today's check →"}
            </p>
          </div>
        </Link>
      )}

      {/* Next calendar event */}
      {dog && nextEvent && nextEventDate && (
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--brown-400)] uppercase tracking-wide mb-1">
                {t("dashboard.vaccineSoon", { dogName: dogRef })}
              </p>
              <p className="text-sm font-medium text-[var(--brown-800)]">
                {nextEvent.event_name} — {t("dashboard.daysUntil", { count: Math.max(0, daysUntil(nextEventDate)) })}
              </p>
              {nextEvent.vet_name && (
                <p className="text-xs text-[var(--brown-400)] mt-0.5">{nextEvent.vet_name}</p>
              )}
            </div>
            <Link href="/health-calendar" className="text-[var(--accent)] flex-shrink-0">
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </Card>
      )}

      {/* Mixed timeline — last 3 entries across all modules */}
      {timeline.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[var(--brown-800)]">
              {t("dashboard.timelineTitle")}
            </h2>
            <Link href="/tracker" className="text-xs text-[var(--accent)] font-medium">
              {t("dashboard.viewHistory")} →
            </Link>
          </div>
          <div className="space-y-2">
            {timeline.map((item, i) => (
              <Card key={i} className="flex items-center gap-3 py-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-[var(--cream)]">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--brown-800)] truncate">
                    {item.summary}
                  </p>
                  <p className="text-xs text-[var(--brown-400)]">{item.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent entries */}
      {recentEntries && recentEntries.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[var(--brown-800)]">
              {t("dashboard.recentEntries")}
            </h2>
            <Link
              href="/tracker"
              className="text-xs text-[var(--accent)] font-medium"
            >
              {t("dashboard.viewAll")} →
            </Link>
          </div>

          <div className="space-y-2">
            {recentEntries.map((entry) => (
              <Card key={entry.id} className="flex items-center gap-3 py-3">
                {/* Itch score badge */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    entry.itch_score >= 7
                      ? "bg-red-100 text-red-700"
                      : entry.itch_score >= 4
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {entry.itch_score}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--brown-800)] truncate">
                    {zoneLabels[entry.affected_zone] ?? entry.affected_zone}
                  </p>
                  <p className="text-xs text-[var(--brown-400)]">
                    {entry.entry_date}
                  </p>
                </div>

                {entry.itch_score >= 8 && (
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Health modules grid */}
      <div>
        <h2 className="font-semibold text-[var(--brown-800)] mb-3">
          {locale === "es" ? "Módulos de Salud" : "Health Modules"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {MODULES.map((mod) => (
            <Link
              key={mod.key}
              href={mod.href as Parameters<typeof Link>[0]["href"]}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3"
              style={{ borderLeft: `4px solid ${mod.color}`, textDecoration: "none" }}
            >
              <Image src={mod.image} alt="" width={44} height={44} className="rounded-xl flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-[var(--brown-800)] truncate">
                  {locale === "es"
                    ? { skin: "Piel", respiratory: "Respiratorio", ears_eyes: "Oídos/Ojos", joints: "Articulaciones", weight: "Peso", health_calendar: "Calendario" }[mod.key]
                    : { skin: "Skin", respiratory: "Breathing", ears_eyes: "Ears/Eyes", joints: "Joints", weight: "Weight", health_calendar: "Calendar" }[mod.key]}
                </p>
                <p className="text-xs text-[var(--brown-400)] truncate">
                  {locale === "es" ? "Ver detalle →" : "View details →"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI disclaimer */}
      <p className="text-xs text-[var(--brown-400)] text-center pb-2">
        {t("common.aiDisclaimer")}
      </p>
    </div>
  );
}
