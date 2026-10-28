import "server-only";
import { unstable_cache } from "next/cache";
import {
  getServiceBySlug as readServiceBySlug,
  readServices,
} from "@/lib/services-store";
import type { StudioService } from "@/lib/services";

export type { StudioService } from "@/lib/services";

export const getServices = unstable_cache(
  () => readServices(),
  ["yasbeauty-studio-services-v6"],
  { tags: ["catalog-services"] },
);

export async function getServiceBySlug(
  slug: string,
): Promise<StudioService | undefined> {
  const services = await getServices();
  return services.find((s) => s.slug === slug);
}

/** Uncached lookup for admin / booking writes after mutation. */
export { readServiceBySlug };
