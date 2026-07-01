"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "@/i18n/navigation";
import { analytics } from "@/lib/analytics/events";

function mapAuthError(message: string, t: ReturnType<typeof useTranslations>): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return t("auth.errors.invalidCredentials");
  if (m.includes("already registered") || m.includes("already been registered"))
    return t("auth.errors.userExists");
  if (m.includes("at least 6 characters") || m.includes("password should be"))
    return t("auth.errors.passwordTooShort");
  if (m.includes("email not confirmed") || m.includes("confirm your email"))
    return t("auth.errors.emailNotConfirmed");
  if (m.includes("rate limit") || m.includes("for security purposes"))
    return t("auth.errors.rateLimit");
  return t("auth.errors.generic");
}

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    if (mode === "signup") {
      analytics.signUpStarted("email");
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(mapAuthError(error.message, t));
      } else {
        analytics.signUpCompleted("email");
        setSent(true);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(mapAuthError(error.message, t));
      } else if (data.user) {
        analytics.loginCompleted("email");
        const { data: consents } = await supabase
          .from("consents")
          .select("consent_type")
          .eq("user_id", data.user.id);

        const types = consents?.map((c) => c.consent_type) ?? [];
        const hasAll =
          types.includes("terms") &&
          types.includes("privacy") &&
          types.includes("medical_disclaimer");

        router.push(hasAll ? "/dashboard" : "/onboarding");
      }
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream)] px-4">
      <div className="w-full max-w-sm">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🐾</div>
          <h1 className="text-2xl font-bold text-[var(--brown-800)]">
            Frenchie Skin Tracker
          </h1>
          <p className="text-sm text-[var(--brown-400)] mt-1">
            {t("auth.welcomeSubtitle")}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--brown-100)] shadow-sm p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📬</div>
              <p className="font-medium text-[var(--brown-800)]">
                {t("auth.signUpSent")}
              </p>
              <p className="text-sm text-[var(--brown-400)] mt-2">{email}</p>
              <button
                onClick={() => {
                  setSent(false);
                  setMode("signin");
                }}
                className="mt-4 text-sm text-[var(--accent)] underline"
              >
                {t("auth.signIn")} →
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  label={t("auth.email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
                <Input
                  type="password"
                  label={t("auth.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  error={error}
                />
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  {mode === "signup" ? t("auth.signUp") : t("auth.signIn")}
                </Button>
              </form>

              <p className="text-center text-sm text-[var(--brown-400)] mt-4">
                {mode === "signup"
                  ? t("auth.alreadyHaveAccount")
                  : t("auth.noAccount")}{" "}
                <button
                  onClick={() => {
                    setMode(mode === "signup" ? "signin" : "signup");
                    setError("");
                  }}
                  className="text-[var(--accent)] underline"
                >
                  {mode === "signup" ? t("auth.signIn") : t("auth.signUp")}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
