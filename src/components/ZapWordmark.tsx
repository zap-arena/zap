import { Zap } from "lucide-react";
import { cn } from "../lib/utils";

export interface ZapWordmarkProps {
  className?: string;
  boltClassName?: string;
}

/** Renders "ZAP" with the bolt from the brand mark standing in for the "A". */
export function ZapWordmark({
  className,
  boltClassName,
}: Readonly<ZapWordmarkProps>) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-foreground font-black tracking-tight",
        className,
      )}
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      Z
      <Zap
        size="1em"
        className={cn(
          "inline-block -mx-[0.04em] translate-y-[0.03em] fill-warning text-warning",
          boltClassName,
        )}
        strokeWidth={1.5}
      />
      P
    </span>
  );
}
