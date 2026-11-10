import Link from "next/link";
import site from "@/data/site.json";
import { Logo } from "@/components/Logo";
import { HoursTable } from "@/components/HoursTable";
import { FacebookIcon } from "@/components/icons";
import { fill, type Dict, type Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/pages";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const linkCls = "inline-flex min-h-9 items-center transition-colors hover:text-or";
  const pages = [
    { href: `/${lang}#buffet`, label: d.nav.buffet },
    { href: pagePath("formules", lang), label: d.nav.formules },
    { href: pagePath("buffetAmiens", lang), label: d.pages.buffetAmiens.title },
    { href: pagePath("sushisBoves", lang), label: d.pages.sushisBoves.title },
    { href: pagePath("bonCadeau", lang), label: d.nav.giftCard },
    { href: pagePath("legal", lang), label: d.footer.legal },
  ];
  return (
    <footer className="bg-charbon pb-24 text-cream md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.2fr_1fr_1fr_1.1fr] md:px-10 md:py-20">
        <div>
          <Logo />
          <p className="mt-6 max-w-xs text-[0.9375rem] leading-relaxed text-cream/75">{d.footer.tagline}</p>
          <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="mt-4 -ms-1 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] transition-opacity hover:opacity-70" aria-label={d.nav.facebook}>
            <FacebookIcon />
            Facebook
          </a>
        </div>
        <div className="text-[0.9375rem] leading-relaxed">
          <p className="mb-3 text-or">{d.infos.address}</p>
          <address className="not-italic">
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}
          </address>
          <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-line mt-2 inline-block text-cream/80">
            {d.infos.directions}
          </a>
          <p className="mt-6 mb-2 text-or">{d.infos.phone}</p>
          <a href={`tel:${site.phoneIntl}`} className="link-line tabular-nums">
            {site.phone}
          </a>
        </div>
        <div className="text-[0.9375rem]">
          <p className="mb-2 text-or">{d.footer.explore}</p>
          <ul className="text-cream/85">
            {pages.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className={linkCls}>
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-[0.9375rem] text-or">{d.infos.hours}</p>
          <HoursTable lang={lang} d={d} />
        </div>
      </div>
      <div className="border-t border-cream/10 px-6 py-6 text-center">
        <p className="text-[0.8125rem] text-cream/65">{fill(d.footer.rights, { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
