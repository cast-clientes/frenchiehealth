"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { analytics } from "@/lib/analytics/events";

const COPY = {
  en: {
    comingSoon: "Coming Soon",
    available: "Available",
    notifyMe: "Notify me when ready",
    emailPlaceholder: "your@email.com",
    submit: "Join waitlist",
    submitting: "Joining...",
    success: "You're on the list! We'll notify you when this module launches.",
    error: "Something went wrong. Please try again.",
  },
  es: {
    comingSoon: "Próximamente",
    available: "Disponible",
    notifyMe: "Notificarme cuando esté listo",
    emailPlaceholder: "tu@correo.com",
    submit: "Unirme a la lista",
    submitting: "Uniéndome...",
    success: "¡Estás en la lista! Te notificaremos cuando este módulo esté disponible.",
    error: "Algo salió mal. Por favor intenta de nuevo.",
  },
};

interface ComingSoonProps {
  locale: string;
  module: string;
  icon: string;
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
}

export function ComingSoon({ locale, module, icon, titleEn, titleEs, descEn, descEs }: ComingSoonProps) {
  const c = COPY[locale as keyof typeof COPY] ?? COPY.en;
  const title = locale === "es" ? titleEs : titleEn;
  const desc = locale === "es" ? descEs : descEn;

  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), module, locale }),
      });
      if (res.ok) {
        analytics.moduleWaitlistJoined(module);
        setState("done");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <div className="px-4 pt-6 space-y-5">
      <div className="text-center py-8">
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{icon}</div>
        <h1 className="text-2xl font-bold text-[var(--brown-800)]">{title}</h1>
        <span
          style={{
            display: "inline-block",
            marginTop: "0.5rem",
            background: "#f3f4f6",
            color: "#6b7280",
            borderRadius: "999px",
            padding: "0.25rem 0.75rem",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          {c.comingSoon}
        </span>
        <p className="text-sm text-[var(--brown-400)] mt-4 max-w-xs mx-auto">{desc}</p>
      </div>

      {state === "done" ? (
        <Card className="bg-green-50 border-green-200 text-center">
          <p className="text-sm text-green-800">✅ {c.success}</p>
        </Card>
      ) : (
        <Card>
          <p className="text-sm font-semibold text-[var(--brown-800)] mb-3">{c.notifyMe}</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={c.emailPlaceholder}
              style={{
                width: "100%",
                padding: "0.625rem 0.875rem",
                border: "1.5px solid #e5e7eb",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {state === "error" && (
              <p className="text-xs text-red-600">{c.error}</p>
            )}
            <button
              type="submit"
              disabled={state === "sending"}
              style={{
                width: "100%",
                padding: "0.625rem",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: "0.75rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: state === "sending" ? "not-allowed" : "pointer",
                opacity: state === "sending" ? 0.7 : 1,
              }}
            >
              {state === "sending" ? c.submitting : c.submit}
            </button>
          </form>
        </Card>
      )}
    </div>
  );
}
