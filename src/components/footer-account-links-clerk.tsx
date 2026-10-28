"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export function FooterAccountLinksClerk() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded || !isSignedIn) return null;

  return (
    <li>
      <Link
        href="/account/orders"
        className="text-sm text-neutral-300 transition hover:text-white"
      >
        Track my order
      </Link>
    </li>
  );
}
