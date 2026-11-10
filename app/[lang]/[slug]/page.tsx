import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import site from "@/data/site.json";
import { getDict, isLocale, locales, type Dict, type Locale } from "@/lib/i18n";
import { PAGE_IDS, pageOfSlug, pagePath, SLUGS, type PageId } from "@/lib/pages";
import { pageJsonLd } from "@/lib/jsonld";
import { OpenStatus } from "@/components/OpenStatus";
import { BookLink } from "@/components/BookingBar";
import { Photo } from "@/components/Photo";
import { FormulesGrid, Rating } from "@/components/Sections";
import { GiftIcon, PhoneIcon } from "@/components/icons";
import type { SlotId } from "@/lib/photos";

export function generateStaticParams() {
  return locales.flatMap((lang) => PAGE_IDS.map((id) => ({ lang, slug: SLUGS[id][lang] })));
}
export const dynamicParams = false;

function resolve(lang: string, slug: string): { lang: Locale; id: PageId } | null {
  if (!isLocale(lang)) return null;
  const id = pageOfSlug(slug, lang);
  return id ? { lang, id } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { lang: l, slug } = await params;
  const r = resolve(l, slug);
  if (!r) return {};
  const d = getDict(r.lang);
  const p = d.pages[r.id];
  const description = "metaDescription" in p ? p.metaDescription : d.meta.description;
  return {
    title: p.metaTitle,
    description,
    alternates: {
      canonical: pagePath(r.id, r.lang),
      languages: { ...Object.fromEntries(locales.map((x) => [x, pagePath(r.id, x)])), "x-default": pagePath(r.id, "fr") },
    },
    openGraph: { title: p.metaTitle, description, url: pagePath(r.id, r.lang), images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
    robots: r.id === "legal" ? { index: false, follow: true } : undefined,
  };
}

function Actions({ d, lang }: { d: Dict; lang: Locale }) {
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <BookLink className="btn">{d.nav.bookCta}</BookLink>
        <a href={`tel:${site.phoneIntl}`} className="btn-line">
          <PhoneIcon />
          <span className="tabular-nums">{site.phone}</span>
        </a>
      </div>
      <div className="mt-5 flex flex-col gap-1.5 text-[0.9375rem] text-muted sm:flex-row sm:gap-6">
        <Rating d={d} lang={lang} />
        <OpenStatus />
      </div>
    </>
  );
}

function Formules({ lang, d }: { lang: Locale; d: Dict }) {
  const p = d.pages.formules;
  return (
    <div className="px-6 pt-14 pb-24 md:px-10 md:pt-20 md:pb-32">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-2xl">
          <p className="eyebrow">{d.formules.eyebrow}</p>
          <h1 className="display mt-3 text-[2.75rem] md:text-[4rem]">{p.title}</h1>
          <p className="lead mt-4">{p.lead}</p>
        </header>
        <div className="mt-12">
          <FormulesGrid d={d} lang={lang} headingLevel={2} />
        </div>
        <section className="mt-20 grid gap-8 rounded-3xl bg-cream-deep p-8 md:grid-cols-[1.4fr_1fr] md:p-12">
          <div>
            <h2 className="display text-[2rem]">{p.groupsTitle}</h2>
            <p className="lead mt-3 max-w-xl">{p.groupsText}</p>
          </div>
          <div className="self-end">
            <Actions d={d} lang={lang} />
          </div>
        </section>
      </div>
    </div>
  );
}

function SeoPage({ lang, d, id, photos }: { lang: Locale; d: Dict; id: "buffetAmiens" | "sushisBoves"; photos: [SlotId, SlotId] }) {
  const p = d.pages[id];
  const other = id === "buffetAmiens" ? "sushisBoves" : "buffetAmiens";
  return (
    <div className="px-6 pt-14 pb-24 md:px-10 md:pt-20 md:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <header>
            <p className="eyebrow">{p.eyebrow}</p>
            <h1 className="display mt-3 text-[2.75rem] md:text-[4.25rem]">{p.title}</h1>
            {p.intro.map((t) => (
              <p key={t} className="lead mt-5 max-w-xl">
                {t}
              </p>
            ))}
            <div className="mt-8">
              <Actions d={d} lang={lang} />
            </div>
          </header>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white">
            <Photo id={photos[0]} d={d} sizes="(min-width: 768px) 40vw, 100vw" priority />
          </div>
        </div>

        <div className="mt-20 grid gap-x-16 gap-y-12 md:grid-cols-2">
          {p.sections.map((s) => (
            <section key={s.title} className="border-t border-line pt-6">
              <h2 className="display text-[1.75rem]">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
            </section>
          ))}
        </div>

        <div className="relative mt-16 aspect-[21/9] overflow-hidden rounded-3xl bg-white">
          <Photo id={photos[1]} d={d} sizes="100vw" />
        </div>

        <section className="mt-20">
          <h2 className="display text-[2rem] md:text-[2.5rem]">{d.formules.title}</h2>
          <div className="mt-8">
            <FormulesGrid d={d} lang={lang} />
          </div>
        </section>

        <p className="mt-14 text-[0.9375rem]">
          <Link href={pagePath(other, lang)} className="link-line">
            {d.pages[other].title}
          </Link>
        </p>
      </div>
    </div>
  );
}

function BonCadeau({ d, lang }: { d: Dict; lang: Locale }) {
  const p = d.pages.bonCadeau;
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <GiftIcon className="h-10 w-10 text-or-ink" />
      <h1 className="display mt-6 text-[2.75rem] md:text-[3.75rem]">{p.title}</h1>
      <p className="lead mt-5">{p.lead}</p>
      {p.text.map((t) => (
        <p key={t} className="mt-4 leading-relaxed">
          {t}
        </p>
      ))}
      <a href={`tel:${site.phoneIntl}`} className="btn mt-10">
        <PhoneIcon />
        {p.cta} · <span className="tabular-nums">{site.phone}</span>
      </a>
      <p className="mt-6">
        <Link href={pagePath("formules", lang)} className="link-line text-[0.9375rem]">
          {d.formules.seeAll}
        </Link>
      </p>
    </div>
  );
}

function Legal({ d }: { d: Dict }) {
  const p = d.pages.legal;
  const pending = <em className="text-braise-ink not-italic">{p.pending}</em>;
  const blocks: [string, React.ReactNode][] = [
    [p.editor, p.editorText],
    [p.company, site.legal.company || pending],
    [p.siret, site.legal.siret || pending],
    [p.director, site.legal.director || pending],
    [p.host, site.legal.host],
    [p.data, p.dataText],
    [p.cookies, p.cookiesText],
    [p.photos, p.photosText],
  ];
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="display text-[2.75rem] md:text-[3.5rem]">{p.title}</h1>
      {blocks.map(([title, body]) => (
        <section key={title} className="mt-10">
          <h2 className="font-medium">{title}</h2>
          <p className="mt-2 leading-relaxed text-muted">{body}</p>
        </section>
      ))}
    </div>
  );
}

export default async function Page({ params }: PageProps<"/[lang]/[slug]">) {
  const { lang: l, slug } = await params;
  const r = resolve(l, slug);
  if (!r) notFound();
  const d = getDict(r.lang);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd(r.lang, r.id)) }} />
      {r.id === "formules" && <Formules lang={r.lang} d={d} />}
      {r.id === "buffetAmiens" && <SeoPage lang={r.lang} d={d} id="buffetAmiens" photos={["salle", "grill"]} />}
      {r.id === "sushisBoves" && <SeoPage lang={r.lang} d={d} id="sushisBoves" photos={["sushis", "fruits-de-mer"]} />}
      {r.id === "bonCadeau" && <BonCadeau d={d} lang={r.lang} />}
      {r.id === "legal" && <Legal d={d} />}
    </>
  );
}
