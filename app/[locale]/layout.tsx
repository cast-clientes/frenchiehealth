import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { GTMNoScript, GTMScript } from "@/components/analytics/GTMScript";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import CookieConsent from "@/components/CookieConsent";
import LanguageSwitch from "@/components/LanguageSwitch";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#e8734a",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Frenchie Skin Tracker",
    template: "%s · Frenchie Skin Tracker",
  },
  description:
    "Track your French Bulldog's skin health with daily tips, a vet-specific feeding plan, and AI guidance.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Frenchie",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Frenchie Skin Tracker",
    description: "The skin health app built for French Bulldog owners.",
    type: "website",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "es")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <>
      <GTMScript />
      <GTMNoScript />
      <NextIntlClientProvider messages={messages}>
        <PageViewTracker />
        {children}
        <LanguageSwitch />
        <CookieConsent locale={locale} />
      </NextIntlClientProvider>
    </>
  );
}
