"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { analytics } from "@/lib/analytics/events";
import {
  calendarConfig,
  earsEyesConfig,
  jointsConfig,
  respiratoryConfig,
  weightConfig,
} from "@/components/modules/moduleConfigs";

type ModuleKey =
  | "respiratory"
  | "ears_eyes"
  | "joints"
  | "weight"
  | "health_calendar";

type Field =
  | {
      key: string;
      type: "text" | "number" | "date";
      labelEn: string;
      labelEs: string;
      placeholderEn?: string;
      placeholderEs?: string;
      required?: boolean;
    }
  | {
      key: string;
      type: "textarea";
      labelEn: string;
      labelEs: string;
      placeholderEn?: string;
      placeholderEs?: string;
    }
  | {
      key: string;
      type: "boolean";
      labelEn: string;
      labelEs: string;
    }
  | {
      key: string;
      type: "select";
      labelEn: string;
      labelEs: string;
      options: Array<{ value: string; labelEn: string; labelEs: string }>;
      required?: boolean;
    };

type ModuleConfig = {
  module: ModuleKey;
  icon: string;
  titleEn: string;
  titleEs: string;
  subtitleEn: string;
  subtitleEs: string;
  emergencyEn?: string;
  emergencyEs?: string;
  fields: Field[];
  summary: (entry: Record<string, unknown>, locale: string) => string;
};

type EntriesResponse = {
  dog: { id: string } | null;
  entries: Array<Record<string, unknown>>;
  error?: string;
};

function today() {
  return new Date().toISOString().split("T")[0];
}

function label(locale: string, en: string, es: string) {
  return locale === "es" ? es : en;
}

function stringValue(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function boolValue(value: unknown) {
  return value === true;
}

export function HealthModulePage({
  moduleKey,
  locale,
}: {
  moduleKey: ModuleKey;
  locale: string;
}) {
  const router = useRouter();
  const config = {
    respiratory: respiratoryConfig,
    ears_eyes: earsEyesConfig,
    joints: jointsConfig,
    weight: weightConfig,
    health_calendar: calendarConfig,
  }[moduleKey];
  const [entries, setEntries] = useState<Array<Record<string, unknown>>>([]);
  const [hasDog, setHasDog] = useState(true);
  const [values, setValues] = useState<Record<string, string | boolean>>({
    date: today(),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const copy = useMemo(
    () => ({
      title: label(locale, config.titleEn, config.titleEs),
      subtitle: label(locale, config.subtitleEn, config.subtitleEs),
      save: locale === "es" ? "Guardar registro" : "Save entry",
      saving: locale === "es" ? "Guardando..." : "Saving...",
      history: locale === "es" ? "Historial reciente" : "Recent history",
      empty: locale === "es" ? "Aun no hay registros." : "No entries yet.",
      addDog:
        locale === "es"
          ? "Agrega tu Frenchie para empezar"
          : "Add your Frenchie to get started",
      addDogCta: locale === "es" ? "Agregar Frenchie" : "Add Frenchie",
      saved: locale === "es" ? "Registro guardado." : "Entry saved.",
      disclaimer:
        locale === "es"
          ? "Esto es informacion general y no reemplaza el consejo profesional de tu veterinario."
          : "This is general information and does not replace your veterinarian's professional advice.",
    }),
    [config, locale],
  );

  useEffect(() => {
    async function loadEntries() {
      setLoading(true);
      const res = await fetch(`/api/module-entries?module=${config.module}`);
      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }
      const data = (await res.json()) as EntriesResponse;
      setHasDog(Boolean(data.dog));
      setEntries(data.entries ?? []);
      setLoading(false);
    }

    loadEntries();
  }, [config.module, router]);

  function updateValue(key: string, value: string | boolean) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/module-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        module: config.module,
        ...values,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Could not save entry.");
      setSaving(false);
      return;
    }

    analytics.moduleEntryCreated(config.module);
    setEntries((current) => [data.entry, ...current].slice(0, 20));
    setValues({ date: today() });
    setSaved(true);
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="px-4 pt-6">
        <Card>
          <p className="text-sm text-[var(--brown-600)]">
            {locale === "es" ? "Cargando..." : "Loading..."}
          </p>
        </Card>
      </div>
    );
  }

  if (!hasDog) {
    return (
      <div className="px-4 pt-6 space-y-4">
        <Card className="text-center">
          <div className="text-4xl mb-3">{config.icon}</div>
          <h1 className="text-xl font-bold text-[var(--brown-800)]">
            {copy.addDog}
          </h1>
          <Button className="mt-4" onClick={() => router.push("/dogs/new")}>
            {copy.addDogCta}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-6 space-y-5">
      <div>
        <div className="text-4xl mb-2">{config.icon}</div>
        <h1 className="text-2xl font-bold text-[var(--brown-800)]">
          {copy.title}
        </h1>
        <p className="text-sm text-[var(--brown-400)] mt-1">{copy.subtitle}</p>
      </div>

      {(config.emergencyEn || config.emergencyEs) && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-sm text-red-800 leading-relaxed">
            {label(locale, config.emergencyEn ?? "", config.emergencyEs ?? "")}
          </p>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="space-y-4">
          {config.fields.map((field) => {
            const fieldLabel = label(locale, field.labelEn, field.labelEs);
            if (field.type === "boolean") {
              return (
                <label
                  key={field.key}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brown-100)] bg-white px-4 py-3"
                >
                  <span className="text-sm font-medium text-[var(--brown-700)]">
                    {fieldLabel}
                  </span>
                  <input
                    type="checkbox"
                    checked={boolValue(values[field.key])}
                    onChange={(e) => updateValue(field.key, e.target.checked)}
                    className="h-5 w-5 accent-[var(--accent)]"
                  />
                </label>
              );
            }

            if (field.type === "select") {
              return (
                <label key={field.key} className="block">
                  <span className="text-sm font-medium text-[var(--brown-700)]">
                    {fieldLabel}
                  </span>
                  <select
                    required={field.required}
                    value={stringValue(values[field.key])}
                    onChange={(e) => updateValue(field.key, e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--brown-200)] bg-white px-4 py-2.5 text-sm text-[var(--brown-800)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                  >
                    <option value="">
                      {locale === "es" ? "Selecciona..." : "Select..."}
                    </option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {label(locale, option.labelEn, option.labelEs)}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            if (field.type === "textarea") {
              const placeholder = label(
                locale,
                field.placeholderEn ?? "",
                field.placeholderEs ?? "",
              );

              return (
                <label key={field.key} className="block">
                  <span className="text-sm font-medium text-[var(--brown-700)]">
                    {fieldLabel}
                  </span>
                  <textarea
                    value={stringValue(values[field.key])}
                    onChange={(e) => updateValue(field.key, e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className="mt-1 w-full resize-none rounded-xl border border-[var(--brown-200)] bg-white px-4 py-2.5 text-sm text-[var(--brown-800)] placeholder:text-[var(--brown-400)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                  />
                </label>
              );
            }

            const placeholder = label(
              locale,
              field.placeholderEn ?? "",
              field.placeholderEs ?? "",
            );

            return (
              <label key={field.key} className="block">
                <span className="text-sm font-medium text-[var(--brown-700)]">
                  {fieldLabel}
                </span>
                <input
                  type={field.type}
                  required={field.required}
                  value={stringValue(values[field.key])}
                  onChange={(e) => updateValue(field.key, e.target.value)}
                  placeholder={placeholder}
                  className="mt-1 w-full rounded-xl border border-[var(--brown-200)] bg-white px-4 py-2.5 text-sm text-[var(--brown-800)] placeholder:text-[var(--brown-400)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                />
              </label>
            );
          })}
        </Card>

        {saved && (
          <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
            {copy.saved}
          </p>
        )}
        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit" loading={saving} className="w-full" size="lg">
          {saving ? copy.saving : copy.save}
        </Button>
      </form>

      <div>
        <h2 className="font-semibold text-[var(--brown-800)] mb-3">
          {copy.history}
        </h2>
        {entries.length === 0 ? (
          <Card>
            <p className="text-sm text-[var(--brown-400)]">{copy.empty}</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <Card key={stringValue(entry.id)} className="py-3">
                <p className="text-sm font-medium text-[var(--brown-800)]">
                  {config.summary(entry, locale)}
                </p>
                <p className="text-xs text-[var(--brown-400)] mt-1">
                  {stringValue(entry.date ?? entry.event_date)}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-[var(--brown-400)] text-center">
        {copy.disclaimer}
      </p>
    </div>
  );
}

export type { ModuleConfig };
