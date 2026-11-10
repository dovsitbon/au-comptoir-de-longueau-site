import site from "@/data/site.json";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { formatDay, formatTime, isoDay } from "@/lib/format";
import { addDays, isOpenDay, parisTime, slotsOn } from "@/lib/hours";

export const SERVICES = ["midi", "soir"] as const;
export type Service = (typeof SERVICES)[number];
export const OCCASIONS = ["none", "family", "birthday", "friends", "company", "other"] as const;
export type Occasion = (typeof OCCASIONS)[number];

export type Booking = {
  date: string;
  service: Service;
  time: string;
  adults: number;
  children: number;
  occasion: Occasion;
  message: string;
  name: string;
  phone: string;
  email: string;
};

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toHhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** Service d'un créneau : midi s'il commence avant data/site.json → reservation.lunchEndsBefore. */
const serviceOf = (start: string): Service => (start < site.reservation.lunchEndsBefore ? "midi" : "soir");

/** Services ouverts un jour donné. */
export const servicesOn = (iso: string): Service[] => SERVICES.filter((s) => slotsOn(iso).some(([a]) => serviceOf(a) === s));

/**
 * Heures d'arrivée proposées pour un jour et un service : toutes les 15 min dans le créneau,
 * jusqu'à 45 min avant la fermeture. Le jour même : rien avant maintenant + 30 min.
 */
export function timesOn(iso: string, service: Service, now?: Date): string[] {
  const { stepMinutes: step, lastSeatingMinutes: last } = site.reservation;
  const floor = now && iso === isoDay(now) ? toMin(parisTime(now)) + 30 : -1;
  return slotsOn(iso)
    .filter(([a]) => serviceOf(a) === service)
    .flatMap(([a, b]) => {
      const out: string[] = [];
      for (let t = toMin(a); t <= toMin(b) - last; t += step) if (t >= floor) out.push(toHhmm(t));
      return out;
    });
}

/** Prochains jours ouverts où il reste une heure d'arrivée possible. */
export function bookableDays(now: Date, count = 90) {
  const out: string[] = [];
  let day = isoDay(now);
  for (let i = 0; i < 150 && out.length < count; i++, day = addDays(day, 1))
    if (isOpenDay(day) && SERVICES.some((s) => timesOn(day, s, now).length)) out.push(day);
  return out;
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const int = (v: unknown, min: number, max: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : min;
};

/** Nettoie une demande reçue côté serveur : null si elle est incomplète ou hors des heures d'ouverture. */
export function parseBooking(v: unknown): Booking | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const b: Booking = {
    date: ISO.test(str(o.date, 10)) ? str(o.date, 10) : "",
    service: (SERVICES as readonly string[]).includes(o.service as string) ? (o.service as Service) : "soir",
    time: str(o.time, 5),
    adults: int(o.adults, 1, site.reservation.maxAdults),
    children: int(o.children, 0, site.reservation.maxChildren),
    occasion: (OCCASIONS as readonly string[]).includes(o.occasion as string) ? (o.occasion as Occasion) : "none",
    message: str(o.message, 1500),
    name: str(o.name, 120),
    phone: str(o.phone, 30),
    email: str(o.email, 160),
  };
  if (!b.date || !b.name || !isPhone(b.phone) || !isEmail(b.email)) return null;
  if (!timesOn(b.date, b.service).includes(b.time)) return null;
  return b;
}

/** Lignes du récapitulatif (e-mails) : [libellé, valeur]. */
export function bookingRows(b: Booking, lang: Locale, d: Dict, withContact = true): [string, string][] {
  const m = d.book.mail;
  const when = `${formatDay(b.date, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}, ${d.book.services[b.service].toLowerCase()}, ${formatTime(b.time, lang)}`;
  const rows: [string, string][] = [
    [m.when, when],
    [m.guests, `${b.adults} ${b.adults > 1 ? m.adults : m.adult}${b.children ? `, ${b.children} ${b.children > 1 ? m.children : m.child}` : ""}`],
  ];
  if (b.occasion !== "none") rows.push([m.occasion, d.book.occasions[b.occasion]]);
  if (withContact) rows.push([m.name, b.name], [m.phone, b.phone], [m.email, b.email]);
  if (b.message) rows.push([m.message, b.message]);
  return rows;
}

/** Lien WhatsApp (vide tant que le restaurant n'a pas donné de portable : data/site.json → whatsapp). */
export const waLink = (text: string) => (site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : "");
