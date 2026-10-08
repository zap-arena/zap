import type React from "react";
import JoinTypesGallery from "../../components/guide/JoinTypesGallery";
import {
  CompareTable,
  GroupingDiagram,
  InfoCards,
  KeyRelationDiagram,
  MergeChart,
  VennPair,
  VerticalSteps,
} from "../../components/guide/OopsDiagrams";
import SqlVisualizer from "../../components/guide/SqlVisualizer";
import {
  aggregateExamples,
  basicQueryExamples,
  joinExamples,
  labExamples,
  subqueryExamples,
  windowExamples,
} from "../../components/guide/sqlExamples";
import Navbar from "../../components/Navbar";
import { useGuideLogic } from "../../hooks/useGuideLogic";

export default function SqlGuidePage() {
  useGuideLogic();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Topic navigation">
          <div className="sidebar-title">SQL Blueprint</div>
          <div className="side-group">
            <div className="side-group-label">Foundations</div>
            <a className="side-link" href="#q1">
              01 · Data &amp; Types
            </a>
            <a className="side-link" href="#q2">
              02 · Data Systems
            </a>
            <a className="side-link" href="#q3">
              03 · ACID Properties
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Schema Design</div>
            <a className="side-link" href="#q4">
              04 · Normalization
            </a>
            <a className="side-link" href="#q5">
              05 · Denormalization
            </a>
            <a className="side-link" href="#q6">
              06 · Distributed DBs
            </a>
            <a className="side-link" href="#q13">
              13 · Database Keys
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Querying</div>
            <a className="side-link" href="#q7">
              07 · Sub-languages
            </a>
            <a className="side-link" href="#q8">
              08 · Query Execution
            </a>
            <a className="side-link" href="#q9">
              09 · WHERE &amp; Functions
            </a>
            <a className="side-link" href="#q10">
              10 · GROUP BY &amp; HAVING
            </a>
            <a className="side-link" href="#q11">
              11 · NULL Handling
            </a>
            <a className="side-link" href="#q12">
              12 · CTEs
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Combining Data</div>
            <a className="side-link" href="#q14">
              14 · SQL Joins
            </a>
            <a className="side-link" href="#q15">
              15 · Views
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Hands-on · Visual</div>
            <a className="side-link" href="#q16">
              16 · Anatomy of a SELECT
            </a>
            <a className="side-link" href="#q17">
              17 · Aggregation Visualised
            </a>
            <a className="side-link" href="#q18">
              18 · Types of Join
            </a>
            <a className="side-link" href="#q19">
              19 · Joins Step by Step
            </a>
            <a className="side-link" href="#q20">
              20 · Window Functions
            </a>
            <a className="side-link" href="#q21">
              21 · Subqueries
            </a>
            <a className="side-link" href="#q22">
              22 · Query Lab
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">SQL</span>
              <span className="sub">Zero to Query</span>
            </div>
          </div>

          <div className="question-nav">
            <button type="button" id="prevQuestionBtn">
              ← Previous
            </button>
            <span className="question-nav-progress" id="questionProgress" />
            <button type="button" id="nextQuestionBtn">
              Next →
            </button>
          </div>

          <div className="content">
            <div className="intro">
              <h1>Zero to Query: The SQL Blueprint</h1>
              <p>
                Twenty-two topics covering everything from raw data types to
                joins, window functions and subqueries — with a live SQL engine
                built into the page so you can run every example, edit it, and
                watch the query execute one clause at a time.
              </p>
              <div className="legend">
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={
                      {
                        background: "hsl(var(--primary))",
                      } as React.CSSProperties
                    }
                  ></span>
                  Concept &amp; diagram
                </span>
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={
                      {
                        background: "hsl(var(--primary))",
                      } as React.CSSProperties
                    }
                  ></span>
                  Query + interview tip
                </span>
              </div>
            </div>

            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>Data &amp; Types of Data</h2>
                <span className="level-badge reference">Foundation</span>
              </div>
              <p className="prompt">
                <b>Data</b> is a collection of raw facts and figures. In modern
                computing, data is categorized based on its structural
                organization.
              </p>
              <InfoCards
                cards={[
                  {
                    title: "Structured Data",
                    desc: "Highly organized into predefined schemas (rows and columns). Easily searchable via SQL.",
                    code: "SQL, Tables, CSV",
                    color: "#3fb950",
                  },
                  {
                    title: "Semi-Structured",
                    desc: "Lacks a rigid tabular structure but uses tags or keys to hierarchy data.",
                    code: "JSON, XML, NoSQL",
                    color: "#f59e0b",
                  },
                  {
                    title: "Unstructured Data",
                    desc: "No predefined format or organization. Hardest to query directly without processing.",
                    code: "Images, Audio, Text",
                    color: "#3b82f6",
                  },
                ]}
              />
              <div className="twist">
                <strong>Interview tip:</strong> if asked about unstructured data
                in SQL, mention that modern RDBMS systems store it using{" "}
                <b>BLOB</b> (Binary Large Object) data types.
              </div>
            </section>

            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>Data Systems &amp; Storage</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Understanding the architectural layer where data is stored is
                crucial before querying it.
              </p>
              <InfoCards
                cards={[
                  {
                    title: "Database & DBMS",
                    desc: "A Database is a structured data collection. A DBMS is the software layer used to create, manage, and retrieve it.",
                    code: "MySQL, PostgreSQL, Oracle, SQL Server",
                    color: "#f59e0b",
                  },
                  {
                    title: "Data Warehouse",
                    desc: "A centralized repository storing historical, structured data optimized for fast querying and BI reporting (strict ETL).",
                    code: "BigQuery, Redshift, Snowflake",
                    color: "#f59e0b",
                  },
                  {
                    title: "Data Lake",
                    desc: "Holds vast amounts of raw, unstructured and semi-structured data in native format (Schema-on-Read).",
                    code: "Amazon S3, Azure Data Lake, Hadoop",
                    color: "#f59e0b",
                  },
                  {
                    title: "Cloud Storage",
                    desc: "Scalable logical pools spread across multiple physical servers, managed by a hosting company.",
                    code: "GCS, Amazon S3, Azure Blob Storage",
                    color: "#f59e0b",
                  },
                ]}
              />
              <div className="twist">
                <strong>Interview tip:</strong> <b>Warehouse</b> = processed,
                highly structured data ready for dashboards. <b>Lake</b> = raw,
                unfiltered data waiting for exploration.
              </div>
            </section>

            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>ACID Properties</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                ACID properties guarantee reliable transaction processing in
                databases.
              </p>
              <InfoCards
                cards={[
                  {
                    title: 'Atomicity — "All or Nothing"',
                    desc: "Transferring $100 from Alice to Bob: deduct (step 1), add (step 2). If step 2 fails, step 1 rolls back.",
                    color: "#f59e0b",
                  },
                  {
                    title: 'Consistency — "Rules Maintained"',
                    desc: "If balances must stay ≥ $0, withdrawing $100 from a $50 balance is blocked.",
                    color: "#3b82f6",
                  },
                  {
                    title: 'Isolation — "Invisible Concurrent Changes"',
                    desc: "While Alice transfers $100, Bob checking his balance won't see it until the transaction fully commits.",
                    color: "#a371f7",
                  },
                  {
                    title: 'Durability — "Permanent Saves"',
                    desc: 'Alice sees "Transfer Successful", power goes out — the committed transaction survives on disk.',
                    color: "#059669",
                  },
                ]}
              />
              <div className="twist">
                <strong>Interview tip:</strong> "Can a transaction be durable
                but not atomic?" No — ACID works together. If it fails mid-way,
                it rolls back; nothing is durably saved.
              </div>
            </section>

            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Normalization</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Normalization organizes data to reduce redundancy and eliminate
                Insertion, Update, and Deletion Anomalies.
              </p>

              <h3 style={{ marginTop: 16 }}>1NF — Atomic Values</h3>
              <p className="prompt">
                Each column contains a single value — no repeating groups.
              </p>
              <CompareTable
                headers={[
                  '✕ Violation (Phones: "555-12, 555-98")',
                  "✓ Compliant (one row per phone)",
                ]}
                rows={[
                  [
                    "ID 1, Name John, Phones 555-12, 555-98",
                    "ID 1 John 555-12 / ID 1 John 555-98",
                  ],
                ]}
              />

              <h3 style={{ marginTop: 16 }}>2NF — No Partial Dependencies</h3>
              <CompareTable
                headers={["Violation", "Solution"]}
                rows={[
                  [
                    "PK (StudentID, CourseID) → CourseFee only depends on CourseID",
                    "Split: Enrollment(StudentID, CourseID) & CourseDetails(CourseID, CourseFee)",
                  ],
                ]}
              />

              <h3 style={{ marginTop: 16 }}>
                3NF — No Transitive Dependencies
              </h3>
              <CompareTable
                headers={["Violation", "Solution"]}
                rows={[
                  [
                    "StudentID → ZipCode → City",
                    "Split: Student(StudentID, ZipCode) & Location(ZipCode, City)",
                  ],
                ]}
              />

              <h3 style={{ marginTop: 16 }}>
                BCNF — Every Determinant Is a Superkey
              </h3>
              <CompareTable
                headers={["Violation", "Solution"]}
                rows={[
                  [
                    "(StudentID, Course) → Teacher, and Teacher → Course (Teacher isn't a superkey)",
                    "Split: Student_Teacher(StudentID, Teacher) & Teacher_Course(Teacher, Course)",
                  ],
                ]}
              />
            </section>

            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>Denormalization</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                <b>Denormalization</b> is the strategic addition of redundancy
                to a normalized database to improve read performance by avoiding
                expensive multi-table JOINs.
              </p>
              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q5-ref">
                  <div
                    className="lang-wrapper code-split"
                    style={{ gridTemplateColumns: "1fr 1fr" }}
                  >
                    <div className="code-col">
                      <div className="code-label java">
                        Normalized (slower reads)
                      </div>
                      <pre className="code-panel">
                        <code>{`-- Expensive aggregate JOIN
SELECT u.name, COUNT(o.id)
FROM Users u JOIN Orders o ON u.id = o.user_id
GROUP BY u.name;`}</code>
                      </pre>
                    </div>
                    <div className="code-col">
                      <div className="code-label py">
                        Denormalized (faster reads)
                      </div>
                      <pre className="code-panel">
                        <code>{`-- total_orders stored directly on Users
-- Instantaneous read, no JOIN
SELECT name, total_orders
FROM Users;`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>Interview tip:</strong> denormalization is a{" "}
                <b>trade-off</b> — it speeds up reads but slows down writes,
                since redundant data must be maintained.
              </div>
            </section>

            <section className="question" id="q6">
              <div className="q-head">
                <span className="q-index">06</span>
                <h2>Distributed Database Systems</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                A <b>Distributed Database System (DDBMS)</b> is spread over
                multiple sites but appears as a single logical database to the
                user.
              </p>
              <InfoCards
                cards={[
                  {
                    title: "Homogeneous DDBMS",
                    desc: "All sites use the exact same DBMS software and OS. Easier to design.",
                    color: "#3b82f6",
                  },
                  {
                    title: "Heterogeneous DDBMS",
                    desc: "Sites run different DBMS software (e.g. Oracle and SQL Server). Requires complex translation.",
                    color: "#f59e0b",
                  },
                  {
                    title: "Client-Server DDBMS",
                    desc: "A central server manages processing and fulfills requests from distributed clients.",
                    color: "#a371f7",
                  },
                  {
                    title: "Peer-to-Peer DDBMS",
                    desc: "No central server. Each node has equal capabilities, sharing data directly with other nodes.",
                    color: "#059669",
                  },
                  {
                    title: "Multi-Database Systems",
                    desc: "Integrates multiple independent, pre-existing databases into one system without modifying them.",
                    color: "#ec4899",
                  },
                ]}
              />
              <p className="prompt" style={{ marginTop: 16 }}>
                <b>Real-world examples:</b>
              </p>
              <InfoCards
                cards={[
                  {
                    title: "Cassandra",
                    desc: "Masterless architecture handling massive data across servers with no single point of failure.",
                    color: "#059669",
                  },
                  {
                    title: "Cloud Spanner",
                    desc: "Google's fully managed relational database offering global distribution and strong consistency.",
                    color: "#3b82f6",
                  },
                  {
                    title: "DynamoDB",
                    desc: "Amazon's fast, flexible NoSQL distributed DB for single-digit millisecond performance.",
                    color: "#f59e0b",
                  },
                ]}
              />
              <MergeChart
                parents={["Site A", "Site B", "Site C"]}
                child="Single Logical Database"
              />
              <div className="twist">
                <strong>Interview tip:</strong> mention the <b>CAP Theorem</b>{" "}
                (Consistency, Availability, Partition Tolerance) — a distributed
                system can only guarantee two of the three at any time.
              </div>
            </section>

            <section className="question" id="q7">
              <div className="q-head">
                <span className="q-index">07</span>
                <h2>SQL Sub-languages</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q7-ddl">
                  <div className="complexity">
                    DDL (Data Definition Language) — defines schemas,
                    auto-committed (cannot be rolled back)
                  </div>
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`-- Creates a brand new table
CREATE TABLE Users (id INT, name VARCHAR(50));

-- Modifies table structure
ALTER TABLE Users ADD email VARCHAR(100);

-- Deletes table structure permanently
DROP TABLE Users;`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="tabs-wrapper" style={{ marginTop: 16 }}>
                <div className="approach-panel active" id="q7-dml">
                  <div className="complexity">
                    DML (Data Manipulation Language) — manipulates data, not
                    auto-committed (can be rolled back)
                  </div>
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`-- Adds a new record
INSERT INTO Users (id, name) VALUES (1, 'Alice');

-- Updates existing record
UPDATE Users SET name = 'Bob' WHERE id = 1;

-- Removes records
DELETE FROM Users WHERE id = 1;`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div
                className="lang-wrapper code-split"
                style={{ gridTemplateColumns: "1fr 1fr 1fr", marginTop: 16 }}
              >
                <div className="code-col">
                  <div className="code-label java">DQL (Query)</div>
                  <pre className="code-panel">
                    <code>{`-- Fetches data
SELECT * FROM Users;`}</code>
                  </pre>
                </div>
                <div className="code-col">
                  <div className="code-label py">DCL (Control)</div>
                  <pre className="code-panel">
                    <code>{`-- Manage permissions
GRANT SELECT ON Users TO read_user;`}</code>
                  </pre>
                </div>
                <div className="code-col">
                  <div className="code-label java">TCL (Transaction)</div>
                  <pre className="code-panel">
                    <code>{`-- Save or undo
COMMIT;
ROLLBACK;`}</code>
                  </pre>
                </div>
              </div>
              <div className="twist">
                <strong>DELETE vs TRUNCATE:</strong> DELETE (DML) logs
                row-by-row and can be rolled back. TRUNCATE (DDL) resets the
                table instantly and cannot be rolled back.
              </div>
            </section>

            <section className="question" id="q8">
              <div className="q-head">
                <span className="q-index">08</span>
                <h2>Query Execution Flow</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <CompareTable
                headers={["Written Order (Syntax)", "Execution Order (Engine)"]}
                rows={[
                  ["1. SELECT", "1. FROM / JOIN — get raw source data"],
                  ["2. FROM / JOIN", "2. WHERE — filter rows"],
                  ["3. WHERE", "3. GROUP BY — aggregate into buckets"],
                  ["4. GROUP BY", "4. HAVING — filter buckets"],
                  ["5. HAVING", "5. SELECT — extract columns"],
                  ["6. ORDER BY", "6. ORDER BY — sort results"],
                  ["7. LIMIT", "7. LIMIT — restrict count"],
                ]}
              />
              <VerticalSteps
                steps={[
                  "FROM / JOIN",
                  "WHERE",
                  "GROUP BY",
                  "HAVING",
                  "SELECT",
                  "ORDER BY",
                  "LIMIT",
                ]}
              />
              <div className="twist">
                <strong>Interview tip:</strong> because <code>SELECT</code> is
                evaluated late (step 5), you <b>cannot</b> use column aliases
                defined in SELECT inside your WHERE or GROUP BY clauses.
              </div>
            </section>

            <section className="question" id="q9">
              <div className="q-head">
                <span className="q-index">09</span>
                <h2>WHERE Clause &amp; Functions</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <div
                className="lang-wrapper code-split"
                style={{ gridTemplateColumns: "1fr 1fr" }}
              >
                <div className="code-col">
                  <div className="code-label java">Filtering Operators</div>
                  <pre className="code-panel">
                    <code>{`-- Filters ranges (inclusive)
WHERE salary BETWEEN 50000 AND 100000

-- Pattern matching
WHERE name LIKE 'A%'`}</code>
                  </pre>
                </div>
                <div className="code-col">
                  <div className="code-label py">Common Functions</div>
                  <pre className="code-panel">
                    <code>{`-- String functions
SELECT UPPER(name), LENGTH(name)

-- Date functions
WHERE YEAR(hire_date) = 2023`}</code>
                  </pre>
                </div>
              </div>
              <div className="twist">
                In <code>LIKE</code>, <code>%</code> matches zero or more
                characters. <code>_</code> matches exactly <b>one</b> character.
              </div>
            </section>

            <section className="question" id="q10">
              <div className="q-head">
                <span className="q-index">10</span>
                <h2>GROUP BY &amp; HAVING</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q10-ref">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`SELECT department, COUNT(*) AS emp_count
FROM Employees
-- 1. WHERE filters individual rows BEFORE aggregation
WHERE status = 'Active'
-- 2. GROUP BY buckets the rows
GROUP BY department
-- 3. HAVING filters the summarized buckets AFTER aggregation
HAVING COUNT(*) > 5;`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <GroupingDiagram
                rows={[
                  { label: "Alice · Sales", key: "Sales" },
                  { label: "Bob · Sales", key: "Sales" },
                  { label: "Carol · IT", key: "IT" },
                  { label: "Dan · IT", key: "IT" },
                  { label: "Eve · IT", key: "IT" },
                ]}
                groups={[
                  { key: "Sales", color: "#3b82f6", agg: "COUNT = 2" },
                  { key: "IT", color: "#059669", agg: "COUNT = 3" },
                ]}
              />
              <div className="twist">
                <strong>WHERE vs HAVING?</strong> WHERE filters raw data. HAVING
                filters aggregated data. You cannot use aggregate functions
                (SUM, COUNT) inside a WHERE clause.
              </div>
            </section>

            <section className="question" id="q11">
              <div className="q-head">
                <span className="q-index">11</span>
                <h2>NULL in SQL</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <div
                className="lang-wrapper code-split"
                style={{ gridTemplateColumns: "1fr 1fr" }}
              >
                <div className="code-col">
                  <div className="code-label java">Checking for NULL</div>
                  <pre className="code-panel">
                    <code>{`-- Check for NULL properly
WHERE col_name IS NULL;
WHERE col_name IS NOT NULL;`}</code>
                  </pre>
                </div>
                <div className="code-col">
                  <div className="code-label py">COALESCE</div>
                  <pre className="code-panel">
                    <code>{`-- Returns first non-null
-- Replaces NULL bonus with 0
SELECT COALESCE(bonus, 0) FROM Emp;`}</code>
                  </pre>
                </div>
              </div>
              <div className="twist">
                Arithmetic on NULL (<code>10 + NULL</code>) equals NULL. Always
                wrap nullable columns in <code>COALESCE()</code> before doing
                math.
              </div>
            </section>

            <section className="question" id="q12">
              <div className="q-head">
                <span className="q-index">12</span>
                <h2>CTEs (Common Table Expressions)</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q12-ref">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`-- 1. Define the CTE (named HighEarners)
WITH HighEarners AS (
    SELECT id, department FROM Employees WHERE salary > 100000
)
-- 2. Query the CTE just like a normal table
SELECT department, COUNT(*) FROM HighEarners GROUP BY department;`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="twist">
                A CTE only exists in memory for the duration of the query
                execution. Once the query finishes, it's gone.
              </div>
            </section>

            <section className="question" id="q13">
              <div className="q-head">
                <span className="q-index">13</span>
                <h2>SQL Keys</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <InfoCards
                cards={[
                  {
                    title: "Primary Key",
                    desc: "Uniquely identifies rows. Cannot be NULL, must be UNIQUE. One per table.",
                    code: "CREATE TABLE Users (UserID INT PRIMARY KEY);",
                    color: "#3b82f6",
                  },
                  {
                    title: "Composite Key",
                    desc: "A Primary Key made up of two or more columns.",
                    code: "CREATE TABLE OrderItems (OrderID INT, ProductID INT, PRIMARY KEY (OrderID, ProductID));",
                    color: "#a371f7",
                  },
                  {
                    title: "Unique Key",
                    desc: "Ensures distinct values. Multiple allowed per table. Can contain ONE NULL.",
                    code: "Email VARCHAR(100) UNIQUE",
                    color: "#059669",
                  },
                  {
                    title: "Foreign Key",
                    desc: "References the PK of another table. Enforces Referential Integrity.",
                    code: "FOREIGN KEY (CustID) REFERENCES Customers(CustID)",
                    color: "#f59e0b",
                  },
                  {
                    title: "Candidate Key",
                    desc: "A minimal set of attributes that uniquely identifies a row. The DBA chooses one to be the PK.",
                    code: "e.g. EmployeeID and SSN are both Candidate Keys",
                    color: "#8b949e",
                  },
                ]}
              />
              <KeyRelationDiagram
                tableA={{
                  name: "Customers",
                  columns: [
                    { name: "CustID", tag: "PK" },
                    { name: "Name" },
                    { name: "Email" },
                  ],
                }}
                tableB={{
                  name: "Orders",
                  columns: [
                    { name: "OrderID", tag: "PK" },
                    { name: "CustID", tag: "FK" },
                    { name: "Total" },
                  ],
                }}
                relation="1 : N"
              />
              <div className="twist">
                A table can have <b>multiple</b> Foreign Keys referencing
                multiple different tables.
              </div>
            </section>

            <section className="question" id="q14">
              <div className="q-head">
                <span className="q-index">14</span>
                <h2>SQL Joins</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 12,
                  marginTop: 12,
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    background: "#161b22",
                    border: "1px solid #21262d",
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#e6edf3",
                      marginBottom: 4,
                    }}
                  >
                    INNER JOIN
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "#8b949e",
                      marginBottom: 6,
                    }}
                  >
                    Records matching in both tables
                  </div>
                  <VennPair
                    leftFilled={false}
                    rightFilled={false}
                    overlapFilled={true}
                    color="#ea580c"
                  />
                  <pre
                    className="code-panel"
                    style={{ textAlign: "left", fontSize: 11 }}
                  >
                    <code>{`SELECT * FROM A INNER JOIN B ON A.id = B.id;`}</code>
                  </pre>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    background: "#161b22",
                    border: "1px solid #21262d",
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#e6edf3",
                      marginBottom: 4,
                    }}
                  >
                    LEFT JOIN
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "#8b949e",
                      marginBottom: 6,
                    }}
                  >
                    All Left records, matched Right
                  </div>
                  <VennPair
                    leftFilled={true}
                    rightFilled={false}
                    overlapFilled={true}
                    color="#facc15"
                  />
                  <pre
                    className="code-panel"
                    style={{ textAlign: "left", fontSize: 11 }}
                  >
                    <code>{`SELECT * FROM A LEFT JOIN B ON A.id = B.id;`}</code>
                  </pre>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    background: "#161b22",
                    border: "1px solid #21262d",
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#e6edf3",
                      marginBottom: 4,
                    }}
                  >
                    RIGHT JOIN
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "#8b949e",
                      marginBottom: 6,
                    }}
                  >
                    All Right records, matched Left
                  </div>
                  <VennPair
                    leftFilled={false}
                    rightFilled={true}
                    overlapFilled={true}
                    color="#facc15"
                  />
                  <pre
                    className="code-panel"
                    style={{ textAlign: "left", fontSize: 11 }}
                  >
                    <code>{`SELECT * FROM A RIGHT JOIN B ON A.id = B.id;`}</code>
                  </pre>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    background: "#161b22",
                    border: "1px solid #21262d",
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#e6edf3",
                      marginBottom: 4,
                    }}
                  >
                    FULL OUTER JOIN
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "#8b949e",
                      marginBottom: 6,
                    }}
                  >
                    All records from either table
                  </div>
                  <VennPair
                    leftFilled={true}
                    rightFilled={true}
                    overlapFilled={false}
                    color="#f59e0b"
                  />
                  <pre
                    className="code-panel"
                    style={{ textAlign: "left", fontSize: 11 }}
                  >
                    <code>{`SELECT * FROM A FULL JOIN B ON A.id = B.id;`}</code>
                  </pre>
                </div>
              </div>

              <div
                className="lang-wrapper code-split"
                style={{ gridTemplateColumns: "1fr 1fr", marginTop: 16 }}
              >
                <div className="code-col">
                  <div className="code-label java">
                    CROSS JOIN — Cartesian product
                  </div>
                  <pre className="code-panel">
                    <code>{`-- 10x5 = 50 rows (pairs every row)
SELECT * FROM A CROSS JOIN B;`}</code>
                  </pre>
                </div>
                <div className="code-col">
                  <div className="code-label py">
                    SELF JOIN — table joined with itself
                  </div>
                  <pre className="code-panel">
                    <code>{`-- Find managers for employees
SELECT E1.name, E2.name
FROM Emp E1 JOIN Emp E2 ON E1.mgr = E2.id;`}</code>
                  </pre>
                </div>
              </div>

              <div className="twist">
                Find records in Table A but NOT in B? Use a <b>LEFT JOIN</b> and
                add <code>WHERE B.id IS NULL</code>.
              </div>
            </section>

            <section className="question" id="q15">
              <div className="q-head">
                <span className="q-index">15</span>
                <h2>Views</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                A <b>View</b> is a virtual table based on an SQL statement. It
                doesn't store data physically (unless materialized), but
                simplifies complex joins and enhances security by hiding
                sensitive columns.
              </p>
              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q15-ref">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`-- 1. Create a view to hide salaries and complex joins
CREATE VIEW PublicEmployeeList AS
SELECT e.emp_id, e.name, d.department_name
FROM Employees e
JOIN Departments d ON e.dept_id = d.id;

-- 2. Query it simply
SELECT * FROM PublicEmployeeList;`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>"Can you INSERT through a View?"</strong> Yes, but only
                if it's an "Updatable View" (usually meaning it doesn't contain
                GROUP BY, aggregates, or multiple joined tables).
              </div>
            </section>

            <section className="question" id="q16">
              <div className="q-head">
                <span className="q-index">16</span>
                <h2>Anatomy of a SELECT</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Everything below this point runs on a <b>live SQL engine</b> in
                your browser against a small company database. Edit any query,
                press <b>Run</b>, and step through the clauses one at a time to
                watch rows being kept, dropped or padded.
                <br />
                <br />
                The single most important idea in SQL is that{" "}
                <b>you do not write a query in the order it executes</b>. You
                write <code>SELECT</code> first, but the database runs it almost
                last — which explains nearly every beginner error message.
              </p>
              <div className="example">
                Written order: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER
                BY → LIMIT · Execution order: FROM → JOIN → WHERE → GROUP BY →
                HAVING → WINDOW → SELECT → DISTINCT → ORDER BY → LIMIT
              </div>
              <SqlVisualizer
                title="SELECT · WHERE · ORDER BY · LIMIT"
                examples={basicQueryExamples}
              />
              <div className="twist">
                <strong>
                  "Why can't I use a column alias in my WHERE clause?"
                </strong>{" "}
                Because <code>SELECT</code> — where the alias is created — runs{" "}
                <em>after</em> <code>WHERE</code>. Try the last example above:
                the engine rejects it with the same error a real database gives.{" "}
                <code>ORDER BY</code> runs after <code>SELECT</code>, which is
                why the alias works there.
              </div>
            </section>

            <section className="question" id="q17">
              <div className="q-head">
                <span className="q-index">17</span>
                <h2>Aggregation Visualised</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                An aggregate turns <b>many rows into one</b>.{" "}
                <code>GROUP BY</code> decides how many "ones" you get: without
                it the whole table is a single group, with it you get one output
                row per distinct key. Step to the <b>GROUP BY</b> stage in the
                player to see eight rows physically fold into four buckets.
              </p>
              <div className="example">
                WHERE filters <b>rows</b> before grouping · HAVING filters{" "}
                <b>groups</b> after grouping · an aggregate can never appear in
                WHERE
              </div>
              <SqlVisualizer
                title="GROUP BY · HAVING · COUNT · AVG"
                examples={aggregateExamples}
              />
              <div className="tabs-wrapper">
                <div className="approach-tabs">
                  <button
                    type="button"
                    className="tab-btn active"
                    data-target="q17-count"
                  >
                    COUNT(*) vs COUNT(col)
                  </button>
                  <button
                    type="button"
                    className="tab-btn"
                    data-target="q17-null"
                  >
                    Aggregates &amp; NULL
                  </button>
                </div>
                <div className="approach-panel active" id="q17-count">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`-- employees has 8 rows; Priya's dept_id is NULL

SELECT COUNT(*)                 FROM employees;  -- 8  (counts rows)
SELECT COUNT(dept_id)           FROM employees;  -- 7  (skips NULLs)
SELECT COUNT(DISTINCT dept_id)  FROM employees;  -- 3  (10, 20, 30)

-- The classic reporting bug:
SELECT d.dept_name, COUNT(*) AS staff
FROM departments d
LEFT JOIN employees e ON d.dept_id = e.dept_id
GROUP BY d.dept_name;
-- Legal returns 1, not 0 — COUNT(*) counted the NULL-padded row.
-- Fix: COUNT(e.emp_id), which ignores the NULL.`}</code>
                    </pre>
                  </div>
                </div>
                <div className="approach-panel" id="q17-null">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`-- Every aggregate except COUNT(*) ignores NULL inputs.

SELECT AVG(salary) FROM employees;
-- Sums the 8 non-null salaries and divides by 8.

-- But if 2 of 8 salaries were NULL, AVG divides by 6, not 8.
-- "Average of the known values" is rarely what the business meant.
SELECT AVG(COALESCE(salary, 0)) FROM employees;  -- treat unknown as 0

-- SUM over zero rows is NULL, not 0 — this breaks dashboards:
SELECT COALESCE(SUM(amount), 0) AS revenue
FROM sales WHERE region = 'East';   -- no East rows -> 0, not NULL`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>"Why does my NULL group still appear?"</strong>{" "}
                <code>GROUP BY</code> treats all NULLs as <em>equal</em> and
                puts them in one bucket, even though <code>NULL = NULL</code>{" "}
                evaluates to UNKNOWN. Grouping uses "is not distinct from"
                semantics, not <code>=</code>.
              </div>
            </section>

            <section className="question" id="q18">
              <div className="q-head">
                <span className="q-index">18</span>
                <h2>Types of Join</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                A join answers one question:{" "}
                <b>
                  when a row on the left has no partner on the right, what
                  happens to it?
                </b>{" "}
                Every join type is just a different answer. The row counts on
                each card are computed live by running that join against the
                sample database.
              </p>
              <div className="example">
                employees has 8 rows (Priya has no department) · departments has
                4 rows (Legal has no employees) · the counts below are the
                actual results
              </div>
              <JoinTypesGallery />
              <div className="twist">
                <strong>"Which join should I reach for by default?"</strong>{" "}
                <code>LEFT JOIN</code> when the left table is the thing you are
                reporting on and you must not lose rows; <code>INNER JOIN</code>{" "}
                only when a missing match genuinely means the row is irrelevant.
                If a report's row count mysteriously drops, an INNER JOIN is
                almost always the culprit.
              </div>
            </section>

            <section className="question" id="q19">
              <div className="q-head">
                <span className="q-index">19</span>
                <h2>Joins Step by Step</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Now watch a join actually happen. Step to the <b>JOIN</b> stage
                and the trace labels every row: blue rows matched the{" "}
                <code>ON</code> condition, amber rows found no partner and were{" "}
                <b>NULL-padded</b> to survive. Compare <code>INNER</code> (7
                rows), <code>LEFT</code> (8), <code>RIGHT</code> (8),{" "}
                <code>FULL</code> (9) and <code>CROSS</code> (32) on the exact
                same data.
              </p>
              <div className="example">
                Also covers the two patterns interviewers actually ask for: the{" "}
                <b>self join</b> org chart, the <b>anti-join</b> that finds rows
                with no match, and the <b>ON vs WHERE</b> trap that silently
                downgrades a LEFT JOIN
              </div>
              <SqlVisualizer
                title="Every join type on the same two tables"
                examples={joinExamples}
                badge="Join Walkthrough"
              />
              <div className="tabs-wrapper">
                <div className="approach-tabs">
                  <button
                    type="button"
                    className="tab-btn active"
                    data-target="q19-onwhere"
                  >
                    ON vs WHERE
                  </button>
                  <button
                    type="button"
                    className="tab-btn"
                    data-target="q19-fanout"
                  >
                    Join fan-out
                  </button>
                </div>
                <div className="approach-panel active" id="q19-onwhere">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`-- Filter in ON: applied BEFORE padding -> 8 rows, LEFT JOIN intact
SELECT e.name, d.dept_name
FROM employees e
LEFT JOIN departments d
  ON e.dept_id = d.dept_id AND d.city = 'Mumbai';

-- Filter in WHERE: applied AFTER padding -> 3 rows
-- The padded rows have d.city = NULL, NULL = 'Mumbai' is UNKNOWN,
-- so WHERE drops them and the LEFT JOIN silently became an INNER JOIN.
SELECT e.name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id
WHERE d.city = 'Mumbai';

-- Rule of thumb:
--   ON    = how the tables relate
--   WHERE = which final rows you want
-- On an INNER JOIN the two are interchangeable. On an OUTER join
-- they are completely different queries.`}</code>
                    </pre>
                  </div>
                </div>
                <div className="approach-panel" id="q19-fanout">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`-- A join is not "lookup", it is a filtered cartesian product.
-- If the right side matches N times, the left row is DUPLICATED N times.

SELECT e.name, SUM(e.salary)   -- WRONG
FROM employees e
JOIN sales s ON e.emp_id = s.emp_id
GROUP BY e.name;
-- Meera has 2 sales, so her salary is counted TWICE.

-- Fix 1: aggregate before joining (derived table)
SELECT e.name, e.salary, t.deals
FROM employees e
JOIN (SELECT emp_id, COUNT(*) AS deals
      FROM sales GROUP BY emp_id) t
  ON t.emp_id = e.emp_id;

-- Fix 2: don't join at all, use a scalar subquery
SELECT e.name, e.salary,
       (SELECT COUNT(*) FROM sales s WHERE s.emp_id = e.emp_id) AS deals
FROM employees e;`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>
                  "My SUM is suddenly too big after adding a join."
                </strong>{" "}
                That is <b>fan-out</b>. The join duplicated your left rows
                before the aggregate ran. Aggregate first in a derived table,
                then join the small result — see the second tab.
              </div>
            </section>

            <section className="question" id="q20">
              <div className="q-head">
                <span className="q-index">20</span>
                <h2>Window Functions</h2>
                <span className="level-badge hard">Hard</span>
              </div>
              <p className="prompt">
                <code>GROUP BY</code> collapses rows. A <b>window function</b>{" "}
                does the same arithmetic but <b>keeps every row</b>, attaching
                the computed value as an extra column. That single difference is
                what lets you show a salary and its department total side by
                side without a self join.
              </p>
              <div className="example">
                <code>FUNC(...) OVER (PARTITION BY ... ORDER BY ...)</code> ·
                PARTITION BY = "restart per group" · ORDER BY inside OVER =
                "running / positional"
              </div>
              <SqlVisualizer
                title="ROW_NUMBER · RANK · PARTITION BY · LAG · running totals"
                examples={windowExamples}
                badge="Window Walkthrough"
              />
              <div className="tabs-wrapper">
                <div className="approach-tabs">
                  <button
                    type="button"
                    className="tab-btn active"
                    data-target="q20-ranks"
                  >
                    The three ranking functions
                  </button>
                  <button
                    type="button"
                    className="tab-btn"
                    data-target="q20-frame"
                  >
                    Frames: the ORDER BY trap
                  </button>
                  <button
                    type="button"
                    className="tab-btn"
                    data-target="q20-vs"
                  >
                    Window vs GROUP BY
                  </button>
                </div>
                <div className="approach-panel active" id="q20-ranks">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`-- Salaries: 95000, 81000, 72000, 72000, 69000, 64000, 58000, 58000
--                                 ^^^^^ tie          ^^^^^ tie

SELECT name, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
       RANK()       OVER (ORDER BY salary DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk
FROM employees;

--  salary | row_num | rnk | dense_rnk
--  95000  |    1    |  1  |     1
--  81000  |    2    |  2  |     2
--  72000  |    3    |  3  |     3     <- tie
--  72000  |    4    |  3  |     3     <- tie
--  69000  |    5    |  5  |     4     <- RANK skipped 4
--  64000  |    6    |  6  |     5
--  58000  |    7    |  7  |     6     <- tie
--  58000  |    8    |  7  |     6     <- tie

-- ROW_NUMBER : always 1..N, ties broken arbitrarily. Use for pagination
--              and de-duplication.
-- RANK       : ties share a rank, then the next rank JUMPS. Use for
--              leaderboards ("joint 3rd, nobody is 4th").
-- DENSE_RANK : ties share a rank, next rank CONTINUES. Use for
--              "top 3 distinct salaries".`}</code>
                    </pre>
                  </div>
                </div>
                <div className="approach-panel" id="q20-frame">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`-- Same function. Same partition. Completely different answers.

SELECT region, quarter, amount,
       SUM(amount) OVER (PARTITION BY region)                  AS region_total,
       SUM(amount) OVER (PARTITION BY region ORDER BY quarter) AS running_total
FROM sales;

-- No ORDER BY inside OVER:
--   frame defaults to the WHOLE partition -> a constant group total.
-- With ORDER BY inside OVER:
--   frame defaults to RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
--   -> a running total.

-- Adding ORDER BY to get "sorted output" silently turns your group
-- total into a running total. This is the #1 window-function bug.

-- Be explicit when it matters:
SUM(amount) OVER (PARTITION BY region ORDER BY quarter
                  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)

-- RANGE vs ROWS also differs on ties: RANGE includes all peer rows
-- with the same ORDER BY value, ROWS counts physical rows.`}</code>
                    </pre>
                  </div>
                </div>
                <div className="approach-panel" id="q20-vs">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`-- Goal: show each employee next to their department average.

-- With GROUP BY you must aggregate, then join back:
SELECT e.name, e.salary, a.avg_salary
FROM employees e
JOIN (SELECT dept_id, AVG(salary) AS avg_salary
      FROM employees GROUP BY dept_id) a
  ON a.dept_id = e.dept_id;

-- With a window function it is one pass and no join:
SELECT name, salary,
       AVG(salary) OVER (PARTITION BY dept_id) AS avg_salary
FROM employees;

--   GROUP BY  : N rows -> 1 row per group   (detail is LOST)
--   OVER (..) : N rows -> N rows            (detail is KEPT)

-- You cannot filter on a window function in WHERE or HAVING,
-- because windows are computed AFTER both. Wrap it instead:
SELECT * FROM (
  SELECT name, dept_id,
         ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) rn
  FROM employees
) t WHERE rn = 1;`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>
                  "Give me the highest-paid person in each department."
                </strong>{" "}
                This is the most-asked SQL interview question on earth. The
                answer is{" "}
                <code>
                  ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC)
                </code>{" "}
                in a subquery, filtered to <code>rn = 1</code>. Use{" "}
                <code>RANK()</code> instead if ties should all be returned.
              </div>
            </section>

            <section className="question" id="q21">
              <div className="q-head">
                <span className="q-index">21</span>
                <h2>Subqueries</h2>
                <span className="level-badge hard">Hard</span>
              </div>
              <p className="prompt">
                A subquery is a <code>SELECT</code> nested inside another
                statement. Where you put it decides what it must return: a
                single value in <code>WHERE x &gt; (...)</code>, a set in{" "}
                <code>IN (...)</code>, a boolean in <code>EXISTS (...)</code>,
                or a whole table in <code>FROM (...)</code>.
              </p>
              <div className="example">
                <b>Uncorrelated</b> = runs once, independent of the outer query
                · <b>Correlated</b> = references an outer column, so it re-runs
                for every outer row
              </div>
              <SqlVisualizer
                title="Scalar · IN · EXISTS · correlated · derived tables"
                examples={subqueryExamples}
                badge="Subquery Walkthrough"
              />
              <div className="tabs-wrapper">
                <div className="approach-tabs">
                  <button
                    type="button"
                    className="tab-btn active"
                    data-target="q21-where"
                  >
                    Where a subquery can go
                  </button>
                  <button
                    type="button"
                    className="tab-btn"
                    data-target="q21-notin"
                  >
                    NOT IN vs NOT EXISTS
                  </button>
                  <button
                    type="button"
                    className="tab-btn"
                    data-target="q21-cte"
                  >
                    Subquery vs CTE
                  </button>
                </div>
                <div className="approach-panel active" id="q21-where">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`-- 1. SELECT list -> must return exactly ONE row and ONE column
SELECT name,
       (SELECT dept_name FROM departments d
        WHERE d.dept_id = e.dept_id) AS dept
FROM employees e;

-- 2. WHERE with a comparison -> scalar
SELECT name FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- 3. WHERE with IN / ANY / ALL -> one column, many rows
SELECT name FROM employees
WHERE dept_id IN (SELECT dept_id FROM departments WHERE city = 'Pune');

-- 4. WHERE with EXISTS -> any shape, only existence matters
SELECT name FROM employees e
WHERE EXISTS (SELECT 1 FROM sales s WHERE s.emp_id = e.emp_id);

-- 5. FROM -> a full table, and it MUST be aliased
SELECT t.dept_id, t.headcount
FROM (SELECT dept_id, COUNT(*) AS headcount
      FROM employees GROUP BY dept_id) t
WHERE t.headcount > 1;`}</code>
                    </pre>
                  </div>
                </div>
                <div className="approach-panel" id="q21-notin">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`-- Find employees who have never made a sale.

-- NOT EXISTS: correct, and the one to default to.
SELECT name FROM employees e
WHERE NOT EXISTS (SELECT 1 FROM sales s WHERE s.emp_id = e.emp_id);
-- -> Asha, Arjun, Divya, Priya

-- NOT IN: correct ONLY while the subquery never returns NULL.
SELECT name FROM employees e
WHERE e.emp_id NOT IN (SELECT emp_id FROM sales);
-- -> same answer here, because sales.emp_id has no NULLs.

-- Now imagine ONE row in sales had emp_id = NULL:
--   emp_id NOT IN (2, 3, NULL)
--   => emp_id <> 2 AND emp_id <> 3 AND emp_id <> NULL
--   => TRUE AND TRUE AND UNKNOWN
--   => UNKNOWN  -> the row is dropped
-- Every row is dropped. The query returns ZERO rows, silently.

-- NOT EXISTS uses row-existence, not value comparison,
-- so NULLs cannot poison it. Prefer it unconditionally.`}</code>
                    </pre>
                  </div>
                </div>
                <div className="approach-panel" id="q21-cte">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`-- A CTE is a named subquery written before the query that uses it.
-- Same execution, far better readability — and it can be reused.

-- Nested subqueries: read inside-out, each level re-stated
SELECT d.dept_name, t.avg_salary
FROM (SELECT dept_id, AVG(salary) AS avg_salary
      FROM employees GROUP BY dept_id) t
JOIN departments d ON d.dept_id = t.dept_id
WHERE t.avg_salary > 60000;

-- Same thing as a CTE: read top-down
WITH dept_avg AS (
    SELECT dept_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY dept_id
)
SELECT d.dept_name, a.avg_salary
FROM dept_avg a
JOIN departments d ON d.dept_id = a.dept_id
WHERE a.avg_salary > 60000;

-- A derived table can only be used once. A CTE can be referenced
-- many times in the same statement, and can be RECURSIVE.`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>"Correlated subquery or window function?"</strong> A
                correlated subquery re-executes per outer row — O(N×M). The
                window-function rewrite does one pass. Run example 3 above, then
                compare it to{" "}
                <code>AVG(salary) OVER (PARTITION BY dept_id)</code> in topic
                20: same answer, one scan.
              </div>
            </section>

            <section className="question" id="q22">
              <div className="q-head">
                <span className="q-index">22</span>
                <h2>Query Lab</h2>
                <span className="level-badge hard">Hard</span>
              </div>
              <p className="prompt">
                A free-form playground on the same database. Everything you have
                learned is available: joins, grouping, window functions and
                subqueries can all be combined in one statement. Start from a
                preset, then change it and press <b>Run</b>.
              </p>
              <div className="example">
                Supported: SELECT · DISTINCT · aliases · all JOIN types · WHERE
                · GROUP BY · HAVING · ORDER BY · LIMIT/OFFSET · CASE · IN /
                BETWEEN / LIKE / IS NULL · COUNT, SUM, AVG, MIN, MAX ·
                ROW_NUMBER, RANK, DENSE_RANK, NTILE, LAG, LEAD, FIRST_VALUE,
                LAST_VALUE · scalar, IN, EXISTS and derived-table subqueries
              </div>
              <SqlVisualizer
                title="Open playground — combine everything"
                examples={labExamples}
                badge="Sandbox"
              />
              <div className="twist">
                <strong>The interview answer in one sentence:</strong> SQL is
                declarative, so the only thing you ever really control is{" "}
                <em>which rows survive which stage</em> — <code>ON</code>{" "}
                decides how tables relate, <code>WHERE</code> filters rows,{" "}
                <code>HAVING</code> filters groups, and window functions attach
                values without removing anything at all.
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
