import { cn } from "../lib/utils";

export interface LogoProps {
  size?: number | string;
  className?: string;
}

/** The cropped brand mark (circle + bolt) from the full ZAP logo artwork. */
export function Logo({ size = 24, className }: LogoProps) {
  return (
    <img
      src="/logo-mark.png"
      alt="ZAP"
      width={size}
      height={size}
      className={cn("inline-block object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}
