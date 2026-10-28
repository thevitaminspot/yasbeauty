import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";
import { ui } from "@/lib/ui";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  className?: string;
  align?: "left" | "center";
};

export function PageHeader({
  eyebrow,
  title,
  lede,
  className = "",
  align = "left",
}: PageHeaderProps) {
  return (
    <Reveal
      className={`${align === "center" ? "mx-auto text-center" : ""} ${className}`}
    >
      <header>
        {eyebrow ? <p className={ui.eyebrow}>{eyebrow}</p> : null}
        <h1 className={`${ui.pageTitle} ${eyebrow ? "" : "mt-0"}`}>{title}</h1>
        {lede ? (
          <p className={`${ui.pageLede} ${align === "center" ? "mx-auto" : ""}`}>
            {lede}
          </p>
        ) : null}
      </header>
    </Reveal>
  );
}
