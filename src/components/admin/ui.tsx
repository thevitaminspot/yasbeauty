import Link from "next/link";
import type { ReactNode } from "react";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-neutral-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 font-serif text-4xl italic text-black">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function AdminQuickActions({ children }: { children: ReactNode }) {
  return <div className="mb-8 flex flex-wrap gap-2">{children}</div>;
}

export function AdminQuickAction({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center border border-neutral-300 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:border-black hover:text-black"
    >
      {children}
    </Link>
  );
}

export function AdminStatCard({
  href,
  label,
  value,
  hint,
}: {
  href?: string;
  label: string;
  value: string;
  hint?: string;
}) {
  const className =
    "block border border-neutral-200 bg-white p-5 transition hover:border-black";
  const body = (
    <>
      <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </span>
      <span className="mt-3 block font-serif text-3xl italic text-black">
        {value}
      </span>
      {hint ? (
        <span className="mt-2 block text-xs leading-5 text-neutral-500">
          {hint}
        </span>
      ) : null}
    </>
  );

  if (!href) return <div className={className}>{body}</div>;
  return (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}

export function AdminSection({
  title,
  href,
  linkLabel = "View all",
  children,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
          {title}
        </h2>
        {href ? (
          <Link
            href={href}
            className="text-[11px] uppercase tracking-[0.12em] text-neutral-600 hover:text-black"
          >
            {linkLabel}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function AdminPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden border border-neutral-200 bg-white ${className}`}>
      {children}
    </div>
  );
}

export function AdminEmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm text-neutral-500">{children}</p>
    </div>
  );
}
