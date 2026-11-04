import Link from "next/link";
import { Suspense } from "react";
import { BookPanel } from "@/app/(store)/book/book-panel";
import { site } from "@/lib/site";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "Book Appointment",
  description:
    "Book nano brows, lip blush, permanent eyeliner, consultation, or training at Yas Beauty Allure Abuja.",
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
    <div className={`${ui.pageShell} grid min-w-0 gap-10 overflow-x-hidden lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-14`}>
      <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <p className={ui.eyebrow}>Studio</p>
        <h1 className={`${ui.pageTitle} max-w-[9ch]`}>Book.</h1>
        <p className={`${ui.pageLede} max-w-sm`}>
          Pick a service, choose a preferred time or cohort, then pay the
          deposit to hold your request.
        </p>

        <dl className="mt-8 space-y-5 border-t border-neutral-200 pt-6 text-sm">
          <div>
            <dt className={ui.eyebrow}>Deposit</dt>
            <dd className="mt-2 text-neutral-700">
              ₦15,000 procedures · ₦250,000 training
            </dd>
          </div>
          <div>
            <dt className={ui.eyebrow}>Scheduling</dt>
            <dd className="mt-2 text-neutral-700">
              Procedures use a preferred date. Training books by cohort month.
            </dd>
          </div>
          <div>
            <dt className={ui.eyebrow}>Studio</dt>
            <dd className="mt-2 text-neutral-700">{site.address.full}</dd>
          </div>
        </dl>

        <p className="mt-8 text-sm text-neutral-500">
          Prefer to browse first?{" "}
          <Link href="/services" className="underline underline-offset-4 hover:text-black">
            Services
          </Link>
          {" · "}
          <a
            href={`mailto:${site.email}`}
            className="underline underline-offset-4 hover:text-black"
          >
            Email
          </a>
        </p>
      </aside>

      <div className="min-w-0 max-w-full">
        <Suspense
          fallback={
            <div className="min-h-[420px] animate-pulse border border-neutral-200 bg-neutral-50" />
          }
        >
          <BookFormLoader searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
