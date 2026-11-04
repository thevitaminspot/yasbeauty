/** Interactive shade studio — hex is approximate studio reference, not a lab match. */

export type ShadeLine = "lips" | "brows";

export type ShadeEntry = {
  id: string;
  line: ShadeLine;
  name: string;
  shade: string;
  tagline: string;
  hex: string;
  slug: string;
  image: string;
};

export const shadePalette: ShadeEntry[] = [
  {
    id: "lip-amore",
    line: "lips",
    name: "Amoré",
    shade: "Warm rose",
    tagline: "Soft romantic lip blush",
    hex: "#8B3A4A",
    slug: "amore-lip-pigment",
    image: "/products/lips/amore-v2.jpg",
  },
  {
    id: "lip-bloody-mary",
    line: "lips",
    name: "Bloody Mary",
    shade: "Classic red",
    tagline: "Bold statement red",
    hex: "#6B1C28",
    slug: "bloody-mary-lip-pigment",
    image: "/products/lips/bloody-mary-v2.jpg",
  },
  {
    id: "lip-sweet-lips",
    line: "lips",
    name: "Sweet Lips",
    shade: "Bright coral pink",
    tagline: "Youthful coral flush",
    hex: "#C47A8A",
    slug: "sweet-lips-pigment",
    image: "/products/lips/sweet-lips-v2.jpg",
  },
  {
    id: "lip-lapel",
    line: "lips",
    name: "La'pel",
    shade: "Warm orange",
    tagline: "Sun-kissed warmth",
    hex: "#C45A2C",
    slug: "lapel-lip-pigment",
    image: "/products/lips/lapel-v2.jpg",
  },
  {
    id: "lip-salamander",
    line: "lips",
    name: "Salamander",
    shade: "Fiery orange-red",
    tagline: "High-impact warmth",
    hex: "#B54A3C",
    slug: "salamander-lip-pigment",
    image: "/products/lips/salamander-v2.jpg",
  },
  {
    id: "brow-smoky-black",
    line: "brows",
    name: "Smoky Black",
    shade: "Soft charcoal",
    tagline: "Diffused depth for hair strokes",
    hex: "#1A1514",
    slug: "smoky-black-brow-pigment",
    image: "/products/brows/smoky-black-v2.jpg",
  },
  {
    id: "brow-black-brown",
    line: "brows",
    name: "Black Brown",
    shade: "Cool ash brown",
    tagline: "Studio-neutral brown",
    hex: "#3D2B24",
    slug: "black-brown-brow-pigment",
    image: "/products/brows/black-brown-v2.jpg",
  },
  {
    id: "brow-melanin-brown",
    line: "brows",
    name: "Melanin Brown",
    shade: "Rich warm brown",
    tagline: "Made for deeper skin tones",
    hex: "#5C3D2E",
    slug: "melanin-brown-brow-pigment",
    image: "/products/brows/melanin-brown-v2.jpg",
  },
];

export function shadesForLine(line: ShadeLine) {
  return shadePalette.filter((s) => s.line === line);
}
