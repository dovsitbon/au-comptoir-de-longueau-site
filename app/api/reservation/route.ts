import { Resend } from "resend";
import site from "@/data/site.json";
import { bookingRows, parseBooking } from "@/lib/reservation";
import { fill, getDict, isLocale, type Locale } from "@/lib/i18n";

// Demande de réservation. Le restaurant n'a qu'une ligne fixe : la demande part par e-mail (Resend).
//  1. notification au restaurant (en français, bien formatée, « Répondre » écrit directement au client) ;
//  2. confirmation de réception au client, dans sa langue.
// Variables Vercel : RESEND_API_KEY, BOOKING_NOTIFY_EMAIL (adresse du restaurant), RESEND_FROM (domaine vérifié dans Resend,
// ex. « Au Comptoir de Longueau <reservation@mondomaine.fr> » ; sans domaine vérifié, Resend n'envoie qu'à l'adresse du compte).
// Sans ces variables, la route répond { notified: false } et le site invite le client à appeler pour confirmer.

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function html({ title, intro, rows, outro }: { title: string; intro?: string; rows: [string, string][]; outro?: string }) {
  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 16px 10px 0;border-bottom:1px solid #EDE4D3;color:#6B6258;font-size:13px;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:10px 0;border-bottom:1px solid #EDE4D3;font-size:15px;color:#1A1A1A">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  return `<div style="background:#F7F1E6;padding:32px 16px"><div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;font-family:Helvetica,Arial,sans-serif;color:#1A1A1A">
<div style="background:#1A1A1A;padding:18px 28px;color:#F7F1E6;font-size:13px;letter-spacing:3px">AU COMPTOIR <span style="color:#C9A14E">DE LONGUEAU</span></div>
<div style="padding:28px">
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">${esc(title)}</h1>
${intro ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.6">${esc(intro)}</p>` : ""}
<table style="width:100%;border-collapse:collapse">${table}</table>
${outro ? `<p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:#4A443D">${esc(outro)}</p>` : ""}
</div>
<div style="padding:16px 28px;border-top:1px solid #EDE4D3;font-size:12px;color:#6B6258">${esc(site.address.street)}, ${site.address.postalCode} ${site.address.city} · ${site.phone}</div>
</div></div>`;
}

const plain = (title: string, rows: [string, string][], extra = "") => `${title}\n\n${rows.map(([k, v]) => `${k} : ${v}`).join("\n")}${extra ? `\n\n${extra}` : ""}`;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const lang: Locale = typeof body.lang === "string" && isLocale(body.lang) ? body.lang : "fr";
  const b = parseBooking(body.booking);
  if (!b) return Response.json({ ok: false }, { status: 400 });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_NOTIFY_EMAIL;
  if (!key || !to) return Response.json({ ok: true, notified: false, confirmed: false });

  const resend = new Resend(key);
  const from = process.env.RESEND_FROM ?? "Au Comptoir de Longueau <onboarding@resend.dev>";
  const fr = getDict("fr");
  const rows = bookingRows(b, "fr", fr);
  if (lang !== "fr") rows.push([fr.book.mail.lang, lang.toUpperCase()]);
  const guests = b.adults + b.children;
  const subject = `${guests >= site.reservation.groupFrom ? "[Groupe] " : ""}${fr.book.mail.subject} · ${b.name} · ${b.date} ${b.time} · ${guests} pers.`;

  let notified = false;
  let confirmed = false;
  try {
    const r = await resend.emails.send({ from, to, replyTo: b.email, subject, html: html({ title: fr.book.mail.title, rows, outro: fr.book.mail.reply }), text: plain(fr.book.mail.title, rows, fr.book.mail.reply) });
    notified = !r.error;
  } catch {}

  if (notified) {
    const d = getDict(lang);
    const m = d.book.mail;
    const crows = bookingRows(b, lang, d, false);
    const intro = fill(m.confirmIntro, { name: b.name });
    try {
      const r = await resend.emails.send({ from, to: b.email, replyTo: to, subject: m.confirmSubject, html: html({ title: m.confirmSubject, intro, rows: crows, outro: m.confirmOutro }), text: plain(intro, crows, m.confirmOutro) });
      confirmed = !r.error;
    } catch {}
  }
  return Response.json({ ok: true, notified, confirmed });
}
