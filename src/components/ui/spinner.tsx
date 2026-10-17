import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4 animate-spin text-primary", className)}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="opacity-20"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray="28 35"
        strokeLinecap="round"
        className="opacity-90"
      />
    </svg>
  );
}

export { Spinner };

