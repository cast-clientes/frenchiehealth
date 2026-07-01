import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { createElement } from "react";
import { getParentTitle } from "@/lib/parentDisplay";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 4, fontWeight: 700 },
  subtitle: { fontSize: 10, color: "#6b5a4e", marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: 700, marginTop: 16, marginBottom: 6, color: "#2c1810" },
  row: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#e5ded6", paddingVertical: 4 },
  cellDate: { width: 70 },
  cellBody: { flex: 1 },
  empty: { color: "#9c9086", fontStyle: "italic", marginBottom: 4 },
  disclaimer: { marginTop: 24, fontSize: 8, color: "#9c9086", borderTopWidth: 0.5, borderTopColor: "#e5ded6", paddingTop: 8 },
});

function fmt(date: string) {
  return date;
}

async function getCurrentDogAndProfile(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const [{ data: dogs }, { data: profile }] = await Promise.all([
    supabase.from("dogs").select("*").eq("user_id", userId).limit(1),
    supabase.from("profiles").select("full_name, parent_role, parent_role_custom").eq("id", userId).single(),
  ]);
  return { dog: dogs?.[0] ?? null, profile };
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: sub } = await supabase.from("subscriptions").select("plan").eq("user_id", user.id).single();
  if (sub?.plan !== "paid") {
    return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
  }

  const { dog, profile } = await getCurrentDogAndProfile(supabase, user.id);
  if (!dog) {
    return NextResponse.json({ error: "No dog found" }, { status: 400 });
  }

  const locale = req.nextUrl.pathname.split("/")[1] === "es" ? "es" : "en";
  const es = locale === "es";
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [skinRes, respRes, earEyeRes, jointRes, weightRes] = await Promise.all([
    supabase.from("skin_entries").select("*").eq("dog_id", dog.id).gte("entry_date", ninetyDaysAgo).order("entry_date", { ascending: false }),
    supabase.from("respiratory_entries").select("*").eq("dog_id", dog.id).gte("date", ninetyDaysAgo).order("date", { ascending: false }),
    supabase.from("ear_eye_checks").select("*").eq("dog_id", dog.id).gte("date", ninetyDaysAgo).order("date", { ascending: false }),
    supabase.from("joint_entries").select("*").eq("dog_id", dog.id).gte("date", ninetyDaysAgo).order("date", { ascending: false }),
    supabase.from("weight_entries").select("*").eq("dog_id", dog.id).gte("date", ninetyDaysAgo).order("date", { ascending: false }),
  ]);

  const ownerTitle = profile
    ? getParentTitle({
        parentRole: profile.parent_role ?? "parent",
        parentRoleCustom: profile.parent_role_custom,
        dogName: dog.name,
        includesDogName: false,
        language: locale,
      })
    : null;

  const zoneLabels: Record<string, { en: string; es: string }> = {
    facial_folds: { en: "Facial folds", es: "Pliegues faciales" },
    back: { en: "Back / Body", es: "Lomo / Cuerpo" },
    paws: { en: "Paws", es: "Patas" },
    ears: { en: "Ears", es: "Orejas" },
    other: { en: "Other", es: "Otro" },
  };

  const skinEntries = skinRes.data ?? [];
  const respEntries = respRes.data ?? [];
  const earEyeEntries = earEyeRes.data ?? [];
  const jointEntries = jointRes.data ?? [];
  const weightEntries = weightRes.data ?? [];

  const doc = createElement(
    Document,
    {},
    createElement(
      Page,
      { size: "A4", style: styles.page },
      createElement(Text, { style: styles.title }, `${dog.name} — ${es ? "Historial de salud" : "Health history"}`),
      createElement(
        Text,
        { style: styles.subtitle },
        `${es ? "Últimos 90 días" : "Last 90 days"}${ownerTitle ? ` · ${es ? "Preparado por" : "Prepared by"}: ${ownerTitle}` : ""} · ${new Date().toISOString().split("T")[0]}`
      ),

      createElement(Text, { style: styles.sectionTitle }, es ? "🐾 Piel" : "🐾 Skin"),
      skinEntries.length === 0
        ? createElement(Text, { style: styles.empty }, es ? "Sin registros" : "No entries")
        : skinEntries.map((e) =>
            createElement(
              View,
              { key: e.id, style: styles.row },
              createElement(Text, { style: styles.cellDate }, fmt(e.entry_date)),
              createElement(
                Text,
                { style: styles.cellBody },
                `${es ? "Score" : "Score"} ${e.itch_score}/10 · ${zoneLabels[e.affected_zone]?.[locale] ?? e.affected_zone}${e.notes ? ` — ${e.notes}` : ""}`
              )
            )
          ),

      createElement(Text, { style: styles.sectionTitle }, es ? "🫁 Respiratorio" : "🫁 Respiratory"),
      respEntries.length === 0
        ? createElement(Text, { style: styles.empty }, es ? "Sin registros" : "No entries")
        : respEntries.map((e) =>
            createElement(
              View,
              { key: e.id, style: styles.row },
              createElement(Text, { style: styles.cellDate }, fmt(e.date)),
              createElement(
                Text,
                { style: styles.cellBody },
                e.episode_occurred
                  ? `${es ? "Episodio" : "Episode"} · ${es ? "severidad" : "severity"} ${e.severity ?? "-"}/10${e.trigger_suspected ? ` · ${es ? "detonante" : "trigger"}: ${e.trigger_suspected}` : ""}${e.temperature_celsius ? ` · ${e.temperature_celsius}°C` : ""}`
                  : es ? "Sin episodios" : "No episodes"
              )
            )
          ),

      createElement(Text, { style: styles.sectionTitle }, es ? "👂 Oídos / Ojos" : "👂 Ears / Eyes"),
      earEyeEntries.length === 0
        ? createElement(Text, { style: styles.empty }, es ? "Sin registros" : "No entries")
        : earEyeEntries.map((e) =>
            createElement(
              View,
              { key: e.id, style: styles.row },
              createElement(Text, { style: styles.cellDate }, fmt(e.date)),
              createElement(
                Text,
                { style: styles.cellBody },
                [
                  e.ear_discharge ? (es ? "secreción en oído" : "ear discharge") : null,
                  e.ear_odor ? (es ? "mal olor" : "odor") : null,
                  e.eye_redness ? (es ? "ojos rojos" : "eye redness") : null,
                  e.eye_discharge ? (es ? "secreción ocular" : "eye discharge") : null,
                  e.cherry_eye_visible ? "cherry eye" : null,
                ]
                  .filter(Boolean)
                  .join(", ") || (es ? "Sin hallazgos" : "No findings")
              )
            )
          ),

      createElement(Text, { style: styles.sectionTitle }, es ? "🦴 Articulaciones" : "🦴 Joints"),
      jointEntries.length === 0
        ? createElement(Text, { style: styles.empty }, es ? "Sin registros" : "No entries")
        : jointEntries.map((e) =>
            createElement(
              View,
              { key: e.id, style: styles.row },
              createElement(Text, { style: styles.cellDate }, fmt(e.date)),
              createElement(
                Text,
                { style: styles.cellBody },
                e.limping
                  ? `${es ? "Cojeó" : "Limping"} · ${e.affected_limb ?? "-"} · ${es ? "dolor" : "pain"} ${e.pain_score ?? "-"}/10`
                  : es ? "Sin cojera" : "No limping"
              )
            )
          ),

      createElement(Text, { style: styles.sectionTitle }, es ? "⚖️ Peso y digestión" : "⚖️ Weight & digestion"),
      weightEntries.length === 0
        ? createElement(Text, { style: styles.empty }, es ? "Sin registros" : "No entries")
        : weightEntries.map((e) =>
            createElement(
              View,
              { key: e.id, style: styles.row },
              createElement(Text, { style: styles.cellDate }, fmt(e.date)),
              createElement(
                Text,
                { style: styles.cellBody },
                `${e.weight_kg} kg${e.appetite ? ` · ${es ? "apetito" : "appetite"}: ${e.appetite}` : ""}${e.stool_consistency ? ` · ${es ? "heces" : "stool"}: ${e.stool_consistency}` : ""}${e.gas_bloating ? ` · ${es ? "gases" : "gas"}` : ""}${e.vomiting ? ` · ${es ? "vómito" : "vomiting"}` : ""}`
              )
            )
          ),

      createElement(
        Text,
        { style: styles.disclaimer },
        es
          ? "Este reporte es solo para fines informativos y no constituye asesoramiento médico. Siempre consulta a un veterinario licenciado para diagnóstico y tratamiento."
          : "This report is for informational purposes only and does not constitute medical advice. Always consult a licensed veterinarian for diagnosis and treatment."
      )
    )
  );

  const buffer = await renderToBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${dog.name}-health-history.pdf"`,
    },
  });
}
