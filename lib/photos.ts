import sizes from "@/data/media-sizes.json";
import photos from "@/data/photos.json";

/**
 * Emplacements photo du site (data/photos.json). Chaque emplacement attend un fichier assets/<dir>/<id>.jpg
 * (vos photos prises sur place) ; `npm run media` le prépare dans public/media/<dir>/<id>.jpg. Tant que le fichier
 * manque, le site affiche un cadre crème avec un dessin au trait et « Photo à venir » (components/Photo.tsx).
 */
export const SLOTS = photos.slots;
export type SlotId = keyof typeof SLOTS;
export type Art = "buffet" | "grill" | "sushi" | "seafood" | "salad" | "pot" | "dessert" | "icecream" | "room" | "cake" | "facade";
export type Img = { src: string; width: number; height: number };

export const artOf = (id: SlotId) => SLOTS[id].art as Art;

/** La photo d'un emplacement si elle a été déposée, sinon null. */
export function photoOf(id: SlotId): Img | null {
  const src = `/media/${SLOTS[id].dir}/${id}.jpg`;
  const s = (sizes as Record<string, number[]>)[src];
  return s ? { src, width: s[0], height: s[1] } : null;
}
