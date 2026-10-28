/** Studio results — previous clients (PMU brows, lashes, soft glam). */
export type ClientWorkShot = {
  id: string;
  src: string;
  alt: string;
  /** Short treatment label shown under the frame */
  treatment: string;
};

export const clientWork: ClientWorkShot[] = [
  {
    id: "melanin-mapped",
    src: "/clients/client-01.jpg",
    alt: "Nano brow mapping with Yas Melanin Brown pigment bottles",
    treatment: "Nano brows",
  },
  {
    id: "brow-finish",
    src: "/clients/client-02.jpg",
    alt: "Fresh nano brow strokes on a previous client",
    treatment: "Nano brows",
  },
  {
    id: "brow-detail",
    src: "/clients/client-03.jpg",
    alt: "Close-up of defined nano brow arch",
    treatment: "Nano brows",
  },
  {
    id: "chair-brows",
    src: "/clients/client-04.jpg",
    alt: "In-chair brow result with mapping check",
    treatment: "In chair",
  },
  {
    id: "lash-macro",
    src: "/clients/client-05.jpg",
    alt: "Macro detail of curled lash extensions",
    treatment: "Lashes",
  },
  {
    id: "lash-glitter",
    src: "/clients/client-06.jpg",
    alt: "Wispy lash set with soft brow finish",
    treatment: "Lashes",
  },
  {
    id: "lash-volume",
    src: "/clients/client-07.jpg",
    alt: "Volume lashes with laminated brow",
    treatment: "Lashes",
  },
  {
    id: "soft-glam",
    src: "/clients/client-08.jpg",
    alt: "Client soft glam with brows, lashes, and glossy lips",
    treatment: "Soft glam",
  },
  {
    id: "full-finish",
    src: "/clients/client-09.jpg",
    alt: "Client portrait with brows, lashes, and lip gloss",
    treatment: "Full finish",
  },
  {
    id: "studio-portrait",
    src: "/clients/client-10.jpg",
    alt: "Studio client result — brows, lashes, and lip tint",
    treatment: "Studio result",
  },
];
