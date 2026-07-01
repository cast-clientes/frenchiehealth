"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { getParentTitle } from "@/lib/parentDisplay";
import type { ParentRole } from "@/lib/parentDisplay";
import { Clock, Image as ImageIcon, FileHeart, Lightbulb, Star, ChevronRight, ChevronLeft } from "lucide-react";

const MORE_LINKS = [
  { href: "/tracker", icon: Clock, labelEs: "Historial completo", labelEn: "Full history" },
  { href: "/album", icon: ImageIcon, labelEs: "Álbum de vida", labelEn: "Life album" },
  { href: "/passport", icon: FileHeart, labelEs: "Pasaporte de salud", labelEn: "Health passport" },
  { href: "/tips", icon: Lightbulb, labelEs: "Tips del día", labelEn: "Daily tips" },
  { href: "/upgrade", icon: Star, labelEs: "Mi plan", labelEn: "My plan" },
] as const;

interface RoleOption {
  key: ParentRole;
  emoji: string;
  labelEs: string;
  labelEn: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  { key: "mama",    emoji: "👩", labelEs: "Mamá",    labelEn: "Mom"      },
  { key: "papa",    emoji: "👨", labelEs: "Papá",    labelEn: "Dad"      },
  { key: "tutor",   emoji: "🧑", labelEs: "Tutor/a", labelEn: "Guardian" },
  { key: "abuelo",  emoji: "👴", labelEs: "Abuelo",  labelEn: "Grandpa"  },
  { key: "abuela",  emoji: "👵", labelEs: "Abuela",  labelEn: "Grandma"  },
  { key: "hermano", emoji: "👦", labelEs: "Hermano", labelEn: "Brother"  },
  { key: "hermana", emoji: "👧", labelEs: "Hermana", labelEn: "Sister"   },
  { key: "custom",  emoji: "✍️", labelEs: "Mi rol…", labelEn: "My role…" },
];

export default function ProfilePage() {
  const locale = useLocale();

  const [parentRole, setParentRole] = useState<ParentRole>("parent");
  const [customRole, setCustomRole] = useState("");
  const [dogName, setDogName] = useState("");
  const [dogNickname, setDogNickname] = useState("");
  const [dogPronoun, setDogPronoun] = useState<"el" | "ella">("el");
  const [dogId, setDogId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Passport info
  const [breedColor, setBreedColor] = useState("");
  const [vetName, setVetName] = useState("");
  const [vetPhone, setVetPhone] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [microchip, setMicrochip] = useState("");
  const [allergiesText, setAllergiesText] = useState("");
  const [medicationsText, setMedicationsText] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: profile }, { data: dogs }] = await Promise.all([
        supabase.from("profiles").select("parent_role, parent_role_custom").eq("id", user.id).single(),
        supabase
          .from("dogs")
          .select("id, name, nickname, pronoun, breed_color, vet_name, vet_phone, emergency_contact_name, emergency_contact_phone, microchip_number, known_allergies, current_medications")
          .eq("user_id", user.id)
          .limit(1),
      ]);

      if (profile) {
        setParentRole((profile.parent_role as ParentRole) ?? "parent");
        setCustomRole(profile.parent_role_custom ?? "");
      }
      const dog = dogs?.[0];
      if (dog) {
        setDogId(dog.id);
        setDogName(dog.name ?? "");
        setDogNickname(dog.nickname ?? "");
        setDogPronoun((dog.pronoun === "ella" ? "ella" : "el") as "el" | "ella");
        setBreedColor(dog.breed_color ?? "");
        setVetName(dog.vet_name ?? "");
        setVetPhone(dog.vet_phone ?? "");
        setEmergencyName(dog.emergency_contact_name ?? "");
        setEmergencyPhone(dog.emergency_contact_phone ?? "");
        setMicrochip(dog.microchip_number ?? "");
        setAllergiesText((dog.known_allergies ?? []).join(", "));
        setMedicationsText((dog.current_medications ?? []).join(", "));
      }
      setLoading(false);
    }
    load();
  }, []);

  const previewTitle = getParentTitle({
    parentRole,
    parentRoleCustom: customRole.trim() || null,
    dogName: dogName.trim() || (locale === "es" ? "tu Frenchie" : "your Frenchie"),
    language: locale === "es" ? "es" : "en",
  });

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const roleCustom = parentRole === "custom" ? customRole.trim() || null : null;
    const displayTitle = getParentTitle({
      parentRole,
      parentRoleCustom: roleCustom,
      dogName: dogName.trim() || "Frenchie",
      language: "es",
    });

    const { error: profileErr } = await supabase.from("profiles").upsert({
      id: user.id,
      parent_role: parentRole,
      parent_role_custom: roleCustom,
      parent_role_display: displayTitle,
    });

    if (profileErr) {
      setError(profileErr.message);
      setSaving(false);
      return;
    }

    let err: { message: string } | null = null;
    if (dogId) {
      const { error: dogErr } = await supabase.from("dogs").update({
        name: dogName.trim() || undefined,
        nickname: dogNickname.trim() || null,
        pronoun: dogPronoun,
        gender: dogPronoun === "ella" ? "female" : "male",
        breed_color: breedColor.trim() || null,
        vet_name: vetName.trim() || null,
        vet_phone: vetPhone.trim() || null,
        emergency_contact_name: emergencyName.trim() || null,
        emergency_contact_phone: emergencyPhone.trim() || null,
        microchip_number: microchip.trim() || null,
        known_allergies: allergiesText.trim() ? allergiesText.split(",").map((s) => s.trim()).filter(Boolean) : null,
        current_medications: medicationsText.trim() ? medicationsText.split(",").map((s) => s.trim()).filter(Boolean) : null,
      }).eq("id", dogId).eq("user_id", user.id);
      err = dogErr;
    }

    if (err) {
      setError((err as { message: string }).message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="px-4 pt-8 flex items-center justify-center">
        <div className="text-4xl animate-pulse">🐾</div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-10 space-y-6 max-w-lg mx-auto">
      <div className="flex items-center gap-2">
        <Link href="/dashboard" aria-label={locale === "es" ? "Volver al inicio" : "Back to dashboard"} className="p-1 -ml-1 rounded-lg hover:bg-[var(--cream)] transition-colors">
          <ChevronLeft className="w-5 h-5 text-[var(--brown-700)]" />
        </Link>
        <h1 className="text-2xl font-bold text-[var(--brown-800)]">
          {locale === "es" ? "Tu perfil 🐾" : "Your profile 🐾"}
        </h1>
      </div>

      {/* Live preview */}
      <div style={{ background: "linear-gradient(135deg, #fff3ed, #ffe8d6)", borderRadius: "1.25rem", padding: "1.25rem", border: "2px solid var(--accent)" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.375rem" }}>
          {locale === "es" ? "Así te vamos a llamar" : "How we'll call you"}
        </p>
        <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--brown-800)" }}>
          {previewTitle.charAt(0).toUpperCase() + previewTitle.slice(1)} 💛
        </p>
      </div>

      {/* Parent role */}
      <div>
        <p className="text-sm font-semibold text-[var(--brown-700)] mb-3">
          {locale === "es" ? "¿Cuál es tu rol?" : "What's your role?"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.625rem" }}>
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              aria-pressed={parentRole === opt.key}
              onClick={() => setParentRole(opt.key)}
              style={{
                background: parentRole === opt.key ? "#fff3ed" : "white",
                border: parentRole === opt.key ? "2px solid var(--accent)" : "1.5px solid var(--brown-100)",
                borderRadius: "0.875rem",
                padding: "0.75rem 0.375rem",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{opt.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--brown-800)" }}>
                {locale === "es" ? opt.labelEs : opt.labelEn}
              </div>
            </button>
          ))}
        </div>

        {parentRole === "custom" && (
          <input
            type="text"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            placeholder={locale === "es" ? "Ej: el humano de, la madrina de…" : "E.g. the human of…"}
            style={{
              marginTop: "0.75rem",
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "0.875rem",
              border: "1.5px solid var(--brown-200)",
              fontSize: "0.875rem",
              outline: "none",
              boxSizing: "border-box",
            }}
            autoFocus
          />
        )}
      </div>

      {/* Dog info */}
      {dogId !== null ? (
        <>
          <Card>
            <p className="text-sm font-semibold text-[var(--brown-700)] mb-3">
              {locale === "es" ? "Info de tu Frenchie" : "Your Frenchie's info"}
            </p>
            <div className="space-y-3">
              <Input
                label={locale === "es" ? "Nombre" : "Name"}
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                placeholder="Luna, Max, Coco..."
              />
              <Input
                label={locale === "es" ? "Apodo cariñoso (opcional)" : "Nickname (optional)"}
                value={dogNickname}
                onChange={(e) => setDogNickname(e.target.value)}
                placeholder={locale === "es" ? "bebé, el rey, princesa…" : "baby, little king…"}
              />
              <div>
                <p className="text-sm font-semibold text-[var(--brown-700)] mb-2">
                  {locale === "es" ? "Pronombre" : "Pronoun"}
                </p>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {(["el", "ella"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setDogPronoun(p)}
                      style={{
                        flex: 1,
                        padding: "0.625rem",
                        borderRadius: "0.75rem",
                        border: dogPronoun === p ? "2px solid var(--accent)" : "1.5px solid var(--brown-200)",
                        background: dogPronoun === p ? "#fff3ed" : "white",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        color: dogPronoun === p ? "var(--accent)" : "var(--brown-600)",
                      }}
                    >
                      {p === "el" ? (locale === "es" ? "Él 🐾" : "He 🐾") : (locale === "es" ? "Ella 🐾" : "She 🐾")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Passport / medical info */}
          <Card>
            <p className="text-sm font-semibold text-[var(--brown-700)] mb-3">
              {locale === "es" ? "🏥 Pasaporte de salud" : "🏥 Health passport"}
            </p>
            <div className="space-y-3">
              <Input
                label={locale === "es" ? "Color / raza" : "Color / breed"}
                value={breedColor}
                onChange={(e) => setBreedColor(e.target.value)}
                placeholder={locale === "es" ? "Atigrado con mancha blanca..." : "Brindle with white patch..."}
              />
              <Input
                label={locale === "es" ? "Número de microchip" : "Microchip number"}
                value={microchip}
                onChange={(e) => setMicrochip(e.target.value)}
                placeholder="956000012345678"
              />
              <Input
                label={locale === "es" ? "Veterinario" : "Veterinarian"}
                value={vetName}
                onChange={(e) => setVetName(e.target.value)}
                placeholder={locale === "es" ? "Dr. Carlos Martínez" : "Dr. Smith"}
              />
              <Input
                label={locale === "es" ? "Teléfono del veterinario" : "Vet phone"}
                value={vetPhone}
                onChange={(e) => setVetPhone(e.target.value)}
                placeholder="+57 300 123 4567"
              />
              <Input
                label={locale === "es" ? "Contacto de emergencia" : "Emergency contact"}
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder={locale === "es" ? "Nombre" : "Name"}
              />
              <Input
                label={locale === "es" ? "Teléfono de emergencia" : "Emergency phone"}
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+57 310 987 6543"
              />
              <Input
                label={locale === "es" ? "Alergias conocidas (separadas por coma)" : "Known allergies (comma-separated)"}
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder={locale === "es" ? "Pollo, polen" : "Chicken, pollen"}
              />
              <Input
                label={locale === "es" ? "Medicamentos actuales (separados por coma)" : "Current medications (comma-separated)"}
                value={medicationsText}
                onChange={(e) => setMedicationsText(e.target.value)}
                placeholder={locale === "es" ? "Apoquel 5.4mg" : "Apoquel 5.4mg"}
              />
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <p className="text-sm font-semibold text-[var(--brown-700)] mb-2">
            {locale === "es" ? "Info de tu Frenchie" : "Your Frenchie's info"}
          </p>
          <p className="text-sm text-[var(--brown-500)] mb-3">
            {locale === "es"
              ? "Todavía no has agregado a tu Frenchie."
              : "You haven't added your Frenchie yet."}
          </p>
          <Link
            href="/dogs/new"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            {locale === "es" ? "Agregar a mi Frenchie" : "Add dog"}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Card>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {saved && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 text-center font-semibold">
          {locale === "es" ? "✅ ¡Guardado!" : "✅ Saved!"}
        </div>
      )}

      <Button className="w-full" size="lg" onClick={handleSave} loading={saving}>
        {locale === "es" ? "Guardar cambios" : "Save changes"}
      </Button>

      {/* More — everything else in the app lives here */}
      <div>
        <p className="text-sm font-semibold text-[var(--brown-700)] mb-3">
          {locale === "es" ? "Más" : "More"}
        </p>
        <Card className="p-0 overflow-hidden">
          {MORE_LINKS.map((link, i) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--cream)] transition-colors ${
                  i < MORE_LINKS.length - 1 ? "border-b border-[var(--brown-100)]" : ""
                }`}
              >
                <Icon className="w-5 h-5 text-[var(--accent)] flex-shrink-0" />
                <span className="flex-1 text-sm font-medium text-[var(--brown-800)]">
                  {locale === "es" ? link.labelEs : link.labelEn}
                </span>
                <ChevronRight className="w-4 h-4 text-[var(--brown-300)] flex-shrink-0" />
              </Link>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
