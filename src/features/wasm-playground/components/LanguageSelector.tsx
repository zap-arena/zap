import type { Language } from "../runtimes/types";

interface LanguageSelectorProps {
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  disabled?: boolean;
}

export function LanguageSelector({
  language,
  onSelectLanguage,
  disabled,
}: LanguageSelectorProps) {
  const options: { id: Language; label: string; badge: string; badgeColor: string }[] = [
    {
      id: "python",
      label: "Python (Pyodide)",
      badge: "WASM READY",
      badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
      id: "cpp",
      label: "C++ (In-Browser)",
      badge: "READY",
      badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
      id: "java",
      label: "Java (In-Browser)",
      badge: "READY",
      badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-muted/60 border border-border rounded-lg">
      {options.map((opt) => {
        const isActive = language === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectLanguage(opt.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              isActive
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span>{opt.label}</span>
            <span
              className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.2 rounded border ${opt.badgeColor}`}
            >
              {opt.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}
