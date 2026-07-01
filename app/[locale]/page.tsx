import LandingPage from "@/components/landing/LandingPage";

export default async function LocaleIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LandingPage locale={locale} />;
}
