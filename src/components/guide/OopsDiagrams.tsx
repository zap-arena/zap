import type React from "react";

/** Lightweight inline-styled diagram primitives for the Java OOPs guide, matching the dark visualizer theme. */

const PALETTE = {
  bg: "#0d1117",
  panel: "#161b22",
  border: "#30363d",
  borderSoft: "#21262d",
  text: "#e6edf3",
  muted: "#8b949e",
  blue: "#3b82f6",
  blueSoft: "#93c5fd",
  pink: "#ec4899",
  pinkSoft: "#fbcfe8",
  purple: "#a371f7",
  purpleSoft: "#ddd6fe",
  green: "#059669",
  greenSoft: "#a7f3d0",
  amber: "#f59e0b",
  amberSoft: "#fde68a",
};

export function InfoCards({
  cards,
}: Readonly<{ cards: { title: string; desc: string; code?: string; color: string }[] }>) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 10,
        marginTop: 12,
      }}
    >
      {cards.map((c) => (
        <div
          key={c.title}
          style={{
            background: PALETTE.panel,
            border: `1px solid ${PALETTE.borderSoft}`,
            borderLeft: `4px solid ${c.color}`,
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <div style={{ fontWeight: 700, color: PALETTE.text, fontSize: 14, marginBottom: 4 }}>{c.title}</div>
          <div style={{ color: PALETTE.muted, fontSize: 12.5, lineHeight: 1.5 }}>{c.desc}</div>
          {c.code && (
            <pre
              style={{
                marginTop: 8,
                background: PALETTE.bg,
                border: `1px solid ${PALETTE.borderSoft}`,
                borderRadius: 7,
                padding: "8px 10px",
                fontSize: 11.5,
                color: "#c9d1d9",
                overflowX: "auto",
              }}
            >
              <code>{c.code}</code>
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}

export function VennPair({
  leftFilled,
  rightFilled,
  overlapFilled,
  color = "#f59e0b",
}: Readonly<{ leftFilled: boolean; rightFilled: boolean; overlapFilled: boolean; color?: string }>) {
  const r = 30;
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" style={{ display: "block", margin: "8px auto" }}>
      <circle cx={40} cy={40} r={r} fill={leftFilled ? color : "transparent"} stroke={PALETTE.border} strokeWidth={2} />
      <circle cx={80} cy={40} r={r} fill={rightFilled ? color : "transparent"} stroke={PALETTE.border} strokeWidth={2} />
      {overlapFilled && (
        <path d="M 53 16 A 30 30 0 0 0 53 64 A 30 30 0 0 0 53 16 Z" fill={color} />
      )}
    </svg>
  );
}

export function FlowDiagram({ nodes }: Readonly<{ nodes: string[] }>) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
        background: PALETTE.bg,
        border: `1px solid ${PALETTE.borderSoft}`,
        borderRadius: 12,
        padding: "18px 16px",
        marginTop: 12,
      }}
    >
      {nodes.map((label, idx) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: `1px solid ${PALETTE.blue}`,
              background: "#0d1f38",
              color: PALETTE.blueSoft,
              fontWeight: 700,
              fontSize: 13,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
          {idx < nodes.length - 1 && <span style={{ color: PALETTE.muted, fontSize: 18 }}>→</span>}
        </div>
      ))}
    </div>
  );
}

export function PillarsGrid({
  pillars,
}: Readonly<{ pillars: { title: string; desc: string; color: string }[] }>) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 10,
        marginTop: 12,
      }}
    >
      {pillars.map((p) => (
        <div
          key={p.title}
          style={{
            position: "relative",
            background: PALETTE.panel,
            border: `1px solid ${PALETTE.borderSoft}`,
            borderLeft: `4px solid ${p.color}`,
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <div style={{ fontWeight: 700, color: PALETTE.text, fontSize: 14, marginBottom: 4 }}>{p.title}</div>
          <div style={{ color: PALETTE.muted, fontSize: 12.5, lineHeight: 1.5 }}>{p.desc}</div>
        </div>
      ))}
    </div>
  );
}

export function OrgChart({
  root,
  children,
}: Readonly<{ root: string; children: { label: string; grandchildren?: string[] }[] }>) {
  return (
    <div
      style={{
        background: PALETTE.bg,
        border: `1px solid ${PALETTE.borderSoft}`,
        borderRadius: 12,
        padding: "20px 16px",
        marginTop: 12,
        textAlign: "center",
      }}
    >
      <NodePill label={root} color={PALETTE.green} />
      <div style={{ width: 2, height: 16, background: PALETTE.border, margin: "0 auto" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 28,
          paddingTop: 16,
          borderTop: `2px solid ${PALETTE.border}`,
          flexWrap: "wrap",
        }}
      >
        {children.map((child) => (
          <div key={child.label} style={{ position: "relative", paddingTop: 0 }}>
            <div style={{ width: 2, height: 16, background: PALETTE.border, margin: "-16px auto 0" }} />
            <NodePill label={child.label} color={PALETTE.amber} />
            {child.grandchildren && child.grandchildren.length > 0 && (
              <>
                <div style={{ width: 2, height: 16, background: PALETTE.border, margin: "0 auto" }} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 16,
                    paddingTop: 16,
                    borderTop: `2px solid ${PALETTE.border}`,
                  }}
                >
                  {child.grandchildren.map((gc) => (
                    <div key={gc} style={{ position: "relative" }}>
                      <div style={{ width: 2, height: 16, background: PALETTE.border, margin: "-16px auto 0" }} />
                      <NodePill label={gc} color={PALETTE.pink} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MergeChart({
  parents,
  child,
}: Readonly<{ parents: string[]; child: string }>) {
  return (
    <div
      style={{
        background: PALETTE.bg,
        border: `1px solid ${PALETTE.borderSoft}`,
        borderRadius: 12,
        padding: "20px 16px",
        marginTop: 12,
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 28,
          paddingBottom: 16,
          borderBottom: `2px solid ${PALETTE.border}`,
          flexWrap: "wrap",
        }}
      >
        {parents.map((p) => (
          <div key={p} style={{ position: "relative" }}>
            <NodePill label={p} color={PALETTE.purple} />
            <div style={{ width: 2, height: 16, background: PALETTE.border, margin: "0 auto -16px" }} />
          </div>
        ))}
      </div>
      <div style={{ width: 2, height: 16, background: PALETTE.border, margin: "0 auto" }} />
      <NodePill label={child} color={PALETTE.green} />
    </div>
  );
}

function NodePill({ label, color }: Readonly<{ label: string; color: string }>) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "7px 16px",
        borderRadius: 8,
        border: `1px solid ${color}`,
        background: PALETTE.panel,
        color: PALETTE.text,
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      {label}
    </span>
  );
}

export function Rings({
  rings,
}: Readonly<{ rings: { label: string; color: string; size: number }[] }>) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px 0 4px" }}>
      <div style={{ position: "relative", width: "min(320px, 80vw)", height: "min(320px, 80vw)" }}>
        {rings.map((ring, idx) => {
          const inset = (100 - ring.size) / 2;
          return (
            <div
              key={ring.label}
              style={{
                position: "absolute",
                inset: `${inset}%`,
                borderRadius: "50%",
                border: `1px solid ${ring.color}`,
                background: `${ring.color}14`,
                display: "flex",
                justifyContent: "center",
                paddingTop: 14 + idx * 2,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                color: ring.color,
              }}
            >
              {ring.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Layers({
  visible,
  hidden,
}: Readonly<{ visible: string; hidden: string }>) {
  return (
    <div
      style={{
        marginTop: 12,
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${PALETTE.borderSoft}`,
      }}
    >
      <div style={{ padding: "12px 16px", background: "#0d2818", color: PALETTE.greenSoft, fontWeight: 600, fontSize: 13 }}>
        {visible}
      </div>
      <div style={{ padding: "12px 16px", background: "#0a1020", color: "#aab9d8", fontSize: 13 }}>{hidden}</div>
    </div>
  );
}

export function VModelDiagram({
  pairs,
  bottom,
}: Readonly<{ pairs: { left: string; right: string }[]; bottom: string }>) {
  return (
    <div
      style={{
        marginTop: 12,
        background: PALETTE.bg,
        border: `1px solid ${PALETTE.borderSoft}`,
        borderRadius: 12,
        padding: "18px 16px",
      }}
    >
      {pairs.map((p, idx) => {
        const indent = idx * 34;
        return (
          <div
            key={p.left}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginLeft: indent,
              marginRight: indent,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                flex: 1,
                minWidth: 120,
                textAlign: "right",
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${PALETTE.blue}`,
                background: "#0d1f38",
                color: PALETTE.blueSoft,
                fontWeight: 700,
                fontSize: 12.5,
              }}
            >
              {p.left}
            </span>
            <span style={{ color: PALETTE.muted, fontSize: 14 }}>⟷</span>
            <span
              style={{
                flex: 1,
                minWidth: 120,
                textAlign: "left",
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${PALETTE.pink}`,
                background: "#2a0d20",
                color: PALETTE.pinkSoft,
                fontWeight: 700,
                fontSize: 12.5,
              }}
            >
              {p.right}
            </span>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <span
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            border: `1px solid ${PALETTE.green}`,
            background: "#0d2818",
            color: PALETTE.greenSoft,
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {bottom}
        </span>
      </div>
    </div>
  );
}

export function SpiralDiagram({
  quadrants,
}: Readonly<{ quadrants: { label: string; color: string }[] }>) {
  const cx = 150;
  const cy = 150;
  const turns = 2.25;
  const totalAngle = turns * Math.PI * 2;
  const steps = 240;
  const a = 10;
  const b = 15;
  const segAngle = (Math.PI * 2) / quadrants.length;

  const runs: { color: string; points: string }[] = [];
  let currentColorIdx = -1;
  let currentPoints: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * totalAngle;
    const r = a + b * (angle / (Math.PI * 2));
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const colorIdx = Math.floor(angle / segAngle) % quadrants.length;
    if (colorIdx !== currentColorIdx) {
      if (currentPoints.length > 1) {
        runs.push({ color: quadrants[currentColorIdx].color, points: currentPoints.join(" ") });
      }
      currentColorIdx = colorIdx;
      currentPoints = currentPoints.length > 0 ? [currentPoints[currentPoints.length - 1]] : [];
    }
    currentPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  if (currentPoints.length > 1) {
    runs.push({ color: quadrants[currentColorIdx].color, points: currentPoints.join(" ") });
  }

  return (
    <div
      style={{
        marginTop: 12,
        display: "flex",
        gap: 20,
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        background: PALETTE.bg,
        border: `1px solid ${PALETTE.borderSoft}`,
        borderRadius: 12,
        padding: "16px",
      }}
    >
      <svg width="200" height="200" viewBox="0 0 300 300">
        {runs.map((run, idx) => (
          <polyline
            key={`${run.color}-${idx}`}
            points={run.points}
            fill="none"
            stroke={run.color}
            strokeWidth={5}
            strokeLinecap="round"
          />
        ))}
        <circle cx={cx} cy={cy} r={4} fill={PALETTE.text} />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {quadrants.map((q) => (
          <div key={q.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: q.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: PALETTE.text }}>{q.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VerticalSteps({ steps }: Readonly<{ steps: string[] }>) {
  return (
    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {steps.map((s, idx) => (
        <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid ${PALETTE.blue}`,
              background: "#0d1f38",
              minWidth: 200,
              justifyContent: "center",
            }}
          >
            <span style={{ color: PALETTE.blueSoft, opacity: 0.7, fontSize: 11, fontWeight: 700 }}>{idx + 1}</span>
            <span style={{ color: PALETTE.blueSoft, fontWeight: 700, fontSize: 13 }}>{s}</span>
          </div>
          {idx < steps.length - 1 && <span style={{ color: PALETTE.muted, fontSize: 16, lineHeight: 1.4 }}>↓</span>}
        </div>
      ))}
    </div>
  );
}

export function GroupingDiagram({
  rows,
  groups,
}: Readonly<{
  rows: { label: string; key: string }[];
  groups: { key: string; color: string; agg: string }[];
}>) {
  return (
    <div
      style={{
        marginTop: 12,
        display: "flex",
        gap: 24,
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        background: PALETTE.bg,
        border: `1px solid ${PALETTE.borderSoft}`,
        borderRadius: 12,
        padding: "18px 16px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map((r) => {
          const g = groups.find((gr) => gr.key === r.key);
          return (
            <span
              key={r.label}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: `1px solid ${g?.color ?? PALETTE.border}`,
                color: PALETTE.text,
                fontSize: 12,
                background: PALETTE.panel,
              }}
            >
              {r.label}
            </span>
          );
        })}
      </div>
      <span style={{ color: PALETTE.muted, fontSize: 20 }}>⇒</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {groups.map((g) => (
          <div
            key={g.key}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: `1px solid ${g.color}`,
              background: `${g.color}1a`,
              color: g.color,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {g.key}: <span style={{ color: PALETTE.text, fontWeight: 400 }}>{g.agg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KeyRelationDiagram({
  tableA,
  tableB,
  relation = "1 : N",
}: Readonly<{
  tableA: { name: string; columns: { name: string; tag?: "PK" | "FK" }[] };
  tableB: { name: string; columns: { name: string; tag?: "PK" | "FK" }[] };
  relation?: string;
}>) {
  const renderTable = (t: { name: string; columns: { name: string; tag?: "PK" | "FK" }[] }) => (
    <div
      style={{
        background: PALETTE.panel,
        border: `1px solid ${PALETTE.borderSoft}`,
        borderRadius: 10,
        minWidth: 170,
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          borderBottom: `1px solid ${PALETTE.borderSoft}`,
          fontWeight: 700,
          color: PALETTE.text,
          fontSize: 13,
        }}
      >
        {t.name}
      </div>
      {t.columns.map((c) => (
        <div
          key={c.name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            padding: "6px 12px",
            fontSize: 12,
            color: PALETTE.muted,
            borderBottom: `1px solid ${PALETTE.borderSoft}`,
          }}
        >
          <span>{c.name}</span>
          {c.tag && (
            <span style={{ color: c.tag === "PK" ? PALETTE.amber : PALETTE.pink, fontWeight: 700, fontSize: 10.5 }}>
              {c.tag}
            </span>
          )}
        </div>
      ))}
    </div>
  );
  return (
    <div
      style={{
        marginTop: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        flexWrap: "wrap",
        background: PALETTE.bg,
        border: `1px solid ${PALETTE.borderSoft}`,
        borderRadius: 12,
        padding: "18px 16px",
      }}
    >
      {renderTable(tableA)}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ color: PALETTE.muted, fontSize: 18 }}>⟶</span>
        <span style={{ color: PALETTE.green, fontSize: 11, fontWeight: 700 }}>{relation}</span>
      </div>
      {renderTable(tableB)}
    </div>
  );
}

export function CompareTable({
  headers,
  rows,
}: Readonly<{ headers: string[]; rows: (string | React.ReactNode)[][] }>) {
  return (
    <div style={{ overflowX: "auto", marginTop: 12 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  background: PALETTE.panel,
                  color: PALETTE.text,
                  border: `1px solid ${PALETTE.borderSoft}`,
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, cIdx) => (
                <td
                  key={`${row[0]}-${cIdx}`}
                  style={{
                    padding: "8px 12px",
                    color: PALETTE.muted,
                    border: `1px solid ${PALETTE.borderSoft}`,
                    verticalAlign: "top",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
