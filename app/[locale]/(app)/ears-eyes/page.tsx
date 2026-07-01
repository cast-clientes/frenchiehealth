import { getLocale } from "next-intl/server";
import { HealthModulePage } from "@/components/modules/HealthModulePage";

export default async function EarsEyesPage() {
  const locale = await getLocale();
  return <HealthModulePage moduleKey="ears_eyes" locale={locale} />;
}
