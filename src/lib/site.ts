export const site = {
  name: "Yas Beauty Allure",
  phone: "+234 814 224 6407",
  phoneHref: "+2348142246407",
  whatsapp: "2348142246407",
  email: "hello@yasbeautyallure.com",
  instagramHandle: "@yasbeautyallure",
  instagram: "https://instagram.com/yasbeautyallure",
  address: {
    label: "Abuja, Nigeria",
    full: "Abuja studio · Nigeria",
  },
} as const;

export function whatsappHref(message: string, phone = site.whatsapp) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function formatNairaLabel(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}
