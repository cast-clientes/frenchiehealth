"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Camera, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function NewDogPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [nickname, setNickname] = useState("");
  const [dogPronoun, setDogPronoun] = useState<"el" | "ella">("el");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const pendingName = localStorage.getItem("frenchie_pending_dog_name");
    const pendingPronoun = localStorage.getItem("frenchie_pending_pronoun");
    const pendingNickname = localStorage.getItem("frenchie_pending_nickname");
    if (pendingName) { setName(pendingName); localStorage.removeItem("frenchie_pending_dog_name"); }
    if (pendingPronoun === "ella") { setDogPronoun("ella"); localStorage.removeItem("frenchie_pending_pronoun"); }
    else if (pendingPronoun) { localStorage.removeItem("frenchie_pending_pronoun"); }
    if (pendingNickname) { setNickname(pendingNickname); localStorage.removeItem("frenchie_pending_nickname"); }
  }, []);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError(t('dogs.nameRequired')); return; }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login"); return; }

    let photoUrl: string | null = null;

    if (photoFile) {
      const ext = photoFile.name.split(".").pop();
      const path = `${user.id}/profile/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("dog-photos")
        .upload(path, photoFile);

      if (!uploadErr) {
        const { data } = supabase.storage.from("dog-photos").getPublicUrl(path);
        photoUrl = data.publicUrl;
      }
    }

    const { error: dbError } = await supabase.from("dogs").insert({
      user_id: user.id,
      name: name.trim(),
      birth_date: birthDate || null,
      weight_kg: weight ? parseFloat(weight) : null,
      photo_url: photoUrl,
      pronoun: dogPronoun,
      gender: dogPronoun === "ella" ? "female" : "male",
      nickname: nickname.trim() || null,
    });

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="px-4 pt-6 space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-9 h-9 rounded-full text-[var(--brown-500)] hover:text-[var(--brown-800)] hover:bg-[var(--brown-100)] transition-colors"
          aria-label={t("common.back")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[var(--brown-800)]">
          {t("dogs.addDog")} 🐶
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Photo */}
        <Card>
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handlePhoto}
            className="hidden"
          />
          {photoPreview ? (
            <div className="flex items-center gap-4">
              <img
                src={photoPreview}
                alt="Dog photo"
                className="w-20 h-20 rounded-2xl object-cover"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-sm text-[var(--accent)] underline"
              >
                {t("tracker.changePhoto")}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full h-28 rounded-xl border-2 border-dashed border-[var(--brown-200)] flex flex-col items-center justify-center gap-2 text-[var(--brown-400)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <Camera className="w-7 h-7" />
              <span className="text-sm">{t("dogs.uploadPhoto")}</span>
            </button>
          )}
        </Card>

        <Input
          label={t("dogs.name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Luna, Max, Coco..."
          required
          error={!name.trim() ? error : undefined}
        />

        {/* Pronoun toggle */}
        <div>
          <p className="text-sm font-semibold text-[var(--brown-700)] mb-2">
            {name.trim()
              ? (locale === "es" ? `¿${name} es...?` : `Is ${name}...?`)
              : (locale === "es" ? "¿Es...?" : "Gender?")}
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {(["el", "ella"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setDogPronoun(p)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "1rem",
                  border: dogPronoun === p ? "2px solid var(--accent)" : "1.5px solid var(--brown-100)",
                  background: dogPronoun === p ? "#fff3ed" : "white",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: dogPronoun === p ? "var(--accent)" : "var(--brown-600)",
                }}
              >
                {p === "el" ? (locale === "es" ? "Él 🐾" : "He/Boy 🐾") : (locale === "es" ? "Ella 🐾" : "She/Girl 🐾")}
              </button>
            ))}
          </div>
        </div>

        <Input
          type="date"
          label={t("dogs.birthDate")}
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />

        <Input
          label={locale === "es" ? "Apodo cariñoso (opcional)" : "Nickname (optional)"}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={locale === "es" ? "bebé, el rey, princesa..." : "baby, little king..."}
        />

        <Input
          type="number"
          label={t("dogs.weight")}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="10.5"
          min={0}
          step={0.1}
        />

        {error && name.trim() && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <Button type="submit" loading={loading} className="w-full" size="lg">
          {t("dogs.save")}
        </Button>
      </form>
    </div>
  );
}
