/** Shared storefront class strings — mobile-first, keep styles consistent. */
export const ui = {
  pageShell:
    "mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-14 md:px-8 md:py-20",
  pageShellNarrow:
    "mx-auto max-w-2xl px-4 py-10 text-center sm:px-5 sm:py-14 md:px-8 md:py-24",
  eyebrow:
    "text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-[11px]",
  pageTitle:
    "mt-3 font-serif text-[clamp(2.15rem,9vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-black",
  sectionTitle:
    "font-serif text-[clamp(1.75rem,7vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em] text-black",
  pageLede:
    "mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 sm:mt-4",
  btnPrimary:
    "inline-flex min-h-12 items-center justify-center border border-black bg-black px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-7",
  btnSecondary:
    "inline-flex min-h-12 items-center justify-center border border-black bg-transparent px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:px-7",
  btnGhost:
    "inline-flex min-h-11 items-center justify-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-600 underline-offset-4 transition hover:text-black hover:underline",
  fieldLabel:
    "block text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 sm:text-[11px]",
  fieldInput:
    "mt-2 box-border w-full min-w-0 max-w-full border border-neutral-300 bg-white px-3.5 py-3.5 text-base outline-none focus:border-black sm:px-4 sm:text-sm",
  panel:
    "min-w-0 overflow-hidden border border-neutral-200 bg-white p-4 sm:p-6 md:p-8",
  chip: "inline-flex min-h-10 items-center px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition sm:px-4 sm:text-[11px]",
  chipActive: "bg-black text-white",
  chipIdle:
    "border border-neutral-300 text-neutral-600 hover:border-black hover:text-black",
} as const;
