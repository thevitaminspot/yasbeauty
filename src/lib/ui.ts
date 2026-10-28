/** Shared storefront class strings — keep styles consistent sitewide. */
export const ui = {
  pageShell: "mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20",
  pageShellNarrow:
    "mx-auto max-w-2xl px-5 py-16 text-center md:px-8 md:py-24",
  eyebrow:
    "text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500",
  pageTitle:
    "mt-3 font-serif text-[clamp(2.5rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-black",
  sectionTitle:
    "font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em] text-black",
  pageLede: "mt-4 max-w-xl text-sm leading-relaxed text-neutral-600",
  btnPrimary:
    "inline-flex items-center justify-center border border-black bg-black px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50",
  btnSecondary:
    "inline-flex items-center justify-center border border-black bg-transparent px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50",
  btnGhost:
    "inline-flex items-center justify-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-600 underline-offset-4 transition hover:text-black hover:underline",
  fieldLabel:
    "block text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500",
  fieldInput:
    "mt-2 w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-black",
  panel: "border border-neutral-200 bg-white p-6 md:p-8",
  chip: "inline-flex items-center px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] transition",
  chipActive: "bg-black text-white",
  chipIdle:
    "border border-neutral-300 text-neutral-600 hover:border-black hover:text-black",
} as const;
