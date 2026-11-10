/** Shared storefront class strings — mobile-first, keep styles consistent. */
export const ui = {
  pageShell:
    "mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-14 md:px-8 md:py-20",
  pageShellNarrow:
    "mx-auto max-w-2xl px-4 py-10 text-center sm:px-5 sm:py-14 md:px-8 md:py-24",
  sectionShell: "mx-auto max-w-7xl px-4 sm:px-5 md:px-8",
  sectionPad: "border-b border-line bg-paper py-14 sm:py-16 md:py-24",
  sectionPadInk: "border-b border-white/10 bg-ink py-14 sm:py-16 md:py-24",
  eyebrow:
    "text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-[11px]",
  eyebrowOnInk:
    "text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400 sm:text-[11px]",
  pageTitle:
    "mt-3 font-serif text-[clamp(2.15rem,9vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-ink",
  sectionTitle:
    "font-serif text-[clamp(1.75rem,7vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em] text-ink",
  sectionTitleOnInk:
    "font-serif text-[clamp(1.75rem,7vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em] text-paper",
  pageLede:
    "mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 sm:mt-4",
  pageLedeOnInk:
    "mt-3 max-w-xl text-sm leading-relaxed text-neutral-400 sm:mt-4",
  price:
    "text-base font-medium tabular-nums tracking-[-0.01em] text-ink sm:text-lg",
  btnPrimary:
    "inline-flex min-h-12 items-center justify-center border border-ink bg-ink px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-paper transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-7",
  btnSecondary:
    "inline-flex min-h-12 items-center justify-center border border-ink bg-transparent px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-50 sm:px-7",
  btnPrimaryOnInk:
    "inline-flex min-h-12 items-center justify-center border border-white bg-white px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 sm:px-7",
  btnSecondaryOnInk:
    "inline-flex min-h-12 items-center justify-center border border-white/55 bg-transparent px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-paper transition hover:border-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:px-7",
  btnGhost:
    "inline-flex min-h-11 items-center justify-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-600 underline-offset-4 transition hover:text-ink hover:underline",
  btnGhostOnInk:
    "inline-flex min-h-11 items-center justify-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 underline-offset-4 transition hover:text-white hover:underline",
  fieldLabel:
    "block text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 sm:text-[11px]",
  fieldInput:
    "mt-2 box-border w-full min-w-0 max-w-full border border-neutral-300 bg-white px-3.5 py-3.5 text-base font-normal normal-case tracking-normal text-ink outline-none placeholder:text-neutral-400 focus:border-ink sm:px-4 sm:text-sm",
  panel:
    "min-w-0 overflow-hidden border border-line bg-surface p-4 sm:p-6 md:p-8",
  chip: "inline-flex min-h-10 items-center px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition sm:px-4 sm:text-[11px]",
  chipActive: "bg-ink text-paper",
  chipIdle:
    "border border-neutral-300 text-neutral-600 hover:border-ink hover:text-ink",
} as const;
