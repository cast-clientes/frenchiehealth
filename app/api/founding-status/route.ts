import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Cache this public, non-sensitive response for 60 seconds at the CDN/Next.js level
// so the anon-key client is not instantiated on every unauthenticated request.
export const revalidate = 60;

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("founding_members_counter")
    .select("spots_taken, total_spots, offer_active, offer_ends_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) {
    return NextResponse.json({
      spots_taken: 0,
      total_spots: 100,
      offer_active: false,
      offer_ends_at: null,
    });
  }

  return NextResponse.json(data);
}
