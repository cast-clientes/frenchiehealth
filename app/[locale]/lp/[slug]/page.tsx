import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LpLandingPage from "@/components/lp/LpLandingPage";
import { getLpContent, lpSlugs } from "@/lib/lp-content";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    lpSlugs.map((slug) => ({
      locale,
      slug,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const content = getLpContent(locale, slug);

  if (!content) {
    return {};
  }

  const url = `/${locale}/lp/${slug}`;
  const image = Object.values(content.images)[0];

  return {
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.meta.keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `/en/lp/${slug}`,
        es: `/es/lp/${slug}`,
      },
    },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url,
      type: "website",
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 675,
              alt: content.meta.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: content.meta.title,
      description: content.meta.description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function LandingPageRoute({ params }: Props) {
  const { locale, slug } = await params;
  const content = getLpContent(locale, slug);

  if (!content) {
    notFound();
  }

  return <LpLandingPage content={content} locale={locale} />;
}
