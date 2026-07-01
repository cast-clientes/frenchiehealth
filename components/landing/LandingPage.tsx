"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const HERO_IMG =
  "https://pikaso.cdnpk.net/private/production/4748085434/render.jpg?token=exp=1783036800~hmac=c98dc698da28e8060f0ca8297d0a4059bdf27850a7ee2e29f7b01e1fc0ea4f5f";
const FEEDING_IMG =
  "https://pikaso.cdnpk.net/private/production/4748086166/render.jpg?token=exp=1783036800~hmac=5a26e89bce1475fbf0587eb4fd103dbf4fe5c520102348d0f5ba198b2d";

const COPY = {
  en: {
    nav: {
      logo: "🐾 Frenchie Health",
      howItWorks: "How it works",
      feeding: "Feeding plan",
      pricing: "Pricing",
      signIn: "Sign in",
      getStarted: "Get started free",
    },
    hero: {
      badge: "Complete health companion 🐾",
      h1: "The complete story of your Frenchie's health, in one place.",
      p: "Track symptoms. Follow patterns. Share with your vet. And never forget a single moment of your dog's life.",
      cta: "Start tracking free →",
      cta2: "See how it works",
      trust: "No credit card · No diagnosis claims · Always consult your vet",
    },
    problem: {
      title: "Sound familiar?",
      subtitle: "French Bulldogs are beautiful and stubborn — especially their skin.",
      stats: [
        { icon: "🐾", stat: "20.8%", label: "of Frenchies experience recurring skin irritation" },
        { icon: "💸", stat: "$1,200+", label: "average spent before getting a clear allergy diagnosis" },
        { icon: "⏳", stat: "3–6 mo", label: "to find a food trigger without consistent daily tracking" },
      ],
    },
    howItWorks: {
      title: "How it works",
      subtitle: "Four simple habits that turn daily observations into answers.",
      steps: [
        { icon: "📸", title: "Log daily", desc: "Quick photo + itch score (1–10) + what they ate. 90 seconds, every day." },
        { icon: "📊", title: "See patterns", desc: "Our engine spots food-flare correlations automatically — no spreadsheets needed." },
        { icon: "💡", title: "Daily tip", desc: "One new care tip every day, specific to Frenchie anatomy and common triggers." },
        { icon: "📋", title: "Vet-ready report", desc: "Export a PDF timeline — photos, scores, food log — for your next appointment." },
      ],
    },
    modules: {
      title: "All your Frenchie's health, in one place",
      subtitle: "Six modules designed around the specific health challenges of the breed.",
      items: [
        { icon: "🐾", title: "Skin & Folds", desc: "Track symptoms, identify triggers, export vet-ready reports.", status: "available", module: "skin" },
        { icon: "🫁", title: "Respiratory", desc: "Log breathing episodes, track effort levels and triggers.", status: "coming", module: "respiratory" },
        { icon: "👂", title: "Ears & Eyes", desc: "Monitor discharge, redness, and schedule cleaning routines.", status: "coming", module: "ears_eyes" },
        { icon: "🦴", title: "Joints & Mobility", desc: "Track limping, pain scores, and activity levels over time.", status: "coming", module: "joints" },
        { icon: "⚖️", title: "Weight & Digestion", desc: "Log weight trends, appetite, and digestive symptoms.", status: "coming", module: "weight" },
        { icon: "📅", title: "Health Calendar", desc: "Never miss a vaccine, deworming, or vet appointment.", status: "coming", module: "health_calendar" },
      ],
      availableLabel: "Available now",
      comingLabel: "Coming soon",
      joinWaitlist: "Join waitlist",
    },
    demo: {
      badge: "AI-powered insights",
      title: "Ask the assistant. See the pattern.",
      desc: "The AI chat knows your Frenchie's recent skin history. Ask about patterns, get tips — always with a clear \"this is not a diagnosis\" reminder built in.",
      cta: "Try it free →",
    },
    feeding: {
      badge: "Breed-specific 🥩",
      title: "A feeding plan built around your Frenchie's biology",
      desc: "Most generic dog guides miss the mark. Our plan covers which proteins help, which ones trigger reactions, portion sizing by age and weight, and a full elimination diet protocol.",
      bullets: [
        "✅ Recommended proteins for the breed",
        "❌ Proteins commonly linked to Frenchie reactions",
        "📐 Portion table by weight and age",
        "🔬 Step-by-step elimination diet guide",
      ],
      cta: "Access feeding plan →",
    },
    trust: {
      quote: '"This app logs. Your vet diagnoses."',
      desc: "Frenchie Health Companion is an education and tracking tool, not a medical device. Every tip, recommendation, and AI response includes a reminder: your veterinarian makes the diagnosis.",
    },
    testimonials: [
      {
        name: "Sarah M.",
        location: "Austin, TX",
        text: "After 8 months of vet visits I finally figured out it was the chicken in his food. The tracker showed the pattern in 3 weeks.",
      },
      {
        name: "Carlos R.",
        location: "Barcelona",
        text: "The daily tips alone are worth it. I didn't know I was cleaning his folds wrong. Skin improved in two weeks.",
      },
    ],
    pricing: {
      title: "Simple, honest pricing",
      subtitle: "Start free. Upgrade when you need more.",
    },
    finalCta: {
      title: "Your Frenchie's story starts today.",
      title2: "Don't lose a single chapter.",
      desc: "Start tracking free — no credit card needed.",
      cta: "Start tracking free →",
    },
    footer: {
      tagline: "Built with love for Frenchie owners everywhere.",
      disclaimer:
        "Frenchie Health is not a medical device and does not provide veterinary diagnosis or treatment advice. All content is for general informational and educational purposes only. Always consult a licensed veterinarian for your pet's health concerns.",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      medDisclaimer: "Medical Disclaimer",
      signin: "Sign in",
      createAccount: "Create account",
    },
  },
  es: {
    nav: {
      logo: "🐾 Frenchie Health",
      howItWorks: "Cómo funciona",
      feeding: "Plan de alimentación",
      pricing: "Precios",
      signIn: "Iniciar sesión",
      getStarted: "Empezar gratis",
    },
    hero: {
      badge: "Compañero completo de salud 🐾",
      h1: "La historia completa de la salud de tu Frenchie, en un solo lugar.",
      p: "Registra síntomas. Detecta patrones. Comparte con tu vet. Y nunca olvides un solo momento en la vida de tu perro.",
      cta: "Empezar gratis →",
      cta2: "Ver cómo funciona",
      trust: "Sin tarjeta · Sin diagnósticos · Siempre consulta a tu vet",
    },
    problem: {
      title: "¿Te suena familiar?",
      subtitle: "Los Bulldogs Franceses son hermosos y testarudos — especialmente su piel.",
      stats: [
        { icon: "🐾", stat: "20.8%", label: "de los Frenchies tienen irritación de piel recurrente" },
        { icon: "💸", stat: "$1.200+", label: "gasto promedio antes de obtener un diagnóstico claro" },
        { icon: "⏳", stat: "3–6 meses", label: "para encontrar un detonante sin registro diario constante" },
      ],
    },
    howItWorks: {
      title: "Cómo funciona",
      subtitle: "Cuatro hábitos simples que convierten observaciones diarias en respuestas.",
      steps: [
        { icon: "📸", title: "Registra a diario", desc: "Foto rápida + puntaje de picazón (1–10) + qué comió. 90 segundos, cada día." },
        { icon: "📊", title: "Ve patrones", desc: "Nuestro motor detecta correlaciones comida-brotes automáticamente — sin hojas de cálculo." },
        { icon: "💡", title: "Tip diario", desc: "Un nuevo consejo de cuidado cada día, específico para la anatomía del Frenchie." },
        { icon: "📋", title: "Reporte para el vet", desc: "Exporta un PDF con la línea de tiempo completa — fotos, puntajes, registro de comida." },
      ],
    },
    modules: {
      title: "Toda la salud de tu Frenchie, en un solo lugar",
      subtitle: "Seis módulos diseñados para los desafíos específicos de la raza.",
      items: [
        { icon: "🐾", title: "Piel y Pliegues", desc: "Registra síntomas, identifica detonantes, exporta reportes para el vet.", status: "available", module: "skin" },
        { icon: "🫁", title: "Respiratorio", desc: "Registra episodios de dificultad respiratoria y sus detonantes.", status: "coming", module: "respiratory" },
        { icon: "👂", title: "Oídos y Ojos", desc: "Monitorea secreciones, enrojecimiento y rutinas de limpieza.", status: "coming", module: "ears_eyes" },
        { icon: "🦴", title: "Articulaciones", desc: "Registra cojera, niveles de dolor y actividad física.", status: "coming", module: "joints" },
        { icon: "⚖️", title: "Peso y Digestión", desc: "Lleva el historial de peso, apetito y síntomas digestivos.", status: "coming", module: "weight" },
        { icon: "📅", title: "Calendario de Salud", desc: "No te pierdas ninguna vacuna, desparasitación o cita veterinaria.", status: "coming", module: "health_calendar" },
      ],
      availableLabel: "Disponible ahora",
      comingLabel: "Próximamente",
      joinWaitlist: "Unirse a la lista",
    },
    demo: {
      badge: "Insights con IA",
      title: "Pregunta al asistente. Ve el patrón.",
      desc: 'El chat de IA conoce el historial de piel reciente de tu Frenchie. Pregunta sobre patrones, recibe tips — siempre con el recordatorio claro: "esto no es un diagnóstico".',
      cta: "Pruébalo gratis →",
    },
    feeding: {
      badge: "Específico para la raza 🥩",
      title: "Un plan alimenticio diseñado alrededor de la biología de tu Frenchie",
      desc: "La mayoría de guías genéricas para perros no dan en el blanco. Nuestro plan cubre qué proteínas ayudan, cuáles desencadenan reacciones, porciones por edad y peso, y un protocolo completo de dieta de eliminación.",
      bullets: [
        "✅ Proteínas recomendadas para la raza",
        "❌ Proteínas comúnmente ligadas a reacciones",
        "📐 Tabla de porciones por peso y edad",
        "🔬 Guía paso a paso de dieta de eliminación",
      ],
      cta: "Ver plan de alimentación →",
    },
    trust: {
      quote: '"Esta app registra. Tu veterinario diagnostica."',
      desc: "Frenchie Health Companion es una herramienta de educación y seguimiento, no un dispositivo médico. Cada tip, recomendación y respuesta de IA incluye un recordatorio: tu veterinario hace el diagnóstico.",
    },
    testimonials: [
      {
        name: "Sarah M.",
        location: "Austin, TX",
        text: "Después de 8 meses de visitas al vet, finalmente descubrí que era el pollo en su comida. El tracker mostró el patrón en 3 semanas.",
      },
      {
        name: "Carlos R.",
        location: "Barcelona",
        text: "Los tips diarios solos valen la pena. No sabía que estaba limpiando sus pliegues mal. La piel mejoró en dos semanas.",
      },
    ],
    pricing: {
      title: "Precios simples y honestos",
      subtitle: "Empieza gratis. Mejora cuando necesites más.",
    },
    finalCta: {
      title: "La historia de tu Frenchie empieza hoy.",
      title2: "No pierdas ni un capítulo.",
      desc: "Empieza a registrar gratis — sin tarjeta de crédito.",
      cta: "Empezar a registrar gratis →",
    },
    footer: {
      tagline: "Hecho con amor para dueños de Frenchies en todo el mundo.",
      disclaimer:
        "Frenchie Health no es un dispositivo médico y no proporciona diagnóstico veterinario ni consejos de tratamiento. Todo el contenido es solo para fines informativos y educativos generales. Siempre consulta a un veterinario licenciado para los problemas de salud de tu mascota.",
      terms: "Términos de Servicio",
      privacy: "Política de Privacidad",
      medDisclaimer: "Aviso Médico",
      signin: "Iniciar sesión",
      createAccount: "Crear cuenta",
    },
  },
} as const;

interface Props {
  locale: string;
}

export default function LandingPage({ locale }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [founderStatus, setFounderStatus] = useState<{ spots_taken: number; offer_active: boolean } | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 });

  const c = COPY[(locale as "en" | "es")] ?? COPY.en;
  const h = (path: string) => `/${locale}${path}`;

  useEffect(() => {
    fetch("/api/founding-status")
      .then((r) => r.json())
      .then((d) => setFounderStatus(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function calc() {
      const diff = new Date("2026-07-31T23:59:59Z").getTime() - Date.now();
      if (diff <= 0) { setCountdown({ days: 0, hours: 0, mins: 0 }); return; }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    }
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, []);

  const spotsLeft = founderStatus ? 100 - founderStatus.spots_taken : 33;

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* ── NAV ── */}
      <nav
        style={{
          background: "rgba(253,246,239,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--brown-100)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "0.875rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href={h("/")}
            style={{
              fontWeight: 800,
              fontSize: "1.05rem",
              color: "var(--brown-800)",
              textDecoration: "none",
            }}
          >
            {c.nav.logo}
          </Link>

          <div className="hidden md:flex" style={{ alignItems: "center", gap: "2rem" }}>
            <a href="#how-it-works" style={{ color: "var(--brown-700)", fontSize: "0.9rem", textDecoration: "none" }}>
              {c.nav.howItWorks}
            </a>
            <a href="#feeding" style={{ color: "var(--brown-700)", fontSize: "0.9rem", textDecoration: "none" }}>
              {c.nav.feeding}
            </a>
            <a href="#pricing" style={{ color: "var(--brown-700)", fontSize: "0.9rem", textDecoration: "none" }}>
              {c.nav.pricing}
            </a>
            <Link href={h("/auth/login")} style={{ color: "var(--brown-700)", fontSize: "0.9rem", textDecoration: "none" }}>
              {c.nav.signIn}
            </Link>
            <Link
              href={h("/auth/login")}
              style={{
                background: "var(--accent)",
                color: "white",
                padding: "0.5rem 1.25rem",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {c.nav.getStarted}
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "var(--brown-800)" }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div
            style={{
              borderTop: "1px solid var(--brown-100)",
              padding: "1rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
            className="md:hidden"
          >
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} style={{ color: "var(--brown-700)", textDecoration: "none" }}>
              {c.nav.howItWorks}
            </a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} style={{ color: "var(--brown-700)", textDecoration: "none" }}>
              {c.nav.pricing}
            </a>
            <Link href={h("/auth/login")} style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
              {c.nav.getStarted} →
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ maxWidth: "72rem", margin: "0 auto", padding: "5rem 1.5rem 4rem" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "4rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <div
              style={{
                display: "inline-block",
                background: "#fff3ed",
                color: "var(--accent)",
                padding: "0.35rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              {c.hero.badge}
            </div>
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: 800,
                lineHeight: 1.15,
                color: "var(--brown-800)",
                marginBottom: "1.25rem",
              }}
            >
              {c.hero.h1}
            </h1>
            <p style={{ fontSize: "1.15rem", color: "var(--brown-700)", lineHeight: 1.65, marginBottom: "2rem", maxWidth: "480px" }}>
              {c.hero.p}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link
                href={h("/auth/login")}
                style={{
                  background: "var(--accent)",
                  color: "white",
                  padding: "0.9rem 2rem",
                  borderRadius: "9999px",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                {c.hero.cta}
              </Link>
              <a
                href="#how-it-works"
                style={{
                  color: "var(--brown-700)",
                  padding: "0.9rem 1.5rem",
                  borderRadius: "9999px",
                  border: "1.5px solid var(--brown-200)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {c.hero.cta2}
              </a>
            </div>

            {/* Urgency bar */}
            {founderStatus?.offer_active && (
              <div
                style={{
                  marginTop: "1rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#fef3c7",
                  border: "1px solid #f59e0b",
                  borderRadius: "9999px",
                  padding: "0.4rem 1rem",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#92400e",
                }}
              >
                🏆{" "}
                {locale === "es"
                  ? `Oferta Founding Member — ${spotsLeft} spots restantes de 100 · Solo hasta el 31 de julio`
                  : `Founding Member Offer — ${spotsLeft} spots left of 100 · July 31 only`}
              </div>
            )}

            <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--brown-400)" }}>
              {c.hero.trust}
            </p>
          </div>

          <div style={{ flex: "0 0 auto", width: "min(380px, 100%)" }}>
            <img
              src={HERO_IMG}
              alt="Happy French Bulldog with healthy skin"
              style={{
                width: "100%",
                borderRadius: "2rem",
                boxShadow: "0 24px 64px rgba(139,90,43,0.22)",
                objectFit: "cover",
                aspectRatio: "4/5",
              }}
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* ── PROBLEM STATS ── */}
      <section
        style={{
          background: "white",
          borderTop: "1px solid var(--brown-100)",
          borderBottom: "1px solid var(--brown-100)",
          padding: "5rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--brown-800)", marginBottom: "0.75rem" }}>
              {c.problem.title}
            </h2>
            <p style={{ color: "var(--brown-700)", fontSize: "1.1rem" }}>
              {c.problem.subtitle}
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {c.problem.stats.map((item) => (
              <div
                key={item.stat}
                style={{
                  background: "#fff8f4",
                  border: "1.5px solid #f0d9c8",
                  borderRadius: "1.25rem",
                  padding: "2rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{item.icon}</div>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--accent)", lineHeight: 1, marginBottom: "0.5rem" }}>
                  {item.stat}
                </div>
                <div style={{ color: "var(--brown-700)", fontSize: "0.9rem", lineHeight: 1.6 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--brown-800)", marginBottom: "0.75rem" }}>
              {c.howItWorks.title}
            </h2>
            <p style={{ color: "var(--brown-700)", fontSize: "1.1rem" }}>
              {c.howItWorks.subtitle}
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {c.howItWorks.steps.map((step, i) => (
              <div
                key={step.title}
                style={{
                  background: "white",
                  border: "1.5px solid var(--brown-100)",
                  borderRadius: "1.25rem",
                  padding: "2rem",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    width: "1.75rem",
                    height: "1.75rem",
                    background: "var(--brown-100)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "var(--brown-700)",
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontSize: "2.25rem", marginBottom: "1rem" }}>{step.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--brown-800)", marginBottom: "0.5rem" }}>
                  {step.title}
                </h3>
                <p style={{ color: "var(--brown-700)", fontSize: "0.875rem", lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HEALTH MODULES GRID ── */}
      <section
        style={{
          padding: "5rem 1.5rem",
          background: "var(--brown-50)",
        }}
      >
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--brown-800)", marginBottom: "0.75rem" }}>
              {c.modules.title}
            </h2>
            <p style={{ color: "var(--brown-700)", fontSize: "1.1rem" }}>
              {c.modules.subtitle}
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {c.modules.items.map((mod) => (
              <div
                key={mod.module}
                style={{
                  background: "white",
                  border: mod.status === "available" ? "2px solid var(--accent)" : "1.5px solid var(--brown-100)",
                  borderRadius: "1.25rem",
                  padding: "1.75rem",
                  opacity: mod.status === "available" ? 1 : 0.85,
                  position: "relative",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{mod.icon}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--brown-800)", margin: 0 }}>
                    {mod.title}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "9999px",
                      background: mod.status === "available" ? "rgba(232,115,74,0.15)" : "var(--brown-100)",
                      color: mod.status === "available" ? "var(--accent)" : "var(--brown-600)",
                    }}
                  >
                    {mod.status === "available" ? c.modules.availableLabel : c.modules.comingLabel}
                  </span>
                </div>
                <p style={{ color: "var(--brown-700)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: mod.status === "coming" ? "1rem" : 0 }}>
                  {mod.desc}
                </p>
                {mod.status === "coming" && (
                  <Link
                    href={h(`/${mod.module === "ears_eyes" ? "ears-eyes" : mod.module}`)}
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "var(--accent)",
                      textDecoration: "none",
                    }}
                  >
                    {c.modules.joinWaitlist} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIFE ALBUM SECTION ── */}
      <section style={{ background: "white", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              style={{
                display: "inline-block",
                background: "#fff3ed",
                color: "var(--accent)",
                padding: "0.35rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              {locale === "es" ? "📸 Álbum de vida" : "📸 Life Album"}
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--brown-800)", marginBottom: "0.75rem" }}>
              {locale === "es"
                ? "No es solo un tracker. Es el álbum de vida de tu Frenchie."
                : "Not just a tracker. It's your Frenchie's life album."}
            </h2>
            <p style={{ color: "var(--brown-700)", fontSize: "1.1rem", maxWidth: "540px", margin: "0 auto" }}>
              {locale === "es"
                ? "Dentro de 3 años, podrás mirar atrás y ver toda la historia de salud de tu Frenchie, foto por foto, dato por dato. Nada perdido. Todo organizado."
                : "In 3 years, you'll look back and see your Frenchie's complete health story, photo by photo, data by data. Nothing lost. Everything organized."}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
            {[
              { emoji: "🏠", date: "Jan 12, 2024", label: locale === "es" ? "Primer día en casa" : "First day home", note: locale === "es" ? "¡4.2 kg de pura ternura!" : "4.2kg of pure love!" },
              { emoji: "💉", date: "Feb 03, 2024", label: locale === "es" ? "Primera vacuna" : "First vaccine", note: locale === "es" ? "Todo bien, sin reacciones" : "All good, no reactions" },
              { emoji: "🛁", date: "Mar 15, 2024", label: locale === "es" ? "Primer baño" : "First bath", note: locale === "es" ? "Odia el agua 😂" : "Hates water 😂" },
              { emoji: "🎂", date: "Oct 28, 2024", label: locale === "es" ? "Primer cumpleaños" : "First birthday", note: "8.1 kg — healthy!" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "#fff8f4",
                  border: "1.5px solid #f0d9c8",
                  borderRadius: "1rem",
                  padding: "1rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{item.emoji}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--brown-400)", marginBottom: "0.25rem" }}>{item.date}</div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--brown-800)", marginBottom: "0.25rem" }}>{item.label}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--brown-600)" }}>{item.note}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#fdf6ef", border: "1.5px solid #f0d9c8", borderRadius: "1.25rem", padding: "1.5rem", textAlign: "center" }}>
            <p style={{ color: "var(--brown-700)", fontSize: "1rem", fontStyle: "italic", lineHeight: 1.7 }}>
              {locale === "es"
                ? '"Listo para cualquier veterinario, en cualquier momento. Eso no lo da ninguna app genérica de mascotas."'
                : '"Ready for any vet, at any moment. No generic pet app does this."'}
            </p>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY SECTION ── */}
      <section style={{ background: "var(--brown-50, #fdf6ef)", padding: "5rem 1.5rem", borderTop: "1px solid var(--brown-100)" }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--brown-800)", marginBottom: "0.75rem" }}>
              {locale === "es"
                ? "Únete a la comunidad de dueños de Frenchie más comprometidos del mundo"
                : "Join the world's most committed Frenchie owner community"}
            </h2>
            <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
              {[
                { icon: "🌍", label: locale === "es" ? "Dueños activos en 24 países" : "Active owners in 24 countries" },
                { icon: "🏆", label: locale === "es" ? `${spotsLeft} spots de Founding Member disponibles` : `${spotsLeft} Founding Member spots left` },
                { icon: "🐾", label: locale === "es" ? "Exclusivo para miembros de pago" : "Exclusive to paying members" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "white",
                    border: "1.5px solid var(--brown-100)",
                    borderRadius: "1rem",
                    padding: "1rem 1.5rem",
                    textAlign: "center",
                    minWidth: "160px",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>{stat.icon}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--brown-700)", fontWeight: 600 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {[
              {
                emoji: "🎉",
                category: locale === "es" ? "Logro" : "Achievement",
                text: locale === "es"
                  ? "¡Semana 4 sin brotes de piel! El tracker mostró que era el pollo 🎉"
                  : "Week 4 with no skin flare-ups! The tracker showed it was the chicken 🎉",
                user: "María G.",
                badge: "🏆",
              },
              {
                emoji: "💡",
                category: "Tip",
                text: locale === "es"
                  ? "Compartiendo el reporte de mi vet — el doctor quedó impresionado con el historial completo"
                  : "Sharing my vet report — the doctor was impressed with the complete history",
                user: "Carlos R.",
                badge: "⭐",
              },
            ].map((post, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  border: "1.5px solid var(--brown-100)",
                  borderRadius: "1.25rem",
                  padding: "1.25rem",
                  filter: "blur(1.5px)",
                  pointerEvents: "none",
                  userSelect: "none",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "1rem" }}>{post.emoji}</span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      background: "#fff3ed",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "9999px",
                    }}
                  >
                    {post.category}
                  </span>
                </div>
                <p style={{ color: "var(--brown-700)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1rem" }}>{post.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--brown-800)" }}>{post.user}</span>
                  <span>{post.badge}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <p style={{ color: "var(--brown-400)", fontSize: "0.85rem" }}>
              🔒 {locale === "es" ? "La comunidad es exclusiva para miembros de pago" : "Community is exclusive to paying members"}
            </p>
          </div>
        </div>
      </section>

      {/* ── APP DEMO (phone mockup) ── */}
      <section
        style={{
          background: "var(--brown-800)",
          padding: "5rem 1.5rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "64rem",
            margin: "0 auto",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "4rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 280px" }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(232,115,74,0.2)",
                color: "#ffa882",
                padding: "0.35rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              {c.demo.badge}
            </div>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "white",
                marginBottom: "1rem",
                lineHeight: 1.3,
              }}
            >
              {c.demo.title}
            </h2>
            <p style={{ color: "#c9a98a", lineHeight: 1.7, marginBottom: "2rem" }}>
              {c.demo.desc}
            </p>
            <Link
              href={h("/auth/login")}
              style={{
                background: "var(--accent)",
                color: "white",
                padding: "0.875rem 2rem",
                borderRadius: "9999px",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              {c.demo.cta}
            </Link>
          </div>

          {/* Phone mockup */}
          <div style={{ flex: "0 0 auto", width: "240px", margin: "0 auto" }}>
            <div
              style={{
                background: "#111",
                borderRadius: "2.5rem",
                padding: "0.6rem",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                border: "6px solid #222",
              }}
            >
              <div style={{ background: "#fdf6ef", borderRadius: "2rem", overflow: "hidden" }}>
                <div style={{ background: "#fdf6ef", height: "22px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "64px", height: "12px", background: "#111", borderRadius: "9999px" }} />
                </div>
                <div style={{ background: "var(--brown-800)", padding: "0.6rem 0.875rem" }}>
                  <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "white" }}>🐾 Frenchie Health</div>
                </div>
                <div style={{ background: "#fdf6ef", padding: "0.75rem" }}>
                  <div style={{ fontSize: "0.5rem", color: "var(--brown-700)", fontWeight: 700, marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                    ITCH SCORE — LAST 7 DAYS
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "36px" }}>
                    {[3, 5, 7, 9, 6, 4, 3].map((v, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          borderRadius: "3px 3px 0 0",
                          height: `${v * 10}%`,
                          background: v >= 8 ? "var(--accent)" : v >= 6 ? "#d4906a" : "#d4a07a",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ height: "1px", background: "var(--brown-100)" }} />
                <div style={{ background: "white", padding: "0.75rem" }}>
                  <div style={{ fontSize: "0.5rem", color: "var(--brown-400)", fontWeight: 700, marginBottom: "0.5rem", letterSpacing: "0.04em" }}>
                    AI ASSISTANT
                  </div>
                  <div
                    style={{
                      background: "#f0e8df",
                      borderRadius: "0.75rem 0.75rem 0.75rem 0.125rem",
                      padding: "0.4rem 0.6rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <div style={{ fontSize: "0.55rem", color: "var(--brown-800)", lineHeight: 1.5 }}>
                      Why are scores so high this week?
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#fff8f4",
                      border: "1px solid #f0d9c8",
                      borderRadius: "0.75rem 0.75rem 0.125rem 0.75rem",
                      padding: "0.4rem 0.6rem",
                    }}
                  >
                    <div style={{ fontSize: "0.5rem", color: "var(--brown-700)", lineHeight: 1.6 }}>
                      The spike aligns with the diet change on Tuesday. Consider removing chicken temporarily.{" "}
                      <span style={{ color: "var(--accent)", fontWeight: 700 }}>🐾 Consult your vet.</span>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: "white",
                    borderTop: "1px solid var(--brown-100)",
                    padding: "0.5rem 0",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  {["🏠", "📊", "💡", "🥩", "💬"].map((ic) => (
                    <div key={ic} style={{ fontSize: "0.875rem" }}>{ic}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEEDING PLAN ── */}
      <section id="feeding" style={{ background: "white", padding: "5rem 1.5rem" }}>
        <div
          style={{
            maxWidth: "64rem",
            margin: "0 auto",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "4rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "0 0 auto", width: "min(440px, 100%)" }}>
            <img
              src={FEEDING_IMG}
              alt="French Bulldog with healthy food"
              style={{
                width: "100%",
                borderRadius: "1.5rem",
                boxShadow: "0 16px 48px rgba(139,90,43,0.15)",
                objectFit: "cover",
                aspectRatio: "16/9",
              }}
              loading="lazy"
            />
          </div>
          <div style={{ flex: "1 1 280px" }}>
            <div
              style={{
                display: "inline-block",
                background: "#fff3ed",
                color: "var(--accent)",
                padding: "0.35rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              {c.feeding.badge}
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--brown-800)", marginBottom: "1rem", lineHeight: 1.3 }}>
              {c.feeding.title}
            </h2>
            <p style={{ color: "var(--brown-700)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              {c.feeding.desc}
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2rem", listStyle: "none", padding: 0 }}>
              {c.feeding.bullets.map((item) => (
                <li key={item} style={{ color: "var(--brown-700)", fontSize: "0.95rem" }}>{item}</li>
              ))}
            </ul>
            <Link
              href={h("/auth/login")}
              style={{
                background: "var(--accent)",
                color: "white",
                padding: "0.875rem 2rem",
                borderRadius: "9999px",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              {c.feeding.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST + TESTIMONIALS ── */}
      <section
        style={{
          background: "#fff8f4",
          borderTop: "1px solid #f0d9c8",
          padding: "5rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <div
            style={{
              background: "white",
              border: "2px solid #fbd5c5",
              borderRadius: "1.5rem",
              padding: "2rem",
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🩺</div>
            <p style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--brown-800)", marginBottom: "0.5rem" }}>
              {c.trust.quote}
            </p>
            <p style={{ color: "var(--brown-700)", fontSize: "0.95rem", maxWidth: "540px", margin: "0 auto" }}>
              {c.trust.desc}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {c.testimonials.map((t) => (
              <div
                key={t.name}
                style={{
                  background: "white",
                  border: "1.5px solid var(--brown-100)",
                  borderRadius: "1.25rem",
                  padding: "1.75rem",
                }}
              >
                <div style={{ fontSize: "1.25rem", color: "#f59e0b", marginBottom: "0.75rem" }}>★★★★★</div>
                <p style={{ color: "var(--brown-800)", lineHeight: 1.7, marginBottom: "1rem", fontStyle: "italic" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--brown-800)", fontSize: "0.9rem" }}>{t.name}</div>
                  <div style={{ color: "var(--brown-400)", fontSize: "0.8rem" }}>{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--brown-800)", marginBottom: "0.75rem" }}>
              {c.pricing.title}
            </h2>
            <p style={{ color: "var(--brown-700)" }}>{c.pricing.subtitle}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", alignItems: "start" }}>
            {/* Free */}
            <div style={{ background: "white", border: "1.5px solid var(--brown-100)", borderRadius: "1.25rem", padding: "1.75rem" }}>
              <div style={{ fontWeight: 700, color: "var(--brown-700)", marginBottom: "0.5rem" }}>
                {locale === "es" ? "Gratis" : "Free"}
              </div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--brown-800)", lineHeight: 1, marginBottom: "0.25rem" }}>$0</div>
              <div style={{ color: "var(--brown-400)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                {locale === "es" ? "para siempre" : "forever"}
              </div>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {(locale === "es"
                  ? ["✓ 3 entradas de registro", "✓ 5 mensajes de IA", "✓ Tip diario", "✗ Fotos (solo texto)", "✗ Comunidad", "✗ Exportar"]
                  : ["✓ 3 tracking entries", "✓ 5 AI messages", "✓ Daily tip", "✗ Photos (text only)", "✗ Community", "✗ Export"]
                ).map((f) => (
                  <li key={f} style={{ fontSize: "0.85rem", color: f.startsWith("✗") ? "#9ca3af" : "var(--brown-700)" }}>{f}</li>
                ))}
              </ul>
              <Link
                href={h("/auth/login")}
                style={{
                  display: "block",
                  textAlign: "center",
                  border: "1.5px solid var(--brown-200)",
                  color: "var(--brown-700)",
                  padding: "0.75rem",
                  borderRadius: "9999px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                {locale === "es" ? "Empezar gratis" : "Get started free"}
              </Link>
            </div>

            {/* Founding Member — CENTER CARD */}
            <div
              style={{
                background: "var(--brown-800)",
                border: "2px solid #f59e0b",
                borderRadius: "1.25rem",
                padding: "1.75rem",
                position: "relative",
                transform: "translateY(-8px)",
              }}
            >
              <div style={{ position: "absolute", top: "-0.875rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.4rem" }}>
                <span style={{ background: "#f59e0b", color: "#111", padding: "0.2rem 0.75rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 800, whiteSpace: "nowrap" }}>
                  🏆 {locale === "es" ? "MÁS POPULAR" : "MOST POPULAR"}
                </span>
                <span style={{ background: "var(--accent)", color: "white", padding: "0.2rem 0.75rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 800, whiteSpace: "nowrap" }}>
                  {locale === "es" ? "OFERTA JULIO" : "JULY OFFER"}
                </span>
              </div>

              <div style={{ fontWeight: 700, color: "#f59e0b", marginBottom: "0.5rem", marginTop: "0.5rem" }}>🏆 Founding Member</div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span style={{ color: "#6b7280", textDecoration: "line-through", fontSize: "1rem" }}>$18.99</span>
                <span style={{ color: "white", fontSize: "2.5rem", fontWeight: 800, lineHeight: 1 }}>$8.99</span>
                <span style={{ color: "#c9a98a", fontSize: "0.9rem" }}>{locale === "es" ? "/mes" : "/mo"}</span>
              </div>
              <div style={{ color: "#f59e0b", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                🔒 {locale === "es" ? "Precio bloqueado para siempre" : "Price locked forever"}
              </div>

              {/* Spots + countdown */}
              <div style={{ background: "#111827", borderRadius: "0.75rem", padding: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ color: "#9ca3af", fontSize: "0.7rem" }}>
                    {founderStatus ? `${founderStatus.spots_taken} ${locale === "es" ? "tomados" : "taken"}` : `67 ${locale === "es" ? "tomados" : "taken"}`}
                  </span>
                  <span style={{ color: "#f59e0b", fontSize: "0.7rem", fontWeight: 700 }}>
                    {spotsLeft} {locale === "es" ? "restantes" : "left"}
                  </span>
                </div>
                <div style={{ background: "#374151", borderRadius: "9999px", height: "6px", marginBottom: "0.5rem" }}>
                  <div
                    style={{
                      background: "linear-gradient(90deg, #f59e0b, #ef4444)",
                      borderRadius: "9999px",
                      height: "6px",
                      width: `${founderStatus ? founderStatus.spots_taken : 67}%`,
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {[
                    [countdown.days, locale === "es" ? "días" : "days"],
                    [countdown.hours, locale === "es" ? "hrs" : "hrs"],
                    [countdown.mins, locale === "es" ? "min" : "min"],
                  ].map(([v, l]) => (
                    <div key={String(l)} style={{ flex: 1, background: "#1f2937", borderRadius: "0.375rem", padding: "0.3rem", textAlign: "center" }}>
                      <div style={{ color: "white", fontWeight: 800, fontSize: "0.9rem" }}>{String(v).padStart(2, "0")}</div>
                      <div style={{ color: "#6b7280", fontSize: "0.6rem" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {(locale === "es"
                  ? ["✓ Todo ilimitado", "✓ Todos los módulos de salud", "✓ Álbum de vida completo", "✓ Pasaporte de salud digital", "✓ Comunidad exclusiva 🏆", "✓ Precio bloqueado para siempre"]
                  : ["✓ Everything unlimited", "✓ All 6 health modules", "✓ Full life album", "✓ Digital health passport", "✓ Exclusive community 🏆", "✓ Price locked forever"]
                ).map((f) => (
                  <li key={f} style={{ fontSize: "0.85rem", color: "#e8d5c0" }}>{f}</li>
                ))}
              </ul>

              <Link
                href={h("/auth/login")}
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#f59e0b",
                  color: "#111",
                  padding: "0.9rem",
                  borderRadius: "9999px",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  marginBottom: "0.5rem",
                }}
              >
                {locale === "es" ? "Asegurar mi precio — $8.99/mes →" : "Secure my price — $8.99/mo →"}
              </Link>
              <p style={{ textAlign: "center", color: "#6b7280", fontSize: "0.7rem" }}>
                {locale === "es" ? "Si cancelas y vuelves, pierdes el precio bloqueado." : "Cancel and return later — lose the locked price."}
              </p>
            </div>

            {/* Annual */}
            <div style={{ background: "white", border: "1.5px solid var(--brown-100)", borderRadius: "1.25rem", padding: "1.75rem" }}>
              <div style={{ fontWeight: 700, color: "var(--brown-700)", marginBottom: "0.5rem" }}>
                {locale === "es" ? "Plan Anual" : "Annual Plan"}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--brown-800)", lineHeight: 1 }}>$74.99</span>
                <span style={{ color: "var(--brown-400)", fontSize: "0.85rem" }}>{locale === "es" ? "/año" : "/yr"}</span>
              </div>
              <div style={{ color: "var(--accent)", fontSize: "0.8rem", fontWeight: 600, marginBottom: "1.5rem" }}>
                $6.25{locale === "es" ? "/mes — ahorrás 30%" : "/mo — save 30%"}
              </div>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {(locale === "es"
                  ? ["✓ Todo lo del plan mensual", "✓ Badge Annual Member en comunidad", "✓ Acceso anticipado a nuevos módulos"]
                  : ["✓ Everything in monthly", "✓ Annual Member badge in community", "✓ Early access to new modules"]
                ).map((f) => (
                  <li key={f} style={{ fontSize: "0.85rem", color: "var(--brown-700)" }}>{f}</li>
                ))}
              </ul>
              <Link
                href={h("/auth/login")}
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "var(--accent)",
                  color: "white",
                  padding: "0.875rem",
                  borderRadius: "9999px",
                  fontWeight: 700,
                  textDecoration: "none",
                  marginBottom: "0.5rem",
                }}
              >
                {locale === "es" ? "Suscribirme anual →" : "Subscribe annually →"}
              </Link>
              <p style={{ textAlign: "center", color: "var(--brown-400)", fontSize: "0.75rem" }}>
                {locale === "es" ? "Cancela cuando quieras." : "Cancel anytime."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: "var(--accent)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "white", marginBottom: "1rem", lineHeight: 1.3 }}>
            {c.finalCta.title}
            <br />
            {c.finalCta.title2}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: "2rem", fontSize: "1.1rem" }}>
            {c.finalCta.desc}
          </p>
          <Link
            href={h("/auth/login")}
            style={{
              background: "white",
              color: "var(--accent)",
              padding: "1rem 2.5rem",
              borderRadius: "9999px",
              fontWeight: 800,
              fontSize: "1.1rem",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            {c.finalCta.cta}
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "var(--brown-800)", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "2.5rem",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <div>
              <div style={{ fontWeight: 800, color: "white", fontSize: "1.05rem", marginBottom: "0.5rem" }}>
                {c.nav.logo}
              </div>
              <p style={{ color: "#c9a98a", fontSize: "0.85rem", maxWidth: "280px", lineHeight: 1.6 }}>
                {c.footer.tagline}
              </p>
            </div>
            <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
              <div>
                <div style={{ color: "#c9a98a", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                  Legal
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <Link href={h("/terms")} style={{ color: "#e8d5c0", fontSize: "0.875rem", textDecoration: "none" }}>{c.footer.terms}</Link>
                  <Link href={h("/privacy")} style={{ color: "#e8d5c0", fontSize: "0.875rem", textDecoration: "none" }}>{c.footer.privacy}</Link>
                  <Link href={h("/terms")} style={{ color: "#e8d5c0", fontSize: "0.875rem", textDecoration: "none" }}>{c.footer.medDisclaimer}</Link>
                </div>
              </div>
              <div>
                <div style={{ color: "#c9a98a", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                  App
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <Link href={h("/auth/login")} style={{ color: "#e8d5c0", fontSize: "0.875rem", textDecoration: "none" }}>{c.footer.signin}</Link>
                  <Link href={h("/auth/login")} style={{ color: "#e8d5c0", fontSize: "0.875rem", textDecoration: "none" }}>{c.footer.createAccount}</Link>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem" }}>
            <p style={{ color: "#6b4c32", fontSize: "0.75rem", lineHeight: 1.7 }}>
              ⚠️ {c.footer.disclaimer} © {new Date().getFullYear()} Frenchie Health Companion. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
