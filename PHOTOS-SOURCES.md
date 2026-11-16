# Photos du site : sources et licences

Relevé du 16 novembre 2026. **4 photos réelles** du restaurant (3 clichés différents) et **7 photos d'illustration** libres de droits.
Les photos d'illustration portent la mention « Photo d'illustration » sur le site et des textes alternatifs neutres : elles ne sont jamais présentées comme le restaurant.

Pour remplacer une photo : déposez la vôtre sous le même nom dans `assets/<dossier>/`, mettez `"source": "real"` dans `data/photos.json`, puis `npm run media`.

## Photos réelles (Au Comptoir de Longueau)

Source : fiche Google Maps « Au Comptoir de Longueau », 15 bis rue Michel Strogoff, Boves (photos de la fiche, auteur non affiché).
**À faire valider par le restaurant**, ou à remplacer par ses propres photos : les droits appartiennent à leur auteur.

| Fichier du site | Emplacement | Contenu | Original |
|---|---|---|---|
| `assets/hero/hero.jpg` | Hero (accueil) | La grande salle, lustres et guirlandes lumineuses | `assets/raw/gmaps/p7.jpg` |
| `assets/salle/salle.jpg` | Page « Buffet à volonté près d'Amiens » | La salle, tables en bois | `assets/raw/gmaps/p6.jpg` |
| `assets/salle/salle-groupes.jpg` | Bloc « Anniversaires et groupes » | Même cliché que la salle | `assets/raw/gmaps/p6.jpg` |
| `assets/grill/grill.jpg` | Tuile et univers « Le grill », page Amiens | Le buffet chaud sous les lampes en cuivre | `assets/raw/gmaps/p5.jpg` |

Autres photos de la fiche récupérées mais non publiées (cartes et menus, ardoise) : `assets/raw/gmaps/p1–p4, p8, p9`. Elles ont servi à relever les prix et les horaires.

## Photos d'illustration (Unsplash)

Licence Unsplash : usage commercial gratuit, sans attribution obligatoire (https://unsplash.com/license). Photos « Unsplash+ » exclues.

| Fichier du site | Emplacement | Photo | Lien |
|---|---|---|---|
| `assets/sushis/sushis.jpg` | Tuile et univers « Les sushis », page Boves | Sushis, sashimis et makis sur plateau en bois (Hoseung Han) | https://unsplash.com/photos/LXFm-Kd3apk |
| `assets/fruits-de-mer/fruits-de-mer.jpg` | Tuile et univers « Fruits de mer », page Boves | Huîtres et crevettes sur glace | https://unsplash.com/photos/FsVn3TQReMI |
| `assets/desserts/desserts.jpg` | Tuile et univers « Les desserts » | Buffet de petits desserts (Encal Media) | https://unsplash.com/photos/JJOQ1gezuF8 |
| `assets/desserts/desserts-enfants.jpg` | Bloc « Les enfants » | Bacs de glaces colorées | https://unsplash.com/photos/SzeATgE4k0c |
| `assets/buffet/entrees.jpg` | Tuile « Les entrées », « Et aussi » | Assiette de salade composée (Markus Winkler) | https://unsplash.com/photos/AOE4ZkUm72c |
| `assets/buffet/plats-chauds.jpg` | Tuile « Plats chauds », « Et aussi » | Bac chauffant de buffet | https://unsplash.com/photos/gfo8ESLIaCA |
| `assets/grill/grill-direct.jpg` | Bloc « Le grill en direct » | Brochettes sur le grill (Deny Hill) | https://unsplash.com/photos/JdH1WqQe8ck |

## Toujours à prendre sur place

- La façade avec l'enseigne (`assets/salle/facade.jpg`), plus toutes les photos d'illustration ci-dessus à remplacer par les vrais plats du buffet : liste dans `assets/A-PHOTOGRAPHIER.md`.
