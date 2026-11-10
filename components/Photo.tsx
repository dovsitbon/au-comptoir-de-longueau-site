import Image from "next/image";
import { LineArt } from "@/components/LineArt";
import { artOf, photoOf, type SlotId } from "@/lib/photos";
import type { Dict } from "@/lib/i18n";

/**
 * Une photo du restaurant si elle a été déposée (assets/<dir>/<id>.jpg puis npm run media),
 * sinon un emplacement crème : dessin au trait, mention « Photo à venir » et le sujet attendu. Jamais d'image de stock.
 * Le parent fixe la taille (aspect-*, h-*) ; ce composant remplit tout l'espace.
 */
export function Photo({ id, d, sizes, priority = false, tone = "light", minimal = false, className = "" }: { id: SlotId; d: Dict; sizes: string; priority?: boolean; tone?: "light" | "dark"; minimal?: boolean; className?: string }) {
  const p = photoOf(id);
  if (p) return <Image src={p.src} alt={d.alt[id]} fill sizes={sizes} priority={priority} quality={75} className={`object-cover ${className}`} />;
  const dark = tone === "dark";
  return (
    <div className={`placeholder absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center ${dark ? "placeholder-dark text-cream/70" : "text-charbon/55"} ${className}`} role="img" aria-label={d.alt[id]}>
      <LineArt art={artOf(id)} className={minimal ? "h-12 w-12" : "h-14 w-14 md:h-16 md:w-16"} />
      {!minimal && (
        <>
          <span className="caps">{d.photo.soon}</span>
          <span className="text-[0.8125rem]">{d.photo.subjects[id]}</span>
        </>
      )}
    </div>
  );
}
