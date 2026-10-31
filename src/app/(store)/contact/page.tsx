import { ContactChannelGrid } from "@/components/contact-icons";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHeader } from "@/components/page-header";
import { site } from "@/lib/site";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "Contact",
  description:
    "WhatsApp, Instagram, or send a note to Yas Beauty Allure in Abuja.",
};

export default function ContactPage() {
  return (
    <div
      className={`${ui.pageShell} grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)] lg:gap-16`}
    >
      <div>
        <PageHeader
          eyebrow="Contact"
          title="Write, or message."
          lede="Orders, wholesale kits, or a studio visit. Send a note — or WhatsApp if you need us today."
        />

        <ContactChannelGrid tone="onLight" includeCall className="mt-12" />

        <div className="mt-10 border-t border-neutral-200 pt-8">
          <p className={ui.eyebrow}>Studio</p>
          <p className="mt-2 font-serif text-xl font-medium italic text-black">
            {site.address.full}
          </p>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
