import earEn from "@/messages/en/lp-ear-infections.json";
import feedingEn from "@/messages/en/lp-feeding-guide.json";
import breathingEn from "@/messages/en/lp-breathing-heat.json";
import newOwnerEn from "@/messages/en/lp-new-frenchie-owner.json";
import vetEn from "@/messages/en/lp-vet-visits.json";
import earEs from "@/messages/es/lp-ear-infections.json";
import feedingEs from "@/messages/es/lp-feeding-guide.json";
import breathingEs from "@/messages/es/lp-breathing-heat.json";
import newOwnerEs from "@/messages/es/lp-new-frenchie-owner.json";
import vetEs from "@/messages/es/lp-vet-visits.json";

export const lpSlugs = [
  "ear-infections",
  "feeding-guide",
  "breathing-heat",
  "new-frenchie-owner",
  "vet-visits",
] as const;

export type LpSlug = (typeof lpSlugs)[number];
export type LpLocale = "en" | "es";

const content = {
  en: {
    "ear-infections": earEn,
    "feeding-guide": feedingEn,
    "breathing-heat": breathingEn,
    "new-frenchie-owner": newOwnerEn,
    "vet-visits": vetEn,
  },
  es: {
    "ear-infections": earEs,
    "feeding-guide": feedingEs,
    "breathing-heat": breathingEs,
    "new-frenchie-owner": newOwnerEs,
    "vet-visits": vetEs,
  },
} as const;

export function isLpSlug(slug: string): slug is LpSlug {
  return lpSlugs.includes(slug as LpSlug);
}

export function getLpContent(locale: string, slug: string) {
  const safeLocale: LpLocale = locale === "es" ? "es" : "en";
  if (!isLpSlug(slug)) return null;
  return content[safeLocale][slug];
}
