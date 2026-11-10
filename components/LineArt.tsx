import type { Art } from "@/lib/photos";

/**
 * Dessins au trait (sujet de chaque emplacement photo), en attendant les vraies photos.
 * Trait fin, couleur du texte ; la flamme et les accents en rouge braise via `accent`.
 */
const ART: Record<Art, { d: string[]; accent?: string[] }> = {
  buffet: {
    d: ["M8 40h48", "M12 40v-6h40v6", "M16 34c0-6 7-10 16-10s16 4 16 10", "M32 24v-3", "M29 21h6", "M10 46h44", "M14 46v4M50 46v4"],
    accent: ["M24 18c-1.5-2 1.5-3 0-5.5", "M32 16c-1.5-2 1.5-3 0-5.5", "M40 18c-1.5-2 1.5-3 0-5.5"],
  },
  grill: {
    d: ["M10 36h44", "M14 36l4 14M50 36l-4 14", "M18 30h28", "M20 26l6-6M28 26l6-6M36 26l6-6", "M22 30v-4M30 30v-4M38 30v-4"],
    accent: ["M26 16c-2-3 2-4 0-7", "M34 15c-2-3 2-4 0-7", "M42 16c-2-3 2-4 0-7"],
  },
  sushi: {
    d: ["M14 44a8 4 0 0 0 16 0v-8a8 4 0 0 0-16 0Z", "M14 36a8 4 0 0 0 16 0", "M34 44a8 4 0 0 0 16 0v-8a8 4 0 0 0-16 0Z", "M34 36a8 4 0 0 0 16 0", "M10 50h44", "M12 14 52 26", "M14 10l40 18"],
    accent: ["M22 36a2 1 0 0 0 0-2", "M42 36a2 1 0 0 0 0-2"],
  },
  seafood: {
    d: ["M14 40c4-12 18-18 30-12 6 3 8 9 6 14", "M14 40c6 4 18 6 26 2", "M44 28l8-10M46 30l10-6", "M22 34l2 4M28 31l2 5M34 30l1 6", "M10 50h44"],
    accent: ["M50 42a3 3 0 1 1-6 0"],
  },
  salad: {
    d: ["M10 32h44", "M12 32a20 14 0 0 0 40 0", "M26 46h12", "M20 32c0-6 4-9 8-9", "M30 32c0-7 6-10 10-8", "M38 32c1-4 4-6 7-5"],
    accent: ["M22 26a3 3 0 1 1 0.1 0"],
  },
  pot: {
    d: ["M14 30h36v12a8 8 0 0 1-8 8H22a8 8 0 0 1-8-8Z", "M10 30h44", "M22 26h20", "M30 26v-3h4v3", "M14 34h-4M50 34h4"],
    accent: ["M24 19c-2-3 2-4 0-7", "M32 18c-2-3 2-4 0-7", "M40 19c-2-3 2-4 0-7"],
  },
  dessert: {
    d: ["M12 44h40", "M16 44V30h32v14", "M16 36h32", "M20 30c0-4 3-6 6-6h12c3 0 6 2 6 6", "M10 50h44"],
    accent: ["M32 24v-6", "M32 18c-1.2-1.4 0-3 0-4 0 1 1.2 2.6 0 4Z"],
  },
  icecream: {
    d: ["M22 30l10 22 10-22", "M22 30h20", "M24 30a8 8 0 0 1 16 0", "M26 22a6 6 0 0 1 12 0", "M26 36l12 8M28 42l8-6"],
    accent: ["M32 14a2 2 0 1 1-.1 0"],
  },
  room: {
    d: ["M8 50h48", "M12 50V22h40v28", "M12 22l20-10 20 10", "M18 42h10M36 42h10", "M23 42v8M41 42v8", "M18 30h8v6h-8zM38 30h8v6h-8z"],
    accent: ["M32 30v4"],
  },
  cake: {
    d: ["M14 46h36", "M16 46V34h32v12", "M16 40c4 3 8 3 12 0s8-3 12 0 6 2 8 0", "M10 52h44", "M24 34v-6M32 34v-6M40 34v-6"],
    accent: ["M24 28c-1.2-1.4 0-3 0-4 0 1 1.2 2.6 0 4Z", "M32 28c-1.2-1.4 0-3 0-4 0 1 1.2 2.6 0 4Z", "M40 28c-1.2-1.4 0-3 0-4 0 1 1.2 2.6 0 4Z"],
  },
  facade: {
    d: ["M8 52h48", "M12 52V24h40v28", "M10 24h44v-8H10Z", "M26 52V38h12v14", "M16 32h6v8h-6zM42 32h6v8h-6z"],
    accent: ["M22 20h20"],
  },
};

export function LineArt({ art, className = "h-16 w-16", accent = "#C2491D" }: { art: Art; className?: string; accent?: string }) {
  const a = ART[art];
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {a.d.map((p) => (
        <path key={p} d={p} />
      ))}
      {a.accent?.map((p) => (
        <path key={p} d={p} stroke={accent} />
      ))}
    </svg>
  );
}
