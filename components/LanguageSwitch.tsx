"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  en: "EN",
  es: "ES",
};

export default function LanguageSwitch() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) ?? routing.defaultLocale;

  return (
    <div
      style={{
        position: "fixed",
        top: "calc(env(safe-area-inset-top, 0px) + 0.5rem)",
        left: "calc(env(safe-area-inset-left, 0px) + 0.5rem)",
        zIndex: 30,
        display: "flex",
        gap: "0.35rem",
        background: "white",
        border: "1.5px solid var(--brown-100)",
        borderRadius: "9999px",
        padding: "0.25rem",
        boxShadow: "0 2px 12px rgba(59,31,15,0.1)",
      }}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          aria-label={l}
          onClick={() => router.replace(pathname, { locale: l })}
          style={{
            minWidth: "2.25rem",
            height: "2rem",
            padding: "0 0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9999px",
            border: "none",
            background: l === locale ? "var(--accent)" : "transparent",
            color: l === locale ? "white" : "var(--brown-700)",
            cursor: "pointer",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {LABELS[l] ?? l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
