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

/** @deprecated Prefer readServices() / getServiceBySlug from services-store */
export const studioServices = defaultStudioServices;
