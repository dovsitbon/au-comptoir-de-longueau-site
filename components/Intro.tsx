"use client";

import { useEffect, useState } from "react";
import { MARK } from "@/components/Logo";

const KEY = "comptoir-intro";

/**
 * Ouverture (1,2 s, une fois par session), en CSS (globals.css) : fond crème, la flamme se dessine au trait rouge,
 * deux baguettes se croisent, « AU COMPTOIR DE LONGUEAU » apparaît, fondu sur le hero.
 * Bouton « Passer » ; rien du tout si l'utilisateur préfère réduire les animations (script dans le layout).
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      document.documentElement.classList.add("intro-seen");
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="intro-curtain flex flex-col items-center justify-center text-charbon" dir="ltr">
      <svg viewBox="0 0 48 48" className="h-24 w-24 md:h-28 md:w-28" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path className="intro-draw" pathLength={1} d={MARK.flame} stroke="#C2491D" strokeWidth="1.4" />
        <path className="intro-draw intro-draw-2" pathLength={1} d={MARK.core} stroke="#C2491D" strokeWidth="1.2" />
        <path className="intro-stick intro-stick-a" d={MARK.stickA} stroke="#1A1A1A" strokeWidth="1.4" />
        <path className="intro-stick intro-stick-b" d={MARK.stickB} stroke="#1A1A1A" strokeWidth="1.4" />
      </svg>
      <p className="intro-name logo-word mt-5 text-center text-[clamp(1rem,4.4vw,1.5rem)]" translate="no" aria-hidden="true">
        AU COMPTOIR DE LONGUEAU
      </p>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          document.documentElement.classList.add("intro-seen");
          setGone(true);
        }}
        className="absolute end-4 bottom-4 min-h-11 px-4 text-[0.9375rem] text-charbon/70 transition-colors hover:text-charbon"
      >
        {skipLabel}
      </button>
    </div>
  );
}
