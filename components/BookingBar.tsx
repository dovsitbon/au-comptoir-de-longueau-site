"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/components/providers";
import { formatDay } from "@/lib/format";
import { useMounted } from "@/lib/useMounted";
import { bookableDays, SERVICES, servicesOn, type Service } from "@/lib/reservation";

export type Prefill = { date?: string; service?: Service; adults?: number };
export const PREFILL_EVENT = "comptoir:prefill";

/** Va au formulaire de réservation (#reserver) en le pré-remplissant, sans recharger si l'on est déjà sur l'accueil. */
export function useGoBook() {
  const { lang } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  return (p: Prefill) => {
    if (pathname === `/${lang}`) {
      window.dispatchEvent(new CustomEvent<Prefill>(PREFILL_EVENT, { detail: p }));
      const el = document.getElementById("reserver");
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
      if (el) {
        if (lenis) lenis.scrollTo(el, { offset: -72 });
        else el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    const q = new URLSearchParams();
    if (p.date) q.set("date", p.date);
    if (p.service) q.set("service", p.service);
    if (p.adults) q.set("adults", String(p.adults));
    router.push(`/${lang}${q.size ? `?${q}` : ""}#reserver`);
  };
}

/** Lien « Réserver » qui pré-remplit le service choisi. */
export function BookLink({ service, className = "", children }: { service?: Service; className?: string; children: ReactNode }) {
  const { lang } = useLocale();
  const go = useGoBook();
  return (
    <a
      href={`/${lang}${service ? `?service=${service}` : ""}#reserver`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        go({ service });
      }}
    >
      {children}
    </a>
  );
}

/**
 * Barre de réservation compacte (date, service, nombre de personnes), sous le hero.
 * « Continuer » pré-remplit le formulaire complet (#reserver) et y descend.
 */
export function BookingBar({ className = "" }: { className?: string }) {
  const { lang, d } = useLocale();
  const mounted = useMounted();
  const days = useMemo(() => (mounted ? bookableDays(new Date(), 45) : []), [mounted]);
  const [date, setDate] = useState("");
  const [rawService, setService] = useState<Service>("soir");
  const [adults, setAdults] = useState(2);
  const open = date ? servicesOn(date) : [...SERVICES];
  const service = open.includes(rawService) ? rawService : (open[0] ?? rawService);

  const go = useGoBook();
  function submit(e: FormEvent) {
    e.preventDefault();
    go({ date: date || undefined, service, adults });
  }

  const cell = "flex min-w-0 flex-1 flex-col justify-center px-4 py-2 md:px-5";
  return (
    <form onSubmit={submit} aria-label={d.bar.label} className={`flex flex-col overflow-hidden rounded-2xl border border-line bg-white text-charbon shadow-[0_18px_40px_-28px_rgba(26,26,26,0.45)] sm:flex-row sm:items-stretch ${className}`}>
      <label className={`${cell} border-b border-line sm:border-e sm:border-b-0`}>
        <span className="text-[0.75rem] text-muted">{d.bar.date}</span>
        <select className="bar-field" value={date} onChange={(e) => setDate(e.target.value)}>
          <option value="">{d.bar.anyDate}</option>
          {days.map((day) => (
            <option key={day} value={day}>
              {formatDay(day, lang, { weekday: "short", day: "numeric", month: "short" })}
            </option>
          ))}
        </select>
      </label>
      <label className={`${cell} border-b border-line sm:border-e sm:border-b-0`}>
        <span className="text-[0.75rem] text-muted">{d.bar.service}</span>
        <select className="bar-field" value={service} onChange={(e) => setService(e.target.value as Service)}>
          {SERVICES.map((s) => (
            <option key={s} value={s} disabled={!open.includes(s)}>
              {d.book.services[s]}
            </option>
          ))}
        </select>
      </label>
      <label className={`${cell} border-b border-line sm:border-b-0`}>
        <span className="text-[0.75rem] text-muted">{d.bar.guests}</span>
        <select className="bar-field tabular-nums" value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <div className="p-2">
        <button type="submit" className="btn h-full w-full !rounded-xl sm:w-auto">
          {d.bar.submit}
        </button>
      </div>
    </form>
  );
}
