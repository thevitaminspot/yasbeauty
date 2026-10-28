"use client";

import dynamic from "next/dynamic";
import { isAuthEnabled } from "@/lib/auth-config";

const FooterAccountLinksClerk = dynamic(
  () =>
    import("@/components/footer-account-links-clerk").then(
      (m) => m.FooterAccountLinksClerk,
    ),
  { ssr: false },
);

/** Account links that only render for signed-in clients. */
export function FooterAccountLinks() {
  if (!isAuthEnabled()) return null;
  return <FooterAccountLinksClerk />;
}
