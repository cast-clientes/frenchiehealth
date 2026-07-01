import { getLocale } from "next-intl/server";
import { HealthModulePage } from "@/components/modules/HealthModulePage";

export default async function WeightPage() {
  const locale = await getLocale();
  return <HealthModulePage moduleKey="weight" locale={locale} />;
}
