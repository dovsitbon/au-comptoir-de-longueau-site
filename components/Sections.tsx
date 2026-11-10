import { BookLink } from "@/components/BookingBar";
import site from "@/data/site.json";
import formules from "@/data/formules.json";
import { fill, type Dict, type Locale } from "@/lib/i18n";
import { price } from "@/lib/format";
import { CheckIcon, StarIcon } from "@/components/icons";

export function Stars({ className = "text-or" }: { className?: string }) {
  return (
    <span className={`flex ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} className={`h-3.5 w-3.5 ${i === 4 ? "opacity-35" : ""}`} />
      ))}
    </span>
  );
}

/** Note Google (data/site.json → rating), lien vers les avis. */
export function Rating({ d, lang, className = "" }: { d: Dict; lang: Locale; className?: string }) {
  return (
    <a href={site.reviewsUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-6 items-center gap-2 transition-opacity hover:opacity-80 ${className}`}>
      <Stars />
      <span>
        {fill(d.hero.rating, { value: site.rating.value.toLocaleString(lang === "en" ? "en-GB" : "fr-FR", { minimumFractionDigits: 1 }) })} · {fill(d.hero.ratingCount, { count: site.rating.countLabel })}
      </span>
    </a>
  );
}

export function SectionHead({ eyebrow, title, lead, center = false, id, as: H = "h2" }: { eyebrow: string; title: string; lead?: string; center?: boolean; id?: string; as?: "h1" | "h2" }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <H id={id} className="display mt-3 text-[2.25rem] md:text-[3.25rem]">
        {title}
      </H>
      {lead && <p className="lead mt-4">{lead}</p>}
    </div>
  );
}

type Formule = { id: keyof Dict["formules"]["items"]; price: number | null; from: boolean; highlight: boolean };
const SERVICE_OF: Partial<Record<Formule["id"], "midi" | "soir">> = { midi: "midi", soir: "soir" };

/** Les 4 formules côte à côte, prix en texte HTML (data/formules.json). */
export function FormulesGrid({ d, lang, headingLevel = 3 }: { d: Dict; lang: Locale; headingLevel?: 2 | 3 }) {
  const f = d.formules;
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <>
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(formules.items as Formule[]).map((it) => {
          const t = f.items[it.id];
          const dark = it.highlight;
          const service = SERVICE_OF[it.id];
          return (
            <li key={it.id} className={`relative flex flex-col rounded-3xl p-7 md:p-8 ${dark ? "bg-charbon text-cream" : "border border-line bg-white"}`}>
              {dark && <span className="caps absolute end-6 top-7 text-or">{f.popular}</span>}
              <H className="display text-[1.5rem]">{t.name}</H>
              <p className={`mt-1 text-[0.9375rem] ${dark ? "text-cream/70" : "text-muted"}`}>{t.when}</p>
              <p className="mt-7 flex flex-wrap items-baseline gap-x-2">
                {it.price === null ? (
                  <span className="display text-[1.75rem]">{f.onRequest}</span>
                ) : (
                  <>
                    {it.from && <span className={`text-[0.9375rem] ${dark ? "text-cream/70" : "text-muted"}`}>{f.from}</span>}
                    <span className="price">{price(it.price, lang)}</span>
                  </>
                )}
              </p>
              <p className={`text-[0.875rem] ${dark ? "text-cream/70" : "text-muted"}`}>{f.perPerson}</p>
              <ul className={`mt-6 flex-1 space-y-2.5 border-t pt-6 text-[0.9375rem] ${dark ? "border-cream/15" : "border-line"}`}>
                {t.points.map((p) => (
                  <li key={p} className="flex gap-2.5">
                    <CheckIcon className={`mt-1 h-4 w-4 shrink-0 ${dark ? "text-or" : "text-braise-ink"}`} />
                    {p}
                  </li>
                ))}
              </ul>
              <BookLink service={service} className={`mt-8 ${dark ? "btn" : "btn-line"}`}>
                {f.cta}
              </BookLink>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-[0.8125rem] text-muted">{f.note}</p>
    </>
  );
}
