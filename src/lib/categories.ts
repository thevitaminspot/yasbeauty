import { brandImages } from "@/lib/product-images";
import type { ProductCategory } from "@/lib/product-types";

export const categories: {
  slug: ProductCategory;
  name: string;
  headline: string;
  description: string;
  image: string;
}[] = [
  {
    slug: "lip-pigments",
    name: "Lip Pigments",
    headline: "Semi-Permanent Lip Collection",
    description:
      "Nano pigments engineered for lip blush and permanent lip work on every skin tone.",
    image: brandImages.collectionLips,
  },
  {
    slug: "brow-pigments",
    name: "Brow & Liner Pigments",
    headline: "Nano Brow & Eyeliner Shades",
    description:
      "Cool-to-warm brow tones and deep liners for nano strokes, powder brows, and fine lines.",
    image: brandImages.collectionBrows,
  },
  {
    slug: "aftercare",
    name: "Aftercare",
    headline: "Post-Procedure Care",
    description:
      "Calming Gel Red-Bye-Bye, cleansing gel, Bright Serum, and Advanced Centella micro-huile.",
    image: brandImages.aftercare,
  },
  {
    slug: "kits",
    name: "Brow & Lash Kits",
    headline: "Lamination, Tint & Tools",
    description:
      "Lamination, tint shades, wax, mapping paste, practice tools, and PMU macro lighting — what we stock beside the pigments.",
    image: "/products/kits/lamination-kit.jpg",
  },
];
