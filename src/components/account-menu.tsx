"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AccountIcon } from "@/components/account-icon";
import { AccountMenuClerk } from "@/components/account-menu-clerk";
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

/**
 * Always paint the outline icon on the server + first client paint, then swap
 * to the Clerk-aware menu. Avoids dynamic(ssr:false) Suspense hydration clashes
 * with neighboring header icons.
 */
export function AccountMenu({ inverse = false }: { inverse?: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isAuthEnabled()) {
    return <AccountIconControl inverse={inverse} />;
  }

  if (!mounted) {
    return <AccountIconControl inverse={inverse} />;
  }

  return <AccountMenuClerk inverse={inverse} />;
}
