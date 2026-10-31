import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

type LogoProps = {
  className?: string;
  variant?: "default" | "inverse";
  /** Larger mark + wordmark for footer / marketing surfaces */
  size?: "nav" | "lg";
};

/** Circular YBA mark + serif wordmark — wordmark stays visible at every breakpoint. */
export function Logo({
  className = "",
  variant = "default",
  size = "nav",
}: LogoProps) {
  const mark = variant === "inverse" ? "text-white" : "text-black";
  const isLarge = size === "lg";

  return (
    <Link
      href="/"
      className={`group inline-flex min-w-0 max-w-full items-center ${
        isLarge ? "gap-4" : "gap-2 sm:gap-2.5"
      } ${className}`}
      aria-label={`${site.name} home`}
    >
      <Image
        src="/brand/yba-logo.png"
        alt=""
        width={isLarge ? 96 : 64}
        height={isLarge ? 96 : 64}
        className={`shrink-0 rounded-full bg-white transition duration-300 group-hover:scale-[1.03] ${
          isLarge
            ? "h-12 w-12 md:h-14 md:w-14"
            : "h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11"
        }`}
        priority={size === "nav"}
        quality={100}
      />
      <span
        className={`min-w-0 truncate font-serif font-medium tracking-tight transition group-hover:opacity-80 ${mark} ${
          isLarge
            ? "text-3xl md:text-4xl"
            : "text-[1.2rem] leading-none sm:text-xl md:text-[1.6rem]"
        }`}
      >
        {site.name}
      </span>
    </Link>
  );
}
