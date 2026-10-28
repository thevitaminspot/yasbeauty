import { HomeHeroAtelier } from "@/components/home-hero/atelier";
import { HomeHeroDefault } from "@/components/home-hero/default";
import { HomeHeroInk } from "@/components/home-hero/ink";

/**
 * Named hero variants. Set ACTIVE_HERO to switch.
 * - `default` — soft rose veil, centered black type (original)
 * - `ink` — black-nav continuum, white type, dark pigment grade
 * - `atelier` — studio editorial, bottom lockup, hairline rule
 */
export const HERO_VARIANTS = {
  default: HomeHeroDefault,
  ink: HomeHeroInk,
  atelier: HomeHeroAtelier,
} as const;

export type HeroVariant = keyof typeof HERO_VARIANTS;

/** Active homepage hero. Say “switch back to default” to restore. */
export const ACTIVE_HERO: HeroVariant = "default";

export function HomeHero() {
  const Active = HERO_VARIANTS[ACTIVE_HERO];
  return <Active />;
}

export { HomeHeroAtelier, HomeHeroDefault, HomeHeroInk };
