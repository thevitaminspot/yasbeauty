/** Black & white brand styling for Clerk — matches storefront, minimal chrome. */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#0a0a0a",
    colorBackground: "#ffffff",
    colorText: "#0a0a0a",
    colorTextSecondary: "#737373",
    colorInputBackground: "#ffffff",
    colorInputText: "#0a0a0a",
    colorNeutral: "#0a0a0a",
    colorDanger: "#b91c1c",
    borderRadius: "0px",
    fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
    fontFamilyButtons: "var(--font-dm-sans), system-ui, sans-serif",
  },
  elements: {
    rootBox: "font-sans",
    card: "shadow-none border border-neutral-200 rounded-none bg-white",
    headerTitle: "font-serif text-2xl italic font-medium tracking-tight text-black",
    headerSubtitle: "text-sm text-neutral-500",
    socialButtonsBlockButton:
      "border border-neutral-300 rounded-none bg-white text-black hover:bg-neutral-50 shadow-none",
    socialButtonsBlockButtonText: "text-xs font-medium uppercase tracking-[0.14em]",
    dividerLine: "bg-neutral-200",
    dividerText: "text-[10px] uppercase tracking-[0.18em] text-neutral-400",
    formFieldLabel:
      "text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500",
    formFieldInput:
      "rounded-none border-neutral-300 bg-white text-black focus:border-black",
    formButtonPrimary:
      "bg-black text-white hover:bg-neutral-800 rounded-none uppercase tracking-[0.2em] text-[11px] font-medium shadow-none",
    formButtonReset: "text-neutral-600 hover:text-black",
    footerActionLink: "text-black hover:text-neutral-600",
    footerActionText: "text-neutral-500",
    identityPreviewText: "text-black",
    identityPreviewEditButton: "text-neutral-600 hover:text-black",
    alertText: "text-neutral-700",
    otpCodeFieldInput: "rounded-none border-neutral-300 bg-white",

    /* UserButton menu — strip identity header + Clerk footer (mobile-like list) */
    userButtonPopoverCard:
      "rounded-none border border-neutral-200 bg-white shadow-none",
    userButtonPopoverMain:
      "rounded-none border-0 bg-white p-0",
    userButtonPopoverUserPreview: "hidden",
    userPreview: "hidden",
    userButtonPopoverActions: "border-0 p-1",
    userButtonPopoverActionButton:
      "rounded-none px-3 py-2.5 hover:bg-neutral-50",
    userButtonPopoverActionButtonText:
      "text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-700",
    userButtonPopoverActionButtonIconBox: "text-neutral-500",
    userButtonPopoverFooter: "hidden",
    userButtonPopoverCustomItemButton:
      "rounded-none px-3 py-2.5 hover:bg-neutral-50",

    /* Manage-account modal — same B&W system, tighter chrome */
    modalBackdrop: "bg-black/50",
    modalContent: "rounded-none bg-white shadow-none border border-neutral-200",
    modalCloseButton:
      "rounded-none text-neutral-500 hover:bg-neutral-100 hover:text-black",
    profileSectionTitleText:
      "font-serif text-lg italic font-medium tracking-tight text-black",
    profileSectionTitle: "border-neutral-200",
    profileSectionContent: "text-sm text-neutral-600",
    profileSectionPrimaryButton:
      "rounded-none border border-neutral-300 text-[11px] uppercase tracking-[0.16em] hover:border-black",
    navbar: "border-neutral-200 bg-white",
    navbarButton:
      "rounded-none text-neutral-600 hover:bg-neutral-50 hover:text-black",
    navbarButtonActive: "bg-neutral-100 text-black",
    navbarButtonIcon: "text-neutral-500",
    scrollBox: "bg-white",
    pageScrollBox: "bg-white",
    badge: "rounded-none bg-neutral-100 text-neutral-700 border-0",
    menuButton: "rounded-none hover:bg-neutral-50",
    menuList: "rounded-none border border-neutral-200 bg-white shadow-none",
    menuItem: "rounded-none text-black hover:bg-neutral-50",
    avatarBox: "rounded-full",
    avatarImageActionsUpload:
      "rounded-none text-[11px] uppercase tracking-[0.16em]",
  },
} as const;
