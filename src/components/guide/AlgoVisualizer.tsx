import { useEffect, useMemo, useState } from "react";

export interface VizHighlight {
  index: number;
  role: "i" | "j" | "lo" | "hi" | "current" | "match" | "sorted";
}

export interface VizTag {
  label: string;
  tone: "info" | "success" | "danger";
}

export interface VizStep {
  description: string;
  array: (string | number)[];
  highlights: VizHighlight[];
  structure?: { label: string; entries: (string | number)[] };
  variables: Record<string, string | number | boolean>;
  done?: boolean;
  /** big bold centerpiece text, e.g. "89 > 81" or "nums[i] + nums[j] = 9" */
  headline?: string;
  /** short colored status chip, e.g. FOUND / ELIMINATE HALF */
  tag?: VizTag;
  /** 1-indexed line in `ApproachRunner.code` to highlight for this step */
  codeLine?: number;
}

export type ApproachId = "brute" | "sub" | "optimal";

export interface ApproachRunner<TInput = number[]> {
  label: string;
  complexity: string;
  code: string[];
  run: (input: TInput, target?: number) => VizStep[];
}

interface AlgoVisualizerProps<TInput = number[]> {
  title: string;
  approaches: Partial<Record<ApproachId, ApproachRunner<TInput>>>;
  defaultInput: TInput;
  /** "array" (default) parses a comma-separated number list; "string" passes the raw text through */
  inputKind?: "array" | "string";
  needsTarget?: boolean;
  defaultTarget?: number;
}

const ROLE_STYLE: Record<
  VizHighlight["role"],
  { bg: string; border: string; text: string; label: string }
> = {
  i: { bg: "#0d1f38", border: "#3b82f6", text: "#93c5fd", label: "i" },
  j: { bg: "#2d1230", border: "#ec4899", text: "#fbcfe8", label: "j" },
  lo: { bg: "#1f1538", border: "#7c3aed", text: "#ddd6fe", label: "lo" },
  hi: { bg: "#38120f", border: "#dc2626", text: "#fca5a5", label: "hi" },
  current: { bg: "#0d2818", border: "#059669", text: "#a7f3d0", label: "cur" },
  match: { bg: "#3a2a0d", border: "#f59e0b", text: "#fde68a", label: "found" },
  sorted: { bg: "#0b2230", border: "#0ea5e9", text: "#bae6fd", label: "sorted" },
};

const TAG_STYLE: Record<VizTag["tone"], { bg: string; text: string }> = {
  info: { bg: "#1f3a6e", text: "#58a6ff" },
  success: { bg: "#1a3a2a", text: "#3fb950" },
  danger: { bg: "#3a2a1f", text: "#f0883e" },
};

const WINDOW_ROLES = new Set<VizHighlight["role"]>(["i", "j", "lo", "hi"]);

const APPROACH_ORDER: ApproachId[] = ["brute", "sub", "optimal"];

export default function AlgoVisualizer<TInput = number[]>({
  title,
  approaches,
  defaultInput,
  inputKind = "array",
  needsTarget,
  defaultTarget,
}: Readonly<AlgoVisualizerProps<TInput>>) {
  const availableApproaches = APPROACH_ORDER.filter((id) => approaches[id]);

  const [selectedApproach, setSelectedApproach] = useState<ApproachId>(
    availableApproaches[0] ?? "brute",
  );
  const [inputText, setInputText] = useState(
    Array.isArray(defaultInput) ? defaultInput.join(", ") : String(defaultInput),
  );
  const [parsedInput, setParsedInput] = useState<TInput>(defaultInput);
  const [targetText, setTargetText] = useState(
    defaultTarget !== undefined ? String(defaultTarget) : "",
  );
  const [target, setTarget] = useState<number | undefined>(defaultTarget);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLog, setShowLog] = useState(false);

  const activeRunner = approaches[selectedApproach];

  const steps = useMemo<VizStep[]>(() => {
    if (!activeRunner) return [];
    try {
      return activeRunner.run(parsedInput, target);
    } catch {
      return [];
    }
  }, [activeRunner, parsedInput, target]);

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedApproach, parsedInput, target]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  const handleSetInput = () => {
    if (inputKind === "string") {
      setParsedInput(inputText as unknown as TInput);
    } else {
      const parsed = inputText
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0)
        .map(Number)
        .filter((v) => !Number.isNaN(v));
      setParsedInput(parsed as unknown as TInput);
    }
    if (needsTarget) {
      const t = Number(targetText);
      setTarget(Number.isNaN(t) ? undefined : t);
    }
  };

  const currentStep = steps[currentStepIndex];
  const progressPct =
    steps.length > 1 ? Math.round((currentStepIndex / (steps.length - 1)) * 100) : 0;

  const rolesUsed = useMemo(() => {
    const roles = new Set<VizHighlight["role"]>();
    for (const step of steps) {
      for (const h of step.highlights) roles.add(h.role);
    }
    return [...roles];
  }, [steps]);

  const highlightForIndex = (index: number): VizHighlight[] =>
    currentStep ? currentStep.highlights.filter((h) => h.index === index) : [];

  const pillButtonStyle = (
    variant: "primary" | "secondary",
    disabled?: boolean,
  ): React.CSSProperties => ({
    padding: "8px 18px",
    borderRadius: 8,
    border: variant === "secondary" ? "1px solid #30363d" : "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: 13,
    fontWeight: 600,
    opacity: disabled ? 0.35 : 1,
    background: variant === "primary" ? "#1f6feb" : "#21262d",
    color: variant === "primary" ? "#fff" : "#e6edf3",
  });

  return (
    <div
      style={{
        border: "1px solid #30363d",
        borderRadius: 14,
        marginTop: 20,
        marginBottom: 20,
        background: "#0d1117",
        color: "#e6edf3",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "16px clamp(12px, 4vw, 22px)", borderBottom: "1px solid #21262d", background: "#161b22" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>⚡ {title}</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#58a6ff",
              background: "#1f3a6e",
              padding: "3px 10px",
              borderRadius: 20,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Visualization &amp; Dry Run
          </span>
        </div>

        {availableApproaches.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {availableApproaches.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedApproach(id)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 8,
                  border: selectedApproach === id ? "1px solid #58a6ff" : "1px solid #30363d",
                  background: selectedApproach === id ? "#1f3a6e" : "#0d1117",
                  color: selectedApproach === id ? "#58a6ff" : "#8b949e",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {approaches[id]?.label}
              </button>
            ))}
          </div>
        )}

        {activeRunner && (
          <div style={{ fontSize: 12.5, color: "#8b949e", marginTop: 10 }}>{activeRunner.complexity}</div>
        )}
      </div>

      {/* Controls */}
      <div
        style={{
          padding: "16px clamp(12px, 4vw, 22px)",
          borderBottom: "1px solid #21262d",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <label style={{ fontSize: 12, color: "#8b949e", display: "flex", alignItems: "center", gap: 6 }}>
          {inputKind === "string" ? "String" : "Array"}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #30363d",
              background: "#0d1117",
              color: "#e6edf3",
              width: "min(190px, 48vw)",
              fontSize: 13,
            }}
          />
        </label>
        {needsTarget && (
          <label style={{ fontSize: 12, color: "#8b949e", display: "flex", alignItems: "center", gap: 6 }}>
            Target
            <input
              type="text"
              value={targetText}
              onChange={(e) => setTargetText(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #30363d",
                background: "#0d1117",
                color: "#e6edf3",
                width: "min(70px, 20vw)",
                fontSize: 13,
              }}
            />
          </label>
        )}
        <button type="button" onClick={handleSetInput} style={pillButtonStyle("secondary")}>
          Apply
        </button>

        <span style={{ flex: 1 }} />

        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          disabled={steps.length === 0}
          style={pillButtonStyle("primary", steps.length === 0)}
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            setCurrentStepIndex((i) => Math.max(0, i - 1));
          }}
          disabled={currentStepIndex === 0}
          style={pillButtonStyle("secondary", currentStepIndex === 0)}
        >
          ◀ Prev
        </button>
        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            setCurrentStepIndex((i) => Math.min(steps.length - 1, i + 1));
          }}
          disabled={steps.length === 0 || currentStepIndex >= steps.length - 1}
          style={pillButtonStyle(
            "secondary",
            steps.length === 0 || currentStepIndex >= steps.length - 1,
          )}
        >
          Next ▶
        </button>
        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            setCurrentStepIndex(0);
          }}
          style={pillButtonStyle("secondary")}
        >
          ↺ Reset
        </button>
        <span style={{ fontSize: 12, color: "#8b949e" }}>
          Step {steps.length === 0 ? 0 : currentStepIndex + 1} / {steps.length}
        </span>
      </div>

      {/* Stage */}
      <div style={{ padding: "20px clamp(12px, 4vw, 22px)" }}>
        <div style={{ height: 4, background: "#21262d", borderRadius: 2, overflow: "hidden", marginBottom: 18 }}>
          <div
            style={{
              height: "100%",
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #1f6feb, #bc8cff)",
              borderRadius: 2,
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {rolesUsed.length > 0 && (
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
            {rolesUsed.map((role) => (
              <span key={role} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#8b949e" }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 4,
                    background: ROLE_STYLE[role].border,
                    display: "inline-block",
                  }}
                />
                {ROLE_STYLE[role].label}
              </span>
            ))}
          </div>
        )}

        {currentStep && (
          <>
            {(() => {
              const isWindowStep = currentStep.highlights.some((h) => WINDOW_ROLES.has(h.role));
              return (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    background: "#0d1117",
                    border: "1px solid #21262d",
                    borderRadius: 12,
                    padding: "28px 18px 22px",
                    marginBottom: 18,
                  }}
                >
                  {currentStep.array.map((value, index) => {
                    const hs = highlightForIndex(index);
                    const primary = hs[0]?.role;
                    const style = primary ? ROLE_STYLE[primary] : null;
                    const emphasize = primary === "current" || primary === "match";
                    const dimmed = isWindowStep && !style;
                    return (
                      <div
                        key={`${index}-${value}`}
                        style={{ textAlign: "center", opacity: dimmed ? 0.3 : 1, transition: "opacity 0.3s ease" }}
                      >
                        {style ? (
                          <div style={{ fontSize: 13, color: style.border, marginBottom: 2 }}>↑</div>
                        ) : (
                          <div style={{ fontSize: 13, marginBottom: 2, visibility: "hidden" }}>↑</div>
                        )}
                        <div
                          style={{
                            width: 58,
                            height: 58,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                            border: `2px solid ${style ? style.border : "#30363d"}`,
                            background: style ? style.bg : "#161b22",
                            color: style ? style.text : "#8b949e",
                            fontWeight: 700,
                            fontSize: 18,
                            transition: "all 0.3s ease",
                            transform: emphasize ? "scale(1.14)" : "scale(1)",
                            boxShadow: emphasize ? `0 0 16px ${style?.border}66` : "none",
                          }}
                        >
                          {value}
                        </div>
                        <div style={{ fontSize: 10, color: "#484f58", marginTop: 6, fontWeight: 600 }}>{index}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: style?.border ?? "transparent", minHeight: 14 }}>
                          {hs.map((h) => h.role).join("/") || "\u00A0"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {(currentStep.headline || currentStep.tag) && (
              <div style={{ textAlign: "center", marginBottom: 18 }}>
                {currentStep.headline && (
                  <div style={{ fontSize: "clamp(18px, 5vw, 28px)", fontWeight: 800, color: "#f0f6fc", marginBottom: 8, letterSpacing: 0.3, wordBreak: "break-word" }}>
                    {currentStep.headline}
                  </div>
                )}
                {currentStep.tag && (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 14px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      background: TAG_STYLE[currentStep.tag.tone].bg,
                      color: TAG_STYLE[currentStep.tag.tone].text,
                    }}
                  >
                    {currentStep.tag.label}
                  </span>
                )}
              </div>
            )}

            {currentStep.structure && (
              <div style={{ marginBottom: 16, fontSize: 12.5 }}>
                <span style={{ color: "#8b949e", marginRight: 8, fontWeight: 600 }}>
                  {currentStep.structure.label}:
                </span>
                {currentStep.structure.entries.length === 0 ? (
                  <span style={{ color: "#484f58" }}>empty</span>
                ) : (
                  currentStep.structure.entries.map((entry, idx) => (
                    <span
                      key={`${entry}-${idx}`}
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: 999,
                        border: "1px solid #30363d",
                        background: "#161b22",
                        color: "#bae6fd",
                        marginRight: 6,
                        marginBottom: 4,
                      }}
                    >
                      {entry}
                    </span>
                  ))
                )}
              </div>
            )}

            {Object.keys(currentStep.variables).length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {Object.entries(currentStep.variables).map(([key, value]) => (
                  <span
                    key={key}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 7,
                      background: "#21262d",
                      fontSize: 12,
                      color: "#e6edf3",
                    }}
                  >
                    <span style={{ color: "#8b949e" }}>{key}:</span> {String(value)}
                  </span>
                ))}
              </div>
            )}

            <div
              style={{
                background: "#0d1117",
                border: `1px solid ${currentStep.done ? "#238636" : "#30363d"}`,
                borderRadius: 10,
                padding: "14px 18px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: currentStep.done ? "#3fb950" : "#58a6ff",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                Step {currentStepIndex + 1}
                {currentStep.done ? " · Done" : ""}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "#e6edf3" }}>{currentStep.description}</div>
            </div>

            {activeRunner && activeRunner.code.length > 0 && (
              <div
                style={{
                  background: "#0d1117",
                  border: "1px solid #21262d",
                  borderRadius: 10,
                  overflow: "hidden",
                  marginTop: 16,
                }}
              >
                <div
                  style={{
                    padding: "8px 16px",
                    background: "#161b22",
                    borderBottom: "1px solid #21262d",
                    fontSize: 12,
                    color: "#8b949e",
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>algorithm.js</span>
                  {currentStep.tag && (
                    <span style={{ color: TAG_STYLE[currentStep.tag.tone].text }}>{currentStep.tag.label}</span>
                  )}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontSize: 12.5, lineHeight: 1.9 }}>
                  {activeRunner.code.map((line, idx) => {
                    const lineNo = idx + 1;
                    const active = currentStep.codeLine === lineNo;
                    return (
                      <div
                        key={lineNo}
                        style={{
                          padding: "1px 16px",
                          whiteSpace: "pre",
                          color: active ? "#e6edf3" : "#8b949e",
                          background: active ? "#15294d" : "transparent",
                          borderLeft: active ? "3px solid #58a6ff" : "3px solid transparent",
                        }}
                      >
                        {line}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Collapsible trace log */}
      <div style={{ borderTop: "1px solid #21262d" }}>
        <button
          type="button"
          onClick={() => setShowLog((v) => !v)}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "10px clamp(12px, 4vw, 22px)",
            background: "transparent",
            border: "none",
            color: "#8b949e",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {showLog ? "▾" : "▸"} Full step-by-step trace ({steps.length} steps)
        </button>
        {showLog && (
          <div style={{ maxHeight: 220, overflowY: "auto", overflowX: "auto", padding: "0 clamp(12px, 4vw, 22px) 16px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#8b949e" }}>
                  <th style={{ padding: "6px 8px" }}>#</th>
                  <th style={{ padding: "6px 8px" }}>Description</th>
                  <th style={{ padding: "6px 8px" }}>Variables</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step, idx) => (
                  <tr
                    key={`${idx}-${step.description}`}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIndex(idx);
                    }}
                    style={{
                      cursor: "pointer",
                      background: idx === currentStepIndex ? "#1f3a6e" : "transparent",
                      color: idx === currentStepIndex ? "#58a6ff" : "#c9d1d9",
                    }}
                  >
                    <td style={{ padding: "4px 8px" }}>{idx + 1}</td>
                    <td style={{ padding: "4px 8px" }}>{step.description}</td>
                    <td style={{ padding: "4px 8px" }}>
                      {Object.entries(step.variables)
                        .map(([k, v]) => `${k}=${v}`)
                        .join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

