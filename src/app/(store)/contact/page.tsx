import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { site, whatsappHref } from "@/lib/site";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "Contact",
  description:
    "WhatsApp, Instagram, or send a note to Yas Beauty Allure in Abuja.",
};

const channels = [
  {
    label: "WhatsApp",
    value: site.phone,
    href: whatsappHref("Hi Yas Beauty Allure."),
  },
  {
    label: "Instagram",
    value: site.instagramHandle,
    href: site.instagram,
  },
  {
    label: "Call",
    value: site.phone,
    href: `tel:${site.phoneHref}`,
  },
  {
    label: "Studio",
    value: site.address.full,
    href: null,
  },
] as const;

export default function ContactPage() {
  return (
    <div className={`${ui.pageShell} grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)] lg:gap-16`}>
      <div>
        <PageHeader
          eyebrow="Contact"
          title="Write, or message."
          lede="Orders, wholesale kits, or a studio visit. Send a note — or WhatsApp if you need us today."
        />

        <ul className="mt-12 space-y-6 border-t border-neutral-200 pt-10">
          {channels.map((channel) => (
            <li key={channel.label}>
              {channel.href ? (
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    channel.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group block"
                >
                  <span className={`${ui.eyebrow}`}>{channel.label}</span>
                  <span className="mt-1 block font-serif text-xl font-medium italic group-hover:underline">
                    {channel.value}
                  </span>
                </a>
              ) : (
                <div>
                  <span className={`${ui.eyebrow}`}>{channel.label}</span>
                  <span className="mt-1 block font-serif text-xl font-medium italic">
                    {channel.value}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <ContactForm />
    </div>
  );
}
