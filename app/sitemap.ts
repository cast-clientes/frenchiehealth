import type { MetadataRoute } from "next";
import { lpSlugs } from "@/lib/lp-content";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://frenchiecare.app";
  const now = new Date();

  return routing.locales.flatMap((locale) =>
    lpSlugs.map((slug) => ({
      url: `${baseUrl}/${locale}/lp/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/lp/${slug}`,
          es: `${baseUrl}/es/lp/${slug}`,
        },
      },
    })),
  );
}
