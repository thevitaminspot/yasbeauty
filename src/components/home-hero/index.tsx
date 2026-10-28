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

/** Active homepage hero. Say “switch back to default” to restore. */
export const ACTIVE_HERO: HeroVariant = "lumen";

export function HomeHero() {
  const Active = HERO_VARIANTS[ACTIVE_HERO];
  return <Active />;
}

export { HomeHeroAtelier, HomeHeroDefault, HomeHeroInk, HomeHeroLumen };
