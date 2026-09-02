"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";
import { useLocale } from "@/i18n/locale-provider";
import { useMansy } from "@/content/schema-ext";
import {
  CARS,
  METRICS,
  metricValue,
  SHOWROOM_FRAME,
  FORECOURT_FRAME,
  PROFILE,
  type Car,
  type MetricId,
} from "@/content/media";
import { FlutedChart } from "@/components/webgl/fluted-chart";

/* ---------------------------------------------------------------- motion -- */

function useOnScreen<T extends HTMLElement>(rootMargin = "-8% 0px -8% 0px") {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reveal = () => node.setAttribute("data-seen", "");
    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin]);
  return ref;
}

const delayVar = (d: number) => ({ "--readout-delay": `${d}ms` }) as CSSProperties;

/** This site's arrival: the read-out. Figures settle; they do not perform. */
function Readout({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useOnScreen<HTMLElement>();
  const C = Tag as unknown as (p: Record<string, unknown>) => ReactElement;
  return (
    <C ref={ref} data-readout="" className={className} style={delayVar(delay)}>
      {children}
    </C>
  );
}

function Rule({ className, delay = 0 }: { className?: string; delay?: number }) {
  const ref = useOnScreen<HTMLDivElement>();
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-rule=""
      className={`fluted h-1.5 w-full origin-[left_center] rtl:origin-[right_center] ${className ?? ""}`}
      style={delayVar(delay)}
    />
  );
}

/** Formats a figure that may be a single value or a published range. */
function fmt(v: number | [number, number] | undefined, unit: string) {
  if (v == null) return null;
  return Array.isArray(v) ? `${v[0]}–${v[1]} ${unit}` : `${v} ${unit}`;
}

/* -------------------------------------------------------------------- nav -- */

export function Nav() {
  const c = useMansy();
  const { locale, toggleLocale } = useLocale();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-plaster/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[86rem] items-center gap-5 px-5 sm:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label={c.brand.name}>
          <img src="/mark.svg" alt="" className="h-7 w-7" />
          <span className="font-display text-[1rem] font-bold leading-none text-ink">
            {c.brand.name}
          </span>
        </a>

        <nav className="ms-auto hidden items-center gap-7 sm:flex">
          {c.nav.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="py-2 text-[0.86rem] text-mid transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={PROFILE.phoneHref}
          className="latin tnum ms-auto shrink-0 text-[0.86rem] font-medium text-mat transition-opacity hover:opacity-80 sm:ms-0"
        >
          {PROFILE.phones[0]}
        </a>

        <button
          onClick={toggleLocale}
          className="shrink-0 border border-ink/25 px-3 py-1.5 text-[0.72rem] text-mid transition-colors hover:border-mat hover:text-ink"
          aria-label={c.a11y.toggleLanguage}
        >
          {locale === "ar" ? "EN" : "ع"}
        </button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------- page -- */

export function Sections() {
  const c = useMansy();
  const [metric, setMetric] = useState<MetricId>("power");

  const meta = METRICS.find((m) => m.id === metric)!;

  // Normalise to 0–1 across the cars that actually have this figure. An
  // inverted metric (0–100, where lower is quicker) is flipped so taller
  // still means better, and the copy says so.
  const { heights, dims } = useMemo(() => {
    const raw = CARS.map((car) => metricValue(car, metric));
    const present = raw.filter((v): v is number => v != null);
    const min = Math.min(...present);
    const max = Math.max(...present);
    const span = max - min || 1;
    return {
      heights: raw.map((v) => {
        if (v == null) return 0.08;
        const t = (v - min) / span;
        return 0.35 + (meta.inverted ? 1 - t : t) * 0.65;
      }),
      dims: raw.map((v) => v == null),
    };
  }, [metric, meta.inverted]);

  return (
    <main>
      {/* ------------------------------------------------------------ hero -- */}
      <section id="top" className="w-full pt-16">
        <div className="mx-auto max-w-[86rem] px-5 py-14 sm:px-8 sm:py-20">
          <Readout className="max-w-[44rem]">
            <p className="label text-mat">{c.hero.eyebrow}</p>
            <h1 className="mt-4 font-display text-hero font-extrabold text-ink">
              {c.hero.headline}
            </h1>
            <Rule className="mt-6 max-w-[12rem]" delay={140} />
            <p className="mt-6 text-lead leading-relaxed text-mid">{c.hero.sub}</p>
            <p className="mt-5 inline-block border-s-2 border-column ps-3 text-[0.86rem] text-ink">
              {c.hero.noProseNote}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={PROFILE.phoneHref}
                className="inline-flex items-center gap-2 bg-ink px-7 py-3.5 text-[0.86rem] font-semibold text-plaster transition-colors hover:bg-mat"
              >
                {c.hero.primaryCta}
              </a>
              <a
                href="#compare"
                className="inline-flex items-center gap-2 border border-ink/30 px-7 py-3.5 text-[0.86rem] font-semibold text-ink transition-colors hover:border-mat hover:text-mat"
              >
                {c.hero.secondaryCta}
              </a>
            </div>
          </Readout>
        </div>
      </section>

      {/* --------------------------------------------------------- compare -- */}
      <section
        id="compare"
        className="on-dark border-y border-rule bg-ink py-20 text-plaster sm:py-28"
      >
        <div className="mx-auto max-w-[86rem] px-5 sm:px-8">
          <Readout className="max-w-[44rem]">
            <p className="label text-column-hi">{c.compare.eyebrow}</p>
            <h2 className="mt-4 font-display text-display font-extrabold text-plaster">
              {c.compare.heading}
            </h2>
            <div className="fluted mt-5 h-1.5 max-w-[8rem]" aria-hidden="true" />
            <p className="mt-6 text-lead leading-relaxed text-plaster-3">{c.compare.intro}</p>
          </Readout>

          {/* Which figure is being compared. */}
          <Readout delay={80} className="mt-10 flex flex-wrap gap-2">
            {METRICS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMetric(m.id)}
                className={`border px-4 py-2 text-[0.85rem] transition-colors ${
                  m.id === metric
                    ? "border-column-hi text-plaster"
                    : "border-white/25 text-plaster-3 hover:border-white/50"
                }`}
              >
                {c.compare.metricNames[m.id]}
              </button>
            ))}
          </Readout>

          <Readout delay={120} className="mt-8">
            <div className="relative h-[20rem] w-full sm:h-[24rem]">
              <FlutedChart
                values={heights}
                colors={CARS.map((car) => car.paint)}
                dims={dims}
                alt={c.compare.chartAlt}
                className="absolute inset-0 h-full w-full"
              />
            </div>

            {/* The read-out under the columns: the actual published figures. */}
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/15 pt-5 sm:grid-cols-4">
              {CARS.map((car) => {
                const raw =
                  metric === "power"
                    ? car.spec.power
                    : metric === "torque"
                      ? car.spec.torque
                      : metric === "topSpeed"
                        ? car.spec.topSpeed
                        : car.spec.zeroToHundred;
                const text = fmt(raw, meta.unit);
                return (
                  <div key={car.id}>
                    <span
                      aria-hidden="true"
                      className="mb-2 block h-1 w-8"
                      style={{ background: car.paint }}
                    />
                    <p className="latin text-[0.82rem] text-plaster-3">{car.marque}</p>
                    <p className="latin text-[0.95rem] text-plaster">{car.model}</p>
                    <p
                      className={`tnum mt-1.5 font-display text-[1.35rem] font-bold ${
                        text ? "text-column-hi" : "text-plaster-3"
                      }`}
                    >
                      {text ?? c.compare.missingLabel}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="mt-5 max-w-[44rem] text-[0.84rem] leading-relaxed text-plaster-3">
              {c.compare.metricNotes[metric]}
              {meta.inverted && (
                <span className="ms-2 text-column-hi">· {c.compare.invertedNote}</span>
              )}
            </p>
            <p className="mt-2 max-w-[44rem] text-[0.8rem] leading-relaxed text-plaster-3">
              {c.compare.rangeNote} {c.hero.chartHint}
            </p>
          </Readout>
        </div>
      </section>

      {/* ----------------------------------------------------------- floor -- */}
      <section id="floor" className="bg-plaster py-20 sm:py-28">
        <div className="mx-auto max-w-[86rem] px-5 sm:px-8">
          <Readout className="max-w-[44rem]">
            <p className="label text-mat">{c.floor.eyebrow}</p>
            <h2 className="mt-4 font-display text-display font-extrabold text-ink">
              {c.floor.heading}
            </h2>
            <Rule className="mt-5 max-w-[8rem]" delay={100} />
            <p className="mt-6 text-lead leading-relaxed text-mid">{c.floor.intro}</p>
          </Readout>

          <div className="mt-12 space-y-14">
            {CARS.map((car, i) => (
              <CarBlock key={car.id} car={car} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ room -- */}
      <section id="room" className="border-t border-rule bg-plaster-2 py-20 sm:py-28">
        <div className="mx-auto max-w-[86rem] px-5 sm:px-8">
          <Readout className="max-w-[44rem]">
            <p className="label text-mat">{c.room.eyebrow}</p>
            <h2 className="mt-4 font-display text-display font-extrabold text-ink">
              {c.room.heading}
            </h2>
            <Rule className="mt-5 max-w-[8rem]" delay={100} />
          </Readout>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-14">
            <Readout delay={100}>
              <div className="grid gap-3 sm:grid-cols-2">
                <figure className="relative aspect-[4/3] overflow-hidden bg-plaster-3">
                  <img
                    src={SHOWROOM_FRAME}
                    alt={c.room.showroomAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </figure>
                <figure className="relative aspect-[4/3] overflow-hidden bg-plaster-3">
                  <img
                    src={FORECOURT_FRAME}
                    alt={c.room.forecourtAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </figure>
              </div>
            </Readout>

            <Readout delay={50}>
              <div className="space-y-4 text-[0.96rem] leading-relaxed text-mid">
                {c.room.body.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                {c.about.body.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>

              <dl className="mt-7 flex gap-8 border-t border-rule pt-5">
                <div>
                  <dd className="tnum font-display text-[1.6rem] font-extrabold leading-none text-ink">
                    {PROFILE.followers}
                  </dd>
                  <dt className="label mt-1 text-mid">{c.room.followersLabel}</dt>
                </div>
                <div>
                  <dd className="tnum font-display text-[1.6rem] font-extrabold leading-none text-ink">
                    {PROFILE.posts}
                  </dd>
                  <dt className="label mt-1 text-mid">{c.room.postsLabel}</dt>
                </div>
              </dl>

              <ul className="mt-6 space-y-1">
                {PROFILE.phones.map((p) => (
                  <li key={p}>
                    <a
                      href={`tel:+2${p}`}
                      className="latin tnum text-[1rem] text-ink transition-colors hover:text-mat"
                    >
                      {p}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={PROFILE.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-[0.85rem] font-semibold text-plaster transition-colors hover:bg-mat"
                >
                  {c.room.cta}
                </a>
                <a
                  href={PROFILE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-ink/30 px-6 py-3 text-[0.85rem] font-semibold text-ink transition-colors hover:border-mat hover:text-mat"
                >
                  {c.room.instagramCta}
                </a>
              </div>
            </Readout>
          </div>
        </div>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------- car block -- */

function CarBlock({ car, index }: { car: Car; index: number }) {
  const c = useMansy();
  const [i, setI] = useState(0);
  const cur = car.frames[Math.min(i, car.frames.length - 1)];

  const rows: [keyof typeof c.floor.specLabels, string | null][] = [
    ["engine", car.spec.engine],
    ["power", fmt(car.spec.power, "HP")],
    ["torque", fmt(car.spec.torque, "Nm")],
    ["transmission", car.spec.transmission],
    ["drivetrain", car.spec.drivetrain ?? null],
    ["topSpeed", car.spec.topSpeed ? `${car.spec.topSpeed} km/h` : null],
    ["zeroToHundred", car.spec.zeroToHundred ? `${car.spec.zeroToHundred} sec` : null],
    ["tank", car.spec.tank ? `${car.spec.tank} L` : null],
    [
      "consumption",
      car.spec.consumption ? `${car.spec.consumption[0]}–${car.spec.consumption[1]} L/100 km` : null,
    ],
  ];

  return (
    <Readout as="article" delay={Math.min(index, 3) * 70} className="grid gap-7 lg:grid-cols-2 lg:gap-12">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden bg-plaster-2">
          <img
            key={cur}
            src={cur}
            alt={`${car.marque} ${car.model}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <span className="pointer-events-none absolute bottom-3 end-3 tnum text-[0.7rem] text-plaster">
            {c.floor.positionLabel
              .replace("{n}", String(Math.min(i, car.frames.length - 1) + 1))
              .replace("{total}", String(car.frames.length))}
          </span>
        </div>
        <div className="mt-2 flex gap-1.5">
          {car.frames.map((f, n) => (
            <button
              key={f}
              onClick={() => setI(n)}
              aria-label={`${car.marque} ${car.model} ${n + 1}`}
              className={`h-1 transition-all ${
                n === Math.min(i, car.frames.length - 1)
                  ? "w-8 bg-mat"
                  : "w-4 bg-rule hover:bg-mid"
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-3">
          <span
            aria-hidden="true"
            className="h-3 w-3 shrink-0"
            style={{ background: car.paint, outline: "1px solid rgba(0,0,0,0.12)" }}
          />
          <p className="label text-mid">{car.marque}</p>
        </div>
        <h3 className="latin mt-1 font-display text-[clamp(1.4rem,2.8vw,2.1rem)] font-bold leading-tight text-ink">
          {car.model} <span className="tnum text-mid">{car.year}</span>
        </h3>

        <dl className="mt-5 divide-y divide-rule border-y border-rule">
          {rows.map(([k, v]) =>
            v ? (
              <div key={k} className="flex items-baseline justify-between gap-6 py-2.5">
                <dt className="label text-mid">{c.floor.specLabels[k]}</dt>
                <dd className="latin tnum text-end text-[0.92rem] text-ink">{v}</dd>
              </div>
            ) : null,
          )}
        </dl>

        {car.features.length > 0 && (
          <>
            <p className="label mt-5 text-mid">{c.floor.featuresLabel}</p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {car.features.map((f) => (
                <li key={f} className="text-[0.85rem] text-mid">
                  {f}
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-5 text-[0.88rem] leading-relaxed text-mid">{c.floor.notes[car.id]}</p>

        <a
          href={car.postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-[0.8rem] text-mid underline decoration-rule underline-offset-4 transition-colors hover:text-mat"
        >
          {c.floor.viewPost}
        </a>
      </div>
    </Readout>
  );
}

/* ----------------------------------------------------------------- footer -- */

export function Footer() {
  const c = useMansy();

  return (
    <footer className="border-t-2 border-ink bg-plaster">
      <div className="mx-auto max-w-[86rem] px-5 py-11 sm:px-8 sm:py-13">
        <div className="grid gap-9 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-14">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/mark.svg" alt="" className="h-6 w-6" />
              <span className="font-display text-[1rem] font-bold text-ink">{c.brand.name}</span>
            </div>
            <p className="mt-4 text-[0.9rem] text-mid">{c.brand.tagline}</p>
          </div>
          <div className="space-y-5">
            <nav className="flex flex-wrap gap-x-7 gap-y-3">
              {c.nav.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="label text-mid transition-colors hover:text-mat"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={PROFILE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="label text-mid transition-colors hover:text-mat"
              >
                {c.room.instagramCta}
              </a>
            </nav>
            <div className="max-w-2xl space-y-2.5 border-t border-rule pt-5">
              <p className="text-[0.82rem] leading-relaxed text-mid">{c.footer.disclaimer}</p>
              <p className="label text-mid">{c.footer.rights}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
