import { cn } from "../lib/utils";
import { ThunderLogo } from "./ThunderLogo";

interface ZapLoaderProps {
  size?: "sm" | "md" | "lg" | "fullscreen";
  text?: string;
  className?: string;
}

export default function ZapLoader({
  size = "md",
  text,
  className,
}: ZapLoaderProps) {
  const sizeMap = {
    sm: {
      box: "w-8 h-8",
      ring: "w-8 h-8",
      bolt: "w-3.5 h-3.5",
      text: "text-xs",
    },
    md: {
      box: "w-14 h-14",
      ring: "w-14 h-14",
      bolt: "w-6 h-6",
      text: "text-sm",
    },
    lg: {
      box: "w-20 h-20",
      ring: "w-20 h-20",
      bolt: "w-9 h-9",
      text: "text-base",
    },
    fullscreen: {
      box: "w-24 h-24",
      ring: "w-24 h-24",
      bolt: "w-11 h-11",
      text: "text-base",
    },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn("relative flex items-center justify-center", currentSize.box)}>
        {/* Soft background glow */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-pulse" />

        {/* Outer clockwise spinning ring */}
        <svg
          className={cn("absolute animate-spin", currentSize.ring)}
          viewBox="0 0 50 50"
          style={{ animationDuration: "1.4s" }}
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="text-primary/20"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeDasharray="40 85"
            strokeLinecap="round"
            className="text-primary"
          />
        </svg>

        {/* Inner counter-clockwise pulsing dashed ring */}
        <svg
          className={cn(
            "absolute animate-spin opacity-70",
            size === "sm" ? "w-6 h-6" : size === "md" ? "w-10 h-10" : "w-16 h-16"
          )}
          viewBox="0 0 50 50"
          style={{ animationDuration: "2.4s", animationDirection: "reverse" }}
        >
          <circle
            cx="25"
            cy="25"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="15 25"
            strokeLinecap="round"
            className="text-blue-400 dark:text-blue-300"
          />
        </svg>

        {/* Center glowing lightning bolt with theme-independent contrast */}
        <div className="relative z-10 flex items-center justify-center">
          <ThunderLogo
            className={cn(
              "zap-lightning-bolt",
              currentSize.bolt
            )}
            style={{
              color: "#fbbf24",
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.45)) drop-shadow(0 0 10px #f59e0b)",
            }}
          />
        </div>
      </div>

      {text && (
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          <p
            className={cn(
              "font-medium text-muted-foreground tracking-wide select-none animate-pulse",
              currentSize.text
            )}
          >
            {text}
          </p>
        </div>
      )}
    </div>
  );

  if (size === "fullscreen") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background/80 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
}
