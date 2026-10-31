"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AccountIcon } from "@/components/account-icon";
import { isAuthEnabled } from "@/lib/auth-config";

const AccountMenuClerk = dynamic(
  () =>
    import("@/components/account-menu-clerk").then((m) => m.AccountMenuClerk),
  {
    ssr: false,
    loading: () => (
      <span className="nav-icon inline-flex animate-pulse" aria-hidden />
    ),
  },
);

function AccountLink({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/sign-in"
      className={`nav-icon transition hover:opacity-60 ${
        inverse ? "text-white" : "text-black"
      }`}
      aria-label="Account"
    >
      <AccountIcon />
    </Link>
  );
}

export function AccountMenu({ inverse = false }: { inverse?: boolean }) {
  if (!isAuthEnabled()) {
    return <AccountLink inverse={inverse} />;
  }

  return <AccountMenuClerk inverse={inverse} />;
}
