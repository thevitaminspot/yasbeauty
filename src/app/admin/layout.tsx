import { Suspense } from "react";
import { AdminShell } from "@/components/admin/shell";
import { AdminUnauthorized } from "@/app/admin/unauthorized";
import { isAuthEnabled } from "@/lib/auth-config";
import { isStoreAdmin } from "@/lib/store-admin";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const instant = false;

async function AdminGate({ children }: { children: React.ReactNode }) {
  if (!isAuthEnabled()) {
    return <AdminShell>{children}</AdminShell>;
  }

  if (await isStoreAdmin()) {
    return <AdminShell>{children}</AdminShell>;
  }

  const { auth, currentUser } = await import("@clerk/nextjs/server");
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: "/admin" });
  }

  // Do not revoke sessions here — killing the session on every denied /admin
  // hit can look abusive to Clerk and block further sign-ins.
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  return <AdminUnauthorized email={email} />;
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
