import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateRecommendations } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

const FREE_ENTRIES_LIMIT = parseInt(process.env.FREE_ENTRIES_LIMIT ?? "3", 10);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check free plan limit
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  if (sub?.plan !== "paid") {
    // NOTE: The free tier limit is intentionally per-user (all dogs combined),
    // not per-dog. A user with multiple dogs shares a single entry quota.
    // If a per-dog limit is ever needed, add .eq('dog_id', dog_id) here and
    // move the dog ownership check above this block.
    const { count } = await supabase
      .from("skin_entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((count ?? 0) >= FREE_ENTRIES_LIMIT) {
      return NextResponse.json(
        { error: "free_limit_reached", limit: FREE_ENTRIES_LIMIT },
        { status: 402 }
      );
    }
  }

  const body = await req.json();
  const { dog_id, itch_score, affected_zone, notes, food_of_day, environment, photo_url } = body;

  if (!dog_id || typeof dog_id !== "string") {
    return NextResponse.json({ error: "Missing dog_id" }, { status: 400 });
  }
  if (!affected_zone) {
    return NextResponse.json({ error: "Missing affected_zone" }, { status: 400 });
  }
  if (
    typeof itch_score !== "number" ||
    !Number.isInteger(itch_score) ||
    itch_score < 1 ||
    itch_score > 10
  ) {
    return NextResponse.json(
      { error: "itch_score must be an integer between 1 and 10" },
      { status: 400 }
    );
  }

  // Photo upload is a paid feature
  if (sub?.plan !== "paid" && photo_url) {
    return NextResponse.json(
      { error: "photo_upload_not_allowed" },
      { status: 400 }
    );
  }

  const { data: dog } = await supabase
    .from("dogs")
    .select("id")
    .eq("id", dog_id)
    .eq("user_id", user.id)
    .single();

  if (!dog) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: entry, error } = await supabase
    .from("skin_entries")
    .insert({
      dog_id,
      user_id: user.id,
      itch_score,
      affected_zone,
      notes,
      food_of_day,
      environment,
      photo_url,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch recent entries for recommendation engine
  const { data: history } = await supabase
    .from("skin_entries")
    .select("*")
    .eq("dog_id", dog_id)
    .order("entry_date", { ascending: false })
    .limit(10);

  const recommendations = generateRecommendations(history ?? [], entry);

  return NextResponse.json({ entry, recommendations });
}
