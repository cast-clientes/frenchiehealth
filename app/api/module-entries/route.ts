import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ModuleKey =
  | "respiratory"
  | "ears_eyes"
  | "joints"
  | "weight"
  | "health_calendar";

const MODULE_TABLES = {
  respiratory: "respiratory_entries",
  ears_eyes: "ear_eye_checks",
  joints: "joint_entries",
  weight: "weight_entries",
  health_calendar: "health_events",
} as const;

function isModuleKey(value: string | null): value is ModuleKey {
  return Boolean(value && value in MODULE_TABLES);
}

function cleanText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function cleanNumber(value: unknown) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function cleanBool(value: unknown) {
  return Boolean(value);
}

async function getCurrentDog(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: dogs } = await supabase
    .from("dogs")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  return dogs?.[0] ?? null;
}

export async function GET(req: NextRequest) {
  const moduleKey = req.nextUrl.searchParams.get("module");

  if (!isModuleKey(moduleKey)) {
    return NextResponse.json({ error: "Invalid module" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dog = await getCurrentDog(supabase, user.id);
  if (!dog) {
    return NextResponse.json({ dog: null, entries: [] });
  }

  const table = MODULE_TABLES[moduleKey];
  const dateColumn = moduleKey === "health_calendar" ? "event_date" : "date";
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("dog_id", dog.id)
    .order(dateColumn, { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dog, entries: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const moduleKey = typeof body.module === "string" ? body.module : null;

  if (!isModuleKey(moduleKey)) {
    return NextResponse.json({ error: "Invalid module" }, { status: 400 });
  }

  const dog = await getCurrentDog(supabase, user.id);
  if (!dog) {
    return NextResponse.json(
      { error: "Please add your Frenchie profile first." },
      { status: 400 },
    );
  }

  const date = cleanText(body.date) ?? new Date().toISOString().split("T")[0];
  let insertPayload: Record<string, unknown>;

  switch (moduleKey) {
    case "respiratory":
      insertPayload = {
        dog_id: dog.id,
        user_id: user.id,
        date,
        episode_occurred: cleanBool(body.episode_occurred),
        episode_duration_minutes: cleanNumber(body.episode_duration_minutes),
        trigger_suspected: cleanText(body.trigger_suspected),
        severity: cleanNumber(body.severity),
        temperature_celsius: cleanNumber(body.temperature_celsius),
        notes: cleanText(body.notes),
      };
      break;
    case "ears_eyes":
      insertPayload = {
        dog_id: dog.id,
        user_id: user.id,
        date,
        ear_left_clean: cleanBool(body.ear_left_clean),
        ear_right_clean: cleanBool(body.ear_right_clean),
        ear_discharge: cleanBool(body.ear_discharge),
        ear_odor: cleanBool(body.ear_odor),
        eye_discharge: cleanBool(body.eye_discharge),
        eye_redness: cleanBool(body.eye_redness),
        cherry_eye_visible: cleanBool(body.cherry_eye_visible),
        notes: cleanText(body.notes),
        photo_url: null,
      };
      break;
    case "joints":
      insertPayload = {
        dog_id: dog.id,
        user_id: user.id,
        date,
        limping: cleanBool(body.limping),
        affected_limb: cleanText(body.affected_limb),
        pain_score: cleanNumber(body.pain_score),
        activity_level: cleanText(body.activity_level),
        exercise_minutes: cleanNumber(body.exercise_minutes),
        notes: cleanText(body.notes),
      };
      break;
    case "weight":
      if (cleanNumber(body.weight_kg) === null) {
        return NextResponse.json({ error: "Weight is required" }, { status: 400 });
      }
      insertPayload = {
        dog_id: dog.id,
        user_id: user.id,
        date,
        weight_kg: cleanNumber(body.weight_kg),
        gas_bloating: cleanBool(body.gas_bloating),
        vomiting: cleanBool(body.vomiting),
        stool_consistency: cleanText(body.stool_consistency),
        appetite: cleanText(body.appetite),
        notes: cleanText(body.notes),
      };
      break;
    case "health_calendar":
      insertPayload = {
        dog_id: dog.id,
        user_id: user.id,
        event_type: cleanText(body.event_type) ?? "vet_visit",
        event_name: cleanText(body.event_name) ?? "Health event",
        event_date: date,
        next_due_date: cleanText(body.next_due_date),
        vet_name: cleanText(body.vet_name),
        notes: cleanText(body.notes),
        reminder_sent: false,
      };
      break;
  }

  const { data, error } = await supabase
    .from(MODULE_TABLES[moduleKey])
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data });
}
