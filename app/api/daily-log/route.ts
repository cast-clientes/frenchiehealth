import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function cleanText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
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
  const date = req.nextUrl.searchParams.get("date") ?? new Date().toISOString().split("T")[0];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dog = await getCurrentDog(supabase, user.id);
  if (!dog) {
    return NextResponse.json({ dog: null, log: null });
  }

  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("dog_id", dog.id)
    .eq("log_date", date)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dog, log: data ?? null });
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
  const dog = await getCurrentDog(supabase, user.id);
  if (!dog) {
    return NextResponse.json({ error: "Please add your Frenchie profile first." }, { status: 400 });
  }

  const log_date = cleanText(body.log_date) ?? new Date().toISOString().split("T")[0];

  const payload = {
    dog_id: dog.id,
    user_id: user.id,
    log_date,
    food_description: cleanText(body.food_description),
    water_intake_normal: typeof body.water_intake_normal === "boolean" ? body.water_intake_normal : null,
    water_intake_note: cleanText(body.water_intake_note),
    mood: cleanText(body.mood),
    day_photo_url: cleanText(body.day_photo_url),
    general_note: cleanText(body.general_note),
  };

  const { data, error } = await supabase
    .from("daily_logs")
    .upsert(payload, { onConflict: "dog_id,log_date" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ log: data });
}
