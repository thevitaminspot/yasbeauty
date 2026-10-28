import { brandImages, productImageManifest } from "@/lib/product-images";

export type StudioService = {
  id: string;
  slug: string;
  name: string;
  duration: string;
  fromPrice: number;
  summary: string;
  description: string;
  image: string;
  featured?: boolean;
};

/** Seed catalogue — written to Neon / local JSON on first read. */
export const defaultStudioServices: StudioService[] = [
  {
    id: "svc-nano-brows",
    slug: "nano-brows",
    name: "Nano Brows",
    duration: "2–3 hrs",
    fromPrice: 85000,
    summary: "Hair-stroke nano brows tailored to your bone structure and skin tone.",
    description:
      "Precision nano brow work at our Abuja studio — mapping, pigment selection, and aftercare guidance included.",
    image: productImageManifest["brow-melanin-brown"].primary,
    featured: true,
  },
  {
    id: "svc-lip-blush",
    slug: "lip-blush",
    name: "Lip Blush",
    duration: "2–3 hrs",
    fromPrice: 95000,
    summary: "Soft, healed-true lip color using Yas Beauty Allure pigments.",
    description:
      "Custom lip blush with shades from our semi-permanent lip line. Consultation and touch-up plan provided.",
    image: productImageManifest["lip-amore"].primary,
    featured: true,
  },
  {
    id: "svc-eyeliner",
    slug: "eyeliner",
    name: "Permanent Eyeliner",
    duration: "1.5–2.5 hrs",
    fromPrice: 80000,
    summary: "Lash-line or winged eyeliner that stays put through heat and humidity.",
    description:
      "Permanent eyeliner at our Abuja studio — tightline, soft lash enhancement, or a defined wing. Mapping, pigment choice, and aftercare included.",
    image: productImageManifest["brow-smoky-black"].primary,
    featured: true,
  },
  {
    id: "svc-brow-lamination",
    slug: "brow-lamination",
    name: "Brow Lamination",
    duration: "45–60 min",
    fromPrice: 25000,
    summary: "Lifted, brushed-up brows with a soft set that lasts weeks.",
    description:
      "Brow lamination at our Abuja studio — cleanse, lift, set, and tint options for a fuller, groomed look without PMU.",
    image: productImageManifest["brow-black-brown"].primary,
    featured: true,
  },
  {
    id: "svc-consultation",
    slug: "consultation",
    name: "PMU Consultation",
    duration: "30 min",
    fromPrice: 15000,
    summary: "Not sure which service fits? Start with a one-on-one consult.",
    description:
      "Review goals, skin type, contraindications, and healing expectations before booking a full procedure.",
    image: brandImages.studio,
    featured: true,
  },
  {
    id: "svc-training",
    slug: "training",
    name: "Artist Training",
    duration: "Multi-day",
    fromPrice: 250000,
    summary: "Hands-on nano brow and pigment training for working PMU artists.",
    description:
      "Trainer-led intensives with Yas pigments, live models where applicable, and stockist pricing for graduates.",
    image: brandImages.browsGroup,
  },
];

/** Homepage “Book a chair” trio — core PMU procedures. */
export const homeStudioSlugs = [
  "nano-brows",
  "lip-blush",
  "eyeliner",
] as const;

/** @deprecated Prefer readServices() / getServiceBySlug from services-store */
export const studioServices = defaultStudioServices;
