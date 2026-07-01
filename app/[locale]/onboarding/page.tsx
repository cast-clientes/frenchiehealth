"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, CheckCircle, ChevronRight, Shield, FileText, Stethoscope } from "lucide-react";
import type { ParentRole } from "@/lib/parentDisplay";
import { analytics } from "@/lib/analytics/events";

type ConsentType = "terms" | "privacy" | "medical_disclaimer";

interface ConsentState {
  terms: boolean;
  privacy: boolean;
  medical_disclaimer: boolean;
}

const DOCUMENT_VERSION = "1.0";

interface RoleOption {
  key: ParentRole;
  emoji: string;
  labelEs: string;
  labelEn: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  { key: "mama",    emoji: "👩", labelEs: "Mamá",    labelEn: "Mom"      },
  { key: "papa",    emoji: "👨", labelEs: "Papá",    labelEn: "Dad"      },
  { key: "tutor",   emoji: "🧑", labelEs: "Tutor/a", labelEn: "Guardian" },
  { key: "abuelo",  emoji: "👴", labelEs: "Abuelo",  labelEn: "Grandpa"  },
  { key: "abuela",  emoji: "👵", labelEs: "Abuela",  labelEn: "Grandma"  },
  { key: "custom",  emoji: "✍️", labelEs: "Mi rol…", labelEn: "My role…" },
];

export default function OnboardingPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  // step: 1 = parent role, 2 = consents
  const [step, setStep] = useState(1);

  // Step 1 state
  const [selectedRole, setSelectedRole] = useState<ParentRole | null>(null);
  const [customRole, setCustomRole] = useState("");
  const [dogName, setDogName] = useState("");
  const [dogNickname, setDogNickname] = useState("");
  const [dogPronoun, setDogPronoun] = useState<"el" | "ella">("el");
  const [showWelcome, setShowWelcome] = useState(false);
  const [savingRole, setSavingRole] = useState(false);

  // Step 2 state
  const [consents, setConsents] = useState<ConsentState>({
    terms: false,
    privacy: false,
    medical_disclaimer: false,
  });
  const [expanded, setExpanded] = useState<ConsentType | null>("terms");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const allAccepted = consents.terms && consents.privacy && consents.medical_disclaimer;
  const completedCount = [consents.terms, consents.privacy, consents.medical_disclaimer].filter(Boolean).length;

  useEffect(() => {
    analytics.onboardingStarted();
  }, []);

  useEffect(() => {
    if (consents.terms && !consents.privacy && expanded !== "privacy") {
      const id = window.setTimeout(() => setExpanded("privacy"), 0);
      return () => window.clearTimeout(id);
    } else if (consents.terms && consents.privacy && !consents.medical_disclaimer && expanded !== "medical_disclaimer") {
      const id = window.setTimeout(() => setExpanded("medical_disclaimer"), 0);
      return () => window.clearTimeout(id);
    }
  }, [consents.terms, consents.privacy, consents.medical_disclaimer, expanded]);

  function toggle(type: ConsentType) {
    setConsents((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  async function handleRoleConfirm() {
    if (!selectedRole) return;
    setSavingRole(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login"); return; }

    const roleCustom = selectedRole === "custom" ? customRole.trim() || null : null;

    await supabase.from("profiles").upsert({
      id: user.id,
      parent_role: selectedRole,
      parent_role_custom: roleCustom,
    });

    // Store dog info in localStorage for dogs/new to pre-fill
    if (dogName.trim()) localStorage.setItem("frenchie_pending_dog_name", dogName.trim());
    if (dogNickname.trim()) localStorage.setItem("frenchie_pending_nickname", dogNickname.trim());
    localStorage.setItem("frenchie_pending_pronoun", dogPronoun);

    analytics.onboardingStepCompleted(1, "parent_role_completed");
    setSavingRole(false);
    setShowWelcome(true);
    setTimeout(() => {
      setShowWelcome(false);
      setStep(2);
    }, 2500);
  }

  async function handleContinue() {
    if (!allAccepted) {
      setError(t("onboarding.mustAcceptAll"));
      return;
    }

    setSubmitting(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login"); return; }

    const types: ConsentType[] = ["terms", "privacy", "medical_disclaimer"];
    const { error: dbError } = await supabase.from("consents").upsert(
      types.map((consent_type) => ({
        user_id: user.id,
        consent_type,
        document_version: DOCUMENT_VERSION,
      }))
    );

    if (dbError) {
      setError(dbError.message);
      setSubmitting(false);
      return;
    }

    analytics.onboardingStepCompleted(2, "legal_consents_accepted");
    analytics.onboardingCompleted(
      dogNickname.trim() || "unknown",
      selectedRole === "custom" ? customRole.trim() || "custom" : selectedRole ?? "unknown",
    );
    router.push("/dogs/new");
  }

  const sections: {
    key: ConsentType;
    icon: ReactNode;
    label: string;
    summary: string;
    fullContent: ReactNode;
    checkLabel: string;
  }[] = [
    {
      key: "terms",
      icon: <FileText className="w-5 h-5 text-[var(--accent)]" />,
      label: t("onboarding.termsTitle"),
      summary: t("onboarding.termsSummary"),
      checkLabel: t("onboarding.acceptTerms"),
      fullContent: (
        <div className="text-sm text-[var(--brown-600)] space-y-3">
          <p>{t("onboarding.termsIntro")}</p>
          <ul className="list-disc pl-4 space-y-1.5">
            {(t.raw("onboarding.termsPoints") as string[]).map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
          <p className="text-xs text-[var(--brown-400)]">{t("onboarding.termsFooter")}</p>
        </div>
      ),
    },
    {
      key: "privacy",
      icon: <Shield className="w-5 h-5 text-[var(--accent)]" />,
      label: t("onboarding.privacyTitle"),
      summary: t("onboarding.privacySummary"),
      checkLabel: t("onboarding.acceptPrivacy"),
      fullContent: (
        <div className="text-sm text-[var(--brown-600)] space-y-3">
          <p>{t("onboarding.privacyIntro")}</p>
          <ul className="list-disc pl-4 space-y-1.5">
            {(t.raw("onboarding.privacyPoints") as string[]).map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
          <p className="text-xs text-[var(--brown-400)]">{t("onboarding.privacyFooter")}</p>
        </div>
      ),
    },
    {
      key: "medical_disclaimer",
      icon: <Stethoscope className="w-5 h-5 text-[var(--accent)]" />,
      label: t("onboarding.disclaimerTitle"),
      summary: t("onboarding.disclaimerSummary"),
      checkLabel: t("onboarding.acceptDisclaimer"),
      fullContent: (
        <div className="space-y-4">
          <p className="text-sm text-[var(--brown-600)]">{t("onboarding.disclaimerBody")}</p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <h4 className="font-semibold text-red-800 text-sm">{t("onboarding.emergencySignsTitle")}</h4>
            </div>
            <ul className="space-y-1.5">
              {(t.raw("onboarding.emergencySigns") as string[]).map((sign: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="mt-0.5 flex-shrink-0">•</span>
                  {sign}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
  ];

  // Welcome flash screen (2.5s)
  if (showWelcome) {
    const roleLabel = selectedRole === "custom"
      ? customRole.trim() || (locale === "es" ? "familia" : "family member")
      : ROLE_OPTIONS.find(r => r.key === selectedRole)?.[locale === "es" ? "labelEs" : "labelEn"] ?? "";

    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-6">
        <div className="text-center max-w-xs mx-auto">
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🐾</div>
          <h1 className="text-2xl font-bold text-[var(--brown-800)] mb-4">
            {locale === "es" ? `¡Hola ${roleLabel}! 💛` : `Hi ${roleLabel}! 💛`}
          </h1>
          <p className="text-[var(--brown-600)] text-base leading-relaxed">
            {locale === "es"
              ? `Estamos muy felices de que estén aquí.${dogName.trim() ? ` La historia de ${dogName.trim()} empieza hoy.` : " Prometemos cuidar la historia de su Frenchie como si fuera nuestra."}`
              : `We're so happy you're here.${dogName.trim() ? ` ${dogName.trim()}'s story starts today.` : " We promise to care for your Frenchie's story like it's our own."}`}
          </p>
        </div>
      </div>
    );
  }

  // STEP 1: Parent role
  if (step === 1) {
    const isCustom = selectedRole === "custom";
    const canConfirm = selectedRole && (selectedRole !== "custom" || customRole.trim().length > 0);

    return (
      <div className="min-h-screen bg-[var(--cream)] px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🐾</div>
            <h1 className="text-2xl font-bold text-[var(--brown-800)]">
              {locale === "es" ? "¿Cómo querés que te llamemos?" : "What should we call you?"}
            </h1>
            <p className="text-sm text-[var(--brown-400)] mt-2">
              {locale === "es"
                ? "Para nosotros, sos parte de su familia. ¿Cuál es tu rol?"
                : "For us, you're part of their family. What's your role?"}
            </p>
          </div>

          {/* Role cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                aria-pressed={selectedRole === opt.key}
                onClick={() => setSelectedRole(opt.key)}
                style={{
                  background: selectedRole === opt.key ? "#fff3ed" : "white",
                  border: selectedRole === opt.key ? "2px solid var(--accent)" : "1.5px solid var(--brown-100)",
                  borderRadius: "1rem",
                  padding: "1rem 0.5rem",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: "1.75rem", marginBottom: "0.375rem" }}>{opt.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--brown-800)" }}>
                  {locale === "es" ? opt.labelEs : opt.labelEn}
                </div>
              </button>
            ))}
          </div>

          {/* Custom role input */}
          {isCustom && (
            <div style={{ marginBottom: "1.5rem" }}>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder={locale === "es" ? "Ej: el humano de, la madrina de…" : "E.g. the human of, the godmother of…"}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  borderRadius: "0.875rem",
                  border: "1.5px solid var(--brown-200)",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                autoFocus
              />
            </div>
          )}

          {/* Dog section heading */}
          <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--brown-600)", marginBottom: "0.75rem", marginTop: "0.5rem" }}>
            {locale === "es" ? "Ahora, cuéntanos sobre tu Frenchie" : "Now, tell us about your Frenchie"}
          </p>

          {/* Dog name */}
          <div style={{ background: "white", borderRadius: "1.25rem", border: "1.5px solid var(--brown-100)", padding: "1.25rem", marginBottom: "1rem" }}>
            <label style={{ display: "block", fontWeight: 700, fontSize: "0.875rem", color: "var(--brown-800)", marginBottom: "0.5rem" }}>
              {locale === "es" ? "¿Cómo se llama tu Frenchie?" : "What's your Frenchie's name?"}
            </label>
            <input
              type="text"
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              placeholder={locale === "es" ? "Ej: Luna, Max, Coco, Ñonki…" : "E.g. Luna, Max, Coco…"}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: "1.5px solid var(--brown-200)",
                fontSize: "0.875rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Nickname */}
          <div style={{ background: "white", borderRadius: "1.25rem", border: "1.5px solid var(--brown-100)", padding: "1.25rem", marginBottom: "1rem" }}>
            <label style={{ display: "block", fontWeight: 700, fontSize: "0.875rem", color: "var(--brown-800)", marginBottom: "0.5rem" }}>
              {locale === "es" ? "¿Cómo le decís de cariño?" : "What's their pet name?"}{" "}
              <span style={{ fontWeight: 400, color: "var(--brown-400)" }}>
                {locale === "es" ? "(opcional)" : "(optional)"}
              </span>
            </label>
            <input
              type="text"
              value={dogNickname}
              onChange={(e) => setDogNickname(e.target.value)}
              placeholder={locale === "es" ? "Ej: bebé, el rey, princesa, el gordito…" : "E.g. baby, buddy, princess…"}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: "1.5px solid var(--brown-200)",
                fontSize: "0.875rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Pronoun */}
          <div style={{ background: "white", borderRadius: "1.25rem", border: "1.5px solid var(--brown-100)", padding: "1.25rem", marginBottom: "2rem" }}>
            <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--brown-800)", marginBottom: "0.75rem" }}>
              {locale === "es" ? "¿Tu Frenchie es…?" : "Your Frenchie is…?"}
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {(["el", "ella"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={dogPronoun === p}
                  onClick={() => setDogPronoun(p)}
                  style={{
                    flex: 1,
                    padding: "0.875rem",
                    borderRadius: "0.875rem",
                    border: dogPronoun === p ? "2px solid var(--accent)" : "1.5px solid var(--brown-200)",
                    background: dogPronoun === p ? "#fff3ed" : "white",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "var(--brown-800)",
                  }}
                >
                  {p === "el" ? (locale === "es" ? "Él 🐾" : "He 🐾") : (locale === "es" ? "Ella 🐾" : "She 🐾")}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleRoleConfirm} loading={savingRole} disabled={!canConfirm}>
            {locale === "es" ? "¡Continuar! 🐾" : "Continue! 🐾"}
          </Button>

          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--brown-400)", marginTop: "1rem" }}>
            {locale === "es" ? "Paso 1 de 2" : "Step 1 of 2"}
          </p>
        </div>
      </div>
    );
  }

  // STEP 2: Legal consents
  return (
    <div className="min-h-screen bg-[var(--cream)] px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📋</div>
          <h1 className="text-2xl font-bold text-[var(--brown-800)]">
            {locale === "es" ? "Solo un momento legal 📋" : "Just a quick legal moment 📋"}
          </h1>
          <p className="text-sm text-[var(--brown-400)] mt-2">
            {locale === "es"
              ? "Lee cada sección y acepta — ¡solo toma 2 minutos!"
              : "Read each section and accept — it only takes 2 minutes!"}
          </p>
        </div>

        <div className="mb-8">
          <div style={{ background: "var(--brown-100)", borderRadius: "9999px", height: "8px", marginBottom: "0.5rem" }}>
            <div
              style={{
                background: "var(--accent)",
                borderRadius: "9999px",
                height: "8px",
                width: `${(completedCount / 3) * 100}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--brown-400)" }}>
            {locale === "es" ? `${completedCount} de 3 aceptados` : `${completedCount} of 3 accepted`}
          </p>
        </div>

        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.key}
              className={`bg-white rounded-2xl border transition-all ${
                consents[section.key] ? "border-[var(--accent)] shadow-sm" : "border-[var(--brown-100)]"
              }`}
            >
              <button
                type="button"
                className="w-full flex items-center gap-3 p-4 text-left"
                onClick={() => setExpanded(expanded === section.key ? null : section.key)}
              >
                <div className="flex-shrink-0">{section.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-[var(--brown-800)]">{section.label}</p>
                    {consents[section.key] && <CheckCircle className="w-4 h-4 text-[var(--accent)]" />}
                    {consents[section.key] && (
                      <span style={{ color: "var(--accent)", fontSize: "0.75rem", fontWeight: 700 }}>
                        {locale === "es" ? "✅ ¡Listo!" : "✅ Done!"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--brown-400)] mt-0.5 line-clamp-2">{section.summary}</p>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-[var(--brown-400)] flex-shrink-0 transition-transform ${
                    expanded === section.key ? "rotate-90" : ""
                  }`}
                />
              </button>

              {expanded === section.key && (
                <div className="px-4 pb-4 border-t border-[var(--brown-100)]">
                  <div className="pt-4">{section.fullContent}</div>
                  <label className="flex items-start gap-3 mt-5 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input type="checkbox" checked={consents[section.key]} onChange={() => toggle(section.key)} className="sr-only" />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${consents[section.key] ? "bg-[var(--accent)] border-[var(--accent)]" : "border-[var(--brown-200)] bg-white"}`}>
                        {consents[section.key] && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[var(--brown-700)] group-hover:text-[var(--brown-800)]">
                      {section.checkLabel}
                    </span>
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
        )}

        <Button className="w-full mt-6" size="lg" onClick={handleContinue} loading={submitting} disabled={!allAccepted}>
          {allAccepted
            ? (locale === "es" ? "¡Vamos! 🐾" : "Let's go! 🐾")
            : t("onboarding.continueButton")}
        </Button>

        <p className="text-center text-xs text-[var(--brown-400)] mt-4">
          {locale === "es" ? "Paso 2 de 2" : "Step 2 of 2"}
        </p>
      </div>
    </div>
  );
}
