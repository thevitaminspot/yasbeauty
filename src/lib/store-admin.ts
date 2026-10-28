import { isAuthEnabled } from "@/lib/auth-config";

export async function isStoreAdmin(): Promise<boolean> {
  if (!isAuthEnabled()) {
    return true;
  }

  const { auth, currentUser } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) return false;

  const user = await currentUser();
  if (!user) return false;

  if (user.publicMetadata?.role === "admin") return true;

  const allowlist =
    process.env.STORE_ADMIN_EMAILS?.split(",").map((e) =>
      e.trim().toLowerCase(),
    ) ?? [];

  if (allowlist.length === 0) return false;

  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
  return email ? allowlist.includes(email) : false;
}
