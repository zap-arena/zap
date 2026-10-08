import type { SqlDatabase, SqlTable } from "./sqlEngine";

/* ------------------------------------------------------------------ */
/* Sample schema                                                       */
/* ------------------------------------------------------------------ */

/**
 * The dataset is deliberately shaped to expose the classic SQL traps:
 *  - Priya has no department  -> LEFT JOIN / NULL demos
 *  - Legal has no employees   -> RIGHT JOIN demos
 *  - salaries tie at 72000    -> RANK vs DENSE_RANK vs ROW_NUMBER
 *  - one employee has no sale -> EXISTS / NOT IN demos
 */

export const employees: SqlTable = {
  name: "employees",
  columns: ["emp_id", "name", "dept_id", "salary", "manager_id", "hire_year"],
  rows: [
    [1, "Asha", 10, 95000, null, 2015],
    [2, "Rohit", 10, 72000, 1, 2018],
    [3, "Meera", 20, 81000, 1, 2017],
    [4, "Vikram", 20, 72000, 3, 2019],
    [5, "Neha", 20, 64000, 3, 2021],
    [6, "Arjun", 30, 58000, 1, 2020],
    [7, "Divya", 30, 58000, 6, 2022],
    [8, "Priya", null, 69000, 1, 2016],
  ],
};

export const departments: SqlTable = {
  name: "departments",
  columns: ["dept_id", "dept_name", "city"],
  rows: [
    [10, "Engineering", "Bengaluru"],
    [20, "Sales", "Mumbai"],
    [30, "Support", "Pune"],
    [40, "Legal", "Delhi"],
  ],
};

export const sales: SqlTable = {
  name: "sales",
  columns: ["sale_id", "emp_id", "region", "quarter", "amount"],
  rows: [
    [101, 3, "West", "Q1", 52000],
    [102, 4, "West", "Q1", 31000],
    [103, 3, "West", "Q2", 47000],
    [104, 5, "North", "Q1", 28000],
    [105, 4, "West", "Q2", 39000],
    [106, 5, "North", "Q2", 44000],
    [107, 2, "South", "Q1", 22000],
    [108, 2, "South", "Q2", 35000],
  ],
};

export const SAMPLE_DB: SqlDatabase = {
  employees,
  departments,
  sales,
};

export const SCHEMA_SUMMARY = [
  {
    table: "employees",
    columns: "emp_id, name, dept_id, salary, manager_id, hire_year",
    note: "8 rows · Priya has a NULL dept_id",
  },
  {
    table: "departments",
    columns: "dept_id, dept_name, city",
    note: "4 rows · Legal has nobody in it",
  },
  {
    table: "sales",
    columns: "sale_id, emp_id, region, quarter, amount",
    note: "8 rows · only 4 employees ever sold anything",
  },
];

/* ------------------------------------------------------------------ */
/* Example library                                                     */
/* ------------------------------------------------------------------ */

export interface SqlExample {
  label: string;
  sql: string;
  takeaway: string;
}

/** 16 · Anatomy of a SELECT */
export const basicQueryExamples: SqlExample[] = [
  {
    label: "SELECT · pick columns",
    sql: `SELECT name, salary
FROM employees;`,
    takeaway:
      "The simplest possible query: no filter, no sort. Eight rows in, eight rows out — SELECT only chooses which columns come back.",
  },
  {
    label: "WHERE · filter rows",
    sql: `SELECT name, salary
FROM employees
WHERE salary > 70000;`,
    takeaway:
      "WHERE runs once per row and keeps only the TRUE ones. Watch the trace: five rows survive, three are dropped.",
  },
  {
    label: "ORDER BY + LIMIT · top N",
    sql: `SELECT name, salary
FROM employees
ORDER BY salary DESC
LIMIT 3;`,
    takeaway:
      "LIMIT is the last clause to run. The database still read and sorted all eight rows before throwing five away.",
  },
  {
    label: "DISTINCT · unique values",
    sql: `SELECT DISTINCT dept_id
FROM employees;`,
    takeaway:
      "DISTINCT de-duplicates the projected rows. NULL counts as one distinct value, so Priya's NULL appears exactly once.",
  },
  {
    label: "Computed column + alias",
    sql: `SELECT name,
       salary,
       ROUND(salary * 1.1, 0) AS after_raise
FROM employees
WHERE hire_year < 2019
ORDER BY after_raise DESC;`,
    takeaway:
      "The alias after_raise is created in SELECT, which runs after WHERE. That is why ORDER BY can use it but WHERE cannot.",
  },
  {
    label: "The alias trap (this errors)",
    sql: `SELECT name, salary * 12 AS annual
FROM employees
WHERE annual > 900000;`,
    takeaway:
      "A real database rejects this for the same reason ours does: WHERE is evaluated before SELECT, so the alias does not exist yet. Repeat the expression or wrap the query.",
  },
];

/** 17 · Aggregation */
export const aggregateExamples: SqlExample[] = [
  {
    label: "Aggregate the whole table",
    sql: `SELECT COUNT(*) AS headcount,
       ROUND(AVG(salary), 0) AS avg_salary,
       MAX(salary) AS top_salary
FROM employees;`,
    takeaway:
      "With no GROUP BY, the entire table is a single group and you get exactly one row back.",
  },
  {
    label: "GROUP BY · one row per key",
    sql: `SELECT dept_id,
       COUNT(*) AS headcount,
       ROUND(AVG(salary), 0) AS avg_salary
FROM employees
GROUP BY dept_id;`,
    takeaway:
      "Eight rows fold into four groups. Priya's NULL dept_id forms its own group — GROUP BY treats all NULLs as equal, unlike `=`.",
  },
  {
    label: "HAVING · filter the groups",
    sql: `SELECT dept_id, COUNT(*) AS headcount
FROM employees
GROUP BY dept_id
HAVING COUNT(*) >= 2;`,
    takeaway:
      "HAVING filters groups after aggregation. WHERE could never do this because at WHERE time the groups do not exist.",
  },
  {
    label: "WHERE and HAVING together",
    sql: `SELECT dept_id,
       COUNT(*) AS seniors,
       MIN(hire_year) AS first_hire
FROM employees
WHERE hire_year <= 2019
GROUP BY dept_id
HAVING COUNT(*) > 1;`,
    takeaway:
      "WHERE thins the rows, then GROUP BY folds them, then HAVING thins the groups. Three different filters at three different stages.",
  },
  {
    label: "COUNT(*) vs COUNT(column)",
    sql: `SELECT COUNT(*) AS all_rows,
       COUNT(dept_id) AS with_dept,
       COUNT(DISTINCT dept_id) AS distinct_depts
FROM employees;`,
    takeaway:
      "COUNT(*) counts rows. COUNT(col) skips NULLs — that is the whole difference, and it is the single most common interview question on this topic.",
  },
];

/** 18 · Join types */
export const joinExamples: SqlExample[] = [
  {
    label: "INNER JOIN",
    sql: `SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;`,
    takeaway:
      "Only matches survive. Priya (no department) and Legal (no employees) both vanish — 7 rows, not 8.",
  },
  {
    label: "LEFT JOIN",
    sql: `SELECT e.name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;`,
    takeaway:
      "Every employee is kept. Priya comes back with dept_name = NULL instead of disappearing. 8 rows.",
  },
  {
    label: "RIGHT JOIN",
    sql: `SELECT e.name, d.dept_name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.dept_id;`,
    takeaway:
      "Every department is kept, so Legal appears with name = NULL. Priya is gone. Same data, mirrored.",
  },
  {
    label: "FULL OUTER JOIN",
    sql: `SELECT e.name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.dept_id;`,
    takeaway:
      "Nobody is dropped: 7 matches + Priya + Legal = 9 rows. Both NULL-padded cases appear together.",
  },
  {
    label: "CROSS JOIN",
    sql: `SELECT e.name, d.dept_name
FROM employees e
CROSS JOIN departments d;`,
    takeaway:
      "No ON clause at all: 8 × 4 = 32 rows. Forgetting the join condition silently produces exactly this.",
  },
  {
    label: "SELF JOIN · who manages whom",
    sql: `SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id
ORDER BY manager;`,
    takeaway:
      "One table, two aliases. LEFT JOIN is essential here or Asha (who has no manager) would disappear from her own org chart.",
  },
  {
    label: "Anti-join · find the orphans",
    sql: `SELECT e.name
FROM employees e
LEFT JOIN sales s ON e.emp_id = s.emp_id
WHERE s.sale_id IS NULL;`,
    takeaway:
      "LEFT JOIN then IS NULL on the right side is the classic 'rows with no match' pattern. Four employees never sold anything.",
  },
  {
    label: "Three tables + aggregate",
    sql: `SELECT d.dept_name,
       COUNT(s.sale_id) AS deals,
       SUM(s.amount) AS revenue
FROM departments d
LEFT JOIN employees e ON d.dept_id = e.dept_id
LEFT JOIN sales s ON e.emp_id = s.emp_id
GROUP BY d.dept_name
ORDER BY revenue DESC;`,
    takeaway:
      "Joins chain left to right. COUNT(s.sale_id) returns 0 for Legal, whereas COUNT(*) would wrongly return 1 for its NULL-padded row.",
  },
  {
    label: "The ON vs WHERE trap",
    sql: `SELECT e.name, d.dept_name
FROM employees e
LEFT JOIN departments d
  ON e.dept_id = d.dept_id AND d.city = 'Mumbai';`,
    takeaway:
      "A filter in ON is applied *before* padding, so all 8 employees stay. Move `d.city = 'Mumbai'` to WHERE and the LEFT JOIN silently degrades into an INNER JOIN.",
  },
];

/** 19 · Window functions */
export const windowExamples: SqlExample[] = [
  {
    label: "ROW_NUMBER vs RANK vs DENSE_RANK",
    sql: `SELECT name,
       salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
       RANK()       OVER (ORDER BY salary DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk
FROM employees;`,
    takeaway:
      "Rohit and Vikram both earn 72000. ROW_NUMBER breaks the tie arbitrarily (3 and 4), RANK gives them both 3 then jumps to 5, DENSE_RANK gives them both 3 then continues at 4.",
  },
  {
    label: "PARTITION BY · rank inside each group",
    sql: `SELECT dept_id,
       name,
       salary,
       RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dept_rank
FROM employees
ORDER BY dept_id, dept_rank;`,
    takeaway:
      "PARTITION BY restarts the numbering per department. Crucially, all 8 rows are still returned — unlike GROUP BY, which would collapse them.",
  },
  {
    label: "Aggregate OVER · group total on every row",
    sql: `SELECT name,
       dept_id,
       salary,
       SUM(salary) OVER (PARTITION BY dept_id) AS dept_total,
       ROUND(salary * 100.0 / SUM(salary) OVER (PARTITION BY dept_id), 1) AS pct_of_dept
FROM employees
ORDER BY dept_id, salary DESC;`,
    takeaway:
      "The detail row and its group total side by side. With GROUP BY you would have to join the aggregate back onto the detail.",
  },
  {
    label: "Running total · ORDER BY changes the frame",
    sql: `SELECT quarter,
       region,
       amount,
       SUM(amount) OVER (PARTITION BY region ORDER BY quarter) AS running_total,
       SUM(amount) OVER (PARTITION BY region)                  AS region_total
FROM sales
ORDER BY region, quarter;`,
    takeaway:
      "Same function, same partition — adding ORDER BY silently changes the frame from the whole partition to 'everything up to this row'. That is the #1 window-function gotcha.",
  },
  {
    label: "LAG / LEAD · compare to the neighbouring row",
    sql: `SELECT region,
       quarter,
       amount,
       LAG(amount) OVER (PARTITION BY region ORDER BY quarter) AS prev_quarter,
       amount - LAG(amount) OVER (PARTITION BY region ORDER BY quarter) AS delta
FROM sales
ORDER BY region, quarter;`,
    takeaway:
      "Quarter-over-quarter change without a self join. The first row of each partition has no previous row, so LAG returns NULL.",
  },
  {
    label: "Top-N per group (needs a subquery)",
    sql: `SELECT dept_id, name, salary
FROM (
  SELECT dept_id,
         name,
         salary,
         ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn
  FROM employees
) ranked
WHERE rn = 1;`,
    takeaway:
      "You cannot filter on a window function in WHERE — windows are computed after WHERE. Wrapping the query in a derived table is the standard fix.",
  },
];

/** 20 · Subqueries */
export const subqueryExamples: SqlExample[] = [
  {
    label: "Scalar subquery · compare to an aggregate",
    sql: `SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;`,
    takeaway:
      "The inner query returns one value (71125), computed once, then every row is compared against it. This is impossible without a subquery.",
  },
  {
    label: "IN · a list from another table",
    sql: `SELECT name, dept_id
FROM employees
WHERE dept_id IN (
  SELECT dept_id FROM departments WHERE city IN ('Mumbai', 'Pune')
);`,
    takeaway:
      "The subquery produces a set, and IN tests membership. Uncorrelated: it runs once, not once per row.",
  },
  {
    label: "Correlated subquery · per-row inner query",
    sql: `SELECT e.name,
       e.dept_id,
       e.salary
FROM employees e
WHERE e.salary > (
  SELECT AVG(x.salary) FROM employees x WHERE x.dept_id = e.dept_id
);`,
    takeaway:
      "The inner query references e from the outer query, so it re-runs for every row. Powerful, but this is exactly the pattern a window function replaces more cheaply.",
  },
  {
    label: "EXISTS · does any matching row exist?",
    sql: `SELECT e.name
FROM employees e
WHERE EXISTS (
  SELECT 1 FROM sales s WHERE s.emp_id = e.emp_id AND s.amount > 40000
);`,
    takeaway:
      "EXISTS stops at the first hit and never cares what you select, hence the idiomatic `SELECT 1`. Only Meera and Neha ever closed a deal above 40k.",
  },
  {
    label: "NOT EXISTS vs NOT IN with NULLs",
    sql: `SELECT e.name
FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM sales s WHERE s.emp_id = e.emp_id
);`,
    takeaway:
      "NOT EXISTS correctly returns the four non-sellers. Swap it for `NOT IN (SELECT emp_id ...)` and a single NULL in that column would make the whole result empty.",
  },
  {
    label: "Derived table · subquery in FROM",
    sql: `SELECT d.dept_name, t.headcount, t.avg_salary
FROM (
  SELECT dept_id,
         COUNT(*) AS headcount,
         ROUND(AVG(salary), 0) AS avg_salary
  FROM employees
  GROUP BY dept_id
) t
JOIN departments d ON d.dept_id = t.dept_id
ORDER BY t.avg_salary DESC;`,
    takeaway:
      "Aggregate first, then join the small result. A derived table must be aliased — `t` here — or the parser cannot reference its columns.",
  },
  {
    label: "Subquery in SELECT",
    sql: `SELECT e.name,
       e.salary,
       (SELECT d.dept_name FROM departments d WHERE d.dept_id = e.dept_id) AS dept,
       (SELECT COUNT(*) FROM sales s WHERE s.emp_id = e.emp_id) AS deals
FROM employees e
ORDER BY deals DESC, e.name;`,
    takeaway:
      "A scalar subquery per column. Readable, but it runs once per output row — a LEFT JOIN usually plans better on large tables.",
  },
];

export const labExamples: SqlExample[] = [
  {
    label: "Top earner per department",
    sql: `SELECT dept_id, name, salary
FROM (
  SELECT e.dept_id,
         e.name,
         e.salary,
         ROW_NUMBER() OVER (PARTITION BY e.dept_id ORDER BY e.salary DESC) AS rn
  FROM employees e
) t
WHERE rn = 1
ORDER BY dept_id;`,
    takeaway:
      "The canonical 'top N per group' pattern: rank inside a derived table, then filter on the rank outside it. You cannot filter a window function in WHERE, so the wrapper is mandatory.",
  },
  {
    label: "Department scorecard",
    sql: `SELECT d.dept_name,
       COUNT(e.emp_id) AS headcount,
       AVG(e.salary) AS avg_salary,
       MAX(e.salary) AS top_salary
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.dept_id
GROUP BY d.dept_name
HAVING COUNT(e.emp_id) > 0
ORDER BY avg_salary DESC;`,
    takeaway:
      "LEFT JOIN keeps Legal in the join, then HAVING COUNT(e.emp_id) > 0 removes it. Note COUNT(e.emp_id), not COUNT(*) — COUNT(*) would have scored the empty department as 1.",
  },
  {
    label: "Salary bands with CASE",
    sql: `SELECT name,
       salary,
       CASE
         WHEN salary >= 80000 THEN 'Senior band'
         WHEN salary >= 65000 THEN 'Mid band'
         ELSE 'Entry band'
       END AS band
FROM employees
ORDER BY salary DESC;`,
    takeaway:
      "CASE is SQL's if/else and runs in the SELECT stage. Branches are evaluated top-down and the first TRUE wins, so order your conditions from most to least specific.",
  },
  {
    label: "Revenue share per region",
    sql: `SELECT region,
       quarter,
       amount,
       SUM(amount) OVER (PARTITION BY region) AS region_total,
       ROUND(amount * 100 / SUM(amount) OVER (PARTITION BY region), 1) AS pct
FROM sales
ORDER BY region, quarter;`,
    takeaway:
      "A window function in an arithmetic expression. Because OVER keeps every row, each row can be compared against its own partition total — impossible with GROUP BY alone.",
  },
  {
    label: "Everything at once",
    sql: `SELECT d.dept_name,
       e.name,
       e.salary,
       COALESCE(s.total, 0) AS sales_total,
       RANK() OVER (ORDER BY COALESCE(s.total, 0) DESC) AS sales_rank
FROM employees e
LEFT JOIN departments d ON d.dept_id = e.dept_id
LEFT JOIN (SELECT emp_id, SUM(amount) AS total FROM sales GROUP BY emp_id) s
  ON s.emp_id = e.emp_id
WHERE e.salary > 55000
ORDER BY sales_rank, e.name;`,
    takeaway:
      "Two LEFT JOINs (one onto a pre-aggregated derived table to avoid fan-out), a WHERE filter, COALESCE to turn missing sales into 0, and a window RANK over the result. Step through the stages to see each one apply in turn.",
  },
];
