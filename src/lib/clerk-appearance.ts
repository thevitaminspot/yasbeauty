/** Black & white brand styling for Clerk components */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#0a0a0a",
    colorBackground: "#ffffff",
    colorText: "#0a0a0a",
    colorTextSecondary: "#525252",
    colorInputBackground: "#ffffff",
    colorInputText: "#0a0a0a",
    borderRadius: "0px",
    fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
  },
  elements: {
    card: "shadow-none border border-neutral-200 rounded-none",
    headerTitle: "font-serif italic",
    formButtonPrimary:
      "bg-black text-white hover:bg-neutral-800 rounded-none uppercase tracking-widest text-xs",
    footerActionLink: "text-black hover:text-neutral-600",
    socialButtonsBlockButton: "border-neutral-300 rounded-none",
  },
} as const;
