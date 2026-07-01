import { createClient } from "@/lib/supabase/server";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import RealtimeCommunityFeed, {
  type CommunityPost,
} from "@/components/realtime/RealtimeCommunityFeed";

export default async function CommunityPage() {
  const supabase = await createClient();
  const locale = await getLocale();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user!.id)
    .single();

  const isPaid = sub?.plan === "paid";
  const es = locale === "es";

  // Fetch initial posts only for paid users to avoid unnecessary reads
  let initialPosts: CommunityPost[] = [];
  if (isPaid) {
    const { data } = await supabase
      .from("community_posts")
      .select("id, title, content, category, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    initialPosts = (data as CommunityPost[]) ?? [];
  }

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
          👥 {es ? "Comunidad" : "Community"}
        </h1>
        <p style={{ color: "var(--brown-600)", fontSize: "0.9rem" }}>
          {es ? "Dueños de Frenchie unidos." : "Frenchie owners united."}
        </p>
      </div>

      {!isPaid ? (
        <div
          style={{
            background: "var(--brown-800)",
            borderRadius: "1.5rem",
            padding: "2rem",
            textAlign: "center",
            color: "white",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
          <h2
            style={{
              fontWeight: 800,
              fontSize: "1.25rem",
              marginBottom: "0.75rem",
            }}
          >
            {es
              ? "La comunidad es exclusiva para miembros de pago"
              : "Community is exclusive to paying members"}
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
            }}
          >
            {es
              ? "Únete para acceder a retos mensuales, logros compartidos y la red de dueños más comprometidos del mundo."
              : "Join to access monthly challenges, shared achievements, and the world's most committed owner network."}
          </p>
          <Link
            href="/upgrade"
            style={{
              background: "#f59e0b",
              color: "#111",
              padding: "0.875rem 2rem",
              borderRadius: "9999px",
              fontWeight: 800,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            {es ? "Desbloquear comunidad →" : "Unlock community →"}
          </Link>
        </div>
      ) : (
        <RealtimeCommunityFeed
          initialPosts={initialPosts}
          locale={locale}
          isPaid={true}
        />
      )}
    </div>
  );
}
