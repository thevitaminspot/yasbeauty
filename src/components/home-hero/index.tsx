import { HomeHeroAtelier } from "@/components/home-hero/atelier";
import { HomeHeroChroma } from "@/components/home-hero/chroma";
import { HomeHeroDefault } from "@/components/home-hero/default";
import { HomeHeroInk } from "@/components/home-hero/ink";
import { HomeHeroLumen } from "@/components/home-hero/lumen";

/**
 * Named hero variants. Set ACTIVE_HERO to switch.
 * - `default` — soft rose veil, centered black type (original)
 * - `ink` — black-nav continuum, white type, dark pigment grade
 * - `atelier` — studio editorial, bottom lockup, hairline rule
 * - `lumen` — full-viewport under nav, stacked brand, edge caption
 * - `chroma` — crossfading pigment fields, brand stack, shade rail
 */
export const HERO_VARIANTS = {
  default: HomeHeroDefault,
  ink: HomeHeroInk,
  atelier: HomeHeroAtelier,
  lumen: HomeHeroLumen,
  chroma: HomeHeroChroma,
} as const;

export type HeroVariant = keyof typeof HERO_VARIANTS;

/** Active homepage hero — one composition across breakpoints. */
export const ACTIVE_HERO: HeroVariant = "chroma";

export function HomeHero() {
  const Hero = HERO_VARIANTS[ACTIVE_HERO];
  return <Hero />;
}

export {
  HomeHeroAtelier,
  HomeHeroChroma,
  HomeHeroDefault,
  HomeHeroInk,
  HomeHeroLumen,
};
