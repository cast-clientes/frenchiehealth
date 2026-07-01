"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { analytics } from "@/lib/analytics/events";

type Dict = Record<string, unknown>;

type LpContent = {
  slug: string;
  analyticsName: string;
  nav: { logo: string; how: string; pricing: string; signin: string; cta: string };
  hero: Dict;
  cta: { title: string; body: string; button: string; secondary: string };
  footer: { tagline: string; disclaimer: string; terms: string; privacy: string };
  images: Record<string, string>;
  [key: string]: unknown;
};

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function list(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}

function formatDog(value: string) {
  return value.replaceAll("{dogName}", "Churro");
}

function ImageBlock({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={675}
      unoptimized
      className={`h-full w-full rounded-lg object-cover shadow-[0_20px_60px_rgba(61,40,16,0.14)] ${className}`}
      loading="lazy"
    />
  );
}

function FoundingMemberCard({
  locale,
  analyticsName,
  cta,
}: {
  locale: string;
  analyticsName: string;
  cta: LpContent["cta"];
}) {
  const [founderStatus, setFounderStatus] = useState<{
    spots_taken: number;
    offer_active: boolean;
  } | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 });
  const href = `/${locale}/auth/login`;

  useEffect(() => {
    fetch("/api/founding-status")
      .then((res) => res.json())
      .then((data) => setFounderStatus(data))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const calc = () => {
      const diff = new Date("2026-07-31T23:59:59Z").getTime() - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
      });
    };
    calc();
    const id = window.setInterval(calc, 60000);
    return () => window.clearInterval(id);
  }, []);

  const taken = founderStatus?.spots_taken ?? 67;
  const spotsLeft = Math.max(0, 100 - taken);

  return (
    <section id="pricing" className="bg-[#3d2810] px-6 py-16 text-white">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[#f5a882]">
            Founding Member
          </p>
          <h2 className="mb-4 text-3xl font-extrabold leading-tight md:text-5xl">
            {formatDog(cta.title)}
          </h2>
          <p className="max-w-2xl text-lg leading-8 text-[#e8d5c0]">{formatDog(cta.body)}</p>
        </div>
        <div className="rounded-lg border border-[#f59e0b] bg-[#241707] p-6">
          <div className="mb-4 flex items-baseline gap-3">
            <span className="text-lg text-[#8b735f] line-through">$18.99</span>
            <span className="text-5xl font-extrabold">$8.99</span>
            <span className="text-[#c9a98a]">/mo</span>
          </div>
          <p className="mb-4 text-sm font-semibold text-[#f59e0b]">
            {locale === "es" ? "Precio bloqueado para siempre" : "Price locked forever"}
          </p>
          <div className="mb-5 rounded-lg bg-[#111827] p-4">
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-[#9ca3af]">
                {taken} {locale === "es" ? "tomados" : "taken"}
              </span>
              <span className="font-bold text-[#f59e0b]">
                {spotsLeft} {locale === "es" ? "restantes" : "left"}
              </span>
            </div>
            <div className="mb-3 h-2 rounded-full bg-[#374151]">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444]"
                style={{ width: `${Math.min(100, taken)}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                [countdown.days, locale === "es" ? "dias" : "days"],
                [countdown.hours, "hrs"],
                [countdown.mins, "min"],
              ].map(([value, label]) => (
                <div key={String(label)} className="rounded-md bg-[#1f2937] p-2 text-center">
                  <div className="text-lg font-extrabold">{String(value).padStart(2, "0")}</div>
                  <div className="text-[0.65rem] text-[#9ca3af]">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <Link
            href={href}
            onClick={() => analytics.landingCtaClicked(analyticsName, "founding_member")}
            className="block rounded-full bg-[#f59e0b] px-5 py-3 text-center font-extrabold text-[#111827]"
          >
            {cta.button}
          </Link>
        </div>
      </div>
    </section>
  );
}

function QuizSection({ content }: { content: Dict }) {
  const questions = Array.isArray(content.questions)
    ? (content.questions as Array<{ label: string; options: string[] }>)
    : [];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const complete = questions.length > 0 && Object.keys(answers).length === questions.length;

  return (
    <section id="how" className="bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-3xl font-extrabold text-[#3d2810]">{text(content.title)}</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {questions.map((q, index) => (
            <div key={q.label} className="rounded-lg border border-[#ede0d0] bg-[#fdf8f0] p-5">
              <p className="mb-4 font-bold text-[#3d2810]">{q.label}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setAnswers((prev) => ({ ...prev, [index]: option }))}
                    className={`rounded-full border px-3 py-2 text-sm font-semibold ${
                      answers[index] === option
                        ? "border-[#e8734a] bg-[#e8734a] text-white"
                        : "border-[#d4b896] bg-white text-[#6b4c2a]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {complete && (
          <div className="mt-8 rounded-lg border border-[#f5a882] bg-[#fff3ed] p-6">
            <p className="text-xl font-extrabold text-[#3d2810]">{text(content.result)}</p>
            <p className="mt-2 text-sm text-[#6b4c2a]">{text(content.note)}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function MythSection({ content }: { content: Dict }) {
  const items = Array.isArray(content.items)
    ? (content.items as Array<{ question: string; answer: string }>)
    : [];
  const [open, setOpen] = useState(0);

  return (
    <section id="how" className="bg-white px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-3xl font-extrabold text-[#3d2810]">{text(content.title)}</h2>
        <div className="space-y-3">
          {items.map((item, index) => (
            <button
              key={item.question}
              onClick={() => setOpen(open === index ? -1 : index)}
              className="w-full rounded-lg border border-[#ede0d0] bg-[#fdf8f0] p-5 text-left"
            >
              <div className="flex items-center justify-between gap-4 font-bold text-[#3d2810]">
                <span>{item.question}</span>
                <span>{open === index ? "-" : "+"}</span>
              </div>
              {open === index && <p className="mt-3 leading-7 text-[#6b4c2a]">{item.answer}</p>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function VetDemo({ content }: { content: Dict }) {
  const [shown, setShown] = useState(false);

  return (
    <section className="bg-[#fdf8f0] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-5 text-3xl font-extrabold text-[#3d2810]">{text(content.title)}</h2>
        <textarea
          className="min-h-32 w-full rounded-lg border border-[#d4b896] bg-white p-4 text-[#3d2810]"
          placeholder={text(content.placeholder)}
        />
        <button
          onClick={() => setShown(true)}
          className="mt-4 rounded-full bg-[#e8734a] px-6 py-3 font-bold text-white"
        >
          {text(content.button)}
        </button>
        {shown && (
          <div className="mt-6 rounded-lg border border-[#f5a882] bg-white p-6">
            <p className="mb-2 font-extrabold text-[#3d2810]">{text(content.resultTitle)}</p>
            <p className="leading-7 text-[#6b4c2a]">{text(content.result)}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function LpLandingPage({
  content,
  locale,
}: {
  content: LpContent;
  locale: string;
}) {
  const href = `/${locale}/auth/login`;
  const isFeeding = content.slug === "feeding-guide";
  const isBreathing = content.slug === "breathing-heat";
  const isNewOwner = content.slug === "new-frenchie-owner";
  const isVet = content.slug === "vet-visits";
  const isEar = content.slug === "ear-infections";
  const hero = content.hero;

  const heroTitle = useMemo(() => {
    if (isVet) return text(hero.headline);
    return text(hero.headline);
  }, [hero, isVet]);

  useEffect(() => {
    analytics.pageView(content.analyticsName, `/lp/${content.slug}`);
  }, [content.analyticsName, content.slug]);

  return (
    <div className="min-h-screen bg-[#fdf8f0] text-[#3d2810]">
      <nav className="sticky top-0 z-50 border-b border-[#ede0d0] bg-[#fdf8f0]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href={`/${locale}`} className="text-lg font-extrabold">
            {content.nav.logo}
          </Link>
          <div className="flex items-center gap-5 text-sm font-semibold">
            <a className="hidden text-[#6b4c2a] md:inline" href="#how">
              {content.nav.how}
            </a>
            <a className="hidden text-[#6b4c2a] md:inline" href="#pricing">
              {content.nav.pricing}
            </a>
            <Link className="hidden text-[#6b4c2a] sm:inline" href={href}>
              {content.nav.signin}
            </Link>
            <Link
              href={href}
              onClick={() => analytics.landingCtaClicked(content.analyticsName, "nav")}
              className="rounded-full bg-[#e8734a] px-4 py-2 font-bold text-white"
            >
              {content.nav.cta}
            </Link>
          </div>
        </div>
      </nav>

      {isEar ? (
        <section className="mx-auto max-w-4xl px-6 py-20 md:py-24">
          <h1 className="mb-8 text-4xl font-extrabold leading-tight md:text-6xl">
            {formatDog(heroTitle)}
          </h1>
          <div className="space-y-5 text-xl leading-9 text-[#6b4c2a]">
            {list(hero.story).map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </section>
      ) : isVet ? (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h1 className="mb-10 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            {heroTitle}
          </h1>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-[#ede0d0] bg-white p-6">
              <p className="mb-4 text-sm font-extrabold uppercase text-[#a07850]">
                {text(hero.beforeTitle)}
              </p>
              <p className="text-2xl font-bold leading-9 text-[#6b4c2a]">{text(hero.before)}</p>
            </div>
            <div className="rounded-lg border border-[#f5a882] bg-[#fff3ed] p-6">
              <p className="mb-4 text-sm font-extrabold uppercase text-[#e8734a]">
                {text(hero.afterTitle)}
              </p>
              <p className="text-2xl font-bold leading-9 text-[#3d2810]">{text(hero.after)}</p>
            </div>
          </div>
          <div className="mt-8 aspect-[16/9]">
            <ImageBlock src={content.images.hero} alt={heroTitle} />
          </div>
        </section>
      ) : (
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl">
              {formatDog(heroTitle)}
            </h1>
            <p className="text-xl leading-8 text-[#6b4c2a]">
              {text(hero.subhead) || text(hero.intro) || text(hero.body)}
            </p>
            {text(hero.body) && text(hero.subhead) && (
              <p className="mt-4 leading-8 text-[#6b4c2a]">{text(hero.body)}</p>
            )}
            <Link
              href={href}
              onClick={() => analytics.landingCtaClicked(content.analyticsName, "hero")}
              className="mt-8 inline-flex rounded-full bg-[#e8734a] px-6 py-3 font-bold text-white"
            >
              {content.cta.button}
            </Link>
          </div>
          <div className="aspect-[16/9]">
            <ImageBlock src={content.images.hero} alt={heroTitle} />
          </div>
        </section>
      )}

      {isFeeding && <QuizSection content={content.quiz as Dict} />}
      {isBreathing && <MythSection content={content.myths as Dict} />}

      {isEar && (
        <>
          <section id="how" className="bg-white px-6 py-16">
            <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="mb-3 text-3xl font-extrabold">{text((content.problem as Dict).title)}</h2>
                <p className="mb-5 text-2xl font-bold text-[#e8734a]">
                  {text((content.problem as Dict).subtitle)}
                </p>
                <p className="leading-8 text-[#6b4c2a]">{text((content.problem as Dict).body)}</p>
              </div>
              <div className="aspect-[16/9]">
                <ImageBlock src={content.images.problem} alt={text((content.problem as Dict).title)} />
              </div>
            </div>
          </section>
          <section className="px-6 py-16">
            <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
              {(content.stats as Array<{ value: string; label: string }>).map((stat) => (
                <div key={stat.value} className="rounded-lg bg-white p-6">
                  <div className="mb-3 text-5xl font-extrabold text-[#e8734a]">{stat.value}</div>
                  <p className="font-semibold leading-7 text-[#6b4c2a]">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {isFeeding && (
        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6">
              <h2 className="mb-6 text-3xl font-extrabold">{text((content.problem as Dict).title)}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-extrabold text-[#a07850]">{text((content.problem as Dict).leftTitle)}</h3>
                  {list((content.problem as Dict).left).map((item) => <p key={item} className="mb-2 text-[#6b4c2a]">- {item}</p>)}
                </div>
                <div>
                  <h3 className="mb-3 font-extrabold text-[#e8734a]">{text((content.problem as Dict).rightTitle)}</h3>
                  {list((content.problem as Dict).right).map((item) => <p key={item} className="mb-2 text-[#3d2810]">- {item}</p>)}
                </div>
              </div>
            </div>
            <ImageBlock src={content.images.problem} alt={text((content.problem as Dict).title)} />
          </div>
        </section>
      )}

      {isBreathing && (
        <section className="bg-[#fff3ed] px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="mb-5 text-3xl font-extrabold text-[#7f1d1d]">
                {text((content.emergency as Dict).title)}
              </h2>
              <div className="grid gap-3">
                {list((content.emergency as Dict).items).map((item) => (
                  <div key={item} className="rounded-lg bg-white p-4 font-semibold text-[#7f1d1d]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <ImageBlock src={content.images.warning} alt={text((content.emergency as Dict).title)} />
          </div>
        </section>
      )}

      {isNewOwner && (
        <>
          <section id="how" className="bg-white px-6 py-16">
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-8 text-3xl font-extrabold">{text((content.survival as Dict).title)}</h2>
              <div className="grid gap-4">
                {list((content.survival as Dict).items).map((item, index) => (
                  <div key={item} className="grid grid-cols-[3rem_1fr] gap-4 rounded-lg border border-[#ede0d0] p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8734a] font-extrabold text-white">
                      {index + 1}
                    </div>
                    <p className="text-lg font-semibold leading-7 text-[#3d2810]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="px-6 py-16">
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[#a07850]">
                  {text((content.mistake as Dict).title)}
                </p>
                <h2 className="mb-4 text-4xl font-extrabold">{text((content.mistake as Dict).headline)}</h2>
                <p className="leading-8 text-[#6b4c2a]">{text((content.mistake as Dict).body)}</p>
              </div>
              <ImageBlock src={content.images.chaos} alt={text((content.mistake as Dict).title)} />
            </div>
          </section>
        </>
      )}

      {Boolean(content.solution || content.passport || content.plan) && (
        <section className="bg-white px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
            <div className="aspect-[16/9]">
              <ImageBlock
                src={content.images.solution || content.images.report || content.images.plan || content.images.onboarding}
                alt="Frenchie Care"
              />
            </div>
            <div>
              {(() => {
                const block = (content.solution || content.passport || content.plan) as Dict;
                return (
                  <>
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[#e8734a]">
                      {text(block.eyebrow)}
                    </p>
                    <h2 className="mb-4 text-3xl font-extrabold leading-tight">{text(block.title)}</h2>
                    <p className="mb-5 leading-8 text-[#6b4c2a]">{text(block.body) || text(block.cta)}</p>
                    <div className="grid gap-3">
                      {list(block.bullets || block.steps).map((item) => (
                        <div key={item} className="rounded-lg bg-[#fdf8f0] p-4 font-semibold text-[#3d2810]">
                          {item}
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </section>
      )}

      {isVet && <VetDemo content={content.demo as Dict} />}

      {Boolean(content.testimonial || content.proof || content.community || content.testimonials) && (
        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6">
              {(() => {
                const block = (content.testimonial || content.proof || content.community || content.testimonials) as Dict;
                const quotes = list(block.testimonials || block.posts || block.items);
                return (
                  <>
                    <h2 className="mb-5 text-3xl font-extrabold">
                      {text(block.title) || text(block.name)}
                    </h2>
                    {text(block.quote) && (
                      <p className="mb-4 text-xl font-semibold leading-8">
                        &ldquo;{text(block.quote)}&rdquo;
                      </p>
                    )}
                    {text(block.body) && <p className="mb-4 leading-8 text-[#6b4c2a]">{text(block.body)}</p>}
                    {quotes.map((quote) => (
                      <p key={quote} className="mb-3 rounded-lg bg-[#fdf8f0] p-4 font-semibold text-[#6b4c2a]">
                        {quote}
                      </p>
                    ))}
                    {text(block.detail) && <p className="text-sm text-[#a07850]">{text(block.detail)}</p>}
                  </>
                );
              })()}
            </div>
            <ImageBlock
              src={content.images.result || content.images.community || content.images.vet}
              alt="Frenchie Care result"
            />
          </div>
        </section>
      )}

      <FoundingMemberCard locale={locale} analyticsName={content.analyticsName} cta={content.cta} />

      <footer className="bg-[#241707] px-6 py-10 text-[#e8d5c0]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-2 text-lg font-extrabold text-white">{content.nav.logo}</p>
            <p className="max-w-md leading-7">{content.footer.tagline}</p>
          </div>
          <div className="flex gap-5 text-sm">
            <Link href={`/${locale}/terms`}>{content.footer.terms}</Link>
            <Link href={`/${locale}/privacy`}>{content.footer.privacy}</Link>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-6 text-sm leading-6 text-[#a07850]">
          {content.footer.disclaimer} © {new Date().getFullYear()} Frenchie Care.
        </p>
      </footer>
    </div>
  );
}
