interface FormattedTextProps {
  text: string;
  className?: string;
}

export function FormattedText({ text, className = "" }: FormattedTextProps) {
  if (!text) return null;

  // Pattern matches ```[language]\n code \n``` or ```code```
  const codeBlockRegex = /```(?:([a-zA-Z0-9_+-]+)?\n)?([\s\S]*?)```/g;

  const parts = [];
  let lastIndex = 0;
  let match = codeBlockRegex.exec(text);

  while (match !== null) {
    // Add preceding normal text
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }

    const language = match[1] || "code";
    const code = match[2].trim();

    parts.push({
      type: "code",
      language,
      content: code,
    });

    lastIndex = match.index + match[0].length;
    match = codeBlockRegex.exec(text);
  }

  // Add remaining normal text
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  // If no markdown code blocks found, check if whole text looks like code (e.g. contains multiline code construct like def, function, class, return, int main, for, while, etc or multiple lines with semicolons/braces)
  if (parts.length === 1 && parts[0].type === "text") {
    const raw = parts[0].content;
    const isMultiLineCode =
      (raw.includes("\n") &&
        (raw.includes("{") ||
          raw.includes(";") ||
          raw.includes("def ") ||
          raw.includes("function ") ||
          raw.includes("const ") ||
          raw.includes("let ") ||
          raw.includes("return "))) ||
      raw.startsWith("def ") ||
      raw.startsWith("function ") ||
      raw.startsWith("class ") ||
      raw.startsWith("for(") ||
      raw.startsWith("if(");

    if (isMultiLineCode) {
      parts[0] = {
        type: "code",
        language: "code",
        content: raw.trim(),
      };
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {parts.map((part, i) => {
        if (part.type === "code") {
          return (
            <div
              key={i}
              className="my-3 rounded-lg overflow-hidden border border-border bg-[#1e1e1e] font-mono text-xs shadow-md"
            >
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#333333] text-muted-foreground">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {part.language}
                </span>
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block opacity-80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block opacity-80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block opacity-80" />
                </span>
              </div>
              <div className="p-4 overflow-x-auto text-gray-200 leading-relaxed whitespace-pre font-mono">
                {part.content}
              </div>
            </div>
          );
        }

        return (
          <span key={i} className="whitespace-pre-line">
            {part.content}
          </span>
        );
      })}
    </div>
  );
}
