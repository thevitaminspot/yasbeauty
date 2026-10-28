import { Suspense } from "react";
import { BookPanel } from "@/app/(store)/book/book-panel";
import { PageHeader } from "@/components/page-header";
import { site } from "@/lib/site";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "Book Appointment",
  description:
    "Book nano brows, lip blush, consultation, or training at Yas Beauty Allure Abuja.",
};

type Props = {
  searchParams: Promise<{ service?: string }>;
};

async function BookFormLoader({ searchParams }: Props) {
  const { service: initialServiceSlug } = await searchParams;
  return <BookPanel initialServiceSlug={initialServiceSlug} />;
}

export default function BookPage(props: Props) {
  return (
    <div className={`${ui.pageShell} grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16`}>
      <div>
        <PageHeader
          eyebrow="Studio"
          title="Book a chair."
          lede="Pick a service, preferred time, and your details. A deposit holds your request — we confirm the chair by email or phone."
        />
        <ul className="mt-10 space-y-3 border-t border-neutral-200 pt-8 text-sm text-neutral-600">
          <li>· Patch tests may be required before pigment procedures.</li>
          <li>· Deposit: ₦15,000 for procedures · ₦250,000 for artist training.</li>
          <li>· Reschedule with 48 hours notice when possible.</li>
        </ul>
        <p className="mt-8 text-sm text-neutral-500">
          Prefer email?{" "}
          <a
            href={`mailto:${site.email}`}
            className="underline underline-offset-4 hover:text-black"
          >
            {site.email}
          </a>
        </p>
      </div>

      <Suspense
        fallback={
          <div className="min-h-[420px] animate-pulse border border-neutral-200 bg-neutral-50" />
        }
      >
        <BookFormLoader searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
