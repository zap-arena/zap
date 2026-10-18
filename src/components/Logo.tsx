"use client"

import Image from "next/image";
import { cn } from "../lib/utils";

export interface LogoProps {
  size?: number | string;
  className?: string;
}

/** The cropped brand mark (circle + bolt) from the full ZAP logo artwork. */
export function Logo({ size = 24, className }: LogoProps) {
  const numSize = typeof size === "string" ? parseInt(size) : size;
  return (
    <Image
      src="/logo-mark.png"
      alt="ZAP"
      width={numSize}
      height={numSize}
      className={cn("inline-block object-contain", className)}
      priority
    />
  );
}
