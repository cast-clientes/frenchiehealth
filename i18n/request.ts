import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "es")) {
    locale = routing.defaultLocale;
  }

  const lpMessages = {
    earInfections: (await import(`../messages/${locale}/lp-ear-infections.json`))
      .default,
    feedingGuide: (await import(`../messages/${locale}/lp-feeding-guide.json`))
      .default,
    breathingHeat: (await import(`../messages/${locale}/lp-breathing-heat.json`))
      .default,
    newFrenchieOwner: (
      await import(`../messages/${locale}/lp-new-frenchie-owner.json`)
    ).default,
    vetVisits: (await import(`../messages/${locale}/lp-vet-visits.json`))
      .default,
  };

  return {
    locale,
    messages: {
      ...(await import(`../messages/${locale}.json`)).default,
      lp: lpMessages,
    },
  };
});
