"use client";

import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { AccountIcon } from "@/components/account-icon";
import { clerkAppearance } from "@/lib/clerk-appearance";

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

function AccountIconLink({ inverse = false }: { inverse?: boolean }) {
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

function AccountIconFallback({ inverse = false }: { inverse?: boolean }) {
  return (
    <span
      className={`nav-icon inline-flex ${inverse ? "text-white" : "text-black"}`}
      aria-hidden
    >
      <AccountIcon />
    </span>
  );
}

const userButtonAppearance = {
  ...clerkAppearance,
  elements: {
    ...clerkAppearance.elements,
    avatarBox: "size-[1.35rem] rounded-full ring-1 ring-white/25",
    userButtonTrigger:
      "rounded-full focus:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
  },
} as const;

/** Clerk-standard account control: UserButton when signed in, sign-in link when out. */
export function AccountMenuClerk({ inverse = false }: { inverse?: boolean }) {
  return (
    <>
      <Show when="signed-out">
        <AccountIconLink inverse={inverse} />
      </Show>
      <Show when="signed-in">
        <div className="nav-icon inline-flex">
          <UserButton
            fallback={<AccountIconFallback inverse={inverse} />}
            appearance={userButtonAppearance}
            userProfileProps={{
              appearance: clerkAppearance,
            }}
          >
            <UserButton.MenuItems>
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
              <UserButton.Action label="manageAccount" />
              <UserButton.Action label="signOut" />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </Show>
    </>
  );
}
