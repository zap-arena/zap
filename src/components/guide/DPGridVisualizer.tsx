import { useEffect, useState } from "react";

export interface GridHighlight {
  row: number;
  col: number;
  role: "current" | "top" | "left" | "diag" | "base" | "match";
}

export interface GridTag {
  label: string;
  tone: "info" | "success" | "danger";
}

export interface GridStep {
  description: string;
  grid: (string | number)[][];
  highlights: GridHighlight[];
  variables: Record<string, string | number | boolean>;
  done?: boolean;
  headline?: string;
  tag?: GridTag;
  codeLine?: number;
}

export type GridApproachId = "brute" | "optimal";

export interface GridApproachRunner {
  label: string;
  complexity: string;
  code: string[];
  run: () => GridStep[];
}

interface DPGridVisualizerProps {
  title: string;
  approaches: Partial<Record<GridApproachId, GridApproachRunner>>;
}

const GRID_ROLE_STYLE: Record<GridHighlight["role"], { bg: string; border: string; text: string; label: string }> = {
  current: { bg: "#0d2818", border: "#059669", text: "#a7f3d0", label: "computing" },
  top: { bg: "#0d1f38", border: "#3b82f6", text: "#93c5fd", label: "top" },
  left: { bg: "#2d1230", border: "#ec4899", text: "#fbcfe8", label: "left" },
  diag: { bg: "#241a3a", border: "#a371f7", text: "#ddd6fe", label: "diagonal" },
  base: { bg: "#1f1538", border: "#7c3aed", text: "#ddd6fe", label: "base case" },
  match: { bg: "#3a2a0d", border: "#f59e0b", text: "#fde68a", label: "result" },
};

const TAG_STYLE: Record<GridTag["tone"], { bg: string; text: string }> = {
  info: { bg: "#1f3a6e", text: "#58a6ff" },
  success: { bg: "#1a3a2a", text: "#3fb950" },
  danger: { bg: "#3a2a1f", text: "#f0883e" },
};

const APPROACH_ORDER: GridApproachId[] = ["brute", "optimal"];

export default function DPGridVisualizer({ title, approaches }: Readonly<DPGridVisualizerProps>) {
  const availableApproaches = APPROACH_ORDER.filter((id) => approaches[id]);
  const [selectedApproach, setSelectedApproach] = useState<GridApproachId>(availableApproaches[0] ?? "brute");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLog, setShowLog] = useState(false);

  const activeRunner = approaches[selectedApproach];
  const steps = activeRunner ? activeRunner.run() : [];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedApproach]);

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
    }, 900);
    return () => clearInterval(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  const currentStep = steps[currentStepIndex];
  const progressPct = steps.length > 1 ? Math.round((currentStepIndex / (steps.length - 1)) * 100) : 0;

  const highlightFor = (row: number, col: number): GridHighlight | undefined =>
    currentStep?.highlights.find((h) => h.row === row && h.col === col);

  const pillButtonStyle = (variant: "primary" | "secondary", disabled?: boolean): React.CSSProperties => ({
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
          style={pillButtonStyle("secondary", steps.length === 0 || currentStepIndex >= steps.length - 1)}
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

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
          {(["current", "top", "left", "diag", "base", "match"] as const).map((role) => (
            <span key={role} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#8b949e" }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  background: GRID_ROLE_STYLE[role].border,
                  display: "inline-block",
                }}
              />
              {GRID_ROLE_STYLE[role].label}
            </span>
          ))}
        </div>

        {currentStep && (
          <>
            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                gap: 4,
                background: "#161b22",
                border: "1px solid #21262d",
                borderRadius: 12,
                padding: 16,
                marginBottom: 18,
                maxWidth: "100%",
                overflowX: "auto",
              }}
            >
              {currentStep.grid.map((row, rIdx) => (
                <div key={`row-${rIdx}`} style={{ display: "flex", gap: 4 }}>
                  {row.map((value, cIdx) => {
                    const h = highlightFor(rIdx, cIdx);
                    const style = h ? GRID_ROLE_STYLE[h.role] : null;
                    return (
                      <div
                        key={`cell-${rIdx}-${cIdx}`}
                        style={{
                          width: 42,
                          height: 42,
                          minWidth: 42,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 7,
                          border: `2px solid ${style ? style.border : "#30363d"}`,
                          background: style ? style.bg : "#0d1117",
                          color: style ? style.text : "#8b949e",
                          fontWeight: 700,
                          fontSize: 13,
                          transition: "all 0.25s ease",
                          boxShadow: style ? `0 0 12px ${style.border}55` : "none",
                        }}
                      >
                        {value === "" ? "\u00b7" : value}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {(currentStep.headline || currentStep.tag) && (
              <div style={{ textAlign: "center", marginBottom: 18 }}>
                {currentStep.headline && (
                  <div
                    style={{
                      fontSize: "clamp(16px, 4vw, 24px)",
                      fontWeight: 800,
                      color: "#f0f6fc",
                      marginBottom: 8,
                      letterSpacing: 0.3,
                      wordBreak: "break-word",
                    }}
                  >
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

            {Object.keys(currentStep.variables).length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {Object.entries(currentStep.variables).map(([key, value]) => (
                  <span
                    key={key}
                    style={{ padding: "4px 10px", borderRadius: 7, background: "#21262d", fontSize: 12, color: "#e6edf3" }}
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
              <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, overflow: "hidden", marginTop: 16 }}>
                <div
                  style={{
                    padding: "8px 16px",
                    background: "#161b22",
                    borderBottom: "1px solid #21262d",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#8b949e",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>algorithm.js</span>
                  {currentStep.tag && <span style={{ color: TAG_STYLE[currentStep.tag.tone].text }}>{currentStep.tag.label}</span>}
                </div>
                <div style={{ padding: "12px 0" }}>
                  {activeRunner.code.map((line, idx) => (
                    <div
                      key={`code-${idx}-${line}`}
                      style={{
                        padding: "2px 16px",
                        fontSize: 12.5,
                        fontFamily: "monospace",
                        color: currentStep.codeLine === idx + 1 ? "#f0f6fc" : "#6e7681",
                        background: currentStep.codeLine === idx + 1 ? "#1f3a6e55" : "transparent",
                        whiteSpace: "pre",
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {steps.length > 0 && (
          <button
            type="button"
            onClick={() => setShowLog((v) => !v)}
            style={{ marginTop: 16, background: "none", border: "none", color: "#58a6ff", fontSize: 12.5, cursor: "pointer", padding: 0 }}
          >
            {showLog ? "▾" : "▸"} Full step-by-step trace ({steps.length} steps)
          </button>
        )}
        {showLog && (
          <div style={{ marginTop: 10, maxHeight: 220, overflowY: "auto", border: "1px solid #21262d", borderRadius: 8 }}>
            {steps.map((step, idx) => (
              <div
                key={`trace-${idx}-${step.description}`}
                style={{
                  padding: "8px 14px",
                  fontSize: 12.5,
                  borderBottom: "1px solid #161b22",
                  background: idx === currentStepIndex ? "#161b22" : "transparent",
                  color: idx === currentStepIndex ? "#e6edf3" : "#8b949e",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
              >
                <b>{idx + 1}.</b> {step.description}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
