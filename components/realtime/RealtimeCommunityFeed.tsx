"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: "logro" | "pregunta" | "tip" | "foto";
  created_at: string;
}

interface Props {
  initialPosts: CommunityPost[];
  locale: string;
  isPaid: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string, locale: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  const es = locale === "es";

  if (mins < 1) return es ? "ahora mismo" : "just now";
  if (mins < 60) return es ? `hace ${mins}m` : `${mins}m ago`;
  if (hours < 24) return es ? `hace ${hours}h` : `${hours}h ago`;
  return es ? `hace ${days}d` : `${days}d ago`;
}

function truncate(text: string, max = 120): string {
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

// ─── Category badge config ────────────────────────────────────────────────────

const CATEGORY: Record<
  CommunityPost["category"],
  { labelEs: string; labelEn: string; bg: string; color: string }
> = {
  logro:   { labelEs: "Logro",   labelEn: "Achievement", bg: "#fef3c7", color: "#b45309" },
  pregunta:{ labelEs: "Pregunta",labelEn: "Question",    bg: "#dbeafe", color: "#1d4ed8" },
  tip:     { labelEs: "Tip",     labelEn: "Tip",         bg: "#dcfce7", color: "#15803d" },
  foto:    { labelEs: "Foto",    labelEn: "Photo",       bg: "#f3e8ff", color: "#7c3aed" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function RealtimeCommunityFeed({
  initialPosts,
  locale,
  isPaid,
}: Props) {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [showBanner, setShowBanner] = useState(false);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const es = locale === "es";

  // ── Subscribe to postgres_changes for new community posts
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("community-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_posts" },
        (payload) => {
          const newPost = payload.new as CommunityPost;

          // Prepend the new post so it appears at the top
          setPosts((prev) => [newPost, ...prev]);

          // Show the "new post" banner for 4 s
          setShowBanner(true);
          if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
          bannerTimerRef.current = setTimeout(() => setShowBanner(false), 4000);
        }
      )
      .subscribe();

    return () => {
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* ── "New post" floating banner ────────────────────────────────── */}
      {showBanner && (
        <div
          style={{
            position: "fixed",
            top: "72px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#7c3aed",
            color: "white",
            borderRadius: "9999px",
            padding: "0.45rem 1.25rem",
            fontSize: "0.82rem",
            fontWeight: 700,
            zIndex: 50,
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          Nueva publicación en la comunidad 🐾
        </div>
      )}

      {/* ── Paywall overlay (blurred) ─────────────────────────────────── */}
      {!isPaid && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.55)",
            borderRadius: "1.25rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1.5rem",
            textAlign: "center",
            minHeight: "220px",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔒</div>
          <p
            style={{
              fontWeight: 700,
              color: "var(--brown-800)",
              fontSize: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            {es
              ? "Únete para ver la comunidad completa"
              : "Join to see the full community"}
          </p>
          <p
            style={{
              color: "var(--brown-600)",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            {es
              ? "Accede a logros, preguntas y tips de otros dueños de Frenchie."
              : "Access achievements, questions and tips from other Frenchie owners."}
          </p>
          <Link
            href="/upgrade"
            style={{
              background: "var(--accent)",
              color: "white",
              padding: "0.75rem 1.75rem",
              borderRadius: "9999px",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "0.9rem",
              display: "inline-block",
            }}
          >
            {es ? "Ver planes →" : "See plans →"}
          </Link>
        </div>
      )}

      {/* ── Posts list ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {posts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "var(--brown-400)",
              fontSize: "0.9rem",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🐾</div>
            {es ? "Aún no hay publicaciones." : "No posts yet."}
          </div>
        ) : (
          posts.map((post) => {
            const cat = CATEGORY[post.category] ?? CATEGORY.tip;
            return (
              <article
                key={post.id}
                style={{
                  background: "white",
                  borderRadius: "1rem",
                  padding: "1rem 1.25rem",
                  border: "1px solid var(--brown-100)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                {/* Header: badge + time */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.4rem",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: cat.bg,
                      color: cat.color,
                      borderRadius: "9999px",
                      padding: "0.2rem 0.7rem",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {es ? cat.labelEs : cat.labelEn}
                  </span>
                  <span
                    style={{ fontSize: "0.72rem", color: "var(--brown-400)" }}
                  >
                    {timeAgo(post.created_at, locale)}
                  </span>
                </div>

                {/* Title */}
                {post.title && (
                  <p
                    style={{
                      fontWeight: 700,
                      color: "var(--brown-800)",
                      marginBottom: "0.25rem",
                      fontSize: "0.95rem",
                      lineHeight: "1.4",
                    }}
                  >
                    {post.title}
                  </p>
                )}

                {/* Content preview */}
                <p
                  style={{
                    color: "var(--brown-600)",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                    margin: 0,
                  }}
                >
                  {truncate(post.content)}
                </p>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
