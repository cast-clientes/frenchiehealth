import type { ModuleConfig } from "@/components/modules/HealthModulePage";

function dateField() {
  return {
    key: "date",
    type: "date" as const,
    labelEn: "Date",
    labelEs: "Fecha",
    required: true,
  };
}

function notesField() {
  return {
    key: "notes",
    type: "textarea" as const,
    labelEn: "Notes",
    labelEs: "Notas",
    placeholderEn: "Anything else you noticed?",
    placeholderEs: "Algo mas que hayas notado?",
  };
}

function value(entry: Record<string, unknown>, key: string, fallback = "-") {
  const raw = entry[key];
  return raw === null || raw === undefined || raw === "" ? fallback : String(raw);
}

export const respiratoryConfig: ModuleConfig = {
  module: "respiratory",
  icon: "B",
  titleEn: "Breathing tracker",
  titleEs: "Registro respiratorio",
  subtitleEn: "Track episodes, heat, triggers, and severity.",
  subtitleEs: "Registra episodios, calor, detonantes y severidad.",
  emergencyEn:
    "Emergency signs: blue or pale gums, collapse, severe effort to breathe, or distress that does not improve at rest. Seek veterinary care immediately.",
  emergencyEs:
    "Señales de emergencia: encias azules o palidas, colapso, esfuerzo severo para respirar o malestar que no mejora en reposo. Busca atencion veterinaria inmediata.",
  fields: [
    dateField(),
    { key: "episode_occurred", type: "boolean", labelEn: "Episode happened", labelEs: "Hubo episodio" },
    { key: "severity", type: "number", labelEn: "Severity 1-10", labelEs: "Severidad 1-10", placeholderEn: "1-10", placeholderEs: "1-10" },
    { key: "episode_duration_minutes", type: "number", labelEn: "Duration in minutes", labelEs: "Duracion en minutos" },
    { key: "temperature_celsius", type: "number", labelEn: "Temperature C", labelEs: "Temperatura C" },
    {
      key: "trigger_suspected",
      type: "select",
      labelEn: "Suspected trigger",
      labelEs: "Detonante sospechado",
      options: [
        { value: "heat", labelEn: "Heat", labelEs: "Calor" },
        { value: "exercise", labelEn: "Exercise", labelEs: "Ejercicio" },
        { value: "excitement", labelEn: "Excitement", labelEs: "Emocion" },
        { value: "sleep", labelEn: "Sleep", labelEs: "Sueño" },
        { value: "unknown", labelEn: "Unknown", labelEs: "No se" },
      ],
    },
    notesField(),
  ],
  summary: (entry, locale) =>
    locale === "es"
      ? `Severidad ${value(entry, "severity")}/10 · ${value(entry, "trigger_suspected", "sin detonante")}`
      : `Severity ${value(entry, "severity")}/10 · ${value(entry, "trigger_suspected", "no trigger")}`,
};

export const earsEyesConfig: ModuleConfig = {
  module: "ears_eyes",
  icon: "E",
  titleEn: "Ears and eyes tracker",
  titleEs: "Registro de oidos y ojos",
  subtitleEn: "Track cleanliness, odor, discharge, redness, and cherry eye signs.",
  subtitleEs: "Registra limpieza, olor, secrecion, enrojecimiento y señales de cherry eye.",
  fields: [
    dateField(),
    { key: "ear_left_clean", type: "boolean", labelEn: "Left ear clean", labelEs: "Oido izquierdo limpio" },
    { key: "ear_right_clean", type: "boolean", labelEn: "Right ear clean", labelEs: "Oido derecho limpio" },
    { key: "ear_discharge", type: "boolean", labelEn: "Ear discharge", labelEs: "Secrecion en oido" },
    { key: "ear_odor", type: "boolean", labelEn: "Ear odor", labelEs: "Mal olor en oido" },
    { key: "eye_discharge", type: "boolean", labelEn: "Eye discharge", labelEs: "Secrecion ocular" },
    { key: "eye_redness", type: "boolean", labelEn: "Eye redness", labelEs: "Ojos rojos" },
    { key: "cherry_eye_visible", type: "boolean", labelEn: "Cherry eye visible", labelEs: "Cherry eye visible" },
    notesField(),
  ],
  summary: (entry, locale) => {
    const flags = ["ear_discharge", "ear_odor", "eye_discharge", "eye_redness", "cherry_eye_visible"].filter((key) => entry[key]);
    if (flags.length === 0) return locale === "es" ? "Chequeo sin alertas" : "Check with no alerts";
    return locale === "es" ? `${flags.length} alerta(s) registrada(s)` : `${flags.length} alert(s) logged`;
  },
};

export const jointsConfig: ModuleConfig = {
  module: "joints",
  icon: "J",
  titleEn: "Joints and mobility tracker",
  titleEs: "Registro de articulaciones",
  subtitleEn: "Track limping, pain, activity, and exercise.",
  subtitleEs: "Registra cojera, dolor, actividad y ejercicio.",
  emergencyEn:
    "If your Frenchie cannot bear weight, cries in pain, drags a limb, or suddenly cannot walk, seek veterinary care immediately.",
  emergencyEs:
    "Si tu Frenchie no puede apoyar peso, llora de dolor, arrastra una pata o de repente no puede caminar, busca atencion veterinaria inmediata.",
  fields: [
    dateField(),
    { key: "limping", type: "boolean", labelEn: "Limping", labelEs: "Cojea" },
    {
      key: "affected_limb",
      type: "select",
      labelEn: "Affected limb",
      labelEs: "Extremidad afectada",
      options: [
        { value: "front_left", labelEn: "Front left", labelEs: "Delantera izquierda" },
        { value: "front_right", labelEn: "Front right", labelEs: "Delantera derecha" },
        { value: "back_left", labelEn: "Back left", labelEs: "Trasera izquierda" },
        { value: "back_right", labelEn: "Back right", labelEs: "Trasera derecha" },
        { value: "unknown", labelEn: "Unknown", labelEs: "No se" },
      ],
    },
    { key: "pain_score", type: "number", labelEn: "Pain score 1-10", labelEs: "Dolor 1-10" },
    {
      key: "activity_level",
      type: "select",
      labelEn: "Activity level",
      labelEs: "Nivel de actividad",
      options: [
        { value: "low", labelEn: "Low", labelEs: "Bajo" },
        { value: "normal", labelEn: "Normal", labelEs: "Normal" },
        { value: "high", labelEn: "High", labelEs: "Alto" },
      ],
    },
    { key: "exercise_minutes", type: "number", labelEn: "Exercise minutes", labelEs: "Minutos de ejercicio" },
    notesField(),
  ],
  summary: (entry, locale) =>
    locale === "es"
      ? `Dolor ${value(entry, "pain_score")}/10 · ${entry.limping ? "con cojera" : "sin cojera"}`
      : `Pain ${value(entry, "pain_score")}/10 · ${entry.limping ? "limping" : "no limping"}`,
};

export const weightConfig: ModuleConfig = {
  module: "weight",
  icon: "W",
  titleEn: "Weight and digestion tracker",
  titleEs: "Registro de peso y digestion",
  subtitleEn: "Track weight, stool, appetite, gas, and vomiting.",
  subtitleEs: "Registra peso, heces, apetito, gases y vomitos.",
  fields: [
    dateField(),
    { key: "weight_kg", type: "number", labelEn: "Weight kg", labelEs: "Peso kg", required: true },
    { key: "gas_bloating", type: "boolean", labelEn: "Gas or bloating", labelEs: "Gases o hinchazon" },
    { key: "vomiting", type: "boolean", labelEn: "Vomiting", labelEs: "Vomitos" },
    {
      key: "stool_consistency",
      type: "select",
      labelEn: "Stool consistency",
      labelEs: "Consistencia de heces",
      options: [
        { value: "firm", labelEn: "Firm", labelEs: "Firme" },
        { value: "soft", labelEn: "Soft", labelEs: "Blanda" },
        { value: "loose", labelEn: "Loose", labelEs: "Suelta" },
        { value: "diarrhea", labelEn: "Diarrhea", labelEs: "Diarrea" },
      ],
    },
    {
      key: "appetite",
      type: "select",
      labelEn: "Appetite",
      labelEs: "Apetito",
      options: [
        { value: "low", labelEn: "Low", labelEs: "Bajo" },
        { value: "normal", labelEn: "Normal", labelEs: "Normal" },
        { value: "high", labelEn: "High", labelEs: "Alto" },
      ],
    },
    notesField(),
  ],
  summary: (entry, locale) =>
    locale === "es"
      ? `${value(entry, "weight_kg")} kg · apetito ${value(entry, "appetite", "-")}`
      : `${value(entry, "weight_kg")} kg · appetite ${value(entry, "appetite", "-")}`,
};

export const calendarConfig: ModuleConfig = {
  module: "health_calendar",
  icon: "C",
  titleEn: "Health calendar",
  titleEs: "Calendario de salud",
  subtitleEn: "Track vaccines, deworming, vet visits, grooming, and next due dates.",
  subtitleEs: "Registra vacunas, desparasitacion, visitas al vet, grooming y proximas fechas.",
  fields: [
    dateField(),
    {
      key: "event_type",
      type: "select",
      labelEn: "Event type",
      labelEs: "Tipo de evento",
      required: true,
      options: [
        { value: "vaccine", labelEn: "Vaccine", labelEs: "Vacuna" },
        { value: "deworming", labelEn: "Deworming", labelEs: "Desparasitacion" },
        { value: "vet_visit", labelEn: "Vet visit", labelEs: "Visita al vet" },
        { value: "grooming", labelEn: "Grooming", labelEs: "Grooming" },
        { value: "medication", labelEn: "Medication", labelEs: "Medicacion" },
        { value: "other", labelEn: "Other", labelEs: "Otro" },
      ],
    },
    { key: "event_name", type: "text", labelEn: "Event name", labelEs: "Nombre del evento", required: true },
    { key: "next_due_date", type: "date", labelEn: "Next due date", labelEs: "Proxima fecha" },
    { key: "vet_name", type: "text", labelEn: "Vet or clinic", labelEs: "Vet o clinica" },
    notesField(),
  ],
  summary: (entry, locale) =>
    locale === "es"
      ? `${value(entry, "event_name")} · ${value(entry, "event_type")}`
      : `${value(entry, "event_name")} · ${value(entry, "event_type")}`,
};
