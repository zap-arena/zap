export interface SqlWorkflow {
  id: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  title: string;
  category: string;
  description: string;
  steps: string[];
  icons: string[];
  queryPreview?: string;
  highLevel: string[];
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
  leftSub?: string;
  rightSub?: string;
  icon?: string;
}

export interface SqlMatchingGame {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  instruction: string;
  pairs: MatchingPair[];
}

export const sqlWorkflows: SqlWorkflow[] = [
  {
    id: "sql-wf-select-order",
    level: "Beginner",
    category: "Execution Order",
    title: "SQL SELECT Query Logical Execution Order",
    description: "In SQL, queries are NOT executed in the order they are written (SELECT doesn't run first!). Place the execution phases in the exact order the database engine processes them.",
    queryPreview: "SELECT dept, AVG(salary) FROM employees WHERE status = 'active' GROUP BY dept HAVING AVG(salary) > 60000 ORDER BY AVG(salary) DESC LIMIT 5;",
    steps: [
      "FROM & JOIN: Locate source tables and compute cartesian product/joins",
      "WHERE: Filter raw rows based on row-level boolean predicates",
      "GROUP BY: Aggregate remaining rows into groups by key columns",
      "HAVING: Filter aggregated groups using group-level conditions",
      "SELECT: Evaluate expressions and project required output columns",
      "DISTINCT: Eliminate duplicate projected rows (if specified)",
      "ORDER BY: Sort resulting rows according to specified columns/expressions",
      "LIMIT / OFFSET: Restrict final row count and apply pagination offset"
    ],
    icons: ["🗄️", "🔍", "📊", "🎯", "✨", "🧹", "📶", "✂️"],
    highLevel: [
      "1. Table Ingestion (FROM/JOIN)",
      "2. Row Filtering (WHERE)",
      "3. Grouping & Aggregation (GROUP BY/HAVING)",
      "4. Projection & Sorting (SELECT/ORDER BY/LIMIT)"
    ]
  },
  {
    id: "sql-wf-ddl-create",
    level: "Beginner",
    category: "Data Definition",
    title: "Table Creation & Primary Key Storage Workflow",
    description: "Sequence the steps taken by a relational database engine when creating a new schema table with a primary key constraint.",
    queryPreview: "CREATE TABLE users (id INT PRIMARY KEY, email VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);",
    steps: [
      "Validate table name syntax and permissions in active database",
      "Check catalog dictionary to verify table name does not already exist",
      "Allocate schema metadata and register column data types",
      "Enforce NOT NULL and DEFAULT constraint metadata for columns",
      "Generate clustered B-Tree primary key index structure on disk",
      "Write new relation descriptor into system catalog dictionary",
      "Emit DDL transaction commit log and confirm schema availability"
    ],
    icons: ["📝", "🔍", "📐", "🔒", "🌳", "💾", "✅"],
    highLevel: [
      "1. Syntax & Catalog Verification",
      "2. Column Type & Constraint Registration",
      "3. Index Storage Allocation",
      "4. Catalog Commit"
    ]
  },
  {
    id: "sql-wf-inner-join",
    level: "Intermediate",
    category: "Join Processing",
    title: "Multi-Table Hash INNER JOIN Pipeline",
    description: "Follow the execution pipeline of an optimized Hash Join between an Orders table and a Customers table.",
    queryPreview: "SELECT o.id, c.name FROM orders o INNER JOIN customers c ON o.customer_id = c.id WHERE o.total > 100;",
    steps: [
      "Parse query and verify foreign key relationship schemas",
      "Apply WHERE filter on Orders table to reduce driving record set",
      "Scan smaller Customers table (Build Phase)",
      "Construct in-memory Hash Table keyed by customer_id",
      "Stream Orders records and probe Hash Table for matching customer_id",
      "Emit combined tuple (order_id, customer_name) for matching hash keys",
      "Stream final joined records to output buffer"
    ],
    icons: ["⚙️", "🔍", "📥", "🗂️", "🔎", "🔗", "📤"],
    highLevel: [
      "1. Plan Optimization & Pre-filtering",
      "2. Build Hash Table from Dimension Table",
      "3. Probe Streamed Fact Records",
      "4. Emit Matched Tuples"
    ]
  },
  {
    id: "sql-wf-subquery",
    level: "Intermediate",
    category: "Subqueries",
    title: "Correlated Subquery Resolution Workflow",
    description: "Rebuild the evaluation cycle when a database resolves a correlated subquery that references attributes from an outer query loop.",
    queryPreview: "SELECT e.name, e.salary FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE dept_id = e.dept_id);",
    steps: [
      "Fetch candidate row from outer query (Employees table)",
      "Extract current row's dept_id to bind correlation variable",
      "Execute inner subquery calculating AVG(salary) for that specific dept_id",
      "Receive scalar average result from inner subquery",
      "Evaluate outer WHERE condition: e.salary > calculated average",
      "If condition is TRUE, include employee record in result buffer",
      "Advance outer cursor to next employee row and repeat"
    ],
    icons: ["➡️", "📌", "🧮", "📥", "⚖️", "✅", "🔁"],
    highLevel: [
      "1. Outer Cursor Binding",
      "2. Parameterized Inner Aggregation",
      "3. Scalar Comparison",
      "4. Row Emission & Cursor Advance"
    ]
  },
  {
    id: "sql-wf-transaction-acid",
    level: "Advanced",
    category: "Transactions",
    title: "ACID Transaction & Write-Ahead Log (WAL) Lifecycle",
    description: "Sequence the mission-critical lifecycle of a bank fund transfer transaction ensuring durability and isolation.",
    queryPreview: "BEGIN TRANSACTION;\nUPDATE accounts SET bal = bal - 500 WHERE id = 1;\nUPDATE accounts SET bal = bal + 500 WHERE id = 2;\nCOMMIT;",
    steps: [
      "Issue BEGIN TRANSACTION and assign unique Transaction ID (XID)",
      "Acquire row-level exclusive write locks on affected account rows",
      "Read current account balances into database buffer pool",
      "Generate Write-Ahead Log (WAL) undo/redo records for both account debits/credits",
      "Modify dirty in-memory data pages in buffer cache",
      "Flush WAL log buffer to persistent non-volatile disk storage (fsync)",
      "Issue COMMIT, mark transaction committed in WAL, and release all row locks"
    ],
    icons: ["🚀", "🔒", "📖", "📝", "⚡", "💾", "🏁"],
    highLevel: [
      "1. Lock Acquisition & Isolation",
      "2. In-Memory Buffer Modification",
      "3. Write-Ahead Logging (WAL) Flush",
      "4. Commit & Lock Release"
    ]
  },
  {
    id: "sql-wf-window-func",
    level: "Advanced",
    category: "Analytical Functions",
    title: "Window Function & Over Partition Processing",
    description: "Track how SQL engines evaluate analytical window functions without collapsing rows.",
    queryPreview: "SELECT dept, name, salary, DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as rank FROM employees;",
    steps: [
      "Execute base table FROM, WHERE, and GROUP BY clauses",
      "Segment resulting dataset into distinct PARTITION BY windows (dept)",
      "Sort rows within each partition bucket according to ORDER BY (salary DESC)",
      "Establish window frame boundaries (ROWS/RANGE BETWEEN)",
      "Calculate analytical function (DENSE_RANK) across current frame cursor",
      "Attach computed rank column alongside original row attributes",
      "Project final result set preserving all individual row identities"
    ],
    icons: ["📊", "🗂️", "📶", "🪟", "🧮", "📎", "✨"],
    highLevel: [
      "1. Base Data Gathering",
      "2. Partition Bucketing & Internal Sorting",
      "3. Frame Cursor Computation",
      "4. Non-Collapsing Projection"
    ]
  },
  {
    id: "sql-wf-index-scan",
    level: "Advanced",
    category: "Query Optimization",
    title: "B-Tree Index Seek vs Table Heap Scan",
    description: "Trace how the Cost-Based Optimizer determines whether to use an Index Seek or a Full Table Scan.",
    queryPreview: "EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 4289 AND status = 'shipped';",
    steps: [
      "Query Optimizer reads distribution statistics and histogram on customer_id",
      "Estimate cardinality: predicted matching rows is low (< 1% of table)",
      "Optimizer selects B-Tree Index Seek plan over sequential Heap Scan",
      "Traverse B-Tree root node down to appropriate leaf node using binary search",
      "Scan index leaf node pointers matching customer_id = 4289",
      "Perform table heap lookups (Row IDs) to retrieve remaining column attributes",
      "Apply secondary filter (status = 'shipped') and return qualifying rows"
    ],
    icons: ["📊", "📈", "🎯", "🌳", "📑", "🔎", "📦"],
    highLevel: [
      "1. Cost & Cardinality Estimation",
      "2. B-Tree Root to Leaf Traversal",
      "3. Leaf Pointer Extraction",
      "4. Heap Fetch & Filter"
    ]
  }
];

export const sqlMatchingGames: SqlMatchingGame[] = [
  {
    id: "game-execution-order",
    title: "SQL Clause Execution Phase",
    subtitle: "Match each SQL keyword to what the database engine actually does during that phase.",
    category: "Query Lifecycle",
    difficulty: "Easy",
    instruction: "Click a SQL Clause on the left, then click its corresponding execution responsibility on the right.",
    pairs: [
      {
        id: "p1",
        left: "FROM & JOIN",
        right: "Loads source tables & forms Cartesian/joined relation",
        leftSub: "Phase 1",
        rightSub: "Identifies data sources",
        icon: "🗄️"
      },
      {
        id: "p2",
        left: "WHERE",
        right: "Filters raw rows before any grouping occurs",
        leftSub: "Phase 2",
        rightSub: "Row-level boolean check",
        icon: "🔍"
      },
      {
        id: "p3",
        left: "GROUP BY",
        right: "Collapses rows into distinct groups sharing keys",
        leftSub: "Phase 3",
        rightSub: "Aggregation preparation",
        icon: "📊"
      },
      {
        id: "p4",
        left: "HAVING",
        right: "Filters aggregated groups after calculation",
        leftSub: "Phase 4",
        rightSub: "Post-aggregation filter",
        icon: "🎯"
      },
      {
        id: "p5",
        left: "SELECT",
        right: "Evaluates expressions & projects column list",
        leftSub: "Phase 5",
        rightSub: "Creates output columns",
        icon: "✨"
      },
      {
        id: "p6",
        left: "ORDER BY",
        right: "Sorts final row output in memory or temporary disk",
        leftSub: "Phase 6",
        rightSub: "Sort buffer operation",
        icon: "📶"
      }
    ]
  },
  {
    id: "game-joins",
    title: "SQL JOIN Types & Relational Logic",
    subtitle: "Map each JOIN clause to its exact relational behavior.",
    category: "Relational Joins",
    difficulty: "Medium",
    instruction: "Connect the JOIN type on the left with its accurate set-theory definition on the right.",
    pairs: [
      {
        id: "j1",
        left: "INNER JOIN",
        right: "Returns only rows where the join predicate matches in BOTH tables",
        leftSub: "Intersection (A ∩ B)",
        rightSub: "Strict matching only",
        icon: "🔗"
      },
      {
        id: "j2",
        left: "LEFT OUTER JOIN",
        right: "Returns all rows from left table, padding right columns with NULL when unmatched",
        leftSub: "All A + matched B",
        rightSub: "Preserves driving table",
        icon: "👈"
      },
      {
        id: "j3",
        left: "FULL OUTER JOIN",
        right: "Returns all rows from both tables, filling NULLs wherever a counterpart is absent",
        leftSub: "Union (A ∪ B)",
        rightSub: "Complete non-loss join",
        icon: "🌐"
      },
      {
        id: "j4",
        left: "CROSS JOIN",
        right: "Computes Cartesian product: multiplies every row of Table A with every row of Table B",
        leftSub: "A × B",
        rightSub: "N × M total rows",
        icon: "✖️"
      },
      {
        id: "j5",
        left: "SELF JOIN",
        right: "Joins a table to itself using aliases to resolve hierarchical/parent-child trees",
        leftSub: "e.g. Employee & Manager",
        rightSub: "Unary recursive relation",
        icon: "🪞"
      },
      {
        id: "j6",
        left: "ANTI JOIN (NOT EXISTS)",
        right: "Returns rows from left table that have ZERO matches in the right table",
        leftSub: "A - B difference",
        rightSub: "Finds orphan records",
        icon: "🚫"
      }
    ]
  },
  {
    id: "game-window-functions",
    title: "SQL Window & Analytical Functions",
    subtitle: "Match the analytical function to its calculation behavior.",
    category: "Analytical SQL",
    difficulty: "Hard",
    instruction: "Map each window or aggregate function to its exact mathematical behavior across partition frames.",
    pairs: [
      {
        id: "w1",
        left: "ROW_NUMBER()",
        right: "Assigns a strictly sequential unique integer (1, 2, 3...) with no ties",
        leftSub: "Sequential counter",
        rightSub: "Always increments by 1",
        icon: "🔢"
      },
      {
        id: "w2",
        left: "RANK()",
        right: "Assigns identical ranks to ties, leaving gaps in subsequent rank numbers (1, 2, 2, 4)",
        leftSub: "Olympic style ranking",
        rightSub: "Skips after duplicates",
        icon: "🏅"
      },
      {
        id: "w3",
        left: "DENSE_RANK()",
        right: "Assigns identical ranks to ties WITHOUT gaps in subsequent rank numbers (1, 2, 2, 3)",
        leftSub: "Contiguous ranking",
        rightSub: "Never leaves gaps",
        icon: "🏆"
      },
      {
        id: "w4",
        left: "LEAD(col, 1)",
        right: "Accesses value from next row in current window partition without self-joining",
        leftSub: "Lookahead peek",
        rightSub: "Next row value",
        icon: "⏩"
      },
      {
        id: "w5",
        left: "LAG(col, 1)",
        right: "Accesses value from previous row in current window partition for time-delta diffs",
        leftSub: "Lookbehind peek",
        rightSub: "Previous row value",
        icon: "⏪"
      },
      {
        id: "w6",
        left: "COALESCE(a, b, c)",
        right: "Evaluates arguments in order and returns first non-NULL expression encountered",
        leftSub: "NULL fallback",
        rightSub: "Safe null replacement",
        icon: "🛡️"
      }
    ]
  },
  {
    id: "game-acid",
    title: "ACID Guarantees & Transaction Principles",
    subtitle: "Match each ACID property to its database engineering guarantee.",
    category: "Database Internals",
    difficulty: "Hard",
    instruction: "Connect each ACID pillar with its corresponding mechanism and system guarantee.",
    pairs: [
      {
        id: "a1",
        left: "Atomicity",
        right: "All statements succeed completely or transaction entirely rolls back (All-or-Nothing)",
        leftSub: "The 'A' in ACID",
        rightSub: "Handled via Undo Logs",
        icon: "⚛️"
      },
      {
        id: "a2",
        left: "Consistency",
        right: "Guarantees database transitions only between valid states enforcing all schema constraints",
        leftSub: "The 'C' in ACID",
        rightSub: "Maintains invariants",
        icon: "⚖️"
      },
      {
        id: "a3",
        left: "Isolation",
        right: "Concurrent transactions cannot observe uncommitted intermediate modifications",
        leftSub: "The 'I' in ACID",
        rightSub: "Handled via MVCC & Locks",
        icon: "🧱"
      },
      {
        id: "a4",
        left: "Durability",
        right: "Once committed, changes survive power outages and crashes via Write-Ahead Log (WAL)",
        leftSub: "The 'D' in ACID",
        rightSub: "Persistent disk flush",
        icon: "💾"
      }
    ]
  }
];
