import { getLocale } from "next-intl/server";
import { HealthModulePage } from "@/components/modules/HealthModulePage";

export default async function HealthCalendarPage() {
  const locale = await getLocale();
  return <HealthModulePage moduleKey="health_calendar" locale={locale} />;
}
