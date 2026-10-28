import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { isAuthEnabled } from "@/lib/auth-config";

type ProxyHandler = (
  req: NextRequest,
  event: NextFetchEvent,
) => Response | Promise<Response>;

let clerkHandler: ProxyHandler | null = null;

async function getClerkHandler(): Promise<ProxyHandler> {
  if (clerkHandler) return clerkHandler;

  const { clerkMiddleware, createRouteMatcher } = await import(
    "@clerk/nextjs/server"
  );
  const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

  clerkHandler = clerkMiddleware(async (auth, req) => {
    if (isAdminRoute(req)) {
      await auth.protect();
    }
  }) as ProxyHandler;

  return clerkHandler;
}

export default async function proxy(req: NextRequest, event: NextFetchEvent) {
  if (!isAuthEnabled()) {
    return NextResponse.next();
  }

  const handler = await getClerkHandler();
  return handler(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
