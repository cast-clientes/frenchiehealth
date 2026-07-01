"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { analytics } from "@/lib/analytics/events";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  dogName?: string;
  dogPhotoUrl?: string;
  parentTitle?: string;
  triggerReason: "entries" | "photo" | "chat" | "module";
  locale: string;
  freeLimit?: number;
}

export default function PaywallModal({
  isOpen,
  onClose,
  dogName,
  dogPhotoUrl,
  parentTitle,
  triggerReason,
  locale,
  freeLimit = 3,
}: PaywallModalProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [founderSpots, setFounderSpots] = useState(33);

  useEffect(() => {
    if (!isOpen) return;
    const triggerMap: Record<typeof triggerReason, string> = {
      entries: "entry_3",
      photo: "photo_upload",
      chat: "chat_limit",
      module: "module_locked",
    };

    analytics.paywallViewed(triggerMap[triggerReason]);
  }, [isOpen, triggerReason]);

  useEffect(() => {
    fetch("/api/founding-status")
      .then((r) => r.json())
      .then((d) => setFounderSpots(100 - (d.spots_taken ?? 67)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function calc() {
      const diff =
        new Date("2026-07-31T23:59:59Z").getTime() - Date.now();
      if (diff <= 0) return;
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  if (!isOpen) return null;

  const es = locale === "es";
  const h = (path: string) => `/${locale}${path}`;

  const dog = dogName ?? (es ? "tu Frenchie" : "your Frenchie");
  const who = parentTitle ? (es ? `${parentTitle}` : parentTitle) : null;

  const triggerMessages: Record<typeof triggerReason, string> = {
    entries: es
      ? `Límite gratuito alcanzado. ${who ? `Como ${who}, d` : "D"}esbloquea el historial completo de ${dog} 🐾`
      : `Free limit reached. ${who ? `As ${who}, u` : "U"}nlock ${dog}'s complete health history 🐾`,
    photo: es
      ? `Las fotos están bloqueadas en el plan gratuito.${who ? ` ${who?.charAt(0).toUpperCase() + who.slice(1)}, a` : " A"}ctualiza para guardar el historial visual de ${dog}.`
      : `Photos are locked on the free plan. Upgrade to save ${dog}'s complete visual history.`,
    chat: es
      ? `Has usado tus ${freeLimit} mensajes gratuitos.${who ? ` Como ${who}` : ""}, ${dog} merece atención ilimitada 🐾`
      : `You've used your ${freeLimit} free AI messages. ${dog} deserves unlimited attention 🐾`,
    module: es
      ? `Este módulo de salud${dogName ? ` para ${dog}` : ""} está disponible en el plan de pago.`
      : `This health module${dogName ? ` for ${dog}` : ""} is available on the paid plan.`,
  };

  const spotsTaken = 100 - founderSpots;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "1.5rem",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        {/* Header with dog photo */}
        <div
          style={{
            background: "var(--brown-800)",
            padding: "1.5rem",
            textAlign: "center",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "0.875rem",
              right: "0.875rem",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              cursor: "pointer",
              color: "white",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label={es ? "Cerrar" : "Close"}
          >
            ✕
          </button>
          {dogPhotoUrl ? (
            <img
              src={dogPhotoUrl}
              alt={dogName}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #f59e0b",
                margin: "0 auto 0.75rem",
                display: "block",
              }}
            />
          ) : (
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🐾</div>
          )}
          <p style={{ color: "white", fontWeight: 700, fontSize: "1.05rem" }}>
            {triggerMessages[triggerReason]}
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "1.25rem" }}>
          {/* Price anchor */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  color: "#9ca3af",
                  textDecoration: "line-through",
                  fontSize: "1.1rem",
                }}
              >
                $18.99
              </span>
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--brown-800)",
                }}
              >
                $8.99
              </span>
              <span
                style={{ color: "var(--brown-600)", fontSize: "0.9rem" }}
              >
                {es ? "/mes" : "/mo"}
              </span>
            </div>
            <div
              style={{
                color: "#f59e0b",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              🔒{" "}
              {es
                ? "Precio bloqueado para siempre · Solo Founding Members"
                : "Price locked forever · Founding Members only"}
            </div>
          </div>

          {/* Spots + countdown */}
          <div
            style={{
              background: "#1f2937",
              borderRadius: "0.875rem",
              padding: "0.875rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.4rem",
              }}
            >
              <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
                {spotsTaken} {es ? "tomados" : "taken"}
              </span>
              <span
                style={{
                  color: "#f59e0b",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                ⚡ {founderSpots} {es ? "spots restantes" : "spots left"}
              </span>
            </div>
            <div
              style={{
                background: "#374151",
                borderRadius: "9999px",
                height: "6px",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(90deg, #f59e0b, #ef4444)",
                  borderRadius: "9999px",
                  height: "6px",
                  width: `${spotsTaken}%`,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.4rem",
                justifyContent: "center",
              }}
            >
              {(
                [
                  [countdown.days, es ? "días" : "days"],
                  [countdown.hours, es ? "hrs" : "hrs"],
                  [countdown.mins, "min"],
                  [countdown.secs, es ? "seg" : "sec"],
                ] as [number, string][]
              ).map(([v, l]) => (
                <div
                  key={l}
                  style={{
                    background: "#111827",
                    borderRadius: "0.375rem",
                    padding: "0.4rem 0.75rem",
                    textAlign: "center",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      color: "white",
                      fontWeight: 800,
                      fontSize: "1rem",
                    }}
                  >
                    {String(v).padStart(2, "0")}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "0.6rem" }}>
                    {l}
                  </div>
                </div>
              ))}
            </div>
            <p
              style={{
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "0.7rem",
                marginTop: "0.5rem",
              }}
            >
              {es ? "La oferta termina el 31 de julio" : "Offer ends July 31"}
            </p>
          </div>

          {/* Features */}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
            }}
          >
            {(es
              ? [
                  "✓ Entradas ilimitadas + fotos",
                  "✓ Chat IA ilimitado",
                  "✓ Álbum de vida completo",
                  "✓ Pasaporte de salud digital",
                  "✓ Comunidad exclusiva",
                ]
              : [
                  "✓ Unlimited entries + photos",
                  "✓ Unlimited AI chat",
                  "✓ Full life album",
                  "✓ Digital health passport",
                  "✓ Exclusive community",
                ]
            ).map((f) => (
              <li
                key={f}
                style={{ fontSize: "0.85rem", color: "var(--brown-700)" }}
              >
                {f}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <button
            onClick={() => {
              analytics.paywallCTAClicked("founding_monthly");
              router.push(h("/upgrade"));
            }}
            style={{
              display: "block",
              width: "100%",
              background: "#f59e0b",
              color: "#111",
              border: "none",
              borderRadius: "9999px",
              padding: "0.9rem",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: "pointer",
              marginBottom: "0.5rem",
            }}
          >
            {es
              ? "Asegurar mi precio $8.99/mes →"
              : "Secure my price $8.99/mo →"}
          </button>
          <button
            onClick={() => {
              analytics.paywallCTAClicked("founding_annual");
              router.push(h("/upgrade"));
            }}
            style={{
              display: "block",
              width: "100%",
              background: "white",
              color: "var(--brown-700)",
              border: "1.5px solid var(--brown-200)",
              borderRadius: "9999px",
              padding: "0.7rem",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              marginBottom: "0.5rem",
            }}
          >
            {es
              ? "Ver plan anual ($6.25/mes) →"
              : "See annual plan ($6.25/mo) →"}
          </button>
          <p
            style={{
              textAlign: "center",
              color: "var(--brown-400)",
              fontSize: "0.7rem",
            }}
          >
            {es
              ? "Si cancelas y vuelves después, pierdes el precio bloqueado. Cancela cuando quieras."
              : "Cancel and return later — you lose the locked price. Cancel anytime."}
          </p>
        </div>
      </div>
    </div>
  );
}
