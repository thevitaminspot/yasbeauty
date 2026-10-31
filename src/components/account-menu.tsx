"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AccountIcon } from "@/components/account-icon";
import { isAuthEnabled } from "@/lib/auth-config";

function AccountIconControl({
  inverse = false,
  href = "/sign-in",
  label = "Account",
}: {
  inverse?: boolean;
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className={`nav-icon transition hover:opacity-60 ${
        inverse ? "text-white" : "text-black"
      }`}
      aria-label={label}
    >
      <AccountIcon />
    </Link>
  );
}

const AccountMenuClerk = dynamic(
  () =>
    import("@/components/account-menu-clerk").then((m) => m.AccountMenuClerk),
  {
    ssr: false,
    // Regular outline icon — never a pulse box or Clerk avatar while hydrating.
    loading: () => <AccountIconControl inverse />,
  },
);

export function AccountMenu({ inverse = false }: { inverse?: boolean }) {
  if (!isAuthEnabled()) {
    return <AccountIconControl inverse={inverse} />;
  }

  return <AccountMenuClerk inverse={inverse} />;
}
