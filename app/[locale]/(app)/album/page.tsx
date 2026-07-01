import { createClient } from "@/lib/supabase/server";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

interface MilestoneRow {
  id: string;
  emoji: string | null;
  title: string;
  milestone_date: string;
  description: string | null;
  photo_url: string | null;
}

interface SkinEntryPhoto {
  id: string;
  entry_date: string;
  photo_url: string;
  itch_score: number;
}

export default async function AlbumPage() {
  const supabase = await createClient();
  const locale = await getLocale();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: dogs } = await supabase
    .from("dogs")
    .select("*")
    .eq("user_id", user!.id)
    .limit(1);
  const dog = dogs?.[0];

  const { data: milestones } = dog
    ? await supabase
        .from("dog_milestones")
        .select("*")
        .eq("dog_id", dog.id)
        .order("milestone_date", { ascending: false })
    : { data: [] };

  const { data: skinEntries } = dog
    ? await supabase
        .from("skin_entries")
        .select("id, entry_date, photo_url, itch_score")
        .eq("dog_id", dog.id)
        .not("photo_url", "is", null)
        .order("entry_date", { ascending: false })
        .limit(20)
    : { data: [] };

  const es = locale === "es";

  return (
    <div style={{ padding: "1.5rem", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "var(--brown-800)",
            marginBottom: "0.25rem",
          }}
        >
          {es ? "📸 Álbum de Vida" : "📸 Life Album"}
        </h1>
        {dog && (
          <p style={{ color: "var(--brown-600)", fontSize: "0.9rem" }}>
            {es
              ? `La historia completa de ${dog.name}`
              : `${dog.name}'s complete story`}
          </p>
        )}
      </div>

      {/* Milestones */}
      {milestones && milestones.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontWeight: 700,
              color: "var(--brown-800)",
              marginBottom: "1rem",
              fontSize: "1rem",
            }}
          >
            {es ? "Hitos" : "Milestones"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {(milestones as MilestoneRow[]).map((m) => (
              <div
                key={m.id}
                style={{
                  background: "white",
                  border: "1.5px solid var(--brown-100)",
                  borderRadius: "1rem",
                  padding: "1rem",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ fontSize: "1.75rem", flexShrink: 0 }}>
                  {m.emoji ?? "🐾"}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--brown-800)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {m.title}
                  </div>
                  <div
                    style={{
                      color: "var(--brown-400)",
                      fontSize: "0.75rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {m.milestone_date}
                  </div>
                  {m.description && (
                    <div style={{ color: "var(--brown-700)", fontSize: "0.85rem" }}>
                      {m.description}
                    </div>
                  )}
                </div>
                {m.photo_url && (
                  <img
                    src={m.photo_url}
                    alt={m.title}
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "0.5rem",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo grid from skin entries */}
      {skinEntries && skinEntries.length > 0 && (
        <div>
          <h2
            style={{
              fontWeight: 700,
              color: "var(--brown-800)",
              marginBottom: "1rem",
              fontSize: "1rem",
            }}
          >
            {es ? "Fotos de seguimiento" : "Tracking photos"}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.5rem",
            }}
          >
            {(skinEntries as SkinEntryPhoto[]).map((e) => (
              <div
                key={e.id}
                style={{
                  position: "relative",
                  aspectRatio: "1",
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                }}
              >
                <img
                  src={e.photo_url}
                  alt={`Skin photo from ${e.entry_date}, itch score ${e.itch_score}/10`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "0.25rem",
                    left: "0.25rem",
                    background: "rgba(0,0,0,0.6)",
                    borderRadius: "0.375rem",
                    padding: "0.1rem 0.375rem",
                    fontSize: "0.65rem",
                    color: "white",
                  }}
                >
                  {e.entry_date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!dog && (
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <p style={{ color: "var(--brown-600)", marginBottom: "1rem" }}>
            {es
              ? "Agrega tu Frenchie para empezar tu álbum de vida."
              : "Add your Frenchie to start your life album."}
          </p>
          <Link
            href="/dogs/new"
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            {es ? "Agregar Frenchie →" : "Add Frenchie →"}
          </Link>
        </div>
      )}

      {dog && !milestones?.length && !skinEntries?.length && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 1rem",
            background: "#fdf6ef",
            borderRadius: "1.25rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📸</div>
          <p style={{ color: "var(--brown-700)" }}>
            {es
              ? "Aún no hay fotos ni hitos. ¡Comienza a registrar hoy!"
              : "No photos or milestones yet. Start tracking today!"}
          </p>
        </div>
      )}
    </div>
  );
}
