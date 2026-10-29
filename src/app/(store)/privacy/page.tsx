import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { CONSENT_COOKIE } from "@/lib/cookie-consent";
import { site } from "@/lib/site";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "Privacy & cookies",
  description: `How ${site.name} uses cookies, local storage, and third-party services.`,
};

export default function PrivacyPage() {
  return (
    <div className={ui.pageShellNarrow}>
      <PageHeader
        title="Privacy & cookies"
        lede="What we store in your browser and which partners may set cookies when you shop or book."
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
          <h2 className="font-medium text-black">Essential storage</h2>
          <p>
            Needed for the site to work. We do not ask for consent before using
            them.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="font-medium text-black">Shopping bag</strong> —
              product lines are saved in your browser (local storage) so your bag
              stays while you browse.
            </li>
            <li>
              <strong className="font-medium text-black">Sign-in (Clerk)</strong>{" "}
              — if you create an account or sign in, Clerk sets cookies to keep
              you logged in and secure your session.
            </li>
            <li>
              <strong className="font-medium text-black">Cookie choice</strong> —
              we remember whether you accepted analytics in a first-party cookie
              named <code className="text-black">{CONSENT_COOKIE}</code>.
            </li>
            <li>
              <strong className="font-medium text-black">Payments (Paystack)</strong>{" "}
              — when you pay, Paystack may use cookies or similar tech on their
              checkout pages.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-black">Analytics (optional)</h2>
          <p>
            If you choose <strong className="font-medium text-black">Accept all</strong>{" "}
            on the cookie banner, we load Vercel Web Analytics for anonymous visit
            data (pages viewed, referrers, device type).{" "}
            <strong className="font-medium text-black">Essential only</strong> skips
            that script.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-black">Sharing</h2>
          <p>
            We share data with processors needed to run the shop: Clerk
            (authentication), Paystack (payments), Neon (database), Resend
            (transactional email), and Cloudinary (product images when uploaded).
            We do not sell your personal information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-black">Your choices</h2>
          <p>
            Clear site data or delete cookies for this site and the banner will
            appear again. Contact us to update or delete account-related data
            where we can.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-black">Contact</h2>
          <p>
            Questions about privacy:{" "}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>{" "}
            or WhatsApp {site.phone}.{" "}
            <Link href="/contact" className="underline">
              Contact form
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
