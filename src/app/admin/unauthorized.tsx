import Link from "next/link";

/** Shown when a signed-in user is not on the store admin allowlist. */
export function AdminUnauthorized({ email }: { email?: string | null }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-5">
      <div className="w-full max-w-md border border-neutral-200 bg-white p-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
          Admin
        </p>
        <h1 className="mt-2 font-serif text-3xl italic text-black">
          Access restricted
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          {email ? (
            <>
              Signed in as <strong className="text-black">{email}</strong>, which
              is not on the store admin list.
            </>
          ) : (
            <>This account is not on the store admin list.</>
          )}{" "}
          Use{" "}
          <strong className="text-black">yasbeautyallure6@gmail.com</strong> or{" "}
          <strong className="text-black">thevitaminspotltd@gmail.com</strong>,
          or ask an owner to add your email in{" "}
          <code className="text-xs">STORE_ADMIN_EMAILS</code>.
        </p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/sign-in?redirect_url=/admin"
            className="border border-black bg-black px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-white"
          >
            Switch account
          </Link>
          <Link
            href="/"
            className="border border-neutral-300 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700"
          >
            Back to site
          </Link>
        </div>
      </div>
    </main>
  );
}
