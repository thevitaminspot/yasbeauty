import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { site } from "@/lib/site";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "Shipping & returns",
  description: `Delivery areas, fees, and returns for ${site.name}.`,
};

export default function ShippingPage() {
  return (
    <div className={ui.pageShellNarrow}>
      <PageHeader
        title="Shipping & returns"
        lede="How we deliver pigments and when returns apply."
        align="center"
      />
      <div className="mt-12 space-y-8 text-left text-sm leading-relaxed text-neutral-700">
        <section className="space-y-3">
          <h2 className="font-medium text-black">Delivery</h2>
          <p>
            Abuja area fees are calculated at checkout by location. We also
            ship elsewhere in Nigeria and internationally at the rates shown
            during checkout. Timing depends on your zone and courier
            schedules.
          </p>
          <p>
            See current areas in{" "}
            <Link href="/checkout" className="underline">
              checkout
            </Link>{" "}
            after adding items to your bag.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-medium text-black">Returns</h2>
          <p>
            Unopened products in original condition may be eligible for return
            within 7 days of delivery when arranged with us first. Opened
            pigments and aftercare generally cannot be returned for hygiene
            reasons. Damaged-in-transit claims need photos within 48 hours of
            delivery.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-medium text-black">Studio services</h2>
          <p>
            Booking requests are not physical shipments. Reschedule or cancel
            by contacting the studio as early as you can.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-medium text-black">Help</h2>
          <p>
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>{" "}
            · WhatsApp {site.phone}
          </p>
        </section>
      </div>
    </div>
  );
}
