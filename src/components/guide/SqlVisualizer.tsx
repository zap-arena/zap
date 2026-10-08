import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  formatValue,
  type QueryResult,
  type RowState,
  runQuery,
  type SqlDatabase,
  type SqlValue,
  type TraceStage,
} from "./sqlEngine";
import { SAMPLE_DB, SCHEMA_SUMMARY, type SqlExample } from "./sqlExamples";

interface SqlVisualizerProps {
  title: string;
  examples: SqlExample[];
  db?: SqlDatabase;
  badge?: string;
}

const ROW_STYLE: Record<
  RowState,
  { bg: string; border: string; label: string }
> = {
  neutral: { bg: "transparent", border: "#21262d", label: "#8b949e" },
  kept: { bg: "rgba(63,185,80,0.12)", border: "#238636", label: "#3fb950" },
  dropped: { bg: "rgba(248,81,73,0.10)", border: "#6e2a25", label: "#f85149" },
  matched: { bg: "rgba(88,166,255,0.10)", border: "#1f3a6e", label: "#58a6ff" },
  padded: { bg: "rgba(210,153,34,0.12)", border: "#6b4a10", label: "#d29922" },
  group: { bg: "rgba(163,113,247,0.12)", border: "#4c327d", label: "#a371f7" },
};

const CLAUSE_COLOR: Record<string, string> = {
  FROM: "#58a6ff",
  "INNER JOIN": "#58a6ff",
  "LEFT JOIN": "#d29922",
  "RIGHT JOIN": "#d29922",
  "FULL JOIN": "#d29922",
  "CROSS JOIN": "#d29922",
  WHERE: "#f85149",
  "GROUP BY": "#a371f7",
  HAVING: "#a371f7",
  WINDOW: "#3fb950",
  SELECT: "#58a6ff",
  DISTINCT: "#58a6ff",
  "ORDER BY": "#db6d28",
  LIMIT: "#db6d28",
  RESULT: "#3fb950",
};

const MAX_RENDERED_ROWS = 14;

function pillButtonStyle(
  variant: "primary" | "secondary",
  disabled?: boolean,
): React.CSSProperties {
  return {
    padding: "8px 18px",
    borderRadius: 8,
    border: variant === "secondary" ? "1px solid #30363d" : "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: 13,
    fontWeight: 600,
    opacity: disabled ? 0.35 : 1,
    background: variant === "primary" ? "#1f6feb" : "#21262d",
    color: variant === "primary" ? "#fff" : "#e6edf3",
  };
}

function StageTable({ stage }: Readonly<{ stage: TraceStage }>) {
  const visible = stage.rows.slice(0, MAX_RENDERED_ROWS);
  const hidden = stage.rows.length - visible.length;
  const hasNotes = stage.rows.some((row) => row.note);

  if (stage.rows.length === 0) {
    return (
      <div
        style={{
          padding: "26px 14px",
          textAlign: "center",
          color: "#8b949e",
          fontSize: 13,
          border: "1px dashed #30363d",
          borderRadius: 10,
        }}
      >
        No rows at this stage — the result set is empty.
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 12.5,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <thead>
          <tr>
            {stage.columns.map((column) => (
              <th
                key={column}
                style={{
                  textAlign: "left",
                  padding: "7px 10px",
                  borderBottom: "1px solid #30363d",
                  color: "#58a6ff",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {column}
              </th>
            ))}
            {hasNotes && (
              <th
                style={{
                  textAlign: "left",
                  padding: "7px 10px",
                  borderBottom: "1px solid #30363d",
                  color: "#8b949e",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                what happened
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {visible.map((row, rowIndex) => {
            const style = ROW_STYLE[row.state];
            return (
              <tr
                key={`${stage.key}-${rowIndex}-${row.cells.map(formatValue).join("|")}`}
                style={{
                  background: style.bg,
                  opacity: row.state === "dropped" ? 0.55 : 1,
                  textDecoration:
                    row.state === "dropped" ? "line-through" : "none",
                }}
              >
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={`${stage.columns[cellIndex] ?? cellIndex}`}
                    style={{
                      padding: "6px 10px",
                      borderBottom: "1px solid #161b22",
                      color: cell === null ? "#d29922" : "#e6edf3",
                      fontStyle: cell === null ? "italic" : "normal",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatValue(cell as SqlValue)}
                  </td>
                ))}
                {hasNotes && (
                  <td
                    style={{
                      padding: "6px 10px",
                      borderBottom: "1px solid #161b22",
                      color: style.label,
                      fontSize: 11.5,
                      whiteSpace: "nowrap",
                      textDecoration: "none",
                    }}
                  >
                    {row.note ?? ""}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {hidden > 0 && (
        <div style={{ padding: "8px 10px", fontSize: 11.5, color: "#8b949e" }}>
          … {hidden} more row(s) not shown
        </div>
      )}
    </div>
  );
}

export default function SqlVisualizer({
  title,
  examples,
  db = SAMPLE_DB,
  badge = "Query Walkthrough",
}: Readonly<SqlVisualizerProps>) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [queryText, setQueryText] = useState(examples[0]?.sql ?? "");
  const [appliedQuery, setAppliedQuery] = useState(examples[0]?.sql ?? "");
  const [stageIndex, setStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSchema, setShowSchema] = useState(false);

  const outcome = useMemo<
    { ok: true; result: QueryResult } | { ok: false; message: string }
  >(() => {
    try {
      return { ok: true, result: runQuery(appliedQuery, db) };
    } catch (error) {
      return { ok: false, message: (error as Error).message };
    }
  }, [appliedQuery, db]);

  const stages = outcome.ok ? outcome.result.stages : [];

  useEffect(() => {
    setStageIndex(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    if (stageIndex >= stages.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setInterval(() => {
      setStageIndex((prev) => {
        if (prev >= stages.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1400);
    return () => clearInterval(timer);
  }, [isPlaying, stageIndex, stages.length]);

  const selectExample = (index: number) => {
    const example = examples[index];
    if (!example) return;
    setExampleIndex(index);
    setQueryText(example.sql);
    setAppliedQuery(example.sql);
    setStageIndex(0);
    setIsPlaying(false);
  };

  const handleRun = () => {
    setAppliedQuery(queryText);
    setStageIndex(0);
    setIsPlaying(false);
  };

  const safeIndex = Math.min(stageIndex, Math.max(stages.length - 1, 0));
  const stage = stages[safeIndex];
  const activeExample = examples[exampleIndex];

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
          <span style={{ fontSize: 16, fontWeight: 700 }}>🗃️ {title}</span>
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
            {badge}
          </span>
          <button
            type="button"
            onClick={() => setShowSchema((prev) => !prev)}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "1px solid #30363d",
              borderRadius: 6,
              color: "#8b949e",
              cursor: "pointer",
              fontSize: 11.5,
              padding: "4px 10px",
            }}
          >
            {showSchema ? "▾" : "▸"} Sample schema
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {examples.map((example, index) => (
            <button
              key={example.label}
              type="button"
              onClick={() => selectExample(index)}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border:
                  exampleIndex === index
                    ? "1px solid #58a6ff"
                    : "1px solid #30363d",
                background: exampleIndex === index ? "#1f3a6e" : "#0d1117",
                color: exampleIndex === index ? "#58a6ff" : "#8b949e",
                cursor: "pointer",
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              {example.label}
            </button>
          ))}
        </div>

        {showSchema && (
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gap: 8,
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            }}
          >
            {SCHEMA_SUMMARY.map((entry) => (
              <div
                key={entry.table}
                style={{
                  border: "1px solid #30363d",
                  borderRadius: 8,
                  padding: "8px 11px",
                  background: "#0d1117",
                }}
              >
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "#58a6ff",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {entry.table}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#8b949e",
                    marginTop: 3,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {entry.columns}
                </div>
                <div style={{ fontSize: 11, color: "#d29922", marginTop: 4 }}>
                  {entry.note}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor */}
      <div
        style={{
          padding: "14px clamp(12px, 4vw, 22px)",
          borderBottom: "1px solid #21262d",
        }}
      >
        <textarea
          value={queryText}
          onChange={(event) => setQueryText(event.target.value)}
          spellCheck={false}
          rows={Math.min(14, Math.max(4, queryText.split("\n").length + 1))}
          style={{
            width: "100%",
            resize: "vertical",
            padding: "11px 13px",
            borderRadius: 8,
            border: "1px solid #30363d",
            background: "#010409",
            color: "#e6edf3",
            fontSize: 13,
            lineHeight: 1.6,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        />
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <button
            type="button"
            onClick={handleRun}
            style={pillButtonStyle("primary")}
          >
            ▶ Run query
          </button>
          <button
            type="button"
            onClick={() => selectExample(exampleIndex)}
            style={pillButtonStyle("secondary")}
          >
            ↺ Reset
          </button>
          <span style={{ fontSize: 11.5, color: "#8b949e" }}>
            Edit the SQL and re-run it — the walkthrough below updates live.
          </span>
        </div>
      </div>

      {!outcome.ok && (
        <div
          style={{
            padding: "16px clamp(12px, 4vw, 22px)",
            background: "rgba(248,81,73,0.08)",
            borderBottom: "1px solid #21262d",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f85149" }}>
            ✕ Query error
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "#ffa198",
              marginTop: 5,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {outcome.message}
          </div>
        </div>
      )}

      {outcome.ok && stage && (
        <>
          {/* Stage pipeline */}
          <div
            style={{
              padding: "14px clamp(12px, 4vw, 22px)",
              borderBottom: "1px solid #21262d",
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {stages.map((item, index) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setStageIndex(index);
                  setIsPlaying(false);
                }}
                style={{
                  padding: "5px 11px",
                  borderRadius: 20,
                  border:
                    index === safeIndex
                      ? `1px solid ${CLAUSE_COLOR[item.clause] ?? "#58a6ff"}`
                      : "1px solid #30363d",
                  background: index === safeIndex ? "#161b22" : "transparent",
                  color:
                    index === safeIndex
                      ? (CLAUSE_COLOR[item.clause] ?? "#58a6ff")
                      : "#6e7681",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {index + 1}. {item.clause}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div
            style={{
              padding: "12px clamp(12px, 4vw, 22px)",
              borderBottom: "1px solid #21262d",
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              disabled={stages.length <= 1}
              style={pillButtonStyle("primary", stages.length <= 1)}
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStageIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={safeIndex === 0}
              style={pillButtonStyle("secondary", safeIndex === 0)}
            >
              ◀ Prev
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStageIndex((prev) => Math.min(stages.length - 1, prev + 1));
              }}
              disabled={safeIndex >= stages.length - 1}
              style={pillButtonStyle(
                "secondary",
                safeIndex >= stages.length - 1,
              )}
            >
              Next ▶
            </button>
            <span style={{ fontSize: 12, color: "#8b949e" }}>
              Stage {safeIndex + 1} / {stages.length}
            </span>
          </div>

          {/* Stage body */}
          <div style={{ padding: "16px clamp(12px, 4vw, 22px)" }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "baseline",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 0.6,
                  color: CLAUSE_COLOR[stage.clause] ?? "#58a6ff",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {stage.clause}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>
                {stage.title}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 11.5,
                  color: "#3fb950",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {stage.summary}
              </span>
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: "#8b949e",
                margin: "8px 0 14px",
                lineHeight: 1.6,
              }}
            >
              {stage.detail}
            </p>

            <StageTable stage={stage} />

            {/* Legend */}
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginTop: 12,
                fontSize: 11,
                color: "#8b949e",
              }}
            >
              {(
                [
                  ["kept", "kept"],
                  ["dropped", "filtered out"],
                  ["matched", "join match"],
                  ["padded", "NULL-padded"],
                  ["group", "group"],
                ] as [RowState, string][]
              ).map(([state, label]) => (
                <span
                  key={state}
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                  <span
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 3,
                      background: ROW_STYLE[state].bg,
                      border: `1px solid ${ROW_STYLE[state].border}`,
                    }}
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Takeaway */}
          {activeExample && appliedQuery === activeExample.sql && (
            <div
              style={{
                padding: "13px clamp(12px, 4vw, 22px)",
                borderTop: "1px solid #21262d",
                background: "#161b22",
                fontSize: 12.5,
                color: "#c9d1d9",
                lineHeight: 1.65,
              }}
            >
              <strong style={{ color: "#3fb950" }}>Takeaway: </strong>
              {activeExample.takeaway}
            </div>
          )}
        </>
      )}
    </div>
  );
}
