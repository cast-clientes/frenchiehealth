"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "fst_cookie_consent";

const COPY = {
  en: {
    title: "🍪 We use cookies",
    desc: "We use necessary cookies for security and to keep you logged in. Optional analytics cookies help us understand how you use the app.",
    all: "Accept all",
    necessary: "Necessary only",
    more: "Privacy Policy",
  },
  es: {
    title: "🍪 Usamos cookies",
    desc: "Usamos cookies necesarias para seguridad y para mantenerte conectado. Las cookies opcionales de análisis nos ayudan a mejorar la app.",
    all: "Aceptar todas",
    necessary: "Solo necesarias",
    more: "Política de privacidad",
  },
};

export default function CookieConsent({ locale }: { locale: string }) {
  const [visible, setVisible] = useState(() => {
    if (typeof document === "undefined") return false;

    try {
      return !document.cookie
        .split("; ")
        .some((r) => r.startsWith(`${COOKIE_KEY}=`));
    } catch {
      return false;
    }
  });
  const c = COPY[locale as keyof typeof COPY] ?? COPY.en;

  useEffect(() => {
    try {
      const has = document.cookie
        .split("; ")
        .some((r) => r.startsWith(`${COOKIE_KEY}=`));
      if (!has) {
        const id = window.setTimeout(() => setVisible(true), 0);
        return () => window.clearTimeout(id);
      }
    } catch {
      // cookie access blocked
    }
  }, []);

  const save = (value: "all" | "necessary") => {
    const maxAge = 365 * 24 * 60 * 60;
    const secure = location.protocol === "https:" ? ";Secure" : "";
    document.cookie = `${COOKIE_KEY}=${value};max-age=${maxAge};path=/;SameSite=Lax${secure}`;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(
      value === "all"
        ? { event: "consent_given", consent_type: "all" }
        : { event: "consent_declined" },
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: "0.75rem",
      }}
    >
      <div
        style={{
          background: "white",
          border: "1.5px solid var(--brown-100)",
          borderRadius: "1.25rem",
          padding: "1.25rem 1.5rem",
          boxShadow: "0 -4px 32px rgba(59,31,15,0.1)",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontWeight: 700,
            color: "var(--brown-800)",
            marginBottom: "0.35rem",
            fontSize: "0.95rem",
          }}
        >
          {c.title}
        </p>
        <p
          style={{
            color: "var(--brown-700)",
            fontSize: "0.82rem",
            lineHeight: 1.6,
            marginBottom: "1rem",
          }}
        >
          {c.desc}{" "}
          <Link
            href={`/${locale}/privacy`}
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            {c.more}
          </Link>
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={() => save("all")}
            style={{
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "9999px",
              padding: "0.6rem 1.5rem",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            {c.all}
          </button>
          <button
            onClick={() => save("necessary")}
            style={{
              background: "white",
              color: "var(--brown-700)",
              border: "1.5px solid var(--brown-200)",
              borderRadius: "9999px",
              padding: "0.6rem 1.25rem",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            {c.necessary}
          </button>
        </div>
      </div>
    </div>
  );
}
