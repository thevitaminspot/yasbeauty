import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { isAuthEnabled } from "@/lib/auth-config";
import { isStoreAdmin } from "@/lib/store-admin";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const instant = false;

const adminSignIn = "/sign-in?redirect_url=/admin";

async function AdminGate({ children }: { children: React.ReactNode }) {
  if (!isAuthEnabled()) {
    return <AdminShell>{children}</AdminShell>;
  }

  if (await isStoreAdmin()) {
    return <AdminShell>{children}</AdminShell>;
  }

  const { auth, clerkClient } = await import("@clerk/nextjs/server");
  const { userId, sessionId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: "/admin" });
  }

  // Wrong account — clear the session so sign-in can collect the admin login.
  if (sessionId) {
    try {
      const client = await clerkClient();
      await client.sessions.revokeSession(sessionId);
    } catch {
      // Still send them to sign-in even if revoke fails.
    }
  }

  redirect(adminSignIn);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-neutral-50">
          <div className="h-24 w-64 animate-pulse bg-neutral-200" />
        </main>
      }
    >
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
