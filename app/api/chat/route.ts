import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildAIChatIdentityBlock } from "@/lib/parentDisplay";

export const dynamic = "force-dynamic";

const FREE_CHAT_TOTAL_LIMIT = parseInt(process.env.FREE_CHAT_TOTAL_LIMIT ?? "5", 10);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const isPaid = sub?.plan === "paid";

  if (!isPaid) {
    const { count } = await supabase
      .from("chat_messages")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("role", "user");

    if ((count ?? 0) >= FREE_CHAT_TOTAL_LIMIT) {
      return NextResponse.json(
        { error: "limit_reached", limit: FREE_CHAT_TOTAL_LIMIT },
        { status: 429 }
      );
    }
  }

  let parsedBody: { message?: string; dogId?: string; locale?: string };
  try {
    parsedBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { message, dogId, locale } = parsedBody;

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }
  const language = locale === "es" ? "español" : "English";

  let skinContext = "";
  let dogProfileContext = "";
  let weightContext = "";
  let respiratoryContext = "";
  let identityBlock = "";
  let dogName = locale === "es" ? "tu Frenchie" : "your Frenchie";

  // Fetch parent identity for personalized language
  const { data: profile } = await supabase
    .from("profiles")
    .select("parent_role, parent_role_custom, parent_role_display")
    .eq("id", user.id)
    .single();

  if (dogId) {
    const { data: ownedDog } = await supabase
      .from("dogs")
      .select("id")
      .eq("id", dogId)
      .eq("user_id", user.id)
      .single();

    if (!ownedDog) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Skin entries context (existing)
    const { data: recentEntries } = await supabase
      .from("skin_entries")
      .select("entry_date, itch_score, affected_zone, notes, food_of_day")
      .eq("dog_id", dogId)
      .order("entry_date", { ascending: false })
      .limit(5);

    if (recentEntries && recentEntries.length > 0) {
      skinContext = `\n\nRecent skin tracking data for this dog (last ${recentEntries.length} entries):\n`;
      recentEntries.forEach((e) => {
        skinContext += `- ${e.entry_date}: itch score ${e.itch_score}/10, zone: ${e.affected_zone}${
          e.food_of_day ? `, food: ${e.food_of_day}` : ""
        }${e.notes ? `, notes: ${e.notes}` : ""}\n`;
      });
    }

    // Weight history (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const { data: weightEntries } = await supabase
      .from("weight_entries")
      .select("date, weight_kg, gas_bloating, vomiting, appetite")
      .eq("dog_id", dogId)
      .gte("date", thirtyDaysAgo)
      .order("date", { ascending: false })
      .limit(10);

    if (weightEntries && weightEntries.length > 0) {
      weightContext = `\n\nWeight & digestion (last 30 days):\n`;
      weightEntries.forEach((w) => {
        weightContext += `- ${w.date}: ${w.weight_kg}kg${w.gas_bloating ? ", gas/bloating" : ""}${w.vomiting ? ", vomiting" : ""}${w.appetite ? `, appetite: ${w.appetite}` : ""}\n`;
      });
    }

    // Respiratory episodes (last 30 days)
    const { data: respiratoryEntries } = await supabase
      .from("respiratory_entries")
      .select("date, episode_occurred, severity, trigger_suspected, temperature_celsius")
      .eq("dog_id", dogId)
      .eq("episode_occurred", true)
      .gte("date", thirtyDaysAgo)
      .order("date", { ascending: false })
      .limit(10);

    if (respiratoryEntries && respiratoryEntries.length > 0) {
      respiratoryContext = `\n\nRespiratory episodes (last 30 days):\n`;
      respiratoryEntries.forEach((r) => {
        respiratoryContext += `- ${r.date}: severity ${r.severity}/10${r.trigger_suspected ? `, trigger: ${r.trigger_suspected}` : ""}${r.temperature_celsius ? `, temp: ${r.temperature_celsius}°C` : ""}\n`;
      });
    }

    // Dog profile with allergies/medications/identity
    const { data: dogProfile } = (await supabase
      .from("dogs")
      .select("name, nickname, pronoun, known_allergies, current_medications")
      .eq("id", dogId)
      .single()) as any;

    if (dogProfile) {
      if (dogProfile.name) dogName = dogProfile.name;
      dogProfileContext = `\n\nDog profile:`;
      dogProfileContext += `\n- Name: ${dogProfile.name}`;
      if (dogProfile.known_allergies?.length) {
        dogProfileContext += `\n- Known allergies: ${dogProfile.known_allergies.join(", ")}`;
      }
      if (dogProfile.current_medications?.length) {
        dogProfileContext += `\n- Current medications: ${dogProfile.current_medications.join(", ")}`;
      }

      // Build personalized identity block
      if (profile?.parent_role && profile.parent_role !== "parent") {
        identityBlock = buildAIChatIdentityBlock({
          parentRole: profile.parent_role,
          parentRoleCustom: profile.parent_role_custom,
          dogName: dogProfile.name ?? dogName,
          dogNickname: dogProfile.nickname,
          dogPronoun: (dogProfile.pronoun === "ella" ? "ella" : "el") as "el" | "ella",
          language: locale === "es" ? "es" : "en",
        });
      }
    }
  }

  const systemPrompt = `Eres el asistente de Frenchie Care, un amigo experto en Bulldogs Franceses que habla de manera cálida, simple y directa.

Tu base de conocimiento cubre las 6 áreas de salud del Bulldog Francés: piel (irritación de pliegues, alergias, hot spots, picazón), respiratorio (cara chata, manejo del calor, episodios de estrés), oídos y ojos (infecciones, ojo de cereza, úlceras), articulaciones (cadera, espalda, adaptación de ejercicio), peso y digestión (gases, peso ideal, sensibilidades alimentarias), salud general (vacunas, parásitos, dientes, visitas al vet).

REGLAS DE FORMATO — MUY IMPORTANTES, NUNCA LAS ROMPAS:
- NUNCA uses asteriscos (*texto*, **texto**) para nada
- NUNCA uses hashtags (###, ##, #) para títulos
- NUNCA uses guiones al inicio de línea para hacer listas (- item)
- NUNCA uses formato Markdown de ningún tipo
- SÍ puedes usar emojis para separar ideas o dar calidez 🐾
- SÍ puedes hacer saltos de línea dobles para separar párrafos
- SÍ puedes usar números simples para listas: "1. Primero...", "2. Segundo..."
- Las respuestas deben sonar como un mensaje de WhatsApp de un amigo que sabe mucho, no como un documento médico

REGLAS DE LENGUAJE — NUNCA LAS ROMPAS:
- NUNCA digas "tu perro", "tu mascota" o "el animal" — siempre usa el nombre: ${dogName}
- Habla en este idioma: ${language}
${identityBlock}

REGLAS DE TONO — SIEMPRE:
- Simple: si hay una palabra difícil, usa una fácil. "Dermatitis" → "irritación de piel". "Queratinización" → "piel que se pela". "Malassezia" → "un hongo en la piel".
- Corto: máximo 4-5 oraciones por párrafo. Si necesitás más, hacés un salto de línea.
- Cálido: empezá reconociendo cómo se siente el dueño antes de dar información.
- Accionable: terminá siempre con algo concreto que el dueño puede hacer HOY.
- Con límites claros: si el tema requiere diagnóstico veterinario, decilo con cariño, no como advertencia legal fría.

REGLAS DE SALUD — NUNCA LAS ROMPAS:
- Nunca diagnosticás
- Nunca decís qué medicamento dar ni en qué dosis
- Si te preguntan directamente si sos una IA, confirmalo siempre
- Siempre terminás las respuestas sobre síntomas con: "🐾 Recordá: soy una herramienta de seguimiento con IA — tu vet hace el diagnóstico."
- Si el síntoma suena grave (sangrado, convulsiones, dificultad para respirar, letargo extremo), la respuesta debe empezar con: "Esto necesita atención del vet hoy mismo 🚨 No esperés."

Si el usuario escribe en inglés, respondé en inglés y aplicá las mismas reglas (sin Markdown, simple, cálido, accionable).
${dogProfileContext}${skinContext}${weightContext}${respiratoryContext}

Cuando notes patrones entre módulos (por ejemplo, episodios respiratorios que coinciden con días de calor, o aumento de peso que puede empeorar la respiración), mencionalo con suavidad, como una observación, nunca como un diagnóstico.`;

  // Re-fetch conversation history from DB to prevent history forgery (max 20 messages)
  const chatHistoryRes = dogId
    ? await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("user_id", user.id)
        .eq("dog_id", dogId)
        .order("created_at", { ascending: false })
        .limit(20)
    : await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("user_id", user.id)
        .is("dog_id", null)
        .order("created_at", { ascending: false })
        .limit(20);

  const messages: Array<{ role: "user" | "assistant"; content: string }> = [
    ...((chatHistoryRes.data ?? []).reverse() as Array<{ role: "user" | "assistant"; content: string }>),
    { role: "user", content: message.trim() },
  ];

  const model = isPaid ? "mistral-medium-latest" : "mistral-small-latest";
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "AI service error" }, { status: 502 });
  }

  const data = await res.json();
  const assistantMessage: string = data.choices?.[0]?.message?.content ?? "";

  if (!assistantMessage) {
    return NextResponse.json({ error: "AI returned empty response" }, { status: 502 });
  }

  // Persist both messages only after a successful AI round-trip
  await supabase.from("chat_messages").insert([
    {
      user_id: user.id,
      dog_id: dogId ?? null,
      role: "user",
      content: message.trim(),
    },
    {
      user_id: user.id,
      dog_id: dogId ?? null,
      role: "assistant",
      content: assistantMessage,
    },
  ]);

  return NextResponse.json({ message: assistantMessage });
}
