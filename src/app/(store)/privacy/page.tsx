import { PageHeader } from "@/components/page-header";
import { site } from "@/lib/site";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "Privacy",
  description: `How ${site.name} collects and uses your information.`,
};

export default function PrivacyPage() {
  return (
    <div className={ui.pageShellNarrow}>
      <PageHeader
        title="Privacy"
        lede="How we handle information when you shop, book, or contact the studio."
        align="center"
      />
      <div className="mt-12 space-y-8 text-left text-sm leading-relaxed text-neutral-700">
        <section className="space-y-3">
          <h2 className="font-medium text-black">What we collect</h2>
          <p>
            Account details (name, email) when you sign in; order and booking
            details (contact, delivery address, preferred appointment time);
            and messages you send through the contact form.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-medium text-black">How we use it</h2>
          <p>
            To process payments, fulfill orders, confirm studio bookings, and
            reply to your questions. Payment is handled by Paystack — we do not
            store full card numbers on our servers.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-medium text-black">Sharing</h2>
          <p>
            We share data with processors needed to run the shop: Clerk
            (authentication), Paystack (payments), Neon (database), and
            Cloudinary (product images when uploaded). We do not sell your
            personal information.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-medium text-black">Contact</h2>
          <p>
            Questions about privacy:{" "}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>{" "}
            or WhatsApp {site.phone}.
          </p>
        </section>
      </div>
    </div>
  );
}
