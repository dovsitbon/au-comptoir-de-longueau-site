import type { Locale } from "@/lib/locales";

// Pages secondaires et leurs adresses dans chaque langue
export const PAGE_IDS = ["formules", "buffetAmiens", "sushisBoves", "bonCadeau", "legal"] as const;
export type PageId = (typeof PAGE_IDS)[number];

export const SLUGS: Record<PageId, Record<Locale, string>> = {
  formules: { fr: "formules-et-prix", en: "prices" },
  buffetAmiens: { fr: "buffet-a-volonte-amiens", en: "all-you-can-eat-buffet-amiens" },
  sushisBoves: { fr: "sushis-a-volonte-boves", en: "all-you-can-eat-sushi-boves" },
  bonCadeau: { fr: "bon-cadeau", en: "gift-voucher" },
  legal: { fr: "mentions-legales", en: "legal" },
};

export const pagePath = (id: PageId, lang: Locale) => `/${lang}/${SLUGS[id][lang]}`;

export const pageOfSlug = (slug: string, lang: Locale) => PAGE_IDS.find((id) => SLUGS[id][lang] === slug) ?? null;
