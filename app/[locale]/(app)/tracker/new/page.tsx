"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChevronRight, CheckCircle2, Camera } from "lucide-react";
import PaywallModal from "@/components/PaywallModal";
import { analytics } from "@/lib/analytics/events";

const ZONES = ["facial_folds", "back", "paws", "ears", "other"] as const;
const LIMBS = ["front_left", "front_right", "back_left", "back_right", "unknown"] as const;
const TRIGGERS = ["heat", "exercise", "excitement", "sleep", "unknown"] as const;

type SectionKey = "skin" | "respiratory" | "ears_eyes" | "joints" | "weight" | "food" | "note" | "photo";

const SECTIONS: { key: SectionKey; icon: string }[] = [
  { key: "skin", icon: "🐾" },
  { key: "respiratory", icon: "🫁" },
  { key: "ears_eyes", icon: "👂" },
  { key: "joints", icon: "🦴" },
  { key: "weight", icon: "⚖️" },
  { key: "food", icon: "🍖" },
  { key: "note", icon: "📝" },
  { key: "photo", icon: "📸" },
];

function today() {
  return new Date().toISOString().split("T")[0];
}

function Toggle({ value, onChange, yesLabel, noLabel }: { value: boolean; onChange: (v: boolean) => void; yesLabel: string; noLabel: string }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${value ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "bg-white text-[var(--brown-600)] border-[var(--brown-200)]"}`}
      >
        {yesLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${!value ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "bg-white text-[var(--brown-600)] border-[var(--brown-200)]"}`}
      >
        {noLabel}
      </button>
    </div>
  );
}

function Chips<T extends string>({ options, value, onChange, labels }: { options: readonly T[]; value: T | ""; onChange: (v: T) => void; labels: Record<T, string> }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${value === opt ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "bg-white text-[var(--brown-600)] border-[var(--brown-200)]"}`}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

export default function DailyLogPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) ?? "en";
  const es = locale === "es";

  const [dogId, setDogId] = useState<string | null>(null);
  const [dogRef, setDogRef] = useState<string>(es ? "tu Frenchie" : "your Frenchie");
  const [dogInfo, setDogInfo] = useState<{ name: string; photoUrl: string | null } | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<SectionKey | null>(null);
  const [loggedToday, setLoggedToday] = useState<Record<SectionKey, boolean>>({
    skin: false, respiratory: false, ears_eyes: false, joints: false, weight: false, food: false, note: false, photo: false,
  });
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState<"entries" | "photo">("entries");
  const [savingKey, setSavingKey] = useState<SectionKey | null>(null);
  const [errorKey, setErrorKey] = useState<{ key: SectionKey; message: string } | null>(null);

  // Skin
  const [itchScore, setItchScore] = useState(3);
  const [affectedZone, setAffectedZone] = useState<typeof ZONES[number]>("facial_folds");
  const [skinNotes, setSkinNotes] = useState("");
  const [skinPhotoFile, setSkinPhotoFile] = useState<File | null>(null);
  const [skinPhotoPreview, setSkinPhotoPreview] = useState<string | null>(null);
  const skinFileRef = useRef<HTMLInputElement>(null);

  // Respiratory
  const [respEpisode, setRespEpisode] = useState(false);
  const [respDuration, setRespDuration] = useState("");
  const [respTrigger, setRespTrigger] = useState<typeof TRIGGERS[number] | "">("");
  const [respSeverity, setRespSeverity] = useState(3);
  const [respTemp, setRespTemp] = useState("");
  const [respNotes, setRespNotes] = useState("");

  // Ears/eyes
  const [earLeftClean, setEarLeftClean] = useState(true);
  const [earRightClean, setEarRightClean] = useState(true);
  const [earDischarge, setEarDischarge] = useState(false);
  const [earOdor, setEarOdor] = useState(false);
  const [eyeRedness, setEyeRedness] = useState(false);
  const [eyeDischarge, setEyeDischarge] = useState(false);
  const [earEyeNotes, setEarEyeNotes] = useState("");

  // Joints
  const [limping, setLimping] = useState(false);
  const [affectedLimb, setAffectedLimb] = useState<typeof LIMBS[number] | "">("");
  const [painScore, setPainScore] = useState(3);
  const [activityLevel, setActivityLevel] = useState<"low" | "normal" | "high">("normal");
  const [exerciseMinutes, setExerciseMinutes] = useState("");
  const [jointNotes, setJointNotes] = useState("");

  // Weight
  const [weightKg, setWeightKg] = useState("");
  const [gasBloating, setGasBloating] = useState(false);
  const [vomiting, setVomiting] = useState(false);
  const [stool, setStool] = useState<"firm" | "soft" | "loose" | "diarrhea" | "">("");
  const [appetite, setAppetite] = useState<"low" | "normal" | "high" | "">("");
  const [weightNotes, setWeightNotes] = useState("");

  // Food / water
  const [foodDescription, setFoodDescription] = useState("");
  const [waterNormal, setWaterNormal] = useState(true);
  const [waterNote, setWaterNote] = useState("");

  // General note
  const [generalNote, setGeneralNote] = useState("");
  const [mood, setMood] = useState<"muy_activo" | "normal" | "tranquilo" | "decaido" | "">("");

  // Day photo
  const [dayPhotoFile, setDayPhotoFile] = useState<File | null>(null);
  const [dayPhotoPreview, setDayPhotoPreview] = useState<string | null>(null);
  const dayFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: sub } = await supabase.from("subscriptions").select("plan").eq("user_id", user.id).single();
      setIsPaid(sub?.plan === "paid");

      const { data: dogs } = await supabase.from("dogs").select("id, name, nickname, photo_url").eq("user_id", user.id).limit(1);
      const dog = dogs?.[0];
      if (!dog) {
        setLoading(false);
        return;
      }
      setDogId(dog.id);
      setDogRef(dog.nickname?.trim() || dog.name);
      setDogInfo({ name: dog.name, photoUrl: dog.photo_url });

      const t0 = today();
      const [skinRes, respRes, earRes, jointRes, weightRes, logRes] = await Promise.all([
        supabase.from("skin_entries").select("id").eq("dog_id", dog.id).eq("entry_date", t0).limit(1),
        supabase.from("respiratory_entries").select("id").eq("dog_id", dog.id).eq("date", t0).limit(1),
        supabase.from("ear_eye_checks").select("id").eq("dog_id", dog.id).eq("date", t0).limit(1),
        supabase.from("joint_entries").select("id").eq("dog_id", dog.id).eq("date", t0).limit(1),
        supabase.from("weight_entries").select("id").eq("dog_id", dog.id).eq("date", t0).limit(1),
        fetch(`/api/daily-log?date=${t0}`).then((r) => r.ok ? r.json() : null).catch(() => null),
      ]);

      const log = logRes?.log ?? null;
      setLoggedToday({
        skin: (skinRes.data?.length ?? 0) > 0,
        respiratory: (respRes.data?.length ?? 0) > 0,
        ears_eyes: (earRes.data?.length ?? 0) > 0,
        joints: (jointRes.data?.length ?? 0) > 0,
        weight: (weightRes.data?.length ?? 0) > 0,
        food: Boolean(log?.food_description || log?.water_intake_note),
        note: Boolean(log?.general_note || log?.mood),
        photo: Boolean(log?.day_photo_url),
      });

      setLoading(false);
    }
    init();
  }, [router]);

  function toggleSection(key: SectionKey) {
    setExpanded((cur) => (cur === key ? null : key));
    setErrorKey(null);
  }

  async function uploadPhoto(file: File, folder: string): Promise<string> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !dogId) throw new Error("Not authenticated");
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${dogId}/${folder}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("skin-photos").upload(path, file, { upsert: false });
    if (uploadError) throw new Error(uploadError.message);
    const { data } = supabase.storage.from("skin-photos").getPublicUrl(path);
    return data.publicUrl;
  }

  async function saveSkin() {
    if (skinPhotoFile && !isPaid) {
      setPaywallReason("photo");
      setShowPaywall(true);
      return;
    }
    setSavingKey("skin");
    setErrorKey(null);
    try {
      let photoUrl: string | null = null;
      if (skinPhotoFile) photoUrl = await uploadPhoto(skinPhotoFile, "skin");

      const res = await fetch("/api/skin-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dog_id: dogId,
          itch_score: itchScore,
          affected_zone: affectedZone,
          notes: skinNotes || null,
          food_of_day: null,
          environment: "mixed",
          photo_url: photoUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "free_limit_reached") {
          setPaywallReason("entries");
          setShowPaywall(true);
        } else {
          setErrorKey({ key: "skin", message: data.error ?? "Error" });
        }
        return;
      }
      analytics.skinEntryCreated(1, Boolean(photoUrl));
      setLoggedToday((cur) => ({ ...cur, skin: true }));
      setExpanded(null);
    } catch (e) {
      setErrorKey({ key: "skin", message: e instanceof Error ? e.message : "Error" });
    } finally {
      setSavingKey(null);
    }
  }

  async function saveModule(moduleKey: "respiratory" | "ears_eyes" | "joints" | "weight", payload: Record<string, unknown>) {
    setSavingKey(moduleKey);
    setErrorKey(null);
    try {
      const res = await fetch("/api/module-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: moduleKey, date: today(), ...payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorKey({ key: moduleKey, message: data.error ?? "Error" });
        return;
      }
      analytics.moduleEntryCreated(moduleKey);
      setLoggedToday((cur) => ({ ...cur, [moduleKey]: true }));
      setExpanded(null);
    } catch (e) {
      setErrorKey({ key: moduleKey, message: e instanceof Error ? e.message : "Error" });
    } finally {
      setSavingKey(null);
    }
  }

  async function saveDailyLog(section: "food" | "note" | "photo", extra: Record<string, unknown>) {
    setSavingKey(section);
    setErrorKey(null);
    try {
      let day_photo_url: string | undefined;
      if (section === "photo" && dayPhotoFile) {
        day_photo_url = await uploadPhoto(dayPhotoFile, "daily");
      }
      const res = await fetch("/api/daily-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log_date: today(), ...extra, ...(day_photo_url ? { day_photo_url } : {}) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorKey({ key: section, message: data.error ?? "Error" });
        return;
      }
      setLoggedToday((cur) => ({ ...cur, [section]: true }));
      setExpanded(null);
    } catch (e) {
      setErrorKey({ key: section, message: e instanceof Error ? e.message : "Error" });
    } finally {
      setSavingKey(null);
    }
  }

  const SECTION_LABEL: Record<SectionKey, string> = {
    skin: es ? "Piel" : "Skin",
    respiratory: es ? "Respiratorio" : "Respiratory",
    ears_eyes: es ? "Oídos / Ojos" : "Ears / Eyes",
    joints: es ? "Articulaciones" : "Joints",
    weight: es ? "Peso y digestión" : "Weight & digestion",
    food: es ? "¿Qué comió hoy?" : "What did they eat today?",
    note: es ? "Nota general del día" : "General note",
    photo: es ? "Foto del día" : "Photo of the day",
  };

  if (loading) {
    return (
      <div className="px-4 pt-6">
        <Card><p className="text-sm text-[var(--brown-600)]">{es ? "Cargando..." : "Loading..."}</p></Card>
      </div>
    );
  }

  if (!dogId) {
    return (
      <div className="px-4 pt-6 space-y-4">
        <Card className="text-center">
          <div className="text-4xl mb-3">🐾</div>
          <h1 className="text-xl font-bold text-[var(--brown-800)]">
            {es ? "Agrega tu Frenchie para empezar" : "Add your Frenchie to get started"}
          </h1>
          <Button className="mt-4" onClick={() => router.push("/dogs/new")}>
            {es ? "Agregar Frenchie" : "Add Frenchie"}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-24 space-y-4">
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        dogName={dogInfo?.name}
        dogPhotoUrl={dogInfo?.photoUrl ?? undefined}
        triggerReason={paywallReason}
        locale={locale}
      />

      <div>
        <h1 className="text-2xl font-bold text-[var(--brown-800)]">
          {es ? `¿Cómo estuvo ${dogRef} hoy?` : `How was ${dogRef} today?`}
        </h1>
        <p className="text-sm text-[var(--brown-400)] mt-1">
          {new Date().toLocaleDateString(es ? "es-ES" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="space-y-2">
        {SECTIONS.map((section) => {
          const isOpen = expanded === section.key;
          const isDone = loggedToday[section.key];
          const saving = savingKey === section.key;
          const err = errorKey?.key === section.key ? errorKey.message : null;

          return (
            <div key={section.key} className={`bg-white rounded-2xl border transition-all ${isDone ? "border-green-200" : "border-[var(--brown-100)]"}`}>
              <button
                type="button"
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <span className="text-xl flex-shrink-0">{section.icon}</span>
                <span className="flex-1 text-sm font-medium text-[var(--brown-800)]">{SECTION_LABEL[section.key]}</span>
                {isDone ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                    <CheckCircle2 className="w-4 h-4" /> {es ? "Registrado hoy" : "Logged today"}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-[var(--accent)]">+ {es ? "Registrar" : "Add"}</span>
                )}
                <ChevronRight className={`w-4 h-4 text-[var(--brown-400)] flex-shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-[var(--brown-100)] pt-4 space-y-4">
                  {section.key === "skin" && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-[var(--brown-700)] mb-3">{t("tracker.itchScore")}</p>
                        <div className="flex items-center gap-4">
                          <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${itchScore >= 7 ? "bg-red-100 text-red-700" : itchScore >= 4 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                            {itchScore}
                          </span>
                          <input type="range" min={1} max={10} value={itchScore} onChange={(e) => setItchScore(Number(e.target.value))} className="flex-1 accent-[var(--accent)]" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--brown-700)] mb-2">{t("tracker.affectedZone")}</p>
                        <Chips options={ZONES} value={affectedZone} onChange={setAffectedZone} labels={Object.fromEntries(ZONES.map((z) => [z, t(`tracker.zones.${z}`)])) as Record<typeof ZONES[number], string>} />
                      </div>
                      <textarea value={skinNotes} onChange={(e) => setSkinNotes(e.target.value)} placeholder={t("tracker.notesPlaceholder")} rows={2} className="w-full rounded-xl border border-[var(--brown-200)] bg-white px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-[var(--accent)]" />
                      <input type="file" accept="image/*" capture="environment" ref={skinFileRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) { setSkinPhotoFile(f); setSkinPhotoPreview(URL.createObjectURL(f)); } }} className="hidden" />
                      {skinPhotoPreview ? (
                        <img src={skinPhotoPreview} alt="" className="w-full h-32 object-cover rounded-xl" onClick={() => skinFileRef.current?.click()} />
                      ) : (
                        <button type="button" onClick={() => skinFileRef.current?.click()} className="w-full h-20 rounded-xl border-2 border-dashed border-[var(--brown-200)] flex items-center justify-center gap-2 text-[var(--brown-400)] text-sm">
                          <Camera className="w-4 h-4" /> {t("tracker.uploadPhoto")}
                        </button>
                      )}
                      {err && <p className="text-xs text-red-600">{err}</p>}
                      <Button className="w-full" size="sm" loading={saving} onClick={saveSkin}>{t("common.save")}</Button>
                    </>
                  )}

                  {section.key === "respiratory" && (
                    <>
                      <p className="text-sm font-medium text-[var(--brown-700)]">{es ? "¿Tuvo dificultad respiratoria hoy?" : "Any breathing difficulty today?"}</p>
                      <Toggle value={respEpisode} onChange={setRespEpisode} yesLabel={es ? "Sí" : "Yes"} noLabel="No" />
                      {respEpisode && (
                        <>
                          <input type="number" value={respDuration} onChange={(e) => setRespDuration(e.target.value)} placeholder={es ? "Duración (minutos)" : "Duration (minutes)"} className="w-full rounded-xl border border-[var(--brown-200)] px-4 py-2.5 text-sm" />
                          <Chips options={TRIGGERS} value={respTrigger} onChange={setRespTrigger} labels={{ heat: es ? "Calor" : "Heat", exercise: es ? "Ejercicio" : "Exercise", excitement: es ? "Emoción" : "Excitement", sleep: es ? "Sueño" : "Sleep", unknown: es ? "Sin causa clara" : "Unclear" }} />
                          <div>
                            <p className="text-xs text-[var(--brown-400)] mb-1">{es ? "Severidad" : "Severity"}: {respSeverity}/10</p>
                            <input type="range" min={1} max={10} value={respSeverity} onChange={(e) => setRespSeverity(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
                          </div>
                        </>
                      )}
                      <input type="number" value={respTemp} onChange={(e) => setRespTemp(e.target.value)} placeholder={es ? "Temperatura ambiente hoy (°C)" : "Ambient temperature today (°C)"} className="w-full rounded-xl border border-[var(--brown-200)] px-4 py-2.5 text-sm" />
                      <textarea value={respNotes} onChange={(e) => setRespNotes(e.target.value)} placeholder={es ? "Nota libre" : "Free note"} rows={2} className="w-full rounded-xl border border-[var(--brown-200)] bg-white px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-[var(--accent)]" />
                      {err && <p className="text-xs text-red-600">{err}</p>}
                      <Button className="w-full" size="sm" loading={saving} onClick={() => saveModule("respiratory", {
                        episode_occurred: respEpisode,
                        episode_duration_minutes: respDuration || null,
                        trigger_suspected: respEpisode ? respTrigger || null : null,
                        severity: respEpisode ? respSeverity : null,
                        temperature_celsius: respTemp || null,
                        notes: respNotes || null,
                      })}>{t("common.save")}</Button>
                    </>
                  )}

                  {section.key === "ears_eyes" && (
                    <>
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brown-100)] px-4 py-3">
                        <span className="text-sm text-[var(--brown-700)]">{es ? "Oído izquierdo revisado" : "Left ear checked"}</span>
                        <input type="checkbox" checked={earLeftClean} onChange={(e) => setEarLeftClean(e.target.checked)} className="h-5 w-5 accent-[var(--accent)]" />
                      </label>
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brown-100)] px-4 py-3">
                        <span className="text-sm text-[var(--brown-700)]">{es ? "Oído derecho revisado" : "Right ear checked"}</span>
                        <input type="checkbox" checked={earRightClean} onChange={(e) => setEarRightClean(e.target.checked)} className="h-5 w-5 accent-[var(--accent)]" />
                      </label>
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brown-100)] px-4 py-3">
                        <span className="text-sm text-[var(--brown-700)]">{es ? "¿Hay secreción en oídos?" : "Ear discharge?"}</span>
                        <input type="checkbox" checked={earDischarge} onChange={(e) => setEarDischarge(e.target.checked)} className="h-5 w-5 accent-[var(--accent)]" />
                      </label>
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brown-100)] px-4 py-3">
                        <span className="text-sm text-[var(--brown-700)]">{es ? "¿Hay mal olor?" : "Odor?"}</span>
                        <input type="checkbox" checked={earOdor} onChange={(e) => setEarOdor(e.target.checked)} className="h-5 w-5 accent-[var(--accent)]" />
                      </label>
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brown-100)] px-4 py-3">
                        <span className="text-sm text-[var(--brown-700)]">{es ? "¿Enrojecimiento en ojos?" : "Eye redness?"}</span>
                        <input type="checkbox" checked={eyeRedness} onChange={(e) => setEyeRedness(e.target.checked)} className="h-5 w-5 accent-[var(--accent)]" />
                      </label>
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brown-100)] px-4 py-3">
                        <span className="text-sm text-[var(--brown-700)]">{es ? "¿Secreción en ojos?" : "Eye discharge?"}</span>
                        <input type="checkbox" checked={eyeDischarge} onChange={(e) => setEyeDischarge(e.target.checked)} className="h-5 w-5 accent-[var(--accent)]" />
                      </label>
                      <textarea value={earEyeNotes} onChange={(e) => setEarEyeNotes(e.target.value)} placeholder={es ? "Nota libre" : "Free note"} rows={2} className="w-full rounded-xl border border-[var(--brown-200)] bg-white px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-[var(--accent)]" />
                      {err && <p className="text-xs text-red-600">{err}</p>}
                      <Button className="w-full" size="sm" loading={saving} onClick={() => saveModule("ears_eyes", {
                        ear_left_clean: earLeftClean,
                        ear_right_clean: earRightClean,
                        ear_discharge: earDischarge,
                        ear_odor: earOdor,
                        eye_redness: eyeRedness,
                        eye_discharge: eyeDischarge,
                        notes: earEyeNotes || null,
                      })}>{t("common.save")}</Button>
                    </>
                  )}

                  {section.key === "joints" && (
                    <>
                      <p className="text-sm font-medium text-[var(--brown-700)]">{es ? "¿Cojeó o mostró dolor al moverse hoy?" : "Limping or showing pain today?"}</p>
                      <Toggle value={limping} onChange={setLimping} yesLabel={es ? "Sí" : "Yes"} noLabel="No" />
                      {limping && (
                        <>
                          <Chips options={LIMBS} value={affectedLimb} onChange={setAffectedLimb} labels={{ front_left: es ? "Delantera izq." : "Front left", front_right: es ? "Delantera der." : "Front right", back_left: es ? "Trasera izq." : "Back left", back_right: es ? "Trasera der." : "Back right", unknown: es ? "No sé" : "Unknown" }} />
                          <div>
                            <p className="text-xs text-[var(--brown-400)] mb-1">{es ? "Nivel de dolor" : "Pain level"}: {painScore}/10</p>
                            <input type="range" min={1} max={10} value={painScore} onChange={(e) => setPainScore(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
                          </div>
                        </>
                      )}
                      <p className="text-sm font-medium text-[var(--brown-700)]">{es ? "Nivel de actividad hoy" : "Activity level today"}</p>
                      <Chips options={["low", "normal", "high"] as const} value={activityLevel} onChange={setActivityLevel} labels={{ low: es ? "Muy poco" : "Very little", normal: es ? "Normal" : "Normal", high: es ? "Mucho" : "A lot" }} />
                      <input type="number" value={exerciseMinutes} onChange={(e) => setExerciseMinutes(e.target.value)} placeholder={es ? "Minutos de ejercicio" : "Exercise minutes"} className="w-full rounded-xl border border-[var(--brown-200)] px-4 py-2.5 text-sm" />
                      <textarea value={jointNotes} onChange={(e) => setJointNotes(e.target.value)} placeholder={es ? "Nota libre" : "Free note"} rows={2} className="w-full rounded-xl border border-[var(--brown-200)] bg-white px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-[var(--accent)]" />
                      {err && <p className="text-xs text-red-600">{err}</p>}
                      <Button className="w-full" size="sm" loading={saving} onClick={() => saveModule("joints", {
                        limping,
                        affected_limb: limping ? affectedLimb || null : null,
                        pain_score: limping ? painScore : null,
                        activity_level: activityLevel,
                        exercise_minutes: exerciseMinutes || null,
                        notes: jointNotes || null,
                      })}>{t("common.save")}</Button>
                    </>
                  )}

                  {section.key === "weight" && (
                    <>
                      <input type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder={es ? "Peso hoy (kg)" : "Weight today (kg)"} className="w-full rounded-xl border border-[var(--brown-200)] px-4 py-2.5 text-sm" />
                      <p className="text-sm font-medium text-[var(--brown-700)]">{es ? "Cómo fue la digestión" : "How was digestion"}</p>
                      <Chips options={["firm", "soft", "loose", "diarrhea"] as const} value={stool} onChange={setStool} labels={{ firm: es ? "Normal" : "Firm", soft: es ? "Blanda" : "Soft", loose: es ? "Suelta" : "Loose", diarrhea: es ? "Diarrea" : "Diarrhea" }} />
                      <p className="text-sm font-medium text-[var(--brown-700)]">{es ? "Apetito" : "Appetite"}</p>
                      <Chips options={["low", "normal", "high"] as const} value={appetite} onChange={setAppetite} labels={{ low: es ? "Comió poco" : "Ate less", normal: es ? "Normal" : "Normal", high: es ? "Comió más" : "Ate more" }} />
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brown-100)] px-4 py-3">
                        <span className="text-sm text-[var(--brown-700)]">{es ? "¿Gases o hinchazón?" : "Gas or bloating?"}</span>
                        <input type="checkbox" checked={gasBloating} onChange={(e) => setGasBloating(e.target.checked)} className="h-5 w-5 accent-[var(--accent)]" />
                      </label>
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brown-100)] px-4 py-3">
                        <span className="text-sm text-[var(--brown-700)]">{es ? "¿Vómito?" : "Vomiting?"}</span>
                        <input type="checkbox" checked={vomiting} onChange={(e) => setVomiting(e.target.checked)} className="h-5 w-5 accent-[var(--accent)]" />
                      </label>
                      <textarea value={weightNotes} onChange={(e) => setWeightNotes(e.target.value)} placeholder={es ? "Nota libre" : "Free note"} rows={2} className="w-full rounded-xl border border-[var(--brown-200)] bg-white px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-[var(--accent)]" />
                      {err && <p className="text-xs text-red-600">{err}</p>}
                      <Button className="w-full" size="sm" loading={saving} onClick={() => saveModule("weight", {
                        weight_kg: weightKg,
                        gas_bloating: gasBloating,
                        vomiting,
                        stool_consistency: stool || null,
                        appetite: appetite || null,
                        notes: weightNotes || null,
                      })}>{t("common.save")}</Button>
                    </>
                  )}

                  {section.key === "food" && (
                    <>
                      <textarea value={foodDescription} onChange={(e) => setFoodDescription(e.target.value)} placeholder={es ? "Ej: Royal Canin Frenchie 150g + snack de salmón" : "E.g. Royal Canin Frenchie 150g + salmon snack"} rows={2} className="w-full rounded-xl border border-[var(--brown-200)] bg-white px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-[var(--accent)]" />
                      <p className="text-sm font-medium text-[var(--brown-700)]">{es ? "¿Tomó agua normal hoy?" : "Drank water normally today?"}</p>
                      <Toggle value={waterNormal} onChange={setWaterNormal} yesLabel={es ? "Sí" : "Yes"} noLabel="No" />
                      {!waterNormal && (
                        <input value={waterNote} onChange={(e) => setWaterNote(e.target.value)} placeholder={es ? "¿Más o menos de lo usual?" : "More or less than usual?"} className="w-full rounded-xl border border-[var(--brown-200)] px-4 py-2.5 text-sm" />
                      )}
                      {err && <p className="text-xs text-red-600">{err}</p>}
                      <Button className="w-full" size="sm" loading={saving} onClick={() => saveDailyLog("food", { food_description: foodDescription || null, water_intake_normal: waterNormal, water_intake_note: !waterNormal ? waterNote || null : null })}>{t("common.save")}</Button>
                    </>
                  )}

                  {section.key === "note" && (
                    <>
                      <textarea value={generalNote} onChange={(e) => setGeneralNote(e.target.value)} placeholder={es ? `¿Algo más que quieras recordar sobre el día de ${dogRef}?` : `Anything else to remember about ${dogRef}'s day?`} rows={3} className="w-full rounded-xl border border-[var(--brown-200)] bg-white px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-[var(--accent)]" />
                      <p className="text-sm font-medium text-[var(--brown-700)]">{es ? "Estado de ánimo" : "Mood"}</p>
                      <Chips options={["muy_activo", "normal", "tranquilo", "decaido"] as const} value={mood} onChange={setMood} labels={{ muy_activo: es ? "Muy activo" : "Very active", normal: es ? "Normal" : "Normal", tranquilo: es ? "Más tranquilo" : "Calmer", decaido: es ? "Decaído" : "Down" }} />
                      {err && <p className="text-xs text-red-600">{err}</p>}
                      <Button className="w-full" size="sm" loading={saving} onClick={() => saveDailyLog("note", { general_note: generalNote || null, mood: mood || null })}>{t("common.save")}</Button>
                    </>
                  )}

                  {section.key === "photo" && (
                    <>
                      <input type="file" accept="image/*" capture="environment" ref={dayFileRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) { setDayPhotoFile(f); setDayPhotoPreview(URL.createObjectURL(f)); } }} className="hidden" />
                      {dayPhotoPreview ? (
                        <img src={dayPhotoPreview} alt="" className="w-full h-40 object-cover rounded-xl" onClick={() => dayFileRef.current?.click()} />
                      ) : (
                        <button type="button" onClick={() => dayFileRef.current?.click()} className="w-full h-32 rounded-xl border-2 border-dashed border-[var(--brown-200)] flex flex-col items-center justify-center gap-2 text-[var(--brown-400)]">
                          <Camera className="w-8 h-8" />
                          <span className="text-sm">{t("tracker.uploadPhoto")}</span>
                        </button>
                      )}
                      {err && <p className="text-xs text-red-600">{err}</p>}
                      <Button className="w-full" size="sm" loading={saving} disabled={!dayPhotoFile} onClick={() => saveDailyLog("photo", {})}>{t("common.save")}</Button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button className="w-full" size="lg" onClick={() => router.push("/tracker")}>
        {es ? "Ver historial completo →" : "View full history →"}
      </Button>
    </div>
  );
}
