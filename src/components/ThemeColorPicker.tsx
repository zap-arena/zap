import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccent } from "../store/theme";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function ThemeColorPicker({
  size = "sm",
}: {
  size?: "sm" | "xs";
}) {
  const { accent, setAccent, accents } = useAccent();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Change theme color"
          aria-label="Change theme color"
          className={cn(
            size === "xs" ? "h-7 w-7" : "h-8 w-8",
            "text-muted-foreground hover:text-foreground transition-colors",
          )}
        >
          <Palette size={size === "xs" ? 13 : 15} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-3">
        <p className="mb-2.5 text-xs font-semibold text-foreground">
          Select Color
        </p>
        <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-0.5">
          {accents.map((a) => {
            const selected = a.id === accent.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setAccent(a.id)}
                aria-pressed={selected}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-2.5 py-2 text-sm font-medium transition-colors",
                  selected
                    ? "border-foreground bg-accent"
                    : "border-border hover:bg-accent",
                )}
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `hsl(${a.dot.h} ${a.dot.s}% ${a.dot.l}%)`,
                  }}
                >
                  {selected && (
                    <Check
                      size={12}
                      strokeWidth={3}
                      style={{ color: `hsl(${a.light.fg})` }}
                    />
                  )}
                </span>
                <span className="truncate">{a.label}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
