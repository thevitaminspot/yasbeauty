import type { ProductCategory } from "@/lib/product-types";
import { productImageManifest } from "@/lib/product-images";

export type CatalogItem = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  defaultPrice: number;
  volume: string;
  tagline: string;
  description: string;
  image: string;
  images: string[];
  featured?: boolean;
  bestseller?: boolean;
  shade?: string;
  ingredients: string;
  usage: string;
  cautions: string[];
};

const lipBase = {
  category: "lip-pigments" as const,
  defaultPrice: 18500,
  volume: "10ml",
  ingredients:
    "Aqua, Glycerin, Propylene Glycol, CI colorants. Sterilized gamma ray. Nano pigment formulation.",
  usage:
    "Shake well before use. For permanent makeup procedures by trained professionals only.",
  cautions: [
    "For professional use only.",
    "Patch test before full application.",
    "Use within 12 months of opening.",
    "Store in a cool, dry place away from direct sunlight.",
    "Keep out of reach of children.",
  ],
};

const browBase = {
  category: "brow-pigments" as const,
  defaultPrice: 19500,
  volume: "10ml",
  ingredients:
    "Aqua, Glycerin, Propylene Glycol, CI colorants. Sterilized gamma ray. Nano pigment formulation.",
  usage:
    "Shake well before use. Ideal for nano brows, microblading, and permanent eyeliner.",
  cautions: [
    "For professional use only.",
    "Patch test before full application.",
    "Use within 12 months of opening.",
    "Store in a cool, dry place away from direct sunlight.",
    "Keep out of reach of children.",
  ],
};

export const catalogBase: CatalogItem[] = [
  {
    id: "lip-amore",
    slug: "amore-lip-pigment",
    name: "Amoré",
    shade: "Warm rose",
    tagline: "Soft romantic lip blush",
    description:
      "A balanced warm rose that heals true on melanin-rich lips. Built for natural lip blush and full lip procedures where softness matters.",
    image: productImageManifest["lip-amore"].primary,
    images: [...productImageManifest["lip-amore"].gallery],
    featured: true,
    bestseller: true,
    ...lipBase,
  },
  {
    id: "lip-bloody-mary",
    slug: "bloody-mary-lip-pigment",
    name: "Bloody Mary",
    shade: "Classic red",
    tagline: "Bold statement red",
    description:
      "A saturated true red for clients who want unmistakable color. Works beautifully layered for ombre and full pigment saturation.",
    image: productImageManifest["lip-bloody-mary"].primary,
    images: [...productImageManifest["lip-bloody-mary"].gallery],
    featured: true,
    bestseller: true,
    ...lipBase,
  },
  {
    id: "lip-sweet-lips",
    slug: "sweet-lips-pigment",
    name: "Sweet Lips",
    shade: "Bright coral pink",
    tagline: "Youthful coral flush",
    description:
      "A lively coral-pink that reads fresh on camera and in daylight. A studio favorite for everyday lip blush.",
    image: productImageManifest["lip-sweet-lips"].primary,
    images: [...productImageManifest["lip-sweet-lips"].gallery],
    bestseller: true,
    ...lipBase,
  },
  {
    id: "lip-lapel",
    slug: "lapel-lip-pigment",
    name: "La'pel",
    shade: "Warm orange",
    tagline: "Sun-kissed warmth",
    description:
      "Warm orange undertones for correcting cool lips and building custom blends. Excellent for dark lip neutralization workflows.",
    image: productImageManifest["lip-lapel"].primary,
    images: [...productImageManifest["lip-lapel"].gallery],
    ...lipBase,
  },
  {
    id: "lip-salamander",
    slug: "salamander-lip-pigment",
    name: "Salamander",
    shade: "Fiery orange-red",
    tagline: "High-impact warmth",
    description:
      "A vivid orange-red for artists who push saturation. Mix with Amoré or Sweet Lips for bespoke healed results.",
    image: productImageManifest["lip-salamander"].primary,
    images: [...productImageManifest["lip-salamander"].gallery],
    ...lipBase,
  },
  {
    id: "brow-smoky-black",
    slug: "smoky-black-brow-pigment",
    name: "Smoky Black",
    shade: "Soft charcoal",
    tagline: "Diffused depth for hair strokes",
    description:
      "A matte charcoal that avoids harsh blue shift on heal. Perfect for nano hair strokes and soft powder fill.",
    image: productImageManifest["brow-smoky-black"].primary,
    images: [...productImageManifest["brow-smoky-black"].gallery],
    featured: true,
    bestseller: true,
    ...browBase,
  },
  {
    id: "brow-black-brown",
    slug: "black-brown-brow-pigment",
    name: "Black Brown",
    shade: "Cool ash brown",
    tagline: "Studio-neutral brown",
    description:
      "Cool ash brown with controlled depth. Heals evenly for clients who want definition without a heavy block brow.",
    image: productImageManifest["brow-black-brown"].primary,
    images: [...productImageManifest["brow-black-brown"].gallery],
    featured: true,
    ...browBase,
  },
  {
    id: "brow-melanin-brown",
    slug: "melanin-brown-brow-pigment",
    name: "Melanin Brown",
    shade: "Rich warm brown",
    tagline: "Made for deeper skin tones",
    description:
      "Warm brown pigment that stays true on melanin-rich skin. Developed by Yas Beauty Allure for nano brow specialists.",
    image: productImageManifest["brow-melanin-brown"].primary,
    images: [...productImageManifest["brow-melanin-brown"].gallery],
    bestseller: true,
    ...browBase,
  },
  {
    id: "aftercare-bright-serum",
    slug: "bright-serum-lip-shine",
    name: "Bright Serum",
    shade: "Lip-Shine-Shine",
    tagline: "Post-treatment lip brightening",
    description:
      "Lip-Shine-Shine brightening serum for post lip procedures. Enhances color vibrancy while keeping lips hydrated through healing.",
    image: productImageManifest["aftercare-bright-serum"].primary,
    images: [...productImageManifest["aftercare-bright-serum"].gallery],
    category: "aftercare",
    defaultPrice: 24000,
    volume: "30ml",
    featured: true,
    ingredients:
      "Aqua, Glycerin, Nourishing botanical extracts, brightening actives.",
    usage:
      "Apply a thin layer to lips after approved healing window. For professional retail and client aftercare kits.",
    cautions: [
      "External use only.",
      "Discontinue if irritation occurs.",
      "Keep out of reach of children.",
    ],
  },
];
