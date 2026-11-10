/**
 * Logo typographique provisoire (aucun logo officiel trouvé) : une flamme au trait rouge braise et deux baguettes
 * croisées, puis « AU COMPTOIR » en capitales et « DE LONGUEAU » en petit. Pour le remplacer par le vrai logo,
 * changez seulement ce fichier (et public/logo.svg, app/icon.svg pour le favicon).
 */
export const MARK = {
  flame: "M24 5.5c1.6 5.4 9.5 9.6 9.5 18.6a9.5 9.5 0 0 1-19 0c0-5 2.6-7.5 4.2-11.2.9 2.6 2.4 4 3.6 4.4-.9-4.1-.2-8.1 1.7-11.8Z",
  core: "M24 33.6a3.6 3.6 0 0 1-3.6-3.6c0-2.4 1.9-3.7 3.6-6.4 1.7 2.7 3.6 4 3.6 6.4a3.6 3.6 0 0 1-3.6 3.6Z",
  stickA: "M7 37.5 41 45",
  stickB: "M7 45l34-7.5",
};

export function Mark({ className = "h-9 w-9", flame = "#C2491D", sticks = "currentColor" }: { className?: string; flame?: string; sticks?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={MARK.flame} stroke={flame} strokeWidth="1.8" />
      <path d={MARK.core} stroke={flame} strokeWidth="1.5" />
      <path d={MARK.stickA} stroke={sticks} strokeWidth="1.8" />
      <path d={MARK.stickB} stroke={sticks} strokeWidth="1.8" />
    </svg>
  );
}

export function Logo({ className = "", flame, compact = false }: { className?: string; flame?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} translate="no">
      <Mark className={compact ? "h-8 w-8" : "h-10 w-10"} flame={flame} />
      <span className="flex flex-col leading-none" aria-hidden="true">
        <span className="logo-word text-[1.0625rem] md:text-[1.1875rem]">AU COMPTOIR</span>
        <span className="mt-1 text-[0.5625rem] tracking-[0.42em] md:text-[0.625rem]">DE LONGUEAU</span>
      </span>
      <span className="sr-only">Au Comptoir de Longueau</span>
    </span>
  );
}
