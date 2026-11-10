// Prépare les photos du restaurant pour le web, et l'image de partage (Open Graph).
//   npm run media
//
// 1. Récupère, s'il y en a, les photos Google Maps du dossier Téléchargements (comptoirlongueau_*.jpg) dans assets/raw/.
//    Elles ne sont pas publiées telles quelles : choisissez-les, puis copiez chacune sous le nom de son emplacement.
// 2. Pour chaque emplacement de data/photos.json, cherche assets/<dir>/<id>.jpg (ou .jpeg/.png/.webp),
//    le redimensionne dans public/media/<dir>/<id>.jpg et note ses dimensions dans data/media-sizes.json.
//    next/image sert ensuite AVIF/WebP à la bonne taille, en lazy loading.
// 3. Écrit assets/A-PHOTOGRAPHIER.md : la liste des photos à prendre sur place, cochée au fur et à mesure.
// 4. Génère public/og.jpg (1200 × 630) : la photo du hero si elle existe, sinon le logo sur fond charbon.
import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const { slots } = JSON.parse(await readFile(path.join(ROOT, "data/photos.json"), "utf8"));

// 1. Photos téléchargées
const dl = path.join(os.homedir(), "Downloads");
await mkdir(path.join(ROOT, "assets/raw"), { recursive: true });
if (existsSync(dl)) {
  const found = (await readdir(dl)).filter((f) => /^comptoirlongueau_.*\.(jpe?g|png|webp)$/i.test(f));
  for (const f of found) await copyFile(path.join(dl, f), path.join(ROOT, "assets/raw", f));
  if (found.length) console.log(`${found.length} photo(s) copiée(s) dans assets/raw/`);
}

// 2. Emplacements
const sizes = {};
const todo = [];
for (const [id, s] of Object.entries(slots)) {
  await mkdir(path.join(ROOT, "assets", s.dir), { recursive: true });
  const src = [".jpg", ".jpeg", ".png", ".webp"].map((x) => path.join(ROOT, "assets", s.dir, id + x)).find(existsSync);
  if (!src) {
    todo.push([id, s]);
    continue;
  }
  await mkdir(path.join(ROOT, "public/media", s.dir), { recursive: true });
  const max = id === "hero" ? 2400 : 1600;
  const info = await sharp(src)
    .rotate()
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(ROOT, "public/media", s.dir, `${id}.jpg`));
  sizes[`/media/${s.dir}/${id}.jpg`] = [info.width, info.height];
}
await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");

// 3. Liste des photos à prendre
const lines = [
  "# Photos à prendre sur place",
  "",
  "Généré par `npm run media`. Pour chaque ligne : prenez la photo, enregistrez-la sous le chemin indiqué, relancez `npm run media`.",
  "Uniquement de vraies photos du restaurant (pas d'image de stock ni d'IA). Évitez les visages de clients reconnaissables.",
  "",
  ...Object.entries(slots).map(([id, s]) => `- [${todo.some(([t]) => t === id) ? " " : "x"}] \`assets/${s.dir}/${id}.jpg\` : ${s.shot}`),
  "",
];
await writeFile(path.join(ROOT, "assets/A-PHOTOGRAPHIER.md"), lines.join("\n"));

// 4. Image de partage
const W = 1200;
const H = 630;
const hero = sizes["/media/hero/hero.jpg"] ? path.join(ROOT, "public/media/hero/hero.jpg") : null;
const mark = `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path d="M24 5.5c1.6 5.4 9.5 9.6 9.5 18.6a9.5 9.5 0 0 1-19 0c0-5 2.6-7.5 4.2-11.2.9 2.6 2.4 4 3.6 4.4-.9-4.1-.2-8.1 1.7-11.8Z" stroke="#C2491D" stroke-width="1.6"/>
  <path d="M24 33.6a3.6 3.6 0 0 1-3.6-3.6c0-2.4 1.9-3.7 3.6-6.4 1.7 2.7 3.6 4 3.6 6.4a3.6 3.6 0 0 1-3.6 3.6Z" stroke="#C2491D" stroke-width="1.3"/>
  <path d="M7 37.5 41 45M7 45l34-7.5" stroke="#C9A14E" stroke-width="1.6"/></g>`;
const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  ${hero ? `<rect width="${W}" height="${H}" fill="#1A1A1A" opacity="0.55"/>` : `<g transform="translate(700 40) scale(11.5)" opacity="0.22">${mark}</g>`}
  <g transform="translate(72 88) scale(1.6)">${mark}</g>
  <text x="72" y="236" font-family="Arial, sans-serif" font-size="22" letter-spacing="5" fill="#C9A14E">BUFFET À VOLONTÉ · GRILL · SUSHIS · FRUITS DE MER</text>
  <text x="70" y="330" font-family="'Arial Narrow', Arial, sans-serif" font-weight="bold" font-size="76" fill="#F7F1E6">Tout le choix,</text>
  <text x="70" y="412" font-family="'Arial Narrow', Arial, sans-serif" font-weight="bold" font-size="76" fill="#F7F1E6">à volonté.</text>
  <text x="72" y="500" font-family="Arial, sans-serif" font-weight="bold" font-size="26" letter-spacing="3" fill="#F7F1E6">AU COMPTOIR DE LONGUEAU</text>
  <text x="72" y="540" font-family="Arial, sans-serif" font-size="22" fill="#F7F1E6" opacity="0.75">15 bis rue Michel Strogoff, Boves · près d'Amiens</text>
</svg>`);
const base = hero ? sharp(hero).resize(W, H, { fit: "cover" }) : sharp({ create: { width: W, height: H, channels: 3, background: "#1A1A1A" } });
await base.composite([{ input: text, left: 0, top: 0 }]).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(ROOT, "public/og.jpg"));

console.log(`${Object.keys(sizes).length} photo(s) prête(s), ${todo.length} emplacement(s) en attente (assets/A-PHOTOGRAPHIER.md)`);
