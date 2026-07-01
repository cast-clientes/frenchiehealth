import { createClient } from "@/lib/supabase/server";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

interface DogPassport {
  id: string;
  name: string;
  birth_date: string | null;
  weight_kg: number | null;
  photo_url: string | null;
  breed_color: string | null;
  microchip_number: string | null;
  vet_name: string | null;
  vet_phone: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  known_allergies: string[] | null;
  current_medications: string[] | null;
}

interface HealthEventRow {
  id: string;
  event_name: string;
  event_type: string;
  event_date: string;
  next_due_date: string | null;
}

export default async function PassportPage() {
  const supabase = await createClient();
  const locale = await getLocale();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: dogs } = await supabase
    .from("dogs")
    .select("*")
    .eq("user_id", user!.id)
    .limit(1);
  const dog = dogs?.[0] as DogPassport | undefined;

  const { data: healthEvents } = dog
    ? await supabase
        .from("health_events")
        .select("*")
        .eq("dog_id", dog.id)
        .order("event_date", { ascending: false })
        .limit(10)
    : { data: [] };

  const es = locale === "es";

  const age =
    dog?.birth_date
      ? Math.floor(
          (Date.now() - new Date(dog.birth_date).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000)
        )
      : null;

  return (
    <div style={{ padding: "1.5rem", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "var(--brown-800)",
            marginBottom: "0.25rem",
          }}
        >
          {es ? "🏥 Pasaporte de Salud" : "🏥 Health Passport"}
        </h1>
        <p style={{ color: "var(--brown-600)", fontSize: "0.9rem" }}>
          {es
            ? "Toda la info médica de tu Frenchie, lista para el vet."
            : "All your Frenchie's medical info, ready for the vet."}
        </p>
      </div>

      {!dog ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <p style={{ color: "var(--brown-600)", marginBottom: "1rem" }}>
            {es
              ? "Agrega tu Frenchie para crear su pasaporte."
              : "Add your Frenchie to create their passport."}
          </p>
          <Link
            href="/dogs/new"
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            {es ? "Agregar Frenchie →" : "Add Frenchie →"}
          </Link>
        </div>
      ) : (
        <>
          {/* Passport card */}
          <div
            style={{
              background: "var(--brown-800)",
              borderRadius: "1.5rem",
              padding: "1.5rem",
              marginBottom: "1.25rem",
              color: "white",
            }}
          >
            <div
              style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
            >
              {dog.photo_url ? (
                <img
                  src={dog.photo_url}
                  alt={dog.name}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid rgba(255,255,255,0.3)",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    flexShrink: 0,
                  }}
                >
                  🐾
                </div>
              )}
              <div>
                <h2
                  style={{
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  {dog.name}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                  French Bulldog{dog.breed_color ? ` · ${dog.breed_color}` : ""}
                </p>
                {age !== null && (
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                    {age} {es ? "años" : "years old"}
                  </p>
                )}
                {dog.weight_kg && (
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                    {dog.weight_kg} kg
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Info sections */}
          {[
            {
              title: es ? "Veterinario" : "Veterinarian",
              icon: "🩺",
              fields: [
                { label: es ? "Nombre" : "Name", value: dog.vet_name },
                { label: es ? "Teléfono" : "Phone", value: dog.vet_phone },
              ],
            },
            {
              title: es ? "Contacto de Emergencia" : "Emergency Contact",
              icon: "🆘",
              fields: [
                {
                  label: es ? "Nombre" : "Name",
                  value: dog.emergency_contact_name,
                },
                {
                  label: es ? "Teléfono" : "Phone",
                  value: dog.emergency_contact_phone,
                },
              ],
            },
            {
              title: es ? "Identificación" : "Identification",
              icon: "🔖",
              fields: [
                {
                  label: es ? "Microchip" : "Microchip",
                  value: dog.microchip_number,
                },
              ],
            },
          ].map((section) => (
            <div
              key={section.title}
              style={{
                background: "white",
                border: "1.5px solid var(--brown-100)",
                borderRadius: "1rem",
                padding: "1.25rem",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ fontSize: "1.25rem" }}>{section.icon}</span>
                <span style={{ fontWeight: 700, color: "var(--brown-800)" }}>
                  {section.title}
                </span>
              </div>
              {section.fields.map((f) => (
                <div
                  key={f.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span
                    style={{ color: "var(--brown-400)", fontSize: "0.875rem" }}
                  >
                    {f.label}
                  </span>
                  <span
                    style={{
                      color: "var(--brown-800)",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    {f.value ?? (es ? "No registrado" : "Not recorded")}
                  </span>
                </div>
              ))}
            </div>
          ))}

          {/* Allergies & medications */}
          {(dog.known_allergies?.length || dog.current_medications?.length) && (
            <div
              style={{
                background: "#fff8f4",
                border: "1.5px solid #f0d9c8",
                borderRadius: "1rem",
                padding: "1.25rem",
                marginBottom: "0.75rem",
              }}
            >
              {dog.known_allergies && dog.known_allergies.length > 0 && (
                <div style={{ marginBottom: "0.75rem" }}>
                  <p
                    style={{
                      fontWeight: 700,
                      color: "var(--brown-800)",
                      fontSize: "0.875rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    ⚠️ {es ? "Alergias conocidas" : "Known allergies"}
                  </p>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}
                  >
                    {dog.known_allergies.map((a) => (
                      <span
                        key={a}
                        style={{
                          background: "#fee2e2",
                          color: "#991b1b",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "9999px",
                          fontSize: "0.8rem",
                        }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {dog.current_medications && dog.current_medications.length > 0 && (
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      color: "var(--brown-800)",
                      fontSize: "0.875rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    💊 {es ? "Medicamentos actuales" : "Current medications"}
                  </p>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}
                  >
                    {dog.current_medications.map((m) => (
                      <span
                        key={m}
                        style={{
                          background: "#dbeafe",
                          color: "#1e40af",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "9999px",
                          fontSize: "0.8rem",
                        }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recent health events */}
          {healthEvents && healthEvents.length > 0 && (
            <div
              style={{
                background: "white",
                border: "1.5px solid var(--brown-100)",
                borderRadius: "1rem",
                padding: "1.25rem",
              }}
            >
              <p
                style={{
                  fontWeight: 700,
                  color: "var(--brown-800)",
                  marginBottom: "0.75rem",
                  fontSize: "0.875rem",
                }}
              >
                📅 {es ? "Historial médico reciente" : "Recent medical history"}
              </p>
              {(healthEvents as HealthEventRow[]).map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid var(--brown-100)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: 600,
                        color: "var(--brown-800)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {ev.event_name}
                    </p>
                    <p
                      style={{ color: "var(--brown-400)", fontSize: "0.75rem" }}
                    >
                      {ev.event_type}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{ color: "var(--brown-700)", fontSize: "0.8rem" }}
                    >
                      {ev.event_date}
                    </p>
                    {ev.next_due_date && (
                      <p
                        style={{ color: "var(--accent)", fontSize: "0.75rem" }}
                      >
                        → {ev.next_due_date}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <Link
              href="/profile"
              style={{
                color: "var(--accent)",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              {es
                ? "Editar información del pasaporte →"
                : "Edit passport information →"}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
