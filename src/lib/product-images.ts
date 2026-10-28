/**
 * Label-verified product photography (rebuilt Oct 2026).
 * Filenames use `-v2` to bust stale Next/Image caches after earlier mismatches.
 */
export const productImageManifest = {
  "lip-amore": {
    primary: "/products/lips/amore-v2.jpg",
    gallery: ["/products/lips/amore-v2.jpg"],
    sourceAsset: "PHOTO-2026-10-25-20-00-04-5c7306b0-d45d-4d39-8bb1-0a6b0ba4449b.jpg",
    label: "Amoré",
  },
  "lip-bloody-mary": {
    primary: "/products/lips/bloody-mary-v2.jpg",
    gallery: ["/products/lips/bloody-mary-v2.jpg"],
    sourceAsset: "PHOTO-2026-10-25-20-00-10_13-98eea306-b871-4ea1-bfd2-6d1c02d01fe5.jpg",
    label: "Bloody Mary",
  },
  "lip-sweet-lips": {
    primary: "/products/lips/sweet-lips-v2.jpg",
    gallery: ["/products/lips/sweet-lips-v2.jpg"],
    sourceAsset: "PHOTO-2026-10-25-20-00-10_14-bba38e4b-b5c9-4ac3-bc57-a3b55a322300.jpg",
    label: "Sweet Lips",
  },
  "lip-lapel": {
    primary: "/products/lips/lapel-v2.jpg",
    gallery: ["/products/lips/lapel-v2.jpg"],
    sourceAsset: "PHOTO-2026-10-25-20-00-10_9-471877b5-33bc-460c-bbb3-5230d98ccdce.jpg",
    label: "La'pel",
  },
  "lip-salamander": {
    primary: "/products/lips/salamander-v2.jpg",
    gallery: ["/products/lips/salamander-v2.jpg"],
    sourceAsset: "PHOTO-2026-10-25-20-00-10_8-7373fa08-488d-4540-abe5-ebf22d7276eb.jpg",
    label: "Salamander",
  },
  "brow-smoky-black": {
    primary: "/products/brows/smoky-black-v2.jpg",
    gallery: ["/products/brows/smoky-black-v2.jpg"],
    sourceAsset: "PHOTO-2026-10-25-20-00-09_2-9d9c53d5-5113-4376-b134-be850a94fbf2.jpg",
    label: "Smoky Black",
  },
  "brow-black-brown": {
    primary: "/products/brows/black-brown-v2.jpg",
    gallery: ["/products/brows/black-brown-v2.jpg"],
    sourceAsset: "PHOTO-2026-10-25-20-00-09_4-260b2336-ef10-43f7-9db1-e4b0206f5870.jpg",
    label: "Black Brown",
  },
  "brow-melanin-brown": {
    primary: "/products/brows/melanin-brown-v2.jpg",
    gallery: ["/products/brows/melanin-brown-v2.jpg"],
    sourceAsset: "PHOTO-2026-10-25-20-00-10_11-94b8531e-01a4-4a0f-bae9-1ed3f1ab8b89.jpg",
    label: "Melanin Brown",
  },
  "aftercare-bright-serum": {
    primary: "/products/aftercare/bright-serum-v2.jpg",
    gallery: ["/products/aftercare/bright-serum-v2.jpg"],
    sourceAsset: "PHOTO-2026-10-25-20-00-10_6-ebb904fc-05c0-49a3-9a1d-bdcc1f1d2b9a.jpg",
    label: "Bright Serum",
  },
} as const;

/** Shared lifestyle / category imagery (YAS only — no third-party kits) */
export const brandImages = {
  lipsGroup: "/products/lips/group-v2.jpg",
  browsGroup: "/products/brows/group-v2.jpg",
  collectionLips: "/hero/collection-lips-v2.jpg",
  collectionBrows: "/hero/collection-brows-v2.jpg",
  studio: "/hero/studio-v2.jpg",
  /** Clean single-shade hero — Amoré bottle + swatch on blush pink */
  hero: "/products/lips/amore-v2.jpg",
  /** Dark-blended Smoky Black for NOXE-style black heroes */
  heroDark: "/hero/noxe-smoky-v2.jpg",
  /** Category / homepage art — lifestyle pigment shot (not the retail serum packshot) */
  aftercare: "/hero/studio-v2.jpg",
} as const;
