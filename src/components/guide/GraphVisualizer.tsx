import type React from "react";
import { useEffect, useId, useMemo, useState } from "react";

export type GraphNodeState =
  | "idle"
  | "active"
  | "visited"
  | "result"
  | "rejected";

export type GraphEdgeState = "idle" | "active" | "used" | "rejected";

export interface GraphVizNode {
  id: number;
  x: number;
  y: number;
  label: string;
  state: GraphNodeState;
  /** small caption under the circle, e.g. "d=2" or "in=0" */
  note?: string;
}

export interface GraphVizEdge {
  from: number;
  to: number;
  directed: boolean;
  weight?: number;
  state: GraphEdgeState;
}

export interface GraphTag {
  label: string;
  tone: "info" | "success" | "danger";
}

export interface GraphStep {
  description: string;
  nodes: GraphVizNode[];
  edges: GraphVizEdge[];
  output?: (string | number)[];
  outputLabel?: string;
  structure?: { label: string; entries: (string | number)[] };
  variables: Record<string, string | number | boolean>;
  headline?: string;
  tag?: GraphTag;
  /** 1-indexed line in `GraphApproachRunner.code` to highlight */
  codeLine?: number;
  done?: boolean;
}

export type GraphApproachId =
  | "undirected"
  | "directed"
  | "brute"
  | "optimal"
  | "alt";

export interface GraphEdgeSpec {
  from: number;
  to: number;
  directed: boolean;
  weight?: number;
}

export interface ParsedGraph {
  nodes: { id: number; label: string; x: number; y: number }[];
  edges: GraphEdgeSpec[];
  /** out-neighbours; an undirected edge appears in both directions */
  adjacency: Map<number, { to: number; weight: number }[]>;
  directed: boolean;
  idOf: (label: string) => number | undefined;
  labelOf: (id: number) => string;
}

export interface GraphApproachRunner {
  label: string;
  complexity: string;
  code: string[];
  run: (graph: ParsedGraph, targets: string[]) => GraphStep[];
}

export interface GraphTargetField {
  label: string;
  defaultValue: string;
}

interface GraphVisualizerProps {
  title: string;
  approaches: Partial<Record<GraphApproachId, GraphApproachRunner>>;
  /** edge list, e.g. "A-B, A-C, B-D" or "A>B:4, A>C:2" */
  defaultInput: string;
  inputLabel?: string;
  targetFields?: GraphTargetField[];
}

const TAG_STYLE: Record<GraphTag["tone"], { bg: string; text: string }> = {
  info: { bg: "#1f3a6e", text: "#58a6ff" },
  success: { bg: "#1a3a2a", text: "#3fb950" },
  danger: { bg: "#3a2a1f", text: "#f0883e" },
};

const NODE_STYLE: Record<
  GraphNodeState,
  { border: string; bg: string; text: string; legend: string }
> = {
  idle: {
    border: "#30363d",
    bg: "#161b22",
    text: "#8b949e",
    legend: "unvisited",
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
    legend: "visited",
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
    legend: "conflict",
  },
};

const EDGE_STYLE: Record<
  GraphEdgeState,
  { stroke: string; width: number; dash?: string }
> = {
  idle: { stroke: "#21262d", width: 2 },
  active: { stroke: "#58a6ff", width: 3 },
  used: { stroke: "#3fb950", width: 3 },
  rejected: { stroke: "#f85149", width: 3, dash: "5 4" },
};

const LEGEND_ORDER: GraphNodeState[] = [
  "idle",
  "active",
  "visited",
  "result",
  "rejected",
];

const APPROACH_ORDER: GraphApproachId[] = [
  "undirected",
  "directed",
  "brute",
  "optimal",
  "alt",
];

const VIEW_WIDTH = 760;
const VIEW_HEIGHT = 420;
const NODE_RADIUS = 22;

/**
 * Parses an edge list. `A-B` is undirected, `A>B` is directed and `:w`
 * appends a weight. A bare token (`E`) adds an isolated vertex. Nodes are
 * laid out on a circle in order of first appearance.
 */
export function parseGraph(text: string): ParsedGraph {
  const ids = new Map<string, number>();
  const labels: string[] = [];
  const edges: GraphEdgeSpec[] = [];

  const idFor = (label: string) => {
    const existing = ids.get(label);
    if (existing !== undefined) return existing;
    const id = labels.length;
    ids.set(label, id);
    labels.push(label);
    return id;
  };

  for (const rawToken of text.split(",")) {
    const token = rawToken.trim();
    if (!token) continue;

    const [pair, weightText] = token.split(":");
    const match = /^(.+?)\s*([->])\s*(.+)$/.exec(pair.trim());
    if (!match) {
      idFor(pair.trim());
      continue;
    }

    const from = idFor(match[1].trim());
    const to = idFor(match[3].trim());
    const weight = weightText ? Number(weightText.trim()) : undefined;
    edges.push({
      from,
      to,
      directed: match[2] === ">",
      weight: Number.isNaN(weight) ? undefined : weight,
    });
  }

  const count = Math.max(labels.length, 1);
  const radiusX = VIEW_WIDTH * 0.37;
  const radiusY = VIEW_HEIGHT * 0.36;
  const nodes = labels.map((label, index) => {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
    return {
      id: index,
      label,
      x: VIEW_WIDTH / 2 + Math.cos(angle) * radiusX,
      y: VIEW_HEIGHT / 2 + Math.sin(angle) * radiusY,
    };
  });

  const adjacency = new Map<number, { to: number; weight: number }[]>();
  for (const node of nodes) adjacency.set(node.id, []);
  for (const edge of edges) {
    const weight = edge.weight ?? 1;
    adjacency.get(edge.from)?.push({ to: edge.to, weight });
    if (!edge.directed) adjacency.get(edge.to)?.push({ to: edge.from, weight });
  }
  for (const list of adjacency.values()) list.sort((a, b) => a.to - b.to);

  return {
    nodes,
    edges,
    adjacency,
    directed: edges.some((e) => e.directed),
    idOf: (label) => ids.get(label.trim()),
    labelOf: (id) => labels[id] ?? String(id),
  };
}

export default function GraphVisualizer({
  title,
  approaches,
  defaultInput,
  inputLabel = "Edges",
  targetFields = [],
}: Readonly<GraphVisualizerProps>) {
  const availableApproaches = APPROACH_ORDER.filter((id) => approaches[id]);
  const markerPrefix = useId().replace(/:/g, "");

  const [selectedApproach, setSelectedApproach] = useState<GraphApproachId>(
    availableApproaches[0] ?? "brute",
  );
  const [inputText, setInputText] = useState(defaultInput);
  const [appliedInput, setAppliedInput] = useState(defaultInput);
  const [targetTexts, setTargetTexts] = useState<string[]>(
    targetFields.map((f) => f.defaultValue),
  );
  const [targets, setTargets] = useState<string[]>(
    targetFields.map((f) => f.defaultValue),
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLog, setShowLog] = useState(false);

  const activeRunner = approaches[selectedApproach];
  const graph = useMemo(() => parseGraph(appliedInput), [appliedInput]);

  const steps = useMemo<GraphStep[]>(() => {
    if (!activeRunner) return [];
    try {
      return activeRunner.run(graph, targets);
    } catch {
      return [];
    }
  }, [activeRunner, graph, targets]);

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedApproach, graph, targets]);

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
    }, 850);
    return () => clearInterval(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  const handleApply = () => {
    setAppliedInput(inputText.trim() || defaultInput);
    setTargets(
      targetFields.map((field, idx) => targetTexts[idx] ?? field.defaultValue),
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
          <span style={{ fontSize: 16, fontWeight: 700 }}>🕸️ {title}</span>
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
            Graph Walkthrough
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
          {inputLabel}
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
              width: "min(300px, 55vw)",
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
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
            {/* graph canvas */}
            <div
              style={{
                background: "#0d1117",
                border: "1px solid #21262d",
                borderRadius: 12,
                padding: "14px 12px",
                marginBottom: 14,
                overflowX: "auto",
              }}
            >
              {currentStep.nodes.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#8b949e",
                    fontSize: 13,
                  }}
                >
                  Empty graph
                </div>
              ) : (
                <svg
                  viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  role="img"
                  aria-label={`Graph state: ${currentStep.description}`}
                >
                  <defs>
                    {(Object.keys(EDGE_STYLE) as GraphEdgeState[]).map(
                      (state) => (
                        <marker
                          key={state}
                          id={`${markerPrefix}-arrow-${state}`}
                          viewBox="0 0 10 10"
                          refX="9"
                          refY="5"
                          markerWidth="6"
                          markerHeight="6"
                          orient="auto-start-reverse"
                        >
                          <path
                            d="M 0 0 L 10 5 L 0 10 z"
                            fill={EDGE_STYLE[state].stroke}
                          />
                        </marker>
                      ),
                    )}
                  </defs>

                  {currentStep.edges.map((edge, idx) => {
                    const from = currentStep.nodes[edge.from];
                    const to = currentStep.nodes[edge.to];
                    if (!from || !to) return null;
                    const style = EDGE_STYLE[edge.state];
                    const dx = to.x - from.x;
                    const dy = to.y - from.y;
                    const length = Math.hypot(dx, dy) || 1;
                    const pad = NODE_RADIUS + (edge.directed ? 8 : 2);
                    const x1 = from.x + (dx / length) * NODE_RADIUS;
                    const y1 = from.y + (dy / length) * NODE_RADIUS;
                    const x2 = to.x - (dx / length) * pad;
                    const y2 = to.y - (dy / length) * pad;
                    return (
                      <g key={`edge-${edge.from}-${edge.to}-${idx}`}>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={style.stroke}
                          strokeWidth={style.width}
                          strokeDasharray={style.dash}
                          markerEnd={
                            edge.directed
                              ? `url(#${markerPrefix}-arrow-${edge.state})`
                              : undefined
                          }
                        />
                        {edge.weight !== undefined && (
                          <>
                            <circle
                              cx={(x1 + x2) / 2}
                              cy={(y1 + y2) / 2}
                              r={11}
                              fill="#0d1117"
                              stroke={style.stroke}
                              strokeWidth={1.2}
                            />
                            <text
                              x={(x1 + x2) / 2}
                              y={(y1 + y2) / 2 + 4}
                              textAnchor="middle"
                              fontSize={11}
                              fontWeight={700}
                              fontFamily="'JetBrains Mono', monospace"
                              fill={
                                edge.state === "idle" ? "#8b949e" : style.stroke
                              }
                            >
                              {edge.weight}
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}

                  {currentStep.nodes.map((node) => {
                    const style = NODE_STYLE[node.state];
                    return (
                      <g key={node.id}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={NODE_RADIUS}
                          fill={style.bg}
                          stroke={style.border}
                          strokeWidth={node.state === "idle" ? 2 : 3}
                        />
                        <text
                          x={node.x}
                          y={node.y + 5}
                          textAnchor="middle"
                          fontSize={14}
                          fontWeight={700}
                          fontFamily="'JetBrains Mono', monospace"
                          fill={style.text}
                        >
                          {node.label}
                        </text>
                        {node.note && (
                          <text
                            x={node.x}
                            y={node.y + NODE_RADIUS + 14}
                            textAnchor="middle"
                            fontSize={11}
                            fontWeight={600}
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
              )}
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

export { NODE_RADIUS, VIEW_HEIGHT, VIEW_WIDTH };
