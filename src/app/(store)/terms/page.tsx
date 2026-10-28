import { PageHeader } from "@/components/page-header";
import { site } from "@/lib/site";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "Terms",
  description: `Terms of use for shopping and booking with ${site.name}.`,
};

export default function TermsPage() {
  return (
    <div className={ui.pageShellNarrow}>
      <PageHeader
        title="Terms"
        lede="Using the Yas Beauty Allure shop and studio booking tools."
        align="center"
      />
      <div className="mt-12 space-y-8 text-left text-sm leading-relaxed text-neutral-700">
        <section className="space-y-3">
          <h2 className="font-medium text-black">Professional use</h2>
          <p>
            Pigments and related products are sold for professional PMU use.
            By ordering, you confirm you understand and accept that intended
            use.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-medium text-black">Orders & payment</h2>
          <p>
            Prices are in Nigerian Naira. Orders are confirmed after successful
            Paystack payment. We may cancel or refund if an item cannot be
            fulfilled.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-medium text-black">Bookings</h2>
          <p>
            Studio requests are not confirmed appointments until we accept them.
            Preferred dates and times may change based on availability.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-medium text-black">Liability</h2>
          <p>
            Follow product usage and caution guidance. We are not responsible
            for results from improper professional technique or use outside
            labelled instructions.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-medium text-black">Contact</h2>
          <p>
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>{" "}
            · {site.phone}
          </p>
        </section>
      </div>
    </div>
  );
}
