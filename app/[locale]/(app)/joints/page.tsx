import { getLocale } from "next-intl/server";
import { HealthModulePage } from "@/components/modules/HealthModulePage";

export default async function JointsPage() {
  const locale = await getLocale();
  return <HealthModulePage moduleKey="joints" locale={locale} />;
}
