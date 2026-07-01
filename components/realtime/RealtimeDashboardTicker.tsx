"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Toast {
  id: string;
  message: string;
  /** Controls the CSS slide-in transition; set to true on the next paint after insert. */
  visible: boolean;
}

export interface RealtimeDashboardTickerProps {
  /** Supabase dog UUID. When null the component skips all subscriptions. */
  dogId: string | null;
  /** Supabase auth user UUID — used to name the channel so it is unique per user. */
  userId: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 4_000;
const SLIDE_OUT_MS = 350;

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Invisible client island.  Renders nothing until a realtime INSERT fires on
 * one of the tracked tables, then shows a toast notification above BottomNav.
 *
 * Usage in a Server Component:
 *   <RealtimeDashboardTicker dogId={dog?.id ?? null} userId={user.id} />
 */
export function RealtimeDashboardTicker({
  dogId,
  userId,
}: RealtimeDashboardTickerProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Stable map of pending auto-dismiss timers keyed by toast id.
   * Using a ref avoids re-running the subscription effect when the map changes.
   */
  const timerRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  // ── Cleanup all pending timers on unmount ───────────────────────────────
  useEffect(() => {
    const refs = timerRefs.current;
    return () => {
      refs.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  // ── Realtime subscription ───────────────────────────────────────────────
  useEffect(() => {
    if (!dogId) return;

    const supabase = createClient();

    /** Starts the slide-out transition then removes the toast from state. */
    const dismiss = (id: string): void => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, SLIDE_OUT_MS);
    };

    /** Queues a new toast, evicting the oldest one when the queue is full. */
    const addToast = (message: string): void => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      setToasts((prev) => {
        const next = [...prev];

        // Evict oldest entries that exceed the cap
        while (next.length >= MAX_TOASTS) {
          const evicted = next.shift();
          if (evicted) {
            const pending = timerRefs.current.get(evicted.id);
            if (pending !== undefined) {
              clearTimeout(pending);
              timerRefs.current.delete(evicted.id);
            }
          }
        }

        return [...next, { id, message, visible: false }];
      });

      // Trigger the CSS transition on the next paint so the browser has already
      // committed the element at translateY(20px) before we flip visible → true.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, visible: true } : t))
          );
        });
      });

      // Schedule auto-dismiss
      const timer = setTimeout(() => {
        dismiss(id);
        timerRefs.current.delete(id);
      }, AUTO_DISMISS_MS);

      timerRefs.current.set(id, timer);
    };

    const channel = supabase
      .channel(`dashboard-live-${userId}`)
      // Skin entries
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "skin_entries",
          filter: `dog_id=eq.${dogId}`,
        },
        () => addToast("Nueva entrada de piel registrada 🐾")
      )
      // Weight entries
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "weight_entries",
          filter: `dog_id=eq.${dogId}`,
        },
        () => addToast("Nuevo peso registrado ⚖️")
      )
      // Respiratory entries
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "respiratory_entries",
          filter: `dog_id=eq.${dogId}`,
        },
        () => addToast("Episodio respiratorio registrado 🫁")
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [dogId, userId]);

  // ── Render ─────────────────────────────────────────────────────────────
  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Live activity notifications"
      style={{
        position: "fixed",
        // Sits above BottomNav (fixed bottom-0, z-50 → ~56 px tall on mobile)
        bottom: 80,
        right: 16,
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-end",
        // Let pointer events pass through the wrapper; individual toasts re-enable them
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          style={{
            background: "#1e293b",
            color: "#ffffff",
            // Use the app's accent CSS variable with a hex fallback
            border: "1.5px solid var(--accent, #E8714A)",
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.4,
            maxWidth: 260,
            boxShadow: "0 4px 20px rgba(0,0,0,0.22)",
            willChange: "transform, opacity",
            // Slide-in: start below (visible=false) → slide to 0 (visible=true)
            transform: toast.visible ? "translateY(0)" : "translateY(20px)",
            opacity: toast.visible ? 1 : 0,
            // Spring-like easing for the entrance; linear for the exit
            transition: toast.visible
              ? "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 250ms ease"
              : `transform ${SLIDE_OUT_MS}ms ease, opacity ${SLIDE_OUT_MS}ms ease`,
            pointerEvents: "auto",
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
