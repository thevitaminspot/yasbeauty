"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { AccountIcon } from "@/components/account-icon";

function BagIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-4"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 8h12l-1 12H7L6 8Zm3-3a3 3 0 0 1 6 0v3H9V5Z"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-4"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 3v3m8-3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
      />
    </svg>
  );
}

export function AccountMenuClerk({ inverse = false }: { inverse?: boolean }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <span
        className={`icon-hit inline-flex animate-pulse ${
          inverse ? "bg-white/20" : "bg-neutral-200"
        }`}
        aria-hidden
      />
    );
  }

  if (isSignedIn) {
    return (
      <div className="icon-hit inline-flex">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-7 w-7 rounded-none ring-1 ring-white/30",
            },
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Action label="manageAccount" />
            <UserButton.Link
              label="My orders"
              labelIcon={<BagIcon />}
              href="/account/orders"
            />
            <UserButton.Link
              label="My bookings"
              labelIcon={<CalendarIcon />}
              href="/account/bookings"
            />
            <UserButton.Action label="signOut" />
          </UserButton.MenuItems>
        </UserButton>
      </div>
    );
  }

  return (
    <Link
      href="/sign-in"
      className={`icon-hit inline-flex transition hover:opacity-60 ${
        inverse ? "text-white" : "text-black"
      }`}
      aria-label="Account"
    >
      <AccountIcon className="" />
    </Link>
  );
}
