"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import site from "@/data/site.json";
import { CheckIcon, PhoneIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { PREFILL_EVENT, type Prefill } from "@/components/BookingBar";
import { fill } from "@/lib/i18n";
import { formatDay, formatTime } from "@/lib/format";
import { useMounted } from "@/lib/useMounted";
import { bookableDays, isEmail, isPhone, OCCASIONS, SERVICES, servicesOn, timesOn, type Occasion, type Service } from "@/lib/reservation";

type Errors = Partial<Record<"date" | "time" | "name" | "phone" | "email", string>>;

/**
 * Demande de réservation : date (jours d'ouverture), service (midi / soir), heure d'arrivée (dans le service),
 * adultes, enfants, occasion, coordonnées, message. Envoi via /api/reservation (Resend) : notification au restaurant
 * et confirmation au client. Sans Resend configuré, le client est invité à appeler : aucune demande ne se perd en silence.
 */
export function BookingForm() {
  const { lang, d } = useLocale();
  const b = d.book;
  const { groupFrom, maxAdults, maxChildren } = site.reservation;
  const mounted = useMounted();
  const now = useMemo(() => (mounted ? new Date() : null), [mounted]);
  const days = useMemo(() => (now ? bookableDays(now) : []), [now]);

  const [date, setDate] = useState("");
  const [rawService, setService] = useState<Service>("soir");
  const [rawTime, setTime] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [occasion, setOccasion] = useState<Occasion>("none");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [done, setDone] = useState<null | { notified: boolean; confirmed: boolean; when: string; name: string; guests: string }>(null);

  // Pré-remplissage depuis la barre de réservation (même page : événement ; autre page : paramètres d'URL)
  useEffect(() => {
    const apply = (p: Prefill) => {
      if (p.date) setDate(p.date);
      if (p.service) setService(p.service);
      if (p.adults) setAdults(Math.min(Math.max(p.adults, 1), maxAdults));
    };
    const q = new URLSearchParams(window.location.search);
    if (q.has("service") || q.has("date")) {
      const s = q.get("service");
      apply({ date: q.get("date") ?? undefined, service: s === "midi" || s === "soir" ? s : undefined, adults: Number(q.get("adults")) || undefined });
    }
    const on = (e: Event) => apply((e as CustomEvent<Prefill>).detail);
    window.addEventListener(PREFILL_EVENT, on);
    return () => window.removeEventListener(PREFILL_EVENT, on);
  }, [maxAdults]);

  const open = date ? servicesOn(date) : [...SERVICES];
  const service = open.includes(rawService) ? rawService : (open[0] ?? rawService);
  const times = useMemo(() => (date && now ? timesOn(date, service, now) : []), [date, service, now]);
  const time = times.includes(rawTime) ? rawTime : "";
  const total = adults + children;

  async function submit(e: FormEvent) {
    e.preventDefault();
    const err: Errors = {};
    if (!date || !days.includes(date)) err.date = b.errors.date;
    if (!time) err.time = b.errors.time;
    if (!name.trim()) err.name = b.errors.name;
    if (!isPhone(phone)) err.phone = b.errors.phone;
    if (!isEmail(email)) err.email = b.errors.email;
    setErrors(err);
    if (Object.keys(err).length) {
      document.getElementById(`bk-${Object.keys(err)[0]}`)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lang, booking: { date, service, time, adults, children, occasion, message, name, phone, email } }),
      });
      const json = (await res.json()) as { ok: boolean; notified?: boolean; confirmed?: boolean };
      if (!res.ok || !json.ok) throw new Error("server");
      const m = b.mail;
      const and = lang === "fr" ? "et" : "and";
      const guests = `${adults} ${adults > 1 ? m.adults : m.adult}${children ? ` ${and} ${children} ${children > 1 ? m.children : m.child}` : ""}`;
      setDone({ notified: !!json.notified, confirmed: !!json.confirmed, name: name.trim(), guests, when: `${formatDay(date, lang)}, ${formatTime(time, lang)}` });
      setState("idle");
    } catch {
      setState("error");
    }
  }

  if (done)
    return (
      <div className="fade-in rounded-3xl border border-line bg-white p-6 md:p-10" role="status" aria-live="polite">
        <span className="flex size-11 items-center justify-center rounded-full bg-vert text-cream">
          <CheckIcon className="h-5 w-5" />
        </span>
        <h3 className="display mt-5 text-[1.75rem]">{b.done.title}</h3>
        <p className="lead mt-3">{fill(b.done.text, { name: done.name, guests: done.guests, when: done.when })}</p>
        <p className="mt-3 text-muted">{done.notified ? (done.confirmed ? b.done.mail : "") : b.done.notSent}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {!done.notified && (
            <a href={`tel:${site.phoneIntl}`} className="btn">
              <PhoneIcon />
              {d.nav.call} · <span className="tabular-nums">{site.phone}</span>
            </a>
          )}
          <button type="button" className="btn-line" onClick={() => setDone(null)}>
            {b.done.again}
          </button>
        </div>
      </div>
    );

  const fieldErr = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`bk-${k}-err`} className="mt-1.5 text-[0.875rem] text-braise-ink">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Errors) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `bk-${k}-err` : undefined });
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => i + from);

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl border border-line bg-white p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="bk-date" className="label">
            {b.date}
          </label>
          <select id="bk-date" className="field" value={date} onChange={(e) => setDate(e.target.value)} {...aria("date")}>
            <option value="">{b.chooseDate}</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {formatDay(day, lang)}
              </option>
            ))}
          </select>
          {fieldErr("date")}
        </div>
        <fieldset>
          <legend className="label">{b.service}</legend>
          <div className="flex gap-2">
            {SERVICES.map((s) => (
              <label key={s} className={`seg flex-1 ${open.includes(s) ? "" : "pointer-events-none opacity-40"}`}>
                <input type="radio" name="service" className="sr-only" checked={service === s} disabled={!open.includes(s)} onChange={() => setService(s)} />
                {b.services[s]}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="sm:col-span-2">
          <label htmlFor="bk-time" className="label">
            {b.time}
          </label>
          <select id="bk-time" className="field tabular-nums" value={time} onChange={(e) => setTime(e.target.value)} disabled={!date} {...aria("time")}>
            <option value="">{b.chooseTime}</option>
            {times.map((t) => (
              <option key={t} value={t}>
                {formatTime(t, lang)}
              </option>
            ))}
          </select>
          {date && !times.length && <p className="mt-1.5 text-[0.875rem] text-muted">{b.noTimes}</p>}
          {fieldErr("time")}
        </div>
        <div>
          <label htmlFor="bk-adults" className="label">
            {b.adults}
          </label>
          <select id="bk-adults" className="field tabular-nums" value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
            {range(1, maxAdults).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bk-children" className="label">
            {b.children} <span className="opacity-80">({b.childrenHint})</span>
          </label>
          <select id="bk-children" className="field tabular-nums" value={children} onChange={(e) => setChildren(Number(e.target.value))}>
            {range(0, maxChildren).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        {total >= groupFrom && <p className="text-[0.875rem] text-vert sm:col-span-2">{fill(b.groupHint, { n: groupFrom })}</p>}
        <div className="sm:col-span-2">
          <label htmlFor="bk-occasion" className="label">
            {b.occasion}
          </label>
          <select id="bk-occasion" className="field" value={occasion} onChange={(e) => setOccasion(e.target.value as Occasion)}>
            {OCCASIONS.map((o) => (
              <option key={o} value={o}>
                {b.occasions[o]}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="bk-name" className="label">
            {b.name}
          </label>
          <input id="bk-name" className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} {...aria("name")} />
          {fieldErr("name")}
        </div>
        <div>
          <label htmlFor="bk-phone" className="label">
            {b.phone}
          </label>
          <input id="bk-phone" className="field" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} {...aria("phone")} />
          {fieldErr("phone")}
        </div>
        <div>
          <label htmlFor="bk-email" className="label">
            {b.email}
          </label>
          <input id="bk-email" className="field" type="email" inputMode="email" autoComplete="email" spellCheck={false} value={email} onChange={(e) => setEmail(e.target.value)} {...aria("email")} />
          {fieldErr("email")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="bk-message" className="label">
            {b.message}
          </label>
          <textarea id="bk-message" className="field min-h-24" rows={3} placeholder={b.messagePh} value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button type="submit" className="btn" disabled={state === "sending"}>
          {state === "sending" ? b.sending : b.submit}
        </button>
        <span className="text-[0.875rem] text-muted">{b.callInstead}</span>
        <a href={`tel:${site.phoneIntl}`} className="link-line text-[0.9375rem] tabular-nums">
          {site.phone}
        </a>
      </div>
      {state === "error" && (
        <p className="mt-4 text-braise-ink" role="alert">
          {b.errors.server}
        </p>
      )}
      <p className="mt-5 text-[0.8125rem] text-muted">{b.privacy}</p>
    </form>
  );
}
