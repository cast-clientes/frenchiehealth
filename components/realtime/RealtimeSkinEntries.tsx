"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SkinEntry {
  id: string;
  dog_id: string;
  entry_date: string;
  itch_score: number;
  affected_zone: string;
  photo_url: string | null;
}

export interface RealtimeSkinEntriesProps {
  dogId: string;
  initialEntries: SkinEntry[];
  locale: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TOAST_DURATION_MS = 3_000;
const SLIDE_OUT_MS = 300;

const ZONE_LABELS: Record<"es" | "en", Record<string, string>> = {
  es: {
    facial_folds: "Pliegues faciales",
    back: "Espalda",
    paws: "Patas",
    ears: "Orejas",
    other: "Otro",
  },
  en: {
    facial_folds: "Facial folds",
    back: "Back",
    paws: "Paws",
    ears: "Ears",
    other: "Other",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function itchBadgeStyle(score: number): React.CSSProperties {
  if (score < 4) {
    return { background: "#dcfce7", color: "#15803d" };
  }
  if (score < 7) {
    return { background: "#fef3c7", color: "#b45309" };
  }
  return { background: "#fee2e2", color: "#b91c1c" };
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Client island that owns the skin_entries list for a given dog.
 * Accepts server-fetched initialEntries and keeps them live via a
 * Supabase Realtime postgres_changes subscription.
 *
 * Usage in a Server Component:
 *   <RealtimeSkinEntries dogId={dog.id} initialEntries={skinData} locale={locale} />
 */
export function RealtimeSkinEntries({
  dogId,
  initialEntries,
  locale,
}: RealtimeSkinEntriesProps) {
  const [entries, setEntries] = useState<SkinEntry[]>(initialEntries);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lang: "es" | "en" = locale === "es" ? "es" : "en";
  const zoneLabels = ZONE_LABELS[lang];
  const insertLabel =
    lang === "es" ? "Nueva entrada registrada 🐾" : "New entry registered 🐾";

  // ── Toast helpers ───────────────────────────────────────────────────────
  const showToast = (): void => {
    // Clear any in-flight dismissal
    if (toastTimerRef.current !== null) clearTimeout(toastTimerRef.current);
    if (slideTimerRef.current !== null) clearTimeout(slideTimerRef.current);

    setToastVisible(true);

    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
      toastTimerRef.current = null;
    }, TOAST_DURATION_MS);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) clearTimeout(toastTimerRef.current);
      if (slideTimerRef.current !== null) clearTimeout(slideTimerRef.current);
    };
  }, []);

  // ── Realtime subscription ───────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("skin-entries-" + dogId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "skin_entries",
          filter: "dog_id=eq." + dogId,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const inserted = payload.new as SkinEntry;
            setEntries((prev) => [inserted, ...prev]);
            showToast();
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as SkinEntry;
            setEntries((prev) =>
              prev.map((e) => (e.id === updated.id ? updated : e))
            );
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as Partial<SkinEntry>;
            if (deleted.id) {
              setEntries((prev) => prev.filter((e) => e.id !== deleted.id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dogId]);

  // ── Render ─────────────────────────────────────────────────────────────
  if (entries.length === 0) return null;

  return (
    <div className="space-y-2">
      {/* ── INSERT toast ── */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: `translateX(-50%) translateY(${toastVisible ? "0" : "-12px"})`,
          zIndex: 60,
          background: "var(--accent, #E8714A)",
          color: "#fff",
          borderRadius: 12,
          padding: "10px 18px",
          fontSize: 14,
          fontWeight: 600,
          whiteSpace: "nowrap",
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          opacity: toastVisible ? 1 : 0,
          pointerEvents: "none",
          transition: toastVisible
            ? "opacity 220ms ease, transform 280ms cubic-bezier(0.34,1.56,0.64,1)"
            : `opacity ${SLIDE_OUT_MS}ms ease, transform ${SLIDE_OUT_MS}ms ease`,
        }}
      >
        {insertLabel}
      </div>

      {/* ── Entry list ── */}
      {entries.map((entry) => (
        <Card key={entry.id} className="flex items-center gap-3 py-3">
          {/* Thumbnail or emoji placeholder */}
          <div className="flex-shrink-0">
            {entry.photo_url ? (
              <img
                src={entry.photo_url}
                alt=""
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-[var(--cream)]">
                🐾
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Affected zone */}
              <p className="font-semibold text-sm text-[var(--brown-800)] truncate">
                {zoneLabels[entry.affected_zone] ?? entry.affected_zone}
              </p>

              {/* Itch score badge */}
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                style={itchBadgeStyle(entry.itch_score)}
              >
                {entry.itch_score}/10
              </span>

              {/* Alert icon for high scores */}
              {entry.itch_score >= 7 && (
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              )}
            </div>

            {/* Date */}
            <p className="text-xs text-[var(--brown-400)] mt-0.5">
              {formatDate(entry.entry_date, locale)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
