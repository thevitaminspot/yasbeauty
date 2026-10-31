import Link from "next/link";
import {
  AdminPageHeader,
  AdminPanel,
  AdminQuickAction,
  AdminQuickActions,
} from "@/components/admin/ui";

export const metadata = { title: "Help" };
export const instant = false;

const sections = [
  {
    id: "start",
    title: "Getting started",
    href: "/admin",
    linkLabel: "Open Today",
    steps: [
      "Sign in with yasbeautyallure6@gmail.com or thevitaminspotltd@gmail.com — both accounts are store admins.",
      "Use the left menu for daily work (Orders, Bookings, Products) and Settings for studio setup.",
      "Today shows pending bookings, recent orders, and stock at a glance.",
    ],
  },
  {
    id: "products",
    title: "Add & edit products",
    href: "/admin/products",
    linkLabel: "Go to Products",
    steps: [
      "Open Products, then click Add product.",
      "Fill name, category, price (naira), volume, and stock. Upload a clear product photo.",
      "Add tagline, description, ingredients, usage, and cautions so the shop page looks complete.",
      "Tick Featured or Bestseller if it should stand out on the storefront.",
      "Save product — it appears in the shop immediately. Edit anytime from the list; update stock when inventory changes.",
    ],
  },
  {
    id: "orders",
    title: "Orders & delivery updates",
    href: "/admin/orders",
    linkLabel: "Go to Orders",
    steps: [
      "Paid orders land here after Paystack success. Customers and admin both get email receipts.",
      "Advance status as you work: Confirmed → Packed → Sent → Delivered (dropdown or next-step button).",
      "Each status change emails the customer with the brand logo so they can track the package.",
      "Use search or tabs to find an order by name, phone, email, or reference.",
    ],
  },
  {
    id: "bookings",
    title: "Bookings",
    href: "/admin/bookings",
    linkLabel: "Go to Bookings",
    steps: [
      "New requests show as Pending. Confirm when the slot works, or cancel if it does not.",
      "Confirming or cancelling sends email to the client and admin.",
      "Mark Completed after the appointment. Use Hours (Settings) to set weekly slots and block dates.",
    ],
  },
  {
    id: "services",
    title: "Services & training",
    href: "/admin/services",
    linkLabel: "Go to Services",
    steps: [
      "Services: add studio treatments customers can book (name, price, duration, image, description).",
      "Training: update cohort details, fees, and copy for the training page under Settings → Training.",
      "Hours: set open days/times and blocked dates so booking only offers real availability.",
    ],
  },
  {
    id: "delivery",
    title: "Delivery areas & fees",
    href: "/admin/delivery",
    linkLabel: "Go to Delivery",
    steps: [
      "List Abuja areas you deliver to and set a fee for each.",
      "You can fill major Abuja locations in one click, then edit prices and Save delivery prices.",
      "Checkout only offers the areas you save here.",
    ],
  },
  {
    id: "customers",
    title: "Customers & messages",
    href: "/admin/customers",
    linkLabel: "Go to Customers",
    steps: [
      "Customers lists people from paid orders — useful for follow-up.",
      "Messages holds contact-form submissions from the website. Reply from your email client.",
      "View shop (sidebar) opens the live storefront so you can check what customers see.",
    ],
  },
  {
    id: "emails",
    title: "Emails you will receive",
    href: "/admin/orders",
    linkLabel: "Review orders",
    steps: [
      "New paid order → customer confirmation + admin alert.",
      "Order packed / sent / delivered → customer + admin update.",
      "Booking pending confirmation, confirmed, completed, or cancelled → customer + admin.",
      "Admin alerts go to both yasbeautyallure6@gmail.com and thevitaminspotltd@gmail.com. Check spam if something is missing.",
    ],
  },
] as const;

export default function AdminHelpPage() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Guide"
        title="Help"
        description="How to run the shop and studio from this admin — products, orders, bookings, and settings."
      />

      <AdminQuickActions>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="inline-flex items-center border border-neutral-300 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:border-black hover:text-black"
          >
            {section.title}
          </a>
        ))}
      </AdminQuickActions>

      <AdminPanel className="mb-8 px-5 py-4">
        <p className="text-sm leading-6 text-neutral-600">
          Store admins:{" "}
          <strong className="font-medium text-black">
            yasbeautyallure6@gmail.com
          </strong>{" "}
          and{" "}
          <strong className="font-medium text-black">
            thevitaminspotltd@gmail.com
          </strong>
          . Only these emails can open <code className="text-xs">/admin</code>.
        </p>
      </AdminPanel>

      <div className="space-y-8">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24 border-b border-neutral-200 pb-8 last:border-b-0"
          >
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-serif text-2xl italic text-black">
                {section.title}
              </h2>
              <Link
                href={section.href}
                className="text-[11px] uppercase tracking-[0.12em] text-neutral-600 hover:text-black"
              >
                {section.linkLabel} →
              </Link>
            </div>
            <ol className="list-decimal space-y-2.5 pl-5 text-sm leading-6 text-neutral-700">
              {section.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <AdminQuickAction href="/admin/products">Add a product</AdminQuickAction>
        <AdminQuickAction href="/admin/orders">Review orders</AdminQuickAction>
        <AdminQuickAction href="/admin/bookings">Manage bookings</AdminQuickAction>
        <AdminQuickAction href="/admin">Back to Today</AdminQuickAction>
      </div>
    </div>
  );
}
