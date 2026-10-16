import { Terminal, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface InputPanelProps {
  stdin: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function InputPanel({ stdin, onChange, disabled }: InputPanelProps) {
  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="h-9 px-3 border-b border-border bg-card/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Terminal size={13} className="text-primary" />
          <span>Standard Input (stdin)</span>
        </div>

        {stdin && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onChange("")}
            disabled={disabled}
            className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground gap-1"
          >
            <Trash2 size={11} />
            <span>Clear</span>
          </Button>
        )}
      </div>

      <div className="flex-1 p-2.5 min-h-[100px]">
        <textarea
          value={stdin}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter input passed to your program via input() or cin or Scanner..."
          className="w-full h-full bg-muted/40 border border-border rounded-lg p-2.5 font-mono text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/60 leading-relaxed placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
  );
}
