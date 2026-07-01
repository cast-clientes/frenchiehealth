import { getLocale } from "next-intl/server";
import { HealthModulePage } from "@/components/modules/HealthModulePage";

export default async function RespiratoryPage() {
  const locale = await getLocale();
  return <HealthModulePage moduleKey="respiratory" locale={locale} />;
}
