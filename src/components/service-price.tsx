import { formatNaira } from "@/lib/format";
import type { Product } from "@/lib/product-types";
import type { StudioService } from "@/lib/services";

export function hasSlashAmount(price: number, wasPrice?: number | null) {
  return (
    typeof wasPrice === "number" &&
    Number.isFinite(wasPrice) &&
    wasPrice > price
  );
}

/** Struck-through compare-at + current price. */
export function SlashPrice({
  price,
  wasPrice,
  prefix = "",
  className,
}: {
  price: number;
  wasPrice?: number | null;
  prefix?: string;
  className?: string;
}) {
  const slash = hasSlashAmount(price, wasPrice);
  return (
    <span className={className}>
      {slash ? (
        <span className="mr-2 text-neutral-400 line-through decoration-neutral-400">
          {formatNaira(wasPrice!)}
        </span>
      ) : null}
      <span>
        {prefix}
        {formatNaira(price)}
      </span>
    </span>
  );
}

type PriceService = Pick<StudioService, "fromPrice" | "wasPrice">;

export function hasSlashPrice(service: PriceService) {
  return hasSlashAmount(service.fromPrice, service.wasPrice);
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
  return (
    <SlashPrice
      price={service.fromPrice}
      wasPrice={service.wasPrice}
      prefix={prefix}
      className={className}
    />
  );
}

export function ProductPrice({
  product,
  prefix = "",
  className,
}: {
  product: Pick<Product, "price" | "wasPrice">;
  prefix?: string;
  className?: string;
}) {
  return (
    <SlashPrice
      price={product.price}
      wasPrice={product.wasPrice}
      prefix={prefix}
      className={className}
    />
  );
}
