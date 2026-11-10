# Au Comptoir de Longueau : infos à demander au restaurant

À cocher pendant le rendez-vous. Chaque réponse se reporte dans le fichier indiqué.

## L'essentiel
- [ ] **Nom du gérant** et **l'histoire du restaurant** (ouverture le 6 octobre de quelle année ? ancien nom « Jungle Meal's » sur Facebook ?) → `locales/*.json`
- [ ] **Fait-il partie d'une enseigne** (réseau de buffets) qui a déjà un site ? Si oui, lien et règles de marque.
- [ ] **Formules et prix actuels** : midi semaine, soir, week-end et jours fériés, enfants (tranches d'âge, gratuit pour les petits ?), boissons comprises ou non → `data/formules.json`
- [ ] **Horaires exacts** jour par jour, midi et soir, jours de fermeture, fermetures de l'année → `data/horaires.json`
- [ ] **Capacité** de la salle, nombre maximum pour un groupe, privatisation possible, menu ou gâteau d'anniversaire ? → `data/site.json` (reservation), `locales/*.json`
- [ ] **E-mail** qui recevra les réservations → variable Vercel `BOOKING_NOTIFY_EMAIL` (+ clé Resend)
- [ ] **Un portable** pour activer WhatsApp ? → `data/site.json` (whatsapp)

## Visuels
- [ ] **Logo** officiel (fichier vectoriel ou photo nette de l'enseigne) → `components/Logo.tsx`, `public/logo.svg`, `app/icon.svg`
- [ ] **Photos** du buffet, du grill, des sushis, des fruits de mer, des desserts, de la salle et de la façade → liste dans `assets/A-PHOTOGRAPHIER.md`, puis `npm run media`
- [ ] Accord pour recopier quelques **vrais avis Google** sur le site → `data/avis.json`

## Légal
- [ ] **Raison sociale**, **SIRET**, **directeur de la publication** → `data/site.json` (legal)

## À vérifier
- [ ] Grand parking gratuit devant le restaurant ?
- [ ] Moyens de paiement : CB, espèces, titres-restaurant, Chèques-Vacances (ANCV) ?
- [ ] Chaises hautes, accessibilité fauteuil roulant ?
- [ ] Bons cadeaux : en propose-t-il ? Comment ?
- [ ] Soirées spéciales (fruits de mer, fêtes) à annoncer dans le bandeau → `data/annonces.json`
- [ ] Liste des allergènes disponible ?
