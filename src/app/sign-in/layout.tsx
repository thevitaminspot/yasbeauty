import { SiteShell } from "@/components/site-shell";

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
