import type { Database } from "@/types/database";

type SkinEntry = Database["public"]["Tables"]["skin_entries"]["Row"];

export interface Recommendation {
  type: "info" | "warning" | "urgent";
  titleEn: string;
  titleEs: string;
  messageEn: string;
  messageEs: string;
}

export function generateRecommendations(
  entries: SkinEntry[],
  latestEntry: SkinEntry
): Recommendation[] {
  const recs: Recommendation[] = [];
  const sorted = [...entries].sort(
    (a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
  );

  // Rule 1: Itch score 8+ → urgent vet visit
  if (latestEntry.itch_score >= 8) {
    recs.push({
      type: "urgent",
      titleEn: "High Itch Score Detected",
      titleEs: "Puntuación de Picazón Alta Detectada",
      messageEn:
        "Your Frenchie's itch score is very high today. This level of discomfort warrants a veterinary appointment soon — please don't wait more than 2–3 days if it doesn't improve.",
      messageEs:
        "La puntuación de picazón de tu Frenchie es muy alta hoy. Este nivel de incomodidad amerita una cita veterinaria pronto — por favor no esperes más de 2–3 días si no mejora.",
    });
  }

  // Rule 2: Rising itch 3 consecutive days → check food
  if (sorted.length >= 3) {
    const last3 = sorted.slice(0, 3).map((e) => e.itch_score);
    const rising = last3[0] > last3[1] && last3[1] > last3[2];
    if (rising) {
      recs.push({
        type: "warning",
        titleEn: "Itch Score Rising 3 Days in a Row",
        titleEs: "Puntuación de Picazón en Aumento 3 Días Seguidos",
        messageEn:
          "The itch score has increased 3 days in a row. Consider whether anything changed recently — new food, treats, laundry detergent, or outdoor exposure. A food or contact trigger is worth investigating.",
        messageEs:
          "La puntuación de picazón ha aumentado 3 días seguidos. Considera si algo cambió recientemente — nueva comida, golosinas, detergente de ropa o exposición al exterior. Vale la pena investigar un desencadenante alimentario o por contacto.",
      });
    }
  }

  // Rule 3: Repeated facial_folds → remind cleaning
  const facialCount = sorted
    .slice(0, 5)
    .filter((e) => e.affected_zone === "facial_folds").length;
  if (facialCount >= 3) {
    recs.push({
      type: "info",
      titleEn: "Facial Folds Affected Repeatedly",
      titleEs: "Pliegues Faciales Afectados Repetidamente",
      messageEn:
        "Facial folds have been the main affected zone in recent entries. Make sure you're cleaning and drying them daily — even twice a day if needed. Use fragrance-free, alcohol-free wipes.",
      messageEs:
        "Los pliegues faciales han sido la zona más afectada en las entradas recientes. Asegúrate de limpiarlos y secarlos diariamente — incluso dos veces al día si es necesario. Usa toallitas sin fragancia ni alcohol.",
    });
  }

  // Rule 4: Ear zone repeated
  const earCount = sorted
    .slice(0, 5)
    .filter((e) => e.affected_zone === "ears").length;
  if (earCount >= 2) {
    recs.push({
      type: "warning",
      titleEn: "Recurring Ear Issues",
      titleEs: "Problemas de Oído Recurrentes",
      messageEn:
        "Ears have been a concern in multiple recent entries. Check for dark discharge, strong odor, or excessive scratching — these are signs of an ear infection that needs veterinary attention.",
      messageEs:
        "Las orejas han sido una preocupación en varias entradas recientes. Revisa si hay secreción oscura, olor fuerte o rascado excesivo — estas son señales de una infección de oído que necesita atención veterinaria.",
    });
  }

  // Rule 5: Same food + high scores
  if (latestEntry.food_of_day && latestEntry.itch_score >= 6) {
    const firstWord = (latestEntry.food_of_day ?? "").toLowerCase().split(" ")[0];
    const sameFood = sorted
      .slice(1, 7)
      .filter(
        (e) =>
          e.food_of_day &&
          e.food_of_day.toLowerCase().includes(firstWord) &&
          e.itch_score >= 5
      );

    if (sameFood.length >= 2) {
      recs.push({
        type: "warning",
        titleEn: "Possible Food Connection",
        titleEs: "Posible Conexión con la Comida",
        messageEn: `High itch scores appear repeatedly on days when "${latestEntry.food_of_day}" was logged. Consider whether this food could be a trigger. Consult your vet about an elimination diet.`,
        messageEs: `Las puntuaciones de picazón altas aparecen repetidamente en días en que se registró "${latestEntry.food_of_day}". Considera si este alimento podría ser un desencadenante. Consulta a tu veterinario sobre una dieta de eliminación.`,
      });
    }
  }

  return recs;
}
