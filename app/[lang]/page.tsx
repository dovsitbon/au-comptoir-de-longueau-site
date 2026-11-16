import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import site from "@/data/site.json";
import avis from "@/data/avis.json";
import { fill, getDict, isLocale, type Dict, type Locale } from "@/lib/i18n";
import { formatDay } from "@/lib/format";
import { pagePath } from "@/lib/pages";
import { photoOf, type SlotId } from "@/lib/photos";
import { homeJsonLd } from "@/lib/jsonld";
import { Reveal } from "@/components/Reveal";
import { OpenStatus } from "@/components/OpenStatus";
import { BookingForm } from "@/components/BookingForm";
import { BookingBar, BookLink } from "@/components/BookingBar";
import { HoursTable } from "@/components/HoursTable";
import { Photo } from "@/components/Photo";
import { Mark } from "@/components/Logo";
import { FormulesGrid, Rating, SectionHead, Stars } from "@/components/Sections";
import { ArrowIcon, CalendarIcon, GroupIcon, ParkingIcon, PhoneIcon, PinIcon, RefillIcon } from "@/components/icons";

type TileId = keyof Dict["tiles"]["items"];
const TILES: { id: TileId; photo: SlotId; anchor: string }[] = [
  { id: "grill", photo: "grill", anchor: "buffet-grill" },
  { id: "sushis", photo: "sushis", anchor: "buffet-sushis" },
  { id: "fruitsDeMer", photo: "fruits-de-mer", anchor: "buffet-fruitsDeMer" },
  { id: "entrees", photo: "entrees", anchor: "buffet-aussi" },
  { id: "platsChauds", photo: "plats-chauds", anchor: "buffet-aussi" },
  { id: "desserts", photo: "desserts", anchor: "buffet-desserts" },
];

type Universe = keyof Dict["buffet"]["universes"];
const UNIVERSES: { id: Universe; photo: SlotId }[] = [
  { id: "grill", photo: "grill" },
  { id: "sushis", photo: "sushis" },
  { id: "fruitsDeMer", photo: "fruits-de-mer" },
  { id: "desserts", photo: "desserts" },
];

function Hero({ d, lang }: { d: Dict; lang: Locale }) {
  const photo = photoOf("hero");
  return (
    <section className="relative">
      <div className="relative flex min-h-[calc(100svh-6.5rem)] flex-col justify-end overflow-hidden bg-charbon text-cream md:min-h-[calc(100svh-7rem)]">
        {photo ? (
          <>
            <Image src={photo.src} alt={d.alt.hero} fill priority sizes="100vw" quality={80} className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(26,26,26,0.88),rgba(26,26,26,0.62)_55%,rgba(26,26,26,0.35)),linear-gradient(to_top,rgba(26,26,26,0.7),transparent_45%)]" aria-hidden="true" />
          </>
        ) : (
          <>
            <Mark className="pointer-events-none absolute -end-[12%] top-1/2 h-[120%] w-auto -translate-y-1/2 opacity-[0.16] md:-end-[4%] md:h-[115%]" flame="#C2491D" sticks="#C9A14E" />
            <p className="absolute end-5 top-5 rounded-full border border-cream/20 px-3 py-1 text-[0.75rem] text-cream/60 md:end-8 md:top-7">{d.hero.photoSoon}</p>
          </>
        )}
        <div className="relative mx-auto w-full max-w-7xl px-6 pt-28 pb-24 md:px-10 md:pb-32">
          <p className="caps text-or">{d.hero.eyebrow}</p>
          <h1 className="hero-title mt-5 max-w-4xl">{d.hero.title}</h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-cream/80 md:text-[1.1875rem]">{d.hero.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <BookLink className="btn">{d.hero.ctaBook}</BookLink>
            <Link href={`/${lang}#formules`} className="btn-line text-cream">
              {d.hero.ctaPrices}
            </Link>
          </div>
          <div className="mt-7 flex flex-col gap-1.5 text-[0.9375rem] text-cream/85 sm:flex-row sm:items-center sm:gap-6">
            <Rating d={d} lang={lang} />
            <OpenStatus dark />
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto -mt-12 max-w-5xl px-4 md:-mt-11 md:px-10">
        <BookingBar />
      </div>
    </section>
  );
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang: l } = await params;
  if (!isLocale(l)) notFound();
  const lang: Locale = l;
  const d = getDict(lang);
  const services = [
    { k: "volonte", Icon: RefillIcon },
    { k: "parking", Icon: ParkingIcon },
    { k: "familles", Icon: GroupIcon },
    { k: "reservation", Icon: CalendarIcon },
  ] as const;
  const blocks = [
    { k: "grill", photo: "grill-direct", cta: <Link href={`/${lang}#buffet`} className="btn-line">{d.blocks.grill.cta}</Link> },
    { k: "groups", photo: "salle-groupes", id: "groupes", cta: <BookLink className="btn">{d.blocks.groups.cta}</BookLink> },
    { k: "kids", photo: "desserts-enfants", cta: <Link href={`/${lang}#formules`} className="btn-line">{d.blocks.kids.cta}</Link> },
  ] as const;
  const quotes = avis.items as { name: string; date: string; text: Record<Locale, string> }[];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(lang)) }} />

      <Hero d={d} lang={lang} />

      {/* Tuiles de catégories, juste après le hero */}
      <section aria-labelledby="tuiles" className="pt-16 md:pt-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <h2 id="tuiles" className="display text-[1.5rem] md:text-[1.75rem]">
            {d.tiles.title}
          </h2>
        </div>
        <ul className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 px-6 md:mx-auto md:grid md:max-w-7xl md:grid-cols-6 md:gap-4 md:overflow-visible md:px-10">
          {TILES.map((t, i) => (
            <Reveal as="li" key={t.id} delay={i * 0.04} className="w-[38vw] max-w-44 shrink-0 snap-start md:w-auto md:max-w-none">
              <a href={`#${t.anchor}`} className="group block">
                <div className="zoom relative aspect-square overflow-hidden rounded-2xl bg-white">
                  <Photo id={t.photo} d={d} sizes="(min-width: 768px) 15vw, 38vw" minimal />
                </div>
                <p className="mt-2.5 flex items-center gap-1.5 text-[0.9375rem] font-medium transition-colors group-hover:text-braise-ink">
                  {d.tiles.items[t.id]}
                  <ArrowIcon className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </p>
              </a>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Bande de services en 4 pictos */}
      <section aria-label={d.services.title} className="px-6 pt-16 md:px-10 md:pt-20">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
          {services.map(({ k, Icon }) => (
            <li key={k} className="flex flex-col items-start gap-3 bg-cream p-6 md:p-8">
              <Icon className="h-8 w-8 text-braise" />
              <p className="display text-[1.25rem]">{d.services.items[k].title}</p>
              <p className="text-[0.9375rem] text-muted">{d.services.items[k].text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Formules et prix côte à côte */}
      <section id="formules" aria-labelledby="formules-title" className="scroll-mt-20 px-6 pt-24 md:px-10 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead id="formules-title" eyebrow={d.formules.eyebrow} title={d.formules.title} lead={d.formules.lead} />
            <Link href={pagePath("formules", lang)} className="link-line text-[0.9375rem]">
              {d.formules.seeAll}
            </Link>
          </div>
          <div className="mt-10">
            <FormulesGrid d={d} lang={lang} />
          </div>
        </div>
      </section>

      {/* Le buffet par univers */}
      <section id="buffet" aria-labelledby="buffet-title" className="mt-24 scroll-mt-20 bg-cream-deep px-6 py-24 md:mt-32 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHead id="buffet-title" eyebrow={d.buffet.eyebrow} title={d.buffet.title} lead={d.buffet.lead} />
          <ul className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2">
            {UNIVERSES.map((u, i) => (
              <Reveal as="li" key={u.id} delay={(i % 2) * 0.08}>
                <article id={`buffet-${u.id}`} className="scroll-mt-24">
                  <div className="zoom relative aspect-[4/3] overflow-hidden rounded-3xl bg-white">
                    <Photo id={u.photo} d={d} sizes="(min-width: 768px) 46vw, 100vw" />
                  </div>
                  <div className="mt-5 flex items-baseline gap-4">
                    <span className="display text-[0.9375rem] text-braise-ink tabular-nums">0{i + 1}</span>
                    <div>
                      <h3 className="display text-[1.75rem] md:text-[2rem]">{d.buffet.universes[u.id].title}</h3>
                      <p className="mt-2 max-w-md text-muted">{d.buffet.universes[u.id].text}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
          <div id="buffet-aussi" className="mt-14 grid scroll-mt-24 items-center gap-6 border-t border-charbon/10 pt-10 md:grid-cols-[1fr_auto]">
            <p className="max-w-2xl text-[1.125rem] leading-relaxed">{d.buffet.also}</p>
            <div className="flex gap-3">
              {(["entrees", "plats-chauds"] as const).map((id) => (
                <div key={id} className="relative size-28 overflow-hidden rounded-2xl bg-white md:size-32">
                  <Photo id={id} d={d} sizes="128px" minimal />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trois blocs alternés : photo + texte court + un seul bouton */}
      <div className="space-y-24 px-6 pt-24 md:space-y-32 md:px-10 md:pt-32">
        {blocks.map((b, i) => {
          const t = d.blocks[b.k];
          return (
            <section key={b.k} id={"id" in b ? b.id : undefined} className="mx-auto grid max-w-7xl scroll-mt-20 items-center gap-10 md:grid-cols-2 md:gap-16">
              <Reveal className={`relative aspect-[4/5] overflow-hidden rounded-3xl bg-white md:aspect-square ${i % 2 ? "md:order-2" : ""}`}>
                <Photo id={b.photo} d={d} sizes="(min-width: 768px) 48vw, 100vw" />
              </Reveal>
              <Reveal delay={0.08}>
                <p className="eyebrow">{t.eyebrow}</p>
                <h2 className="display mt-3 text-[2.25rem] md:text-[3rem]">{t.title}</h2>
                <p className="lead mt-5 max-w-lg">{t.text}</p>
                <div className="mt-8">{b.cta}</div>
              </Reveal>
            </section>
          );
        })}
      </div>

      {/* Réserver une table */}
      <section id="reserver" aria-labelledby="reserver-title" className="scroll-mt-20 px-6 pt-24 md:px-10 md:pt-32">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[2fr_3fr] md:gap-16">
          <div>
            <SectionHead id="reserver-title" eyebrow={d.book.eyebrow} title={d.book.title} lead={d.book.lead} />
            <div className="mt-8 space-y-2 text-[0.9375rem] text-muted">
              <Rating d={d} lang={lang} />
              <OpenStatus />
            </div>
            <a href={`tel:${site.phoneIntl}`} className="btn mt-8">
              <PhoneIcon />
              {d.nav.call} · <span className="tabular-nums">{site.phone}</span>
            </a>
          </div>
          <BookingForm />
        </div>
      </section>

      {/* Avis : note Google + emplacements pour de vrais avis (aucun avis inventé) */}
      <section aria-labelledby="avis" className="px-6 pt-24 md:px-10 md:pt-32">
        <div className="mx-auto max-w-7xl rounded-3xl bg-charbon px-6 py-14 text-center text-cream md:py-20">
          <p className="caps text-or">{d.reviews.eyebrow}</p>
          <h2 id="avis" className="display mt-3 text-[2.25rem] md:text-[3rem]">
            {d.reviews.title}
          </h2>
          <p className="price mt-8 !text-[5rem] leading-none md:!text-[6.5rem]">
            {site.rating.value.toLocaleString(lang === "en" ? "en-GB" : "fr-FR", { minimumFractionDigits: 1 })}
            <span className="text-[0.4em] text-cream/55">/5</span>
          </p>
          <div className="mt-4 flex justify-center">
            <Stars className="text-or [&_svg]:h-5 [&_svg]:w-5" />
          </div>
          <p className="mt-4 text-[1.0625rem]">{fill(d.reviews.count, { count: site.rating.countLabel })}</p>
          <p className="mt-1 text-[0.8125rem] text-cream/60">{fill(d.reviews.checked, { date: formatDay(site.rating.checked, lang, { day: "numeric", month: "long", year: "numeric" }) })}</p>

          <p className="mt-12 text-[0.9375rem] text-cream/70">{d.reviews.themesTitle}</p>
          <ul className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-2">
            {d.reviews.themes.map((t) => (
              <li key={t} className="rounded-full border border-cream/20 px-4 py-2 text-[0.9375rem]">
                {t}
              </li>
            ))}
          </ul>

          <div dangerouslySetInnerHTML={{ __html: "<!-- À REMPLIR avec de vrais avis clients (data/avis.json), avec l'accord du restaurant -->" }} hidden />
          {quotes.length > 0 && (
            <ul className="mx-auto mt-12 grid max-w-5xl gap-4 text-start md:grid-cols-3">
              {quotes.slice(0, 3).map((q) => (
                <li key={q.name + q.date} className="rounded-2xl bg-cream/5 p-6">
                  <blockquote className="leading-relaxed">« {q.text[lang]} »</blockquote>
                  <p className="mt-4 text-[0.875rem] text-cream/65">{q.name}</p>
                </li>
              ))}
            </ul>
          )}
          <a href={site.reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-line mt-10 text-cream">
            {d.reviews.cta}
          </a>
        </div>
      </section>

      {/* Infos pratiques */}
      <section id="infos" aria-labelledby="infos-title" className="scroll-mt-20 px-6 pt-24 md:px-10 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <SectionHead id="infos-title" eyebrow={d.infos.eyebrow} title={d.infos.title} />
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.25fr]">
            <dl className="space-y-6">
              <div>
                <dt className="flex items-center gap-2 text-[0.875rem] text-muted">
                  <PinIcon />
                  {d.infos.address}
                </dt>
                <dd className="mt-1.5 text-[1.25rem] leading-snug font-medium">
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city}
                </dd>
                <dd>
                  <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-line mt-2 inline-block text-[0.9375rem]">
                    {d.infos.directions}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-[0.875rem] text-muted">
                  <PhoneIcon />
                  {d.infos.phone}
                </dt>
                <dd className="mt-1.5">
                  <a href={`tel:${site.phoneIntl}`} className="text-[1.25rem] font-medium tabular-nums transition-colors hover:text-braise-ink">
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[0.875rem] text-muted">{d.infos.access}</dt>
                <dd className="mt-1.5">{d.infos.accessText}</dd>
              </div>
              <div>
                <dt className="text-[0.875rem] text-muted">{d.infos.parking}</dt>
                <dd className="mt-1.5">{d.infos.parkingText}</dd>
              </div>
            </dl>
            <div>
              <p className="text-[0.875rem] text-muted">{d.infos.hours}</p>
              <OpenStatus className="mt-2 font-medium" />
              <HoursTable lang={lang} d={d} className="mt-3" />
              <p className="mt-4 text-[0.8125rem] text-muted">{d.infos.hoursNote}</p>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <iframe title={d.infos.mapTitle} src={site.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="aspect-[4/3] w-full rounded-3xl border-0 bg-cream-deep lg:aspect-[4/5]" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="px-6 pt-24 pb-24 md:px-10 md:pt-32 md:pb-32">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">{d.faq.eyebrow}</p>
            <h2 id="faq" className="display mt-3 text-[2.25rem] md:text-[3rem]">
              {d.faq.title}
            </h2>
          </div>
          <div className="border-t border-line">
            {d.faq.items.map((f) => (
              <details key={f.q} className="border-b border-line">
                <summary className="flex min-h-16 items-center justify-between gap-6 py-4 text-[1.0625rem] font-medium">
                  {f.q}
                  <span className="faq-plus shrink-0 text-[1.5rem] leading-none font-light text-braise-ink" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="pb-5 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
