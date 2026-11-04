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
  {
    id: "aftercare-calming-gel",
    slug: "calming-gel-red-bye-bye",
    name: "Calming Gel",
    shade: "Red-Bye-Bye",
    tagline: "Post-brow redness relief",
    description:
      "30ml Calming Gel Red-Bye-Bye for eyebrows after treatment. Soothes and cools irritated skin with Centella Asiatica extract and Mentha Piperita oil — built for post-lamination, tint, and PMU redness.",
    image: productImageManifest["aftercare-calming-gel"].primary,
    images: [...productImageManifest["aftercare-calming-gel"].gallery],
    category: "aftercare",
    defaultPrice: 12500,
    volume: "30ml",
    featured: true,
    bestseller: true,
    ingredients:
      "Aqua, Centella Asiatica Extract, Mentha Piperita Oil, soothing botanicals.",
    usage:
      "Apply a thin layer to the brow area after treatment once skin is intact. Reapply as needed for cooling relief.",
    cautions: [
      "External use only.",
      "Avoid open wounds.",
      "Discontinue if irritation occurs.",
      "Keep out of reach of children.",
    ],
  },
  {
    id: "aftercare-advanced-serum",
    slug: "la-micro-huile-advanced-serum",
    name: "Advanced Serum",
    shade: "La Micro Huile · Centella",
    tagline: "Micro-pearl Centella recovery oil",
    description:
      "YD La Micro Huile De Advanced Serum (5ml) — concentrated Centella micro-huile with suspended pearls for post-PMU recovery and barrier support. Salon retail size.",
    image: productImageManifest["aftercare-advanced-serum"].primary,
    images: [...productImageManifest["aftercare-advanced-serum"].gallery],
    category: "aftercare",
    defaultPrice: 32000,
    volume: "5ml",
    featured: true,
    bestseller: true,
    ingredients:
      "Centella Asiatica actives, micro-pearl oil complex, skin-barrier lipids.",
    usage:
      "Press 1–2 drops onto clean skin after the approved healing window. Massage gently until absorbed.",
    cautions: [
      "External use only.",
      "Patch test before first use.",
      "Discontinue if irritation occurs.",
      "Keep out of reach of children.",
    ],
  },
  {
    id: "aftercare-cleansing-gel",
    slug: "professional-pmu-cleansing-gel",
    name: "PMU Cleansing Gel",
    shade: "Gentle cleanse",
    tagline: "Clean skin · cleaner work area",
    description:
      "Professional PMU cleansing gel (30ml) for lip blush, powder brows, microblading, eyeliner, SMP, scar camouflage, color correction, and training. Gentle touch for prep and mid-procedure wipe-downs.",
    image: productImageManifest["aftercare-cleansing-gel"].primary,
    images: [...productImageManifest["aftercare-cleansing-gel"].gallery],
    category: "aftercare",
    defaultPrice: 12500,
    volume: "30ml",
    featured: true,
    ingredients: "Gentle surfactant blend for professional PMU skin prep.",
    usage:
      "Apply to cotton pad or gloved fingertips; cleanse treatment area before and during procedures as needed.",
    cautions: [
      "External use only.",
      "Avoid eye contact.",
      "Discontinue if irritation occurs.",
      "Keep out of reach of children.",
    ],
  },
  {
    id: "kit-lamination",
    slug: "deluxe-brow-lash-lamination-kit",
    name: "Deluxe Lamination Kit",
    shade: "Brow & lash",
    tagline: "Complete brow & lash lamination system",
    description:
      "Professional deluxe brow and lash lamination kit — lifting lotion, fixing lotion, adhesive, cleanser, keratin booster, and tools. Salon-ready for training and chair work.",
    image: productImageManifest["kit-lamination"].primary,
    images: [...productImageManifest["kit-lamination"].gallery],
    category: "kits",
    defaultPrice: 85000,
    volume: "Full kit",
    featured: true,
    bestseller: true,
    ingredients:
      "Lifting Lotion 1, Fixing Lotion 2, Adhesive, Oil-free Cleanser, Keratin Booster, Y-brushes, flocked wands, silicone shields, spoolies, lash pads, micro brushes.",
    usage:
      "For trained professionals. Follow the step sequence: cleanse → adhesive → lift → fix → cleanse → keratin boost. Times vary by hair type.",
    cautions: [
      "For professional use only.",
      "Patch test before full application.",
      "Follow timing guidelines carefully.",
      "Keep out of reach of children.",
    ],
  },
  {
    id: "kit-brow-tint",
    slug: "rebrows-brow-tint-kit",
    name: "Brow Tint Kit",
    shade: "4 shades",
    tagline: "No-mix professional brow tint",
    description:
      "ReBrows professional brow tint kit with four full-coverage shades (Light Brown, Brown, Dark Brown, Black), dual-ended brush, and mixing palette. Vacuum-fresh, no-mix formula — lasts 4–6 weeks.",
    image: productImageManifest["kit-brow-tint"].primary,
    images: [...productImageManifest["kit-brow-tint"].gallery],
    category: "kits",
    defaultPrice: 45000,
    volume: "4 × 5ml",
    featured: true,
    bestseller: true,
    ingredients:
      "Cream tint system (PPD-free, ammonia-free). Four shades + dual liner/spoolie tool + palette.",
    usage:
      "Clean brows, outline, apply tint from tail toward center, layer if needed, process 10–15 minutes, cleanse, optional set with clear gel.",
    cautions: [
      "For professional use only.",
      "Allergy patch test recommended.",
      "Avoid eye contact.",
      "Keep out of reach of children.",
    ],
  },
  {
    id: "kit-tint-01",
    slug: "rebrows-brow-tint-01-light-brown",
    name: "Brow Tint 01",
    shade: "Light Brown",
    tagline: "No-mix vacuum tint · 5ml",
    description:
      "ReBrows Brow Tint shade 01 Light Brown (5ml). Airless pump, no-mix cream tint for soft blonde-to-light brown brows. Lasts 4–6 weeks.",
    image: productImageManifest["kit-tint-01"].primary,
    images: [...productImageManifest["kit-tint-01"].gallery],
    category: "kits",
    defaultPrice: 12000,
    volume: "5ml",
    ingredients: "PPD-free, ammonia-free cream tint. Vacuum-fresh airless pump.",
    usage:
      "Clean brows, outline, apply from tail toward center, process 10–15 minutes, cleanse.",
    cautions: [
      "For professional use only.",
      "Allergy patch test recommended.",
      "Avoid eye contact.",
    ],
  },
  {
    id: "kit-tint-02",
    slug: "rebrows-brow-tint-02-brown",
    name: "Brow Tint 02",
    shade: "Brown",
    tagline: "No-mix vacuum tint · 5ml",
    description:
      "ReBrows Brow Tint shade 02 Brown (5ml). Balanced medium brown for everyday brow color. Airless, no-mix formula.",
    image: productImageManifest["kit-tint-02"].primary,
    images: [...productImageManifest["kit-tint-02"].gallery],
    category: "kits",
    defaultPrice: 12000,
    volume: "5ml",
    ingredients: "PPD-free, ammonia-free cream tint. Vacuum-fresh airless pump.",
    usage:
      "Clean brows, outline, apply from tail toward center, process 10–15 minutes, cleanse.",
    cautions: [
      "For professional use only.",
      "Allergy patch test recommended.",
      "Avoid eye contact.",
    ],
  },
  {
    id: "kit-tint-03",
    slug: "rebrows-brow-tint-03-dark-brown",
    name: "Brow Tint 03",
    shade: "Dark Brown",
    tagline: "No-mix vacuum tint · 5ml",
    description:
      "ReBrows Brow Tint shade 03 Dark Brown (5ml). Deep cool-leaning brown for richer definition. Airless, no-mix formula.",
    image: productImageManifest["kit-tint-03"].primary,
    images: [...productImageManifest["kit-tint-03"].gallery],
    category: "kits",
    defaultPrice: 12000,
    volume: "5ml",
    ingredients: "PPD-free, ammonia-free cream tint. Vacuum-fresh airless pump.",
    usage:
      "Clean brows, outline, apply from tail toward center, process 10–15 minutes, cleanse.",
    cautions: [
      "For professional use only.",
      "Allergy patch test recommended.",
      "Avoid eye contact.",
    ],
  },
  {
    id: "kit-tint-04",
    slug: "rebrows-brow-tint-04-black",
    name: "Brow Tint 04",
    shade: "Black",
    tagline: "No-mix vacuum tint · 5ml",
    description:
      "ReBrows Brow Tint shade 04 Black (5ml). Full-coverage black for bold, graphic brows. Airless, no-mix formula.",
    image: productImageManifest["kit-tint-04"].primary,
    images: [...productImageManifest["kit-tint-04"].gallery],
    category: "kits",
    defaultPrice: 12000,
    volume: "5ml",
    ingredients: "PPD-free, ammonia-free cream tint. Vacuum-fresh airless pump.",
    usage:
      "Clean brows, outline, apply from tail toward center, process 10–15 minutes, cleanse.",
    cautions: [
      "For professional use only.",
      "Allergy patch test recommended.",
      "Avoid eye contact.",
    ],
  },
  {
    id: "kit-eyebrow-wax",
    slug: "rebrows-eyebrow-wax-pro",
    name: "Eyebrow Wax PRO",
    shade: "Clear hold",
    tagline: "Feathered brow set & hold",
    description:
      "ReBrows Eyebrow Wax PRO (30ml) — clear gel wax for sculpted, laminated-look brows. Brush up, set, and finish with lasting hold.",
    image: productImageManifest["kit-eyebrow-wax"].primary,
    images: [...productImageManifest["kit-eyebrow-wax"].gallery],
    category: "kits",
    defaultPrice: 18500,
    volume: "30ml",
    featured: true,
    ingredients: "Clear styling wax gel for brows. Professional salon formula.",
    usage:
      "Warm a small amount on a spoolie, brush brows into place, and set. Use alone or after tint/lamination.",
    cautions: [
      "External use only.",
      "Discontinue if irritation occurs.",
      "Keep out of reach of children.",
    ],
  },
  {
    id: "kit-brow-brush",
    slug: "dual-precision-brow-brush",
    name: "Dual Brow Brush",
    shade: "Liner + spoolie",
    tagline: "Angled liner meets spoolie",
    description:
      "Professional dual-ended brow brush — ultra-thin angled liner tip for precise tint and mapping, spoolie for blending and grooming.",
    image: productImageManifest["kit-brow-brush"].primary,
    images: [...productImageManifest["kit-brow-brush"].gallery],
    category: "kits",
    defaultPrice: 8500,
    volume: "1 tool",
    ingredients: "Synthetic bristles, stainless ferrules, matte handle.",
    usage: "Use spoolie to groom; angled tip for tint, powder, or outlining.",
    cautions: ["Clean after each client.", "Replace when bristles fray."],
  },
  {
    id: "kit-brow-brush-set",
    slug: "essential-brow-brush-set",
    name: "Brow Brush Set",
    shade: "3-piece",
    tagline: "Angled · spoolie · flat definer",
    description:
      "Three-piece professional brow brush set — angled pomade brush, spoolie, and flat definer for carving and finishing.",
    image: productImageManifest["kit-brow-brush-set"].primary,
    images: [...productImageManifest["kit-brow-brush-set"].gallery],
    category: "kits",
    defaultPrice: 15000,
    volume: "3 tools",
    featured: true,
    ingredients: "Synthetic bristles, stainless ferrules, matte black handles.",
    usage:
      "Use angled for fill, spoolie to blend, flat definer to carve edges with concealer.",
    cautions: ["Clean after each client.", "Replace when bristles fray."],
  },
  {
    id: "kit-brow-paste",
    slug: "microblading-brow-paste",
    name: "Brow Paste",
    shade: "White + peach",
    tagline: "Mapping paste for microblading",
    description:
      "YD microblading brow paste pots — white and peach mapping paste for outlining and transferring brow shapes before pigment.",
    image: productImageManifest["kit-brow-paste"].primary,
    images: [...productImageManifest["kit-brow-paste"].gallery],
    category: "kits",
    defaultPrice: 16500,
    volume: "2 pots",
    featured: true,
    ingredients: "Cosmetic mapping paste (white / peach).",
    usage:
      "Warm a small amount, map brow shape with a stick or brush, refine before pigment.",
    cautions: [
      "For professional use only.",
      "External use only.",
      "Keep out of reach of children.",
    ],
  },
  {
    id: "kit-skin-gel",
    slug: "skin-gel-liquid-latex-practice",
    name: "Skin Gel",
    shade: "Liquid latex practice",
    tagline: "Practice film for real-skin drills",
    description:
      "YDPMU Skin Gel liquid latex practice gel (15ml) — apply wet, dry to a skin-like film for needle-depth drills without marking real skin.",
    image: productImageManifest["kit-skin-gel"].primary,
    images: [...productImageManifest["kit-skin-gel"].gallery],
    category: "kits",
    defaultPrice: 9500,
    volume: "15ml",
    featured: true,
    ingredients: "Liquid latex practice gel for training.",
    usage:
      "Apply a thin layer to the practice area, wait ~15 minutes to dry into a film, then practice strokes. Peel when finished.",
    cautions: [
      "Training product only — not for permanent pigment procedures.",
      "Do not use on broken skin.",
      "Keep out of reach of children.",
    ],
  },
  {
    id: "kit-practice-pencil",
    slug: "brow-stroke-practice-pencil",
    name: "Practice Pencil 0.3mm",
    shade: "HB lead",
    tagline: "Hair-stroke mapping practice",
    description:
      "0.3mm mechanical pencil with lead refills for brow stroke practice — train nano hair patterns before pigment hits skin.",
    image: productImageManifest["kit-practice-pencil"].primary,
    images: [...productImageManifest["kit-practice-pencil"].gallery],
    category: "kits",
    defaultPrice: 6500,
    volume: "Pencil + 12 leads",
    ingredients: "0.3mm HB graphite leads, metal-barrel practice pencil.",
    usage:
      "Practice curved hair strokes on paper or latex pads. Ideal for training and mapping drills.",
    cautions: ["Training tool only — not for skin pigment procedures."],
  },
  {
    id: "kit-lead-refills",
    slug: "practice-pencil-lead-refills",
    name: "Lead Refills 0.3mm",
    shade: "HB · 12 pcs",
    tagline: "60mm leads for practice pencil",
    description:
      "0.3mm HB lead refills (60mm, 12 pcs) for the brow stroke practice pencil — keep training sessions stocked.",
    image: productImageManifest["kit-lead-refills"].primary,
    images: [...productImageManifest["kit-lead-refills"].gallery],
    category: "kits",
    defaultPrice: 3500,
    volume: "12 leads",
    ingredients: "0.3mm HB graphite, 60mm length.",
    usage: "Load into any 0.3mm mechanical practice pencil.",
    cautions: ["Training accessory only."],
  },
  {
    id: "kit-macro-ring-light",
    slug: "pmu-macro-ring-light",
    name: "PMU Macro Ring Light",
    shade: "100mm macro + LED",
    tagline: "Phone-mount macro light for PMU docs",
    description:
      "Clip-on 100mm macro lens with LED ring light, tripod screw, travel case, and phone mount — capture true healed results and chair-side detail for lips, brows, and lashes.",
    image: productImageManifest["kit-macro-ring-light"].primary,
    images: [...productImageManifest["kit-macro-ring-light"].gallery],
    category: "kits",
    defaultPrice: 55000,
    volume: "Full kit",
    featured: true,
    ingredients:
      "100mm macro lens, LED ring, phone clamp, 1/4\" tripod mount, hard case.",
    usage:
      "Clip to phone camera, align lens, adjust LED intensity, mount to tripod if needed. Ideal for before/after documentation.",
    cautions: [
      "Do not look directly into high-intensity LED at close range.",
      "Keep dry; wipe lens with microfiber only.",
    ],
  },
];
