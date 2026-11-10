import site from "@/data/site.json";
import formules from "@/data/formules.json";
import { getDict, locales, type Dict, type Locale } from "@/lib/i18n";
import { weekHours } from "@/lib/hours";
import { pagePath, type PageId } from "@/lib/pages";

const BUSINESS = `${site.url}/#restaurant`;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
type Formule = { id: keyof Dict["formules"]["items"]; price: number | null };

function offers(lang: Locale) {
  const d = getDict(lang);
  return (formules.items as Formule[])
    .filter((f) => f.price !== null)
    .map((f) => ({ "@type": "Offer", name: d.formules.items[f.id].name, description: d.formules.items[f.id].when, price: f.price!.toFixed(2), priceCurrency: "EUR" }));
}

function restaurant(lang: Locale) {
  const d = getDict(lang);
  return {
    "@type": "Restaurant",
    "@id": BUSINESS,
    name: site.name,
    description: d.meta.description,
    url: `${site.url}/${lang}`,
    image: [`${site.url}/og.jpg`],
    logo: `${site.url}/logo.svg`,
    telephone: site.phoneIntl,
    priceRange: "€€",
    servesCuisine: ["Buffet", "Grill", "Sushi", "Fruits de mer"],
    address: { "@type": "PostalAddress", streetAddress: site.address.street, postalCode: site.address.postalCode, addressLocality: site.address.city, addressRegion: site.address.region, addressCountry: site.address.country },
    areaServed: ["Boves", "Longueau", "Amiens", "Camon", "Rivery", "Cagny"],
    hasMap: site.mapsUrl,
    openingHoursSpecification: weekHours().flatMap((slots, i) => slots.map(([opens, closes]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${DAYS[i]}`, opens, closes }))),
    // Note Google relevée à la main (data/site.json → rating.checked) : à mettre à jour de temps en temps
    aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count, bestRating: 5, worstRating: 1, dateModified: site.rating.checked },
    acceptsReservations: true,
    makesOffer: offers(lang),
    sameAs: [site.facebook],
    potentialAction: { "@type": "ReserveAction", target: { "@type": "EntryPoint", urlTemplate: `${site.url}/${lang}#reserver`, inLanguage: lang }, result: { "@type": "FoodEstablishmentReservation", name: d.book.title } },
    knowsLanguage: ["fr", "en"],
  };
}

/** Données structurées de l'accueil : Restaurant (horaires, note Google datée, offres, réservation) et FAQ. */
export function homeJsonLd(lang: Locale) {
  const d = getDict(lang);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.name, inLanguage: [...locales], publisher: { "@id": BUSINESS } },
      restaurant(lang),
      { "@type": "FAQPage", mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
}

/** Données structurées d'une page secondaire, avec fil d'Ariane. */
export function pageJsonLd(lang: Locale, id: PageId) {
  const d = getDict(lang);
  const url = `${site.url}${pagePath(id, lang)}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      restaurant(lang),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: `${site.url}/${lang}` },
          { "@type": "ListItem", position: 2, name: d.pages[id].title, item: url },
        ],
      },
    ],
  };
}
