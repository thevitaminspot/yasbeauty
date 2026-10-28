import { HomeHeroAtelier } from "@/components/home-hero/atelier";
import { HomeHeroDefault } from "@/components/home-hero/default";
import { HomeHeroInk } from "@/components/home-hero/ink";
import { HomeHeroLumen } from "@/components/home-hero/lumen";

/**
 * Named hero variants. Set ACTIVE_HERO to switch.
 * - `default` — soft rose veil, centered black type (original)
 * - `ink` — black-nav continuum, white type, dark pigment grade
 * - `atelier` — studio editorial, bottom lockup, hairline rule
 * - `lumen` — full-viewport under nav, stacked brand, edge caption
 */
export const HERO_VARIANTS = {
  default: HomeHeroDefault,
  ink: HomeHeroInk,
  atelier: HomeHeroAtelier,
  lumen: HomeHeroLumen,
} as const;

export type HeroVariant = keyof typeof HERO_VARIANTS;

/**
 * Responsive heroes: lumen on small screens, default from `md` up.
 * ACTIVE_HERO is kept for single-variant overrides / docs.
 */
export const ACTIVE_HERO: HeroVariant = "lumen";

export function HomeHero() {
  return (
    <>
      <div className="md:hidden">
        <HomeHeroLumen />
      </div>
      <div className="hidden md:block">
        <HomeHeroDefault />
      </div>
    </>
  );
}

export { HomeHeroAtelier, HomeHeroDefault, HomeHeroInk, HomeHeroLumen };
