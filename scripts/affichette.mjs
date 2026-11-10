// Affichette A5 imprimable (PDF) avec QR code vers le site, pour l'accueil, les tables ou la vitrine.
//   npm run affichette   →   print/affichette-a5.pdf (+ aperçu print/affichette-a5.png)
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const site = JSON.parse(await readFile(path.join(ROOT, "data/site.json"), "utf8"));
const url = `${site.url}/fr`;

const hex = (h) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const CHARBON = hex("#1A1A1A");
const CREAM = hex("#F7F1E6");
const OR = hex("#C9A14E");
const BRAISE = hex("#A53C14");
const MUTED = hex("#5C554D");

const pdf = await PDFDocument.create();
pdf.setTitle("Au Comptoir de Longueau : affichette A5");
pdf.setAuthor("Au Comptoir de Longueau");
const W = 419.53;
const H = 595.28;
const page = pdf.addPage([W, H]);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
const sans = await pdf.embedFont(StandardFonts.Helvetica);
const center = (text, font, size, y, color = CHARBON, spacing = 0) => {
  const w = font.widthOfTextAtSize(text, size) + spacing * (text.length - 1);
  if (!spacing) return page.drawText(text, { x: (W - w) / 2, y, size, font, color });
  let x = (W - w) / 2;
  for (const ch of text) {
    page.drawText(ch, { x, y, size, font, color });
    x += font.widthOfTextAtSize(ch, size) + spacing;
  }
};

page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: CREAM });

// Bandeau charbon : la flamme et les baguettes, le nom
const bandH = 200;
page.drawRectangle({ x: 0, y: H - bandH, width: W, height: bandH, color: CHARBON });
const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="480" height="480"><g fill="none" stroke-linecap="round" stroke-linejoin="round">
<path d="M24 5.5c1.6 5.4 9.5 9.6 9.5 18.6a9.5 9.5 0 0 1-19 0c0-5 2.6-7.5 4.2-11.2.9 2.6 2.4 4 3.6 4.4-.9-4.1-.2-8.1 1.7-11.8Z" stroke="#E0592A" stroke-width="1.8"/>
<path d="M24 33.6a3.6 3.6 0 0 1-3.6-3.6c0-2.4 1.9-3.7 3.6-6.4 1.7 2.7 3.6 4 3.6 6.4a3.6 3.6 0 0 1-3.6 3.6Z" stroke="#E0592A" stroke-width="1.5"/>
<path d="M7 37.5 41 45M7 45l34-7.5" stroke="#C9A14E" stroke-width="1.8"/></g></svg>`;
const mark = await pdf.embedPng(await sharp(Buffer.from(markSvg)).png().toBuffer());
page.drawImage(mark, { x: (W - 64) / 2, y: H - 92, width: 64, height: 64 });
center("AU COMPTOIR", bold, 30, H - 132, CREAM, 2);
center("DE LONGUEAU", sans, 10, H - 152, OR, 5);
center("BUFFET À VOLONTÉ · GRILL · SUSHIS · FRUITS DE MER", sans, 7.5, H - 178, CREAM, 1.2);

let y = H - bandH - 52;
center("Réservez votre table", bold, 24, y);
y -= 20;
center("formules, prix, horaires et réservation en ligne", sans, 11, y, MUTED);

const qrPng = await QRCode.toBuffer(url, { margin: 0, width: 600, color: { dark: "#1A1A1A", light: "#F7F1E6" }, errorCorrectionLevel: "M" });
const qrS = 118;
y -= 22 + qrS;
page.drawImage(await pdf.embedPng(qrPng), { x: (W - qrS) / 2, y, width: qrS, height: qrS });
y -= 16;
center(url.replace(/^https?:\/\//, ""), sans, 8.5, y, BRAISE);

y -= 22;
page.drawLine({ start: { x: W / 2 - 40, y }, end: { x: W / 2 + 40, y }, thickness: 0.6, color: OR });
y -= 22;
center("Familles, groupes et anniversaires bienvenus", bold, 11, y);
y -= 16;
center("Midi et soir, sur réservation", sans, 10, y, MUTED);
y -= 26;
center(`${site.address.street}, ${site.address.postalCode} ${site.address.city}`, sans, 9.5, y);
y -= 15;
center(`Tél. ${site.phone}`, bold, 11, y, BRAISE);

await mkdir(path.join(ROOT, "print"), { recursive: true });
await writeFile(path.join(ROOT, "print/affichette-a5.pdf"), await pdf.save());
console.log("affichette prête :", url, "· bas du texte à", Math.round(y), "pt");
