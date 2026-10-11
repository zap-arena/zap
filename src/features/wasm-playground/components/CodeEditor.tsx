import Editor from "@monaco-editor/react";
import { Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { MONACO_THEMES } from "../../../lib/monaco-themes";
import type { Language } from "../runtimes/types";

interface CodeEditorProps {
  language: Language;
  code: string;
  onChange: (value: string) => void;
  onReset: () => void;
  disabled?: boolean;
}

export function CodeEditor({
  language,
  code,
  onChange,
  onReset,
  disabled,
}: CodeEditorProps) {
  const monacoLanguageMap: Record<Language, string> = {
    python: "python",
    cpp: "cpp",
    java: "java",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleEditorWillMount = (monaco: any) => {
    // Register custom monaco themes if available
    Object.keys(MONACO_THEMES).forEach((themeName) => {
      monaco.editor.defineTheme(themeName, MONACO_THEMES[themeName]);
    });
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Editor toolbar */}
      <div className="h-10 px-3 border-b border-border bg-card/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
            {language} Source
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
            title="Copy Code"
          >
            <Copy size={12} />
            <span className="hidden sm:inline">Copy</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onReset}
            disabled={disabled}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
            title="Reset to Template"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {/* Monaco editor instance */}
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          language={monacoLanguageMap[language]}
          value={code}
          theme="vs-dark"
          beforeMount={handleEditorWillMount}
          onChange={(val) => onChange(val || "")}
          options={{
            readOnly: disabled,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            tabSize: 4,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            padding: { top: 12, bottom: 12 },
            folding: true,
            renderLineHighlight: "all",
          }}
        />
      </div>
    </div>
  );
}
