// Génère CONTENU.md : tous les textes du site (fr, en), les formules et les prix, pour validation.
//   npm run contenu
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const load = async (f) => JSON.parse(await readFile(path.join(ROOT, f), "utf8"));
const L = { fr: await load("locales/fr.json"), en: await load("locales/en.json") };
const formules = await load("data/formules.json");
const horaires = await load("data/horaires.json");
const annonces = await load("data/annonces.json");
const site = await load("data/site.json");

const out = [];
const p = (s = "") => out.push(s);
const eur = (n, from) => (n === null ? "**à remplir** (affiché « Tarif sur demande »)" : `${from ? "à partir de " : ""}${n.toFixed(2).replace(".", ",")} €`);

p("# Au Comptoir de Longueau : contenu du site, pour validation");
p();
p("Tous les textes en français et en anglais, les formules et les prix. Les points **À VALIDER** sont des hypothèses à confirmer avec le restaurant.");
p("Fichier généré par `npm run contenu` à partir de `locales/*.json` et `data/*.json` : modifiez ces fichiers, pas celui-ci.");
p();
p("## Grand titre du hero : 3 options");
p();
p(`1. **${L.fr.hero.title}** (en ligne) · EN : ${L.en.hero.title}`);
p("2. Grill, sushis et fruits de mer, sans compter. · EN : Grill, sushi and seafood, no counting.");
p("3. Le grand buffet des familles. · EN : The big family buffet.");
p();
p("Pour changer : `locales/fr.json` et `locales/en.json` → `hero.title`.");
p();
p("## À valider en priorité");
p();
p("- **Prix** : relevés sur une photo de la carte publiée sur la fiche Google (date inconnue) : midi semaine 18,90 €, soir et week-end 25,90 €, enfant -10 ans 12,90 €. D'autres photos montrent des prix plus anciens (17,90 / 24,90 / 9,99 €).");
p("- **Tarif enfant** : moins de 10 ans, sur pièce d'identité. Gratuit pour les moins de 3 ans (vu sur une ancienne carte) ?");
p("- **Horaires** : 12 h – 14 h 30 et 19 h – 22 h, 7 j/7 (flyer du restaurant). La fermeture à 22 h 30 vendredi et samedi est une hypothèse.");
p("- **Midi en semaine** : « du lundi au vendredi » supposé ; **week-end** : « samedi, dimanche et jours fériés, midi et soir » supposé.");
p("- **Enseigne** : le restaurant fait partie du réseau « Au Comptoir » (Rivery, Beauvais… vu sur la carte). Un site d'enseigne existe-t-il ?");
p("- **Photos** : 4 réelles (fiche Google) + 7 d'illustration : voir PHOTOS-SOURCES.md.");
p("- **Boissons en supplément**, **chaises hautes**, **grand parking gratuit**, **sauce soja, gingembre, wasabi** : ajoutés sans source, à confirmer.");
p("- **Moyens de paiement** : CB et espèces annoncés ; titres-restaurant et Chèques-Vacances « à demander » (le restaurant figure dans une liste ANCV Chèque-Vacances Connect, à vérifier).");
p("- **Groupes** : rappel du restaurant à partir de 10 personnes (data/site.json → reservation.groupFrom).");
p("- **Bon cadeau** : page prévue (sur place, sans paiement en ligne) : le restaurant en propose-t-il ?");
p("- **Avis** : aucun avis recopié. Section prête dans `data/avis.json` (avec l'accord du restaurant).");
p("- **Logo** : logo typographique provisoire (flamme + baguettes), à remplacer si l'enseigne a un vrai logo.");
p();
p("## Formules et prix (data/formules.json)");
p();
p("| Formule | Quand | Prix / pers. | English |");
p("|---|---|---|---|");
for (const f of formules.items) p(`| ${L.fr.formules.items[f.id].name} | ${L.fr.formules.items[f.id].when} | ${eur(f.price, f.from)} | ${L.en.formules.items[f.id].name} |`);
p();
p(`_${L.fr.formules.note}_`);
p();
p("## Horaires (data/horaires.json)");
p();
for (let i = 1; i <= 7; i++) {
  const s = horaires.week[String(i)];
  p(`- ${L.fr.infos.days[i - 1]} : ${s.length ? s.map(([a, b]) => `${a} – ${b}`).join(", ") : "fermé"}`);
}
p();
p("## Bandeau d'annonces (data/annonces.json)");
p();
for (const a of [...annonces.items, annonces.default]) {
  p(`- **${a.id}**${a.from ? ` (${a.from} → ${a.to})` : " (par défaut)"}${a.active === false ? " · désactivée" : ""}`);
  p(`  - fr : ${a.fr}`);
  p(`  - en : ${a.en}`);
}
p();
p(`## Coordonnées (data/site.json)`);
p();
p(`- ${site.address.street}, ${site.address.postalCode} ${site.address.city} · ${site.phone}`);
p(`- Note Google : ${site.rating.value} sur plus de ${site.rating.countLabel} avis (relevée le ${site.rating.checked})`);
p(`- E-mail : ${site.email || "**à remplir**"} · WhatsApp : ${site.whatsapp || "aucun (ligne fixe)"}`);
p();

const SKIP = new Set(["alt", "photo"]);
const get = (o, key) => key.split(".").reduce((x, k) => (x == null ? "" : x[k]), o) ?? "";
function walk(obj, key) {
  if (SKIP.has(key)) return;
  if (typeof obj === "string") {
    p(`- \`${key}\``);
    for (const l of ["fr", "en"]) p(`  - ${l} : ${get(L[l], key)}`);
    return;
  }
  if (Array.isArray(obj)) return obj.forEach((v, i) => walk(v, `${key}.${i}`));
  for (const k of Object.keys(obj)) walk(obj[k], key ? `${key}.${k}` : k);
}
p("## Tous les textes du site");
for (const section of Object.keys(L.fr)) {
  if (SKIP.has(section)) continue;
  p();
  p(`### ${section}`);
  p();
  walk(L.fr[section], section);
}
p();
p("## Textes alternatifs des photos");
p();
for (const k of Object.keys(L.fr.alt)) p(`- \`${k}\` · fr : ${L.fr.alt[k]} · en : ${L.en.alt[k]}`);

await writeFile(path.join(ROOT, "CONTENU.md"), out.join("\n") + "\n");
console.log("CONTENU.md :", out.length, "lignes");
