"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle, ChevronLeft, Zap } from "lucide-react";
import { analytics } from "@/lib/analytics/events";
import { Button } from "@/components/ui/Button";

const FEATURES = [
  "unlimited_entries",
  "pdf_export",
  "unlimited_chat",
  "full_feeding_plan",
] as const;

const OFFER_END = new Date("2026-07-31T23:59:59Z");

type PlanType = "founder_monthly" | "founder_annual" | "monthly" | "annual";

const REGULAR_MONTHLY_PRICE = 18.99;
const EARLY_ADOPTER_BONUS = 10;
const FOUNDER_MONTHLY_PRICE = REGULAR_MONTHLY_PRICE - EARLY_ADOPTER_BONUS;
const FOUNDER_ANNUAL_BEFORE_EXTRA_DISCOUNT = FOUNDER_MONTHLY_PRICE * 12;
const FOUNDER_ANNUAL_EXTRA_DISCOUNT_RATE = 0.2;
const FOUNDER_ANNUAL_PRICE =
  Math.round(
    FOUNDER_ANNUAL_BEFORE_EXTRA_DISCOUNT *
      (1 - FOUNDER_ANNUAL_EXTRA_DISCOUNT_RATE) *
      100,
  ) / 100;
const FOUNDER_ANNUAL_MONTHLY_EQUIVALENT =
  Math.round((FOUNDER_ANNUAL_PRICE / 12) * 100) / 100;
const REGULAR_ANNUAL_PRICE = Math.round(REGULAR_MONTHLY_PRICE * 12 * 100) / 100;

const PLAN_PRICES: Record<PlanType, number> = {
  founder_monthly: FOUNDER_MONTHLY_PRICE,
  founder_annual: FOUNDER_ANNUAL_PRICE,
  monthly: REGULAR_MONTHLY_PRICE,
  annual: REGULAR_ANNUAL_PRICE,
};

const ANALYTICS_PLAN: Record<
  PlanType,
  "founding_monthly" | "founding_annual" | "monthly" | "annual"
> = {
  founder_monthly: "founding_monthly",
  founder_annual: "founding_annual",
  monthly: "monthly",
  annual: "annual",
};

interface FoundingStatus {
  total_spots: number;
  spots_taken: number;
  offer_active: boolean;
  offer_ends_at: string;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function price(value: number) {
  return value.toFixed(2);
}

function getCountdown(): Countdown {
  const diff = Math.max(0, OFFER_END.getTime() - Date.now());

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function UpgradePage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const es = locale === "es";

  const [loading, setLoading] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [founderStatus, setFounderStatus] = useState<FoundingStatus | null>(
    null,
  );
  const [countdown, setCountdown] = useState<Countdown>(getCountdown());

  useEffect(() => {
    fetch("/api/founding-status")
      .then((r) => r.json())
      .then((data: FoundingStatus) => setFounderStatus(data))
      .catch(() =>
        setFounderStatus({
          total_spots: 100,
          spots_taken: 67,
          offer_active: false,
          offer_ends_at: OFFER_END.toISOString(),
        }),
      );
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  async function handleCheckout(planType: PlanType) {
    setLoading(planType);
    setError(null);
    analytics.paywallCTAClicked(ANALYTICS_PLAN[planType]);
    analytics.checkoutStarted(ANALYTICS_PLAN[planType], PLAN_PRICES[planType]);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planType }),
    });
    const { url } = await res.json();

    if (url) {
      window.location.href = url;
    } else {
      setError(t("common.error"));
      setLoading(null);
    }
  }

  const offerActive = founderStatus?.offer_active === true;
  const spotsLeft =
    founderStatus !== null
      ? founderStatus.total_spots - founderStatus.spots_taken
      : null;

  if (founderStatus === null) {
    return (
      <div className="px-4 pt-10 pb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-[var(--brown-500)] mb-4 -ml-1"
        >
          <ChevronLeft className="w-4 h-4" />
          {es ? "Volver" : "Back"}
        </button>
        <div className="bg-white border-2 border-[var(--brown-100)] rounded-2xl p-6 text-center">
          <Zap className="w-10 h-10 text-[var(--accent)] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--brown-700)]">
            {t("common.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-6 space-y-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-[var(--brown-500)] -ml-1"
      >
        <ChevronLeft className="w-4 h-4" />
        {es ? "Volver" : "Back"}
      </button>
      <div className="text-center">
        <Zap className="w-10 h-10 text-[var(--accent)] mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-[var(--brown-800)]">
          {t("subscription.upgradeTitle")}
        </h1>
        <p className="text-sm text-[var(--brown-400)] mt-1">
          {es
            ? "Registro ilimitado · IA · Pasaporte · Comunidad"
            : "Unlimited tracking · AI · Passport · Community"}
        </p>
      </div>

      {offerActive ? (
        <div
          className="rounded-2xl overflow-hidden border-2 border-amber-400"
          style={{
            background:
              "linear-gradient(135deg, var(--brown-800) 0%, #2c1408 100%)",
          }}
        >
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <span className="inline-block bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                Founding Member
              </span>
              <div className="text-right">
                <p className="text-amber-400 text-xs font-bold">
                  {spotsLeft} {es ? "restantes" : "left"}
                </p>
                <p className="text-white/50 text-xs">
                  {founderStatus.spots_taken} {es ? "tomados" : "taken"}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="bg-white/10 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-amber-300 text-sm font-semibold">
                    {es ? "Bono early adopter" : "Early adopter bonus"}
                  </p>
                  <p className="text-amber-300 text-lg font-bold">
                    -${price(EARLY_ADOPTER_BONUS)}
                  </p>
                </div>
                <div className="mt-2 border-t border-white/10 pt-2 flex items-end justify-between gap-3">
                  <p className="text-white font-semibold">
                    {es ? "Precio mensual" : "Monthly price"}
                  </p>
                  <div className="text-right">
                    <p className="text-white font-bold text-3xl">
                      ${price(FOUNDER_MONTHLY_PRICE)}
                    </p>
                    <p className="text-white/60 text-xs">
                      {es ? "/mes" : "/mo"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-400/15 border border-amber-400/40 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-amber-300 text-sm font-semibold">
                    {es
                      ? "Descuento anual adicional"
                      : "Additional annual discount"}
                  </p>
                  <p className="text-amber-300 font-bold">20%</p>
                </div>
                <div className="mt-2 border-t border-white/10 pt-2 flex items-end justify-between gap-3">
                  <p className="text-white font-semibold">
                    {es ? "Precio anual" : "Yearly price"}
                  </p>
                  <div className="text-right">
                    <p className="text-white font-bold text-3xl">
                      ${price(FOUNDER_ANNUAL_PRICE)}
                    </p>
                    <p className="text-white/60 text-xs">
                      ${price(FOUNDER_ANNUAL_MONTHLY_EQUIVALENT)}
                      {es ? "/mes" : "/mo"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-amber-300 text-sm font-semibold mb-4">
              {es ? "Precio bloqueado para siempre" : "Price locked forever"}
            </p>

            <div className="mb-5">
              <p className="text-white/60 text-xs mb-2">
                {es ? "Oferta termina el 31 de julio" : "Offer ends July 31"}
              </p>
              <div className="flex gap-2">
                {[
                  { v: countdown.days, l: es ? "dias" : "days" },
                  { v: countdown.hours, l: "hrs" },
                  { v: countdown.minutes, l: "min" },
                  { v: countdown.seconds, l: "sec" },
                ].map(({ v, l }) => (
                  <div
                    key={l}
                    className="bg-black/30 rounded-lg px-2 py-1.5 text-center flex-1"
                  >
                    <p className="text-white font-bold text-lg leading-none">
                      {String(v).padStart(2, "0")}
                    </p>
                    <p className="text-white/50 text-[10px] mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleCheckout("founder_monthly")}
                disabled={loading !== null}
                className="w-full bg-amber-400 text-amber-900 font-bold py-3.5 rounded-full text-sm disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading === "founder_monthly"
                  ? t("common.loading")
                  : es
                    ? `Asegurar $${price(FOUNDER_MONTHLY_PRICE)}/mes ->`
                    : `Secure $${price(FOUNDER_MONTHLY_PRICE)}/mo ->`}
              </button>
              <button
                onClick={() => handleCheckout("founder_annual")}
                disabled={loading !== null}
                className="w-full border border-white/30 text-white/80 font-medium py-2.5 rounded-full text-sm disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading === "founder_annual"
                  ? t("common.loading")
                  : es
                    ? `Pagar anual $${price(FOUNDER_ANNUAL_PRICE)} ($${price(
                        FOUNDER_ANNUAL_MONTHLY_EQUIVALENT,
                      )}/mes) ->`
                    : `Pay yearly $${price(FOUNDER_ANNUAL_PRICE)} ($${price(
                        FOUNDER_ANNUAL_MONTHLY_EQUIVALENT,
                      )}/mo) ->`}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white border-2 border-[var(--brown-100)] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-[var(--brown-700)]">
                {es ? "Mensual" : "Monthly"}
              </span>
              <span className="text-2xl font-bold text-[var(--brown-800)]">
                ${price(REGULAR_MONTHLY_PRICE)}
                <span className="text-sm font-normal text-[var(--brown-400)]">
                  /mo
                </span>
              </span>
            </div>
            <p className="text-xs text-[var(--brown-400)] mb-4">
              {t("subscription.cancelAnytime")}
            </p>
            <Button
              onClick={() => handleCheckout("monthly")}
              loading={loading === "monthly"}
              disabled={loading !== null}
              className="w-full"
            >
              {es ? "Suscribirse mensual" : "Subscribe monthly"}
            </Button>
          </div>

          <div className="bg-white border-2 border-[var(--brown-100)] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-[var(--brown-700)]">
                {es ? "Anual" : "Annual"}
              </span>
              <span className="text-2xl font-bold text-[var(--brown-800)]">
                ${price(REGULAR_ANNUAL_PRICE)}
                <span className="text-sm font-normal text-[var(--brown-400)]">
                  /yr
                </span>
              </span>
            </div>
            <p className="text-xs text-[var(--brown-400)] mb-4">
              {es
                ? `Equivale a $${price(REGULAR_MONTHLY_PRICE)}/mes.`
                : `Equals $${price(REGULAR_MONTHLY_PRICE)}/mo.`}
            </p>
            <Button
              onClick={() => handleCheckout("annual")}
              loading={loading === "annual"}
              disabled={loading !== null}
              className="w-full"
            >
              {es ? "Suscribirse anual" : "Subscribe annually"}
            </Button>
          </div>
        </>
      )}

      <div className="space-y-3 pt-2">
        {FEATURES.map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[var(--accent)] flex-shrink-0" />
            <span className="text-sm text-[var(--brown-700)]">
              {t(`subscription.features.${feature}`)}
            </span>
          </div>
        ))}
      </div>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <p className="text-xs text-[var(--brown-400)] text-center">
        {es
          ? "Pago seguro via Stripe. Precios en USD."
          : "Secure payment via Stripe. Prices in USD."}
      </p>
    </div>
  );
}
