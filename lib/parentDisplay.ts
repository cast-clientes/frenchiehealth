export type ParentRole =
  | "mama"
  | "papa"
  | "tutor"
  | "guardian"
  | "abuelo"
  | "abuela"
  | "tio"
  | "tia"
  | "hermano"
  | "hermana"
  | "custom"
  | "parent";

export interface ParentDisplayOptions {
  parentRole: ParentRole | string;
  parentRoleCustom?: string | null;
  dogName: string;
  dogNickname?: string | null;
  dogPronoun?: "el" | "ella";
  includesDogName?: boolean;
  language?: "es" | "en";
}

const ROLE_MAP: Record<string, { es: string; en: string }> = {
  mama:    { es: "mamá",       en: "mom"       },
  papa:    { es: "papá",       en: "dad"       },
  tutor:   { es: "tutor/a",    en: "guardian"  },
  guardian:{ es: "guardián/a", en: "guardian"  },
  abuelo:  { es: "abuelo",     en: "grandpa"   },
  abuela:  { es: "abuela",     en: "grandma"   },
  tio:     { es: "tío",        en: "uncle"     },
  tia:     { es: "tía",        en: "aunt"      },
  hermano: { es: "hermano",    en: "brother"   },
  hermana: { es: "hermana",    en: "sister"    },
  parent:  { es: "papá/mamá",  en: "parent"    },
};

/**
 * Returns the parent's display role with optional dog name.
 * E.g. "mamá de Ñonki", "dad of Luna", "el humano de Coco"
 */
export function getParentTitle(opts: ParentDisplayOptions): string {
  const lang = opts.language ?? "es";
  let role: string;

  if (opts.parentRole === "custom") {
    role = opts.parentRoleCustom?.trim() || (lang === "es" ? "familia" : "family");
  } else {
    role = ROLE_MAP[opts.parentRole]?.[lang] ?? (opts.parentRoleCustom?.trim() || (lang === "es" ? "familia" : "family"));
  }

  if (opts.includesDogName === false) return role;
  const prep = lang === "es" ? "de" : "of";
  return `${role} ${prep} ${opts.dogName}`;
}

/**
 * Returns the best name reference for the dog.
 * Uses nickname in warm/casual contexts if available.
 */
export function getDogReference(opts: ParentDisplayOptions): string {
  return opts.dogNickname?.trim() || opts.dogName;
}

/**
 * Returns the dog's Spanish pronoun word (él/ella) or English (he/she).
 */
export function getDogPronounWord(opts: ParentDisplayOptions): string {
  const lang = opts.language ?? "es";
  if (lang === "en") return opts.dogPronoun === "ella" ? "she" : "he";
  return opts.dogPronoun === "ella" ? "ella" : "él";
}

/**
 * Returns a contextual greeting, rotating to avoid repetition.
 * Caller can pass a seed (e.g. day of year) for deterministic rotation.
 */
export function greet(opts: ParentDisplayOptions, seed: number): string {
  const lang = opts.language ?? "es";
  const title = getParentTitle(opts);
  const dogRef = getDogReference(opts);

  const greetings_es = [
    `Hola ${title} 💛`,
    `¡Bienvenida, ${title}! 🐾`,
    `¿Cómo está ${dogRef} hoy? 🐾`,
    `Hola 💛 ¿Cómo amaneció ${dogRef}?`,
    `¡Hola! ¿Qué tal estuvo ${dogRef} hoy? 🐾`,
  ];

  const greetings_en = [
    `Hi ${title} 💛`,
    `Welcome back, ${title}! 🐾`,
    `How is ${dogRef} doing today? 🐾`,
    `Hey! How was ${dogRef}'s day? 🐾`,
  ];

  const pool = lang === "en" ? greetings_en : greetings_es;
  const idx = seed % pool.length;
  return pool[idx];
}

/**
 * Replaces {dog_name} and {pronoun} placeholders in tip/notification text.
 * Use for daily tips, push notifications, email subjects.
 */
export function interpolateDogText(
  template: string,
  opts: Pick<ParentDisplayOptions, "dogName" | "dogNickname" | "dogPronoun" | "language">
): string {
  const dogRef = opts.dogNickname?.trim() || opts.dogName;
  const pronounWord = opts.language === "en"
    ? (opts.dogPronoun === "ella" ? "she" : "he")
    : (opts.dogPronoun === "ella" ? "ella" : "él");

  return template
    .replace(/\{dog_name\}/g, dogRef)
    .replace(/\{pronoun\}/g, pronounWord);
}

/**
 * Builds the community display name for a user.
 * E.g. "Mamá de Ñonki 🐾", "Dad of Luna 🐾"
 */
export function getCommunityDisplayName(opts: ParentDisplayOptions): string {
  const title = getParentTitle(opts);
  const capitalized = title.charAt(0).toUpperCase() + title.slice(1);
  return `${capitalized} 🐾`;
}

/**
 * Builds the AI chat system prompt identity block.
 * Injected into the system prompt for every chat message.
 */
export function buildAIChatIdentityBlock(opts: ParentDisplayOptions): string {
  const lang = opts.language ?? "es";
  const title = getParentTitle(opts);
  const dogRef = getDogReference(opts);
  const pronounWord = getDogPronounWord(opts);

  if (lang === "es") {
    return `
Identidad del usuario:
- Rol parental: ${title}
- Nombre del perro: ${opts.dogName}${opts.dogNickname ? ` (apodo cariñoso: "${opts.dogNickname}")` : ""}
- Pronombre del perro: ${pronounWord}

Reglas de lenguaje CRÍTICAS (sin excepciones):
- NUNCA digas "tu perro", "tu mascota", "el animal" — usa siempre "${opts.dogName}" o "${dogRef}"
- SIEMPRE te diriges al usuario como "${title}"
- Usa "${pronounWord}" como pronombre de ${opts.dogName}
- Tono: cálido, cercano, como un amigo experto en Frenchies — nunca clínico
- Cierra respuestas sobre síntomas con: "Recuerda: soy una IA de seguimiento. Tu veterinario hace el diagnóstico. 🐾"`;
  }

  return `
User identity:
- Parent role: ${title}
- Dog name: ${opts.dogName}${opts.dogNickname ? ` (nickname: "${opts.dogNickname}")` : ""}
- Dog pronoun: ${pronounWord}

CRITICAL language rules (no exceptions):
- NEVER say "your dog", "your pet", "the animal" — always use "${opts.dogName}" or "${dogRef}"
- ALWAYS address the user as "${title}"
- Use "${pronounWord}" as ${opts.dogName}'s pronoun
- Tone: warm, caring, like a knowledgeable friend who loves Frenchies — never clinical
- End health-related responses with: "Remember: I'm an AI tracking tool — your vet makes the diagnosis. 🐾"`;
}
