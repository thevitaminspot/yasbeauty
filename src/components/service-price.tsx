import { formatNaira } from "@/lib/format";
import type { StudioService } from "@/lib/services";

type PriceService = Pick<StudioService, "fromPrice" | "wasPrice">;

export function hasSlashPrice(service: PriceService) {
  return (
    typeof service.wasPrice === "number" &&
    Number.isFinite(service.wasPrice) &&
    service.wasPrice > service.fromPrice
  );
}

/** Current from-price with optional struck-through slash/compare-at price. */
export function ServicePrice({
  service,
  prefix = "From ",
  className,
}: {
  service: PriceService;
  prefix?: string;
  className?: string;
}) {
  const slash = hasSlashPrice(service);
  return (
    <span className={className}>
      {slash ? (
        <span className="mr-2 text-neutral-400 line-through decoration-neutral-400">
          {formatNaira(service.wasPrice!)}
        </span>
      ) : null}
      <span>
        {prefix}
        {formatNaira(service.fromPrice)}
      </span>
    </span>
  );
}
