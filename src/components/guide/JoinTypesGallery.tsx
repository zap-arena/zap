import { useId, useMemo } from "react";
import { runQuery } from "./sqlEngine";
import { SAMPLE_DB } from "./sqlExamples";

type Region = "left" | "overlap" | "right";

interface JoinCard {
  name: string;
  tagline: string;
  filled: Region[];
  sql: string;
  countSql: string;
  keeps: string;
  gotcha: string;
  accent: string;
}

const CARDS: JoinCard[] = [
  {
    name: "INNER JOIN",
    tagline: "Only rows that match on both sides",
    filled: ["overlap"],
    sql: "SELECT …\nFROM employees e\nINNER JOIN departments d\n  ON e.dept_id = d.dept_id;",
    countSql:
      "SELECT e.name FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id",
    keeps: "matches only",
    gotcha:
      "Silently deletes data: Priya (no dept) and Legal (no staff) both disappear from the report.",
    accent: "#58a6ff",
  },
  {
    name: "LEFT JOIN",
    tagline: "All left rows + matches from the right",
    filled: ["left", "overlap"],
    sql: "SELECT …\nFROM employees e\nLEFT JOIN departments d\n  ON e.dept_id = d.dept_id;",
    countSql:
      "SELECT e.name FROM employees e LEFT JOIN departments d ON e.dept_id = d.dept_id",
    keeps: "all of employees",
    gotcha:
      "The right-hand columns become NULL, not missing. Any later WHERE on those columns turns it back into an INNER JOIN.",
    accent: "#d29922",
  },
  {
    name: "RIGHT JOIN",
    tagline: "All right rows + matches from the left",
    filled: ["overlap", "right"],
    sql: "SELECT …\nFROM employees e\nRIGHT JOIN departments d\n  ON e.dept_id = d.dept_id;",
    countSql:
      "SELECT e.name FROM employees e RIGHT JOIN departments d ON e.dept_id = d.dept_id",
    keeps: "all of departments",
    gotcha:
      "Identical to swapping the tables and using LEFT JOIN. Most teams ban it for exactly that reason — read order stops matching execution order.",
    accent: "#db6d28",
  },
  {
    name: "FULL OUTER JOIN",
    tagline: "Everything from both sides",
    filled: ["left", "overlap", "right"],
    sql: "SELECT …\nFROM employees e\nFULL OUTER JOIN departments d\n  ON e.dept_id = d.dept_id;",
    countSql:
      "SELECT e.name FROM employees e FULL OUTER JOIN departments d ON e.dept_id = d.dept_id",
    keeps: "nothing is dropped",
    gotcha:
      "A row can be NULL-padded on either side, so `WHERE col IS NULL` no longer tells you which table the gap came from.",
    accent: "#a371f7",
  },
  {
    name: "CROSS JOIN",
    tagline: "Every pairing — no condition at all",
    filled: ["left", "overlap", "right"],
    sql: "SELECT …\nFROM employees e\nCROSS JOIN departments d;",
    countSql: "SELECT e.name FROM employees e CROSS JOIN departments d",
    keeps: "8 × 4 = every combination",
    gotcha:
      "Forgetting the ON clause produces this by accident. On two million-row tables that is a trillion rows.",
    accent: "#f85149",
  },
  {
    name: "SELF JOIN",
    tagline: "One table joined to itself",
    filled: ["left", "overlap"],
    sql: "SELECT e.name, m.name AS manager\nFROM employees e\nLEFT JOIN employees m\n  ON e.manager_id = m.emp_id;",
    countSql:
      "SELECT e.name FROM employees e LEFT JOIN employees m ON e.manager_id = m.emp_id",
    keeps: "hierarchy pairs",
    gotcha:
      "Not a separate join type — just aliases. Use LEFT, or the top of the hierarchy (Asha) vanishes from her own org chart.",
    accent: "#3fb950",
  },
  {
    name: "ANTI JOIN",
    tagline: "Left rows with no match at all",
    filled: ["left"],
    sql: "SELECT e.name\nFROM employees e\nLEFT JOIN sales s\n  ON e.emp_id = s.emp_id\nWHERE s.sale_id IS NULL;",
    countSql:
      "SELECT e.name FROM employees e LEFT JOIN sales s ON e.emp_id = s.emp_id WHERE s.sale_id IS NULL",
    keeps: "the non-matches",
    gotcha:
      "There is no ANTI JOIN keyword in standard SQL. LEFT JOIN + IS NULL, or NOT EXISTS, is how you spell it.",
    accent: "#8b949e",
  },
  {
    name: "SEMI JOIN",
    tagline: "Left rows that have at least one match",
    filled: ["overlap"],
    sql: "SELECT e.name\nFROM employees e\nWHERE EXISTS (\n  SELECT 1 FROM sales s\n  WHERE s.emp_id = e.emp_id\n);",
    countSql:
      "SELECT e.name FROM employees e WHERE EXISTS (SELECT 1 FROM sales s WHERE s.emp_id = e.emp_id)",
    keeps: "matching left rows, once each",
    gotcha:
      "Unlike INNER JOIN it never duplicates a left row, even when the right side matches five times. That is the whole point of EXISTS.",
    accent: "#39c5cf",
  },
];

function VennSvg({
  filled,
  accent,
}: Readonly<{ filled: Region[]; accent: string }>) {
  const idle = "#21262d";
  const clipId = `venn-clip-${useId().replace(/:/g, "")}`;
  const has = (region: Region) => filled.includes(region);

  return (
    <svg
      viewBox="0 0 180 96"
      width="100%"
      height="92"
      role="img"
      aria-label={`Venn diagram highlighting ${filled.join(", ")}`}
    >
      <title>{`Regions kept: ${filled.join(", ")}`}</title>
      <defs>
        <clipPath id={clipId}>
          <circle cx="70" cy="48" r="34" />
        </clipPath>
      </defs>

      <circle
        cx="70"
        cy="48"
        r="34"
        fill={has("left") ? accent : idle}
        fillOpacity={has("left") ? 0.4 : 0.35}
        stroke={accent}
        strokeWidth="1.5"
      />
      <circle
        cx="110"
        cy="48"
        r="34"
        fill={has("right") ? accent : idle}
        fillOpacity={has("right") ? 0.4 : 0.35}
        stroke={accent}
        strokeWidth="1.5"
      />
      <g clipPath={`url(#${clipId})`}>
        <circle
          cx="110"
          cy="48"
          r="34"
          fill={has("overlap") ? accent : idle}
          fillOpacity={has("overlap") ? 0.85 : 0.5}
        />
      </g>

      <circle
        cx="70"
        cy="48"
        r="34"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
      />
      <circle
        cx="110"
        cy="48"
        r="34"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
      />

      <text
        x="46"
        y="52"
        fill="#e6edf3"
        fontSize="11"
        fontWeight="700"
        textAnchor="middle"
      >
        A
      </text>
      <text
        x="134"
        y="52"
        fill="#e6edf3"
        fontSize="11"
        fontWeight="700"
        textAnchor="middle"
      >
        B
      </text>
    </svg>
  );
}

export default function JoinTypesGallery() {
  const counts = useMemo(() => {
    const map: Record<string, string> = {};
    for (const card of CARDS) {
      try {
        map[card.name] =
          `${runQuery(card.countSql, SAMPLE_DB).rows.length} rows`;
      } catch {
        map[card.name] = "—";
      }
    }
    return map;
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(255px, 1fr))",
        gap: 14,
        marginTop: 16,
      }}
    >
      {CARDS.map((card) => (
        <div
          key={card.name}
          style={{
            background: "#0d1117",
            border: "1px solid #30363d",
            borderRadius: 12,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: card.accent,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {card.name}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 10.5,
                fontWeight: 700,
                color: "#3fb950",
                background: "rgba(63,185,80,0.12)",
                border: "1px solid #238636",
                borderRadius: 20,
                padding: "2px 8px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {counts[card.name]}
            </span>
          </div>

          <div style={{ fontSize: 11.5, color: "#8b949e", lineHeight: 1.5 }}>
            {card.tagline}
          </div>

          <VennSvg filled={card.filled} accent={card.accent} />

          <div
            style={{
              fontSize: 10.5,
              textAlign: "center",
              color: card.accent,
              fontWeight: 700,
              letterSpacing: 0.3,
              textTransform: "uppercase",
            }}
          >
            keeps: {card.keeps}
          </div>

          <pre
            style={{
              background: "#010409",
              border: "1px solid #21262d",
              borderRadius: 7,
              padding: "9px 10px",
              margin: 0,
              fontSize: 10.5,
              lineHeight: 1.55,
              color: "#c9d1d9",
              overflowX: "auto",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <code>{card.sql}</code>
          </pre>

          <div
            style={{
              fontSize: 11,
              color: "#d29922",
              lineHeight: 1.55,
              borderTop: "1px solid #21262d",
              paddingTop: 7,
            }}
          >
            <strong>Gotcha: </strong>
            {card.gotcha}
          </div>
        </div>
      ))}
    </div>
  );
}
