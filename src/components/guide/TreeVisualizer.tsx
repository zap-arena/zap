import type React from "react";
import { useEffect, useMemo, useState } from "react";

export interface TreeVizNode {
  /** heap index of the node in the conceptual complete tree (root = 0) */
  id: number;
  parentId: number | null;
  /** position in a 0-1000 wide virtual coordinate space */
  x: number;
  y: number;
  label: string | number;
  state: "idle" | "active" | "visited" | "result" | "rejected";
  /** small caption rendered under the circle, e.g. "depth 2" or "(-inf, 8)" */
  note?: string;
}

export interface TreeTag {
  label: string;
  tone: "info" | "success" | "danger";
}

export interface TreeStep {
  description: string;
  nodes: TreeVizNode[];
  /** ordered values produced so far, e.g. the traversal output */
  output?: (string | number)[];
  outputLabel?: string;
  /** auxiliary structure snapshot, e.g. the BFS queue or the DFS stack */
  structure?: { label: string; entries: (string | number)[] };
  variables: Record<string, string | number | boolean>;
  headline?: string;
  tag?: TreeTag;
  /** 1-indexed line in `TreeApproachRunner.code` to highlight for this step */
  codeLine?: number;
  done?: boolean;
}

export type TreeApproachId =
  | "preorder"
  | "inorder"
  | "postorder"
  | "brute"
  | "optimal";

export type TreeInput = (number | null)[];

export interface TreeApproachRunner {
  label: string;
  complexity: string;
  code: string[];
  run: (values: TreeInput, targetA?: number, targetB?: number) => TreeStep[];
}

export interface TreeTargetField {
  label: string;
  defaultValue: number;
}

interface TreeVisualizerProps {
  title: string;
  approaches: Partial<Record<TreeApproachId, TreeApproachRunner>>;
  /** level-order values; `null` marks a missing child */
  defaultInput: TreeInput;
  /** extra numeric inputs passed to the runner as targetA / targetB */
  targetFields?: TreeTargetField[];
}

const TAG_STYLE: Record<TreeTag["tone"], { bg: string; text: string }> = {
  info: { bg: "#1f3a6e", text: "#58a6ff" },
  success: { bg: "#1a3a2a", text: "#3fb950" },
  danger: { bg: "#3a2a1f", text: "#f0883e" },
};

const NODE_STYLE: Record<
  TreeVizNode["state"],
  { border: string; bg: string; text: string; legend: string }
> = {
  idle: {
    border: "#30363d",
    bg: "#161b22",
    text: "#8b949e",
    legend: "not reached",
  },
  active: {
    border: "#58a6ff",
    bg: "#0d1f38",
    text: "#93c5fd",
    legend: "current node",
  },
  visited: {
    border: "#3fb950",
    bg: "#0d2818",
    text: "#a7f3d0",
    legend: "processed",
  },
  result: {
    border: "#bc8cff",
    bg: "#241c38",
    text: "#d2b3ff",
    legend: "answer",
  },
  rejected: {
    border: "#f85149",
    bg: "#3a1d1d",
    text: "#ffa198",
    legend: "violates rule",
  },
};

const LEGEND_ORDER: TreeVizNode["state"][] = [
  "idle",
  "active",
  "visited",
  "result",
  "rejected",
];

const APPROACH_ORDER: TreeApproachId[] = [
  "preorder",
  "inorder",
  "postorder",
  "brute",
  "optimal",
];
const ROW_HEIGHT = 86;
const VIEW_WIDTH = 1000;

function formatInput(values: TreeInput): string {
  return values.map((v) => (v === null ? "null" : String(v))).join(", ");
}

function parseInput(text: string): TreeInput {
  return text
    .split(",")
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map((token) => {
      if (/^(null|n|x|-)$/i.test(token)) return null;
      const num = Number(token);
      return Number.isNaN(num) ? null : num;
    });
}

export default function TreeVisualizer({
  title,
  approaches,
  defaultInput,
  targetFields = [],
}: Readonly<TreeVisualizerProps>) {
  const availableApproaches = APPROACH_ORDER.filter((id) => approaches[id]);

  const [selectedApproach, setSelectedApproach] = useState<TreeApproachId>(
    availableApproaches[0] ?? "brute",
  );
  const [inputText, setInputText] = useState(formatInput(defaultInput));
  const [parsedInput, setParsedInput] = useState<TreeInput>(defaultInput);
  const [targetTexts, setTargetTexts] = useState<string[]>(
    targetFields.map((f) => String(f.defaultValue)),
  );
  const [targets, setTargets] = useState<number[]>(
    targetFields.map((f) => f.defaultValue),
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLog, setShowLog] = useState(false);

  const activeRunner = approaches[selectedApproach];

  const steps = useMemo<TreeStep[]>(() => {
    if (!activeRunner) return [];
    try {
      return activeRunner.run(parsedInput, targets[0], targets[1]);
    } catch {
      return [];
    }
  }, [activeRunner, parsedInput, targets]);

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedApproach, parsedInput, targets]);

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
    }, 800);
    return () => clearInterval(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  const handleApply = () => {
    const parsed = parseInput(inputText);
    setParsedInput(parsed.length > 0 ? parsed : defaultInput);
    setTargets(
      targetFields.map((field, idx) => {
        const value = Number(targetTexts[idx]);
        return Number.isNaN(value) ? field.defaultValue : value;
      }),
    );
  };

  const currentStep = steps[currentStepIndex];
  const progressPct =
    steps.length > 1
      ? Math.round((currentStepIndex / (steps.length - 1)) * 100)
      : 0;

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

  const usedStates = new Set(currentStep?.nodes.map((n) => n.state) ?? []);

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
      <div
        style={{
          padding: "16px clamp(12px, 4vw, 22px)",
          borderBottom: "1px solid #21262d",
          background: "#161b22",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700 }}>🌲 {title}</span>
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
            Binary Tree Walkthrough
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
                  border:
                    selectedApproach === id
                      ? "1px solid #58a6ff"
                      : "1px solid #30363d",
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
          <div style={{ fontSize: 12.5, color: "#8b949e", marginTop: 10 }}>
            {activeRunner.complexity}
          </div>
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
        <label
          style={{
            fontSize: 12,
            color: "#8b949e",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Level order
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
              width: "min(260px, 55vw)",
              fontSize: 13,
            }}
          />
        </label>
        {targetFields.map((field, idx) => (
          <label
            key={field.label}
            style={{
              fontSize: 12,
              color: "#8b949e",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {field.label}
            <input
              type="text"
              value={targetTexts[idx] ?? ""}
              onChange={(e) =>
                setTargetTexts((prev) => {
                  const next = [...prev];
                  next[idx] = e.target.value;
                  return next;
                })
              }
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
        ))}
        <button
          type="button"
          onClick={handleApply}
          style={pillButtonStyle("secondary")}
        >
          Apply
        </button>

        <span style={{ flex: 1 }} />

        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          disabled={steps.length === 0}
          style={pillButtonStyle("primary", steps.length === 0)}
        >
          {isPlaying ? "\u23f8 Pause" : "\u25b6 Play"}
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
        <div
          style={{
            height: 4,
            background: "#21262d",
            borderRadius: 2,
            overflow: "hidden",
            marginBottom: 18,
          }}
        >
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

        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          {LEGEND_ORDER.filter((state) => usedStates.has(state)).map(
            (state) => (
              <span
                key={state}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "#8b949e",
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: NODE_STYLE[state].bg,
                    border: `2px solid ${NODE_STYLE[state].border}`,
                    display: "inline-block",
                  }}
                />
                {NODE_STYLE[state].legend}
              </span>
            ),
          )}
        </div>

        {currentStep && (
          <>
            {/* tree canvas */}
            <div
              style={{
                background: "#0d1117",
                border: "1px solid #21262d",
                borderRadius: 12,
                padding: "20px 16px",
                marginBottom: 14,
                overflowX: "auto",
              }}
            >
              {(() => {
                const nodes = currentStep.nodes;
                if (nodes.length === 0) {
                  return (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#8b949e",
                        fontSize: 13,
                      }}
                    >
                      Empty tree
                    </div>
                  );
                }
                const maxY = Math.max(...nodes.map((n) => n.y));
                const viewHeight = maxY + ROW_HEIGHT * 0.75;
                const nodeById = new Map(nodes.map((n) => [n.id, n]));
                const depth = Math.max(
                  1,
                  Math.round(maxY / ROW_HEIGHT - 0.5) + 1,
                );
                const radius = Math.max(
                  11,
                  Math.min(26, VIEW_WIDTH / 2 ** depth / 2.4),
                );
                const fontSize = Math.max(9, Math.min(15, radius * 0.62));

                return (
                  <svg
                    viewBox={`0 0 ${VIEW_WIDTH} ${viewHeight}`}
                    style={{
                      width: "100%",
                      minWidth: depth > 4 ? 620 : undefined,
                      height: "auto",
                      display: "block",
                    }}
                    role="img"
                    aria-label={`Binary tree state: ${currentStep.description}`}
                  >
                    {nodes.map((node) => {
                      if (node.parentId === null) return null;
                      const parent = nodeById.get(node.parentId);
                      if (!parent) return null;
                      const lit =
                        node.state !== "idle" && parent.state !== "idle";
                      return (
                        <line
                          key={`edge-${node.id}`}
                          x1={parent.x}
                          y1={parent.y}
                          x2={node.x}
                          y2={node.y}
                          stroke={lit ? "#3d4653" : "#21262d"}
                          strokeWidth={2}
                        />
                      );
                    })}
                    {nodes.map((node) => {
                      const style = NODE_STYLE[node.state];
                      return (
                        <g key={node.id}>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={radius}
                            fill={style.bg}
                            stroke={style.border}
                            strokeWidth={node.state === "idle" ? 2 : 2.8}
                          />
                          <text
                            x={node.x}
                            y={node.y + fontSize * 0.35}
                            textAnchor="middle"
                            fontSize={fontSize}
                            fontWeight={700}
                            fontFamily="'JetBrains Mono', monospace"
                            fill={style.text}
                          >
                            {node.label}
                          </text>
                          {node.note && (
                            <text
                              x={node.x}
                              y={node.y + radius + 13}
                              textAnchor="middle"
                              fontSize={Math.max(8, fontSize * 0.72)}
                              fontFamily="'JetBrains Mono', monospace"
                              fill="#8b949e"
                            >
                              {node.note}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>

            {currentStep.structure && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 14,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "#8b949e",
                    marginRight: 4,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {currentStep.structure.label}
                </span>
                {currentStep.structure.entries.length === 0 ? (
                  <span style={{ fontSize: 12, color: "#484f58" }}>empty</span>
                ) : (
                  currentStep.structure.entries.map((entry, idx) => (
                    <span
                      key={`${idx}-${entry}`}
                      style={{
                        minWidth: 34,
                        textAlign: "center",
                        padding: "5px 9px",
                        borderRadius: 7,
                        border: "1px solid #30363d",
                        background: "#161b22",
                        color: "#c9d1d9",
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {entry}
                    </span>
                  ))
                )}
              </div>
            )}

            {currentStep.output && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "#8b949e",
                    marginRight: 4,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {currentStep.outputLabel ?? "output"}
                </span>
                {currentStep.output.length === 0 ? (
                  <span style={{ fontSize: 12, color: "#484f58" }}>empty</span>
                ) : (
                  currentStep.output.map((value, idx) => (
                    <span
                      key={`${idx}-${value}`}
                      style={{
                        minWidth: 34,
                        textAlign: "center",
                        padding: "5px 9px",
                        borderRadius: 7,
                        border: "1px solid #238636",
                        background: "#0d2818",
                        color: "#a7f3d0",
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {value}
                    </span>
                  ))
                )}
              </div>
            )}

            {(currentStep.headline || currentStep.tag) && (
              <div style={{ textAlign: "center", marginBottom: 18 }}>
                {currentStep.headline && (
                  <div
                    style={{
                      fontSize: "clamp(18px, 5vw, 26px)",
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
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 16,
                }}
              >
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
                    <span style={{ color: "#8b949e" }}>{key}:</span>{" "}
                    {String(value)}
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
                {currentStep.done ? " \u00b7 Done" : ""}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "#e6edf3" }}>
                {currentStep.description}
              </div>
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
                    <span
                      style={{ color: TAG_STYLE[currentStep.tag.tone].text }}
                    >
                      {currentStep.tag.label}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                    fontSize: 12.5,
                    lineHeight: 1.9,
                    overflowX: "auto",
                  }}
                >
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
                          borderLeft: active
                            ? "3px solid #58a6ff"
                            : "3px solid transparent",
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
          {showLog ? "\u25be" : "\u25b8"} Full step-by-step trace (
          {steps.length} steps)
        </button>
        {showLog && (
          <div
            style={{
              maxHeight: 220,
              overflowY: "auto",
              overflowX: "auto",
              padding: "0 clamp(12px, 4vw, 22px) 16px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ textAlign: "left", color: "#8b949e" }}>
                  <th style={{ padding: "6px 8px" }}>#</th>
                  <th style={{ padding: "6px 8px" }}>Description</th>
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
                      background:
                        idx === currentStepIndex ? "#1f3a6e" : "transparent",
                      color: idx === currentStepIndex ? "#58a6ff" : "#c9d1d9",
                    }}
                  >
                    <td style={{ padding: "4px 8px" }}>{idx + 1}</td>
                    <td style={{ padding: "4px 8px" }}>{step.description}</td>
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

export { ROW_HEIGHT, VIEW_WIDTH };
