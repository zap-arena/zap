/**
 * A deliberately small SQL engine used to power the visual SQL course.
 *
 * It supports the slice of SELECT that the guide teaches: joins, filtering,
 * grouping, window functions and subqueries. Every query is executed stage by
 * stage so the UI can show what each clause did to the rows.
 */

export type SqlValue = string | number | null;

export interface SqlTable {
  name: string;
  columns: string[];
  rows: SqlValue[][];
}

export type SqlDatabase = Record<string, SqlTable>;

export type RowState =
  | "neutral"
  | "kept"
  | "dropped"
  | "matched"
  | "padded"
  | "group";

export interface TraceRow {
  cells: SqlValue[];
  state: RowState;
  note?: string;
}

export interface TraceStage {
  key: string;
  clause: string;
  title: string;
  detail: string;
  columns: string[];
  rows: TraceRow[];
  summary: string;
}

export interface QueryResult {
  columns: string[];
  rows: SqlValue[][];
  stages: TraceStage[];
}

/* ------------------------------------------------------------------ */
/* Tokenizer                                                           */
/* ------------------------------------------------------------------ */

type TokenKind = "ident" | "number" | "string" | "op" | "punct" | "eof";

interface Token {
  kind: TokenKind;
  value: string;
  upper: string;
}

const MULTI_CHAR_OPS = ["<>", "!=", "<=", ">=", "||"];

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }
    if (ch === "-" && input[i + 1] === "-") {
      while (i < input.length && input[i] !== "\n") i += 1;
      continue;
    }
    if (ch === "/" && input[i + 1] === "*") {
      const end = input.indexOf("*/", i + 2);
      i = end === -1 ? input.length : end + 2;
      continue;
    }
    if (ch === "'" || ch === '"') {
      const quote = ch;
      let value = "";
      i += 1;
      while (i < input.length) {
        if (input[i] === quote) {
          if (input[i + 1] === quote) {
            value += quote;
            i += 2;
            continue;
          }
          break;
        }
        value += input[i];
        i += 1;
      }
      i += 1;
      tokens.push({
        kind: quote === "'" ? "string" : "ident",
        value,
        upper: value.toUpperCase(),
      });
      continue;
    }
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(input[i + 1] ?? ""))) {
      let value = "";
      while (i < input.length && /[0-9.]/.test(input[i])) {
        value += input[i];
        i += 1;
      }
      tokens.push({ kind: "number", value, upper: value });
      continue;
    }
    if (/[A-Za-z_]/.test(ch)) {
      let value = "";
      while (i < input.length && /[A-Za-z0-9_]/.test(input[i])) {
        value += input[i];
        i += 1;
      }
      tokens.push({ kind: "ident", value, upper: value.toUpperCase() });
      continue;
    }
    const two = input.slice(i, i + 2);
    if (MULTI_CHAR_OPS.includes(two)) {
      tokens.push({ kind: "op", value: two, upper: two });
      i += 2;
      continue;
    }
    if ("+-*/%=<>".includes(ch)) {
      tokens.push({ kind: "op", value: ch, upper: ch });
      i += 1;
      continue;
    }
    if ("(),.;".includes(ch)) {
      tokens.push({ kind: "punct", value: ch, upper: ch });
      i += 1;
      continue;
    }
    throw new Error(`Unexpected character "${ch}"`);
  }
  tokens.push({ kind: "eof", value: "", upper: "" });
  return tokens;
}

/* ------------------------------------------------------------------ */
/* AST                                                                 */
/* ------------------------------------------------------------------ */

export interface OrderItem {
  expr: Expr;
  dir: "ASC" | "DESC";
}

export type Expr =
  | { k: "num"; v: number }
  | { k: "str"; v: string }
  | { k: "null" }
  | { k: "bool"; v: boolean }
  | { k: "col"; table?: string; name: string }
  | { k: "star"; table?: string }
  | { k: "unary"; op: string; e: Expr }
  | { k: "bin"; op: string; l: Expr; r: Expr }
  | { k: "logic"; op: "AND" | "OR"; l: Expr; r: Expr }
  | { k: "not"; e: Expr }
  | { k: "func"; name: string; args: Expr[] }
  | { k: "agg"; name: string; arg: Expr | null; distinct: boolean }
  | {
      k: "window";
      id: number;
      name: string;
      args: Expr[];
      partitionBy: Expr[];
      orderBy: OrderItem[];
    }
  | {
      k: "case";
      operand?: Expr;
      whens: { when: Expr; then: Expr }[];
      otherwise?: Expr;
    }
  | { k: "in"; e: Expr; list?: Expr[]; sub?: SelectAst; negated: boolean }
  | { k: "exists"; sub: SelectAst; negated: boolean }
  | { k: "scalar"; sub: SelectAst }
  | { k: "isnull"; e: Expr; negated: boolean }
  | { k: "between"; e: Expr; lo: Expr; hi: Expr; negated: boolean }
  | { k: "like"; e: Expr; pattern: Expr; negated: boolean };

export type FromItem =
  | { kind: "table"; name: string; alias?: string }
  | { kind: "sub"; sub: SelectAst; alias: string };

export type JoinType = "INNER" | "LEFT" | "RIGHT" | "FULL" | "CROSS";

export interface JoinClause {
  type: JoinType;
  item: FromItem;
  on?: Expr;
}

export interface SelectAst {
  distinct: boolean;
  columns: { expr: Expr; alias?: string }[];
  from: FromItem | null;
  joins: JoinClause[];
  where?: Expr;
  groupBy: Expr[];
  having?: Expr;
  orderBy: OrderItem[];
  limit?: number;
  offset?: number;
  windows: Extract<Expr, { k: "window" }>[];
}

const AGGREGATES = new Set([
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
  "STRING_AGG",
  "GROUP_CONCAT",
]);

const WINDOW_ONLY = new Set([
  "ROW_NUMBER",
  "RANK",
  "DENSE_RANK",
  "NTILE",
  "LAG",
  "LEAD",
  "FIRST_VALUE",
  "LAST_VALUE",
  "PERCENT_RANK",
  "CUME_DIST",
]);

const RESERVED_AFTER_EXPR = new Set([
  "FROM",
  "WHERE",
  "GROUP",
  "HAVING",
  "ORDER",
  "LIMIT",
  "OFFSET",
  "JOIN",
  "INNER",
  "LEFT",
  "RIGHT",
  "FULL",
  "CROSS",
  "OUTER",
  "ON",
  "AND",
  "OR",
  "AS",
  "THEN",
  "WHEN",
  "ELSE",
  "END",
  "ASC",
  "DESC",
  "UNION",
]);

/* ------------------------------------------------------------------ */
/* Parser                                                              */
/* ------------------------------------------------------------------ */

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(sql: string) {
    this.tokens = tokenize(sql);
  }

  private peek(offset = 0): Token {
    return this.tokens[Math.min(this.pos + offset, this.tokens.length - 1)];
  }

  private next(): Token {
    const token = this.peek();
    this.pos += 1;
    return token;
  }

  private isKeyword(word: string, offset = 0): boolean {
    const token = this.peek(offset);
    return token.kind === "ident" && token.upper === word;
  }

  private eatKeyword(word: string): boolean {
    if (this.isKeyword(word)) {
      this.pos += 1;
      return true;
    }
    return false;
  }

  private expectKeyword(word: string): void {
    if (!this.eatKeyword(word)) {
      throw new Error(`Expected ${word} but found "${this.peek().value}"`);
    }
  }

  private isPunct(ch: string, offset = 0): boolean {
    const token = this.peek(offset);
    return token.kind === "punct" && token.value === ch;
  }

  private eatPunct(ch: string): boolean {
    if (this.isPunct(ch)) {
      this.pos += 1;
      return true;
    }
    return false;
  }

  private expectPunct(ch: string): void {
    if (!this.eatPunct(ch)) {
      throw new Error(`Expected "${ch}" but found "${this.peek().value}"`);
    }
  }

  parseQuery(): SelectAst {
    const ast = this.parseSelect();
    this.eatPunct(";");
    if (this.peek().kind !== "eof") {
      throw new Error(`Unexpected trailing input near "${this.peek().value}"`);
    }
    return ast;
  }

  parseSelect(): SelectAst {
    this.expectKeyword("SELECT");
    const distinct = this.eatKeyword("DISTINCT");
    if (!distinct) this.eatKeyword("ALL");

    const columns: { expr: Expr; alias?: string }[] = [];
    do {
      const expr = this.parseExpr();
      let alias: string | undefined;
      if (this.eatKeyword("AS")) {
        alias = this.next().value;
      } else if (
        this.peek().kind === "ident" &&
        !RESERVED_AFTER_EXPR.has(this.peek().upper)
      ) {
        alias = this.next().value;
      }
      columns.push({ expr, alias });
    } while (this.eatPunct(","));

    let from: FromItem | null = null;
    const joins: JoinClause[] = [];
    if (this.eatKeyword("FROM")) {
      from = this.parseFromItem();
      for (;;) {
        const join = this.tryParseJoin();
        if (!join) break;
        joins.push(join);
      }
    }

    let where: Expr | undefined;
    if (this.eatKeyword("WHERE")) where = this.parseExpr();

    const groupBy: Expr[] = [];
    if (this.isKeyword("GROUP")) {
      this.next();
      this.expectKeyword("BY");
      do {
        groupBy.push(this.parseExpr());
      } while (this.eatPunct(","));
    }

    let having: Expr | undefined;
    if (this.eatKeyword("HAVING")) having = this.parseExpr();

    const orderBy: OrderItem[] = [];
    if (this.isKeyword("ORDER")) {
      this.next();
      this.expectKeyword("BY");
      do {
        const expr = this.parseExpr();
        let dir: "ASC" | "DESC" = "ASC";
        if (this.eatKeyword("DESC")) dir = "DESC";
        else this.eatKeyword("ASC");
        orderBy.push({ expr, dir });
      } while (this.eatPunct(","));
    }

    let limit: number | undefined;
    let offset: number | undefined;
    if (this.eatKeyword("LIMIT")) limit = Number(this.next().value);
    if (this.eatKeyword("OFFSET")) offset = Number(this.next().value);

    const ast: SelectAst = {
      distinct,
      columns,
      from,
      joins,
      where,
      groupBy,
      having,
      orderBy,
      limit,
      offset,
      windows: [],
    };
    collectWindows(ast);
    return ast;
  }

  private parseFromItem(): FromItem {
    if (this.isPunct("(")) {
      this.next();
      const sub = this.parseSelect();
      this.expectPunct(")");
      this.eatKeyword("AS");
      const alias = this.next().value;
      return { kind: "sub", sub, alias };
    }
    const name = this.next().value;
    let alias: string | undefined;
    if (this.eatKeyword("AS")) {
      alias = this.next().value;
    } else if (
      this.peek().kind === "ident" &&
      !RESERVED_AFTER_EXPR.has(this.peek().upper)
    ) {
      alias = this.next().value;
    }
    return { kind: "table", name, alias };
  }

  private tryParseJoin(): JoinClause | null {
    const start = this.pos;
    let type: JoinType = "INNER";
    if (this.eatKeyword("INNER")) {
      type = "INNER";
    } else if (this.eatKeyword("LEFT")) {
      type = "LEFT";
      this.eatKeyword("OUTER");
    } else if (this.eatKeyword("RIGHT")) {
      type = "RIGHT";
      this.eatKeyword("OUTER");
    } else if (this.eatKeyword("FULL")) {
      type = "FULL";
      this.eatKeyword("OUTER");
    } else if (this.eatKeyword("CROSS")) {
      type = "CROSS";
    }
    if (!this.eatKeyword("JOIN")) {
      this.pos = start;
      return null;
    }
    const item = this.parseFromItem();
    let on: Expr | undefined;
    if (this.eatKeyword("ON")) on = this.parseExpr();
    return { type, item, on };
  }

  /* ---------------- expressions ---------------- */

  parseExpr(): Expr {
    return this.parseOr();
  }

  private parseOr(): Expr {
    let left = this.parseAnd();
    while (this.eatKeyword("OR")) {
      left = { k: "logic", op: "OR", l: left, r: this.parseAnd() };
    }
    return left;
  }

  private parseAnd(): Expr {
    let left = this.parseNot();
    while (this.eatKeyword("AND")) {
      left = { k: "logic", op: "AND", l: left, r: this.parseNot() };
    }
    return left;
  }

  private parseNot(): Expr {
    if (this.eatKeyword("NOT")) return { k: "not", e: this.parseNot() };
    return this.parseComparison();
  }

  private parseComparison(): Expr {
    if (this.isKeyword("EXISTS")) {
      this.next();
      this.expectPunct("(");
      const sub = this.parseSelect();
      this.expectPunct(")");
      return { k: "exists", sub, negated: false };
    }

    let left = this.parseAdditive();

    for (;;) {
      const token = this.peek();
      if (
        token.kind === "op" &&
        ["=", "<>", "!=", "<", ">", "<=", ">="].includes(token.value)
      ) {
        this.next();
        left = { k: "bin", op: token.value, l: left, r: this.parseAdditive() };
        continue;
      }

      let negated = false;
      let lookahead = 0;
      if (this.isKeyword("NOT")) {
        negated = true;
        lookahead = 1;
      }

      if (this.isKeyword("IN", lookahead)) {
        this.pos += lookahead + 1;
        this.expectPunct("(");
        if (this.isKeyword("SELECT")) {
          const sub = this.parseSelect();
          this.expectPunct(")");
          left = { k: "in", e: left, sub, negated };
        } else {
          const list: Expr[] = [];
          do {
            list.push(this.parseExpr());
          } while (this.eatPunct(","));
          this.expectPunct(")");
          left = { k: "in", e: left, list, negated };
        }
        continue;
      }

      if (this.isKeyword("BETWEEN", lookahead)) {
        this.pos += lookahead + 1;
        const lo = this.parseAdditive();
        this.expectKeyword("AND");
        const hi = this.parseAdditive();
        left = { k: "between", e: left, lo, hi, negated };
        continue;
      }

      if (this.isKeyword("LIKE", lookahead)) {
        this.pos += lookahead + 1;
        const pattern = this.parseAdditive();
        left = { k: "like", e: left, pattern, negated };
        continue;
      }

      if (this.isKeyword("IS")) {
        this.next();
        const isNegated = this.eatKeyword("NOT");
        this.expectKeyword("NULL");
        left = { k: "isnull", e: left, negated: isNegated };
        continue;
      }

      return left;
    }
  }

  private parseAdditive(): Expr {
    let left = this.parseMultiplicative();
    for (;;) {
      const token = this.peek();
      if (token.kind === "op" && ["+", "-", "||"].includes(token.value)) {
        this.next();
        left = {
          k: "bin",
          op: token.value,
          l: left,
          r: this.parseMultiplicative(),
        };
        continue;
      }
      return left;
    }
  }

  private parseMultiplicative(): Expr {
    let left = this.parseUnary();
    for (;;) {
      const token = this.peek();
      if (token.kind === "op" && ["*", "/", "%"].includes(token.value)) {
        this.next();
        left = { k: "bin", op: token.value, l: left, r: this.parseUnary() };
        continue;
      }
      return left;
    }
  }

  private parseUnary(): Expr {
    const token = this.peek();
    if (token.kind === "op" && (token.value === "-" || token.value === "+")) {
      this.next();
      return { k: "unary", op: token.value, e: this.parseUnary() };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): Expr {
    const token = this.peek();

    if (token.kind === "number") {
      this.next();
      return { k: "num", v: Number(token.value) };
    }
    if (token.kind === "string") {
      this.next();
      return { k: "str", v: token.value };
    }
    if (token.kind === "op" && token.value === "*") {
      this.next();
      return { k: "star" };
    }
    if (this.isPunct("(")) {
      this.next();
      if (this.isKeyword("SELECT")) {
        const sub = this.parseSelect();
        this.expectPunct(")");
        return { k: "scalar", sub };
      }
      const expr = this.parseExpr();
      this.expectPunct(")");
      return expr;
    }

    if (token.kind === "ident") {
      if (token.upper === "NULL") {
        this.next();
        return { k: "null" };
      }
      if (token.upper === "TRUE" || token.upper === "FALSE") {
        this.next();
        return { k: "bool", v: token.upper === "TRUE" };
      }
      if (token.upper === "CASE") return this.parseCase();

      this.next();

      if (this.isPunct("(")) return this.parseCall(token.upper);

      if (this.isPunct(".")) {
        this.next();
        if (this.peek().kind === "op" && this.peek().value === "*") {
          this.next();
          return { k: "star", table: token.value };
        }
        const name = this.next().value;
        return { k: "col", table: token.value, name };
      }
      return { k: "col", name: token.value };
    }

    throw new Error(`Unexpected token "${token.value || "end of query"}"`);
  }

  private parseCall(nameUpper: string): Expr {
    this.expectPunct("(");
    const distinct = this.eatKeyword("DISTINCT");
    const args: Expr[] = [];
    if (!this.isPunct(")")) {
      do {
        args.push(this.parseExpr());
      } while (this.eatPunct(","));
    }
    this.expectPunct(")");

    if (this.isKeyword("OVER")) {
      this.next();
      this.expectPunct("(");
      const partitionBy: Expr[] = [];
      if (this.isKeyword("PARTITION")) {
        this.next();
        this.expectKeyword("BY");
        do {
          partitionBy.push(this.parseExpr());
        } while (this.eatPunct(","));
      }
      const orderBy: OrderItem[] = [];
      if (this.isKeyword("ORDER")) {
        this.next();
        this.expectKeyword("BY");
        do {
          const expr = this.parseExpr();
          let dir: "ASC" | "DESC" = "ASC";
          if (this.eatKeyword("DESC")) dir = "DESC";
          else this.eatKeyword("ASC");
          orderBy.push({ expr, dir });
        } while (this.eatPunct(","));
      }
      this.expectPunct(")");
      return {
        k: "window",
        id: -1,
        name: nameUpper,
        args,
        partitionBy,
        orderBy,
      };
    }

    if (WINDOW_ONLY.has(nameUpper)) {
      throw new Error(`${nameUpper}() requires an OVER (...) clause`);
    }
    if (AGGREGATES.has(nameUpper)) {
      return {
        k: "agg",
        name: nameUpper,
        arg: args[0] ?? null,
        distinct,
      };
    }
    return { k: "func", name: nameUpper, args };
  }

  private parseCase(): Expr {
    this.expectKeyword("CASE");
    let operand: Expr | undefined;
    if (!this.isKeyword("WHEN")) operand = this.parseExpr();
    const whens: { when: Expr; then: Expr }[] = [];
    while (this.eatKeyword("WHEN")) {
      const when = this.parseExpr();
      this.expectKeyword("THEN");
      const then = this.parseExpr();
      whens.push({ when, then });
    }
    let otherwise: Expr | undefined;
    if (this.eatKeyword("ELSE")) otherwise = this.parseExpr();
    this.expectKeyword("END");
    return { k: "case", operand, whens, otherwise };
  }
}

function walkExpr(expr: Expr, visit: (e: Expr) => void): void {
  visit(expr);
  switch (expr.k) {
    case "unary":
    case "not":
      walkExpr(expr.e, visit);
      break;
    case "bin":
    case "logic":
      walkExpr(expr.l, visit);
      walkExpr(expr.r, visit);
      break;
    case "func":
      for (const a of expr.args) walkExpr(a, visit);
      break;
    case "agg":
      if (expr.arg) walkExpr(expr.arg, visit);
      break;
    case "window":
      for (const a of expr.args) walkExpr(a, visit);
      for (const p of expr.partitionBy) walkExpr(p, visit);
      for (const o of expr.orderBy) walkExpr(o.expr, visit);
      break;
    case "case":
      if (expr.operand) walkExpr(expr.operand, visit);
      for (const w of expr.whens) {
        walkExpr(w.when, visit);
        walkExpr(w.then, visit);
      }
      if (expr.otherwise) walkExpr(expr.otherwise, visit);
      break;
    case "in":
      walkExpr(expr.e, visit);
      for (const l of expr.list ?? []) walkExpr(l, visit);
      break;
    case "isnull":
      walkExpr(expr.e, visit);
      break;
    case "between":
      walkExpr(expr.e, visit);
      walkExpr(expr.lo, visit);
      walkExpr(expr.hi, visit);
      break;
    case "like":
      walkExpr(expr.e, visit);
      walkExpr(expr.pattern, visit);
      break;
    default:
      break;
  }
}

function collectWindows(ast: SelectAst): void {
  const found: Extract<Expr, { k: "window" }>[] = [];
  const visit = (e: Expr) => {
    if (e.k === "window") {
      e.id = found.length;
      found.push(e);
    }
  };
  for (const col of ast.columns) walkExpr(col.expr, visit);
  for (const item of ast.orderBy) walkExpr(item.expr, visit);
  ast.windows = found;
}

function hasAggregate(expr: Expr): boolean {
  let found = false;
  walkExpr(expr, (e) => {
    if (e.k === "agg") found = true;
  });
  return found;
}

/* ------------------------------------------------------------------ */
/* Values                                                              */
/* ------------------------------------------------------------------ */

export type Env = Record<string, SqlValue>;

interface IRow {
  env: Env;
}

interface ColumnRef {
  key: string;
  label: string;
}

interface IRowSet {
  cols: ColumnRef[];
  rows: IRow[];
}

interface EvalCtx {
  env: Env;
  db: SqlDatabase;
  groupRows?: Env[];
  windowValues?: Map<number, SqlValue>;
  outer?: EvalCtx;
}

export function formatValue(value: SqlValue): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? String(value)
      : String(Math.round(value * 100) / 100);
  }
  return value;
}

function toNumber(value: SqlValue): number | null {
  if (value === null) return null;
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function compareValues(a: SqlValue, b: SqlValue): number {
  if (a === null && b === null) return 0;
  if (a === null) return -1;
  if (b === null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  const an = toNumber(a);
  const bn = toNumber(b);
  if (an !== null && bn !== null) return an - bn;
  return String(a).localeCompare(String(b));
}

/** SQL three-valued logic: null means "unknown", which is not true. */
function isTrue(value: SqlValue): boolean {
  if (value === null) return false;
  if (typeof value === "number") return value !== 0;
  return value !== "" && value.toUpperCase() !== "FALSE";
}

function boolValue(value: boolean): SqlValue {
  return value ? 1 : 0;
}

function resolveColumn(
  ctx: EvalCtx,
  table: string | undefined,
  name: string,
): SqlValue {
  const env = ctx.env;
  if (table) {
    const key = `${table}.${name}`;
    if (key in env) return env[key];
    const lowered = Object.keys(env).find(
      (k) => k.toLowerCase() === key.toLowerCase(),
    );
    if (lowered) return env[lowered];
  } else {
    if (name in env) return env[name];
    const direct = Object.keys(env).find(
      (k) => !k.includes(".") && k.toLowerCase() === name.toLowerCase(),
    );
    if (direct) return env[direct];
    const qualified = Object.keys(env).find((k) =>
      k.toLowerCase().endsWith(`.${name.toLowerCase()}`),
    );
    if (qualified) return env[qualified];
  }
  if (ctx.outer) {
    return resolveColumn({ ...ctx.outer }, table, name);
  }
  throw new Error(`Unknown column "${table ? `${table}.${name}` : name}"`);
}

function likeToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped.replace(/%/g, ".*").replace(/_/g, ".")}$`, "i");
}

/* ------------------------------------------------------------------ */
/* Expression evaluation                                               */
/* ------------------------------------------------------------------ */

function evalExpr(expr: Expr, ctx: EvalCtx): SqlValue {
  switch (expr.k) {
    case "num":
      return expr.v;
    case "str":
      return expr.v;
    case "null":
      return null;
    case "bool":
      return boolValue(expr.v);
    case "col":
      return resolveColumn(ctx, expr.table, expr.name);
    case "star":
      throw new Error("* is only allowed in the SELECT list or COUNT(*)");
    case "unary": {
      const value = toNumber(evalExpr(expr.e, ctx));
      if (value === null) return null;
      return expr.op === "-" ? -value : value;
    }
    case "bin":
      return evalBinary(expr.op, expr.l, expr.r, ctx);
    case "logic": {
      const left = evalExpr(expr.l, ctx);
      const right = evalExpr(expr.r, ctx);
      if (expr.op === "AND") {
        if (left !== null && !isTrue(left)) return boolValue(false);
        if (right !== null && !isTrue(right)) return boolValue(false);
        if (left === null || right === null) return null;
        return boolValue(true);
      }
      if (left !== null && isTrue(left)) return boolValue(true);
      if (right !== null && isTrue(right)) return boolValue(true);
      if (left === null || right === null) return null;
      return boolValue(false);
    }
    case "not": {
      const value = evalExpr(expr.e, ctx);
      if (value === null) return null;
      return boolValue(!isTrue(value));
    }
    case "isnull": {
      const value = evalExpr(expr.e, ctx);
      const isNull = value === null;
      return boolValue(expr.negated ? !isNull : isNull);
    }
    case "between": {
      const value = evalExpr(expr.e, ctx);
      const lo = evalExpr(expr.lo, ctx);
      const hi = evalExpr(expr.hi, ctx);
      if (value === null || lo === null || hi === null) return null;
      const inside =
        compareValues(value, lo) >= 0 && compareValues(value, hi) <= 0;
      return boolValue(expr.negated ? !inside : inside);
    }
    case "like": {
      const value = evalExpr(expr.e, ctx);
      const pattern = evalExpr(expr.pattern, ctx);
      if (value === null || pattern === null) return null;
      const matched = likeToRegExp(String(pattern)).test(String(value));
      return boolValue(expr.negated ? !matched : matched);
    }
    case "in": {
      const value = evalExpr(expr.e, ctx);
      const candidates = expr.sub
        ? runSubquery(expr.sub, ctx).map((row) => row[0])
        : (expr.list ?? []).map((item) => evalExpr(item, ctx));
      if (value === null) return null;
      let sawNull = false;
      for (const candidate of candidates) {
        if (candidate === null) {
          sawNull = true;
          continue;
        }
        if (compareValues(value, candidate) === 0) {
          return boolValue(!expr.negated);
        }
      }
      if (sawNull) return null;
      return boolValue(expr.negated);
    }
    case "exists": {
      const rows = runSubquery(expr.sub, ctx);
      return boolValue(expr.negated ? rows.length === 0 : rows.length > 0);
    }
    case "scalar": {
      const rows = runSubquery(expr.sub, ctx);
      if (rows.length === 0) return null;
      return rows[0][0] ?? null;
    }
    case "case": {
      for (const branch of expr.whens) {
        if (expr.operand) {
          const left = evalExpr(expr.operand, ctx);
          const right = evalExpr(branch.when, ctx);
          if (
            left !== null &&
            right !== null &&
            compareValues(left, right) === 0
          ) {
            return evalExpr(branch.then, ctx);
          }
        } else if (isTrue(evalExpr(branch.when, ctx))) {
          return evalExpr(branch.then, ctx);
        }
      }
      return expr.otherwise ? evalExpr(expr.otherwise, ctx) : null;
    }
    case "func":
      return evalFunction(expr.name, expr.args, ctx);
    case "agg":
      return evalAggregate(expr, ctx.groupRows ?? [ctx.env], ctx);
    case "window": {
      if (!ctx.windowValues?.has(expr.id)) {
        throw new Error(`${expr.name}() OVER (...) cannot be used here`);
      }
      return ctx.windowValues.get(expr.id) ?? null;
    }
    default:
      return null;
  }
}

function evalBinary(op: string, lhs: Expr, rhs: Expr, ctx: EvalCtx): SqlValue {
  const left = evalExpr(lhs, ctx);
  const right = evalExpr(rhs, ctx);
  if (op === "||") {
    if (left === null || right === null) return null;
    return `${formatValue(left)}${formatValue(right)}`;
  }
  if (["=", "<>", "!=", "<", ">", "<=", ">="].includes(op)) {
    if (left === null || right === null) return null;
    const cmp = compareValues(left, right);
    switch (op) {
      case "=":
        return boolValue(cmp === 0);
      case "<>":
      case "!=":
        return boolValue(cmp !== 0);
      case "<":
        return boolValue(cmp < 0);
      case ">":
        return boolValue(cmp > 0);
      case "<=":
        return boolValue(cmp <= 0);
      default:
        return boolValue(cmp >= 0);
    }
  }
  const a = toNumber(left);
  const b = toNumber(right);
  if (a === null || b === null) return null;
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? null : a / b;
    case "%":
      return b === 0 ? null : a % b;
    default:
      throw new Error(`Unsupported operator "${op}"`);
  }
}

function evalFunction(name: string, args: Expr[], ctx: EvalCtx): SqlValue {
  const values = args.map((arg) => evalExpr(arg, ctx));
  switch (name) {
    case "UPPER":
      return values[0] === null ? null : String(values[0]).toUpperCase();
    case "LOWER":
      return values[0] === null ? null : String(values[0]).toLowerCase();
    case "LENGTH":
    case "LEN":
      return values[0] === null ? null : String(values[0]).length;
    case "ABS": {
      const value = toNumber(values[0]);
      return value === null ? null : Math.abs(value);
    }
    case "ROUND": {
      const value = toNumber(values[0]);
      if (value === null) return null;
      const digits = toNumber(values[1] ?? 0) ?? 0;
      const factor = 10 ** digits;
      return Math.round(value * factor) / factor;
    }
    case "FLOOR": {
      const value = toNumber(values[0]);
      return value === null ? null : Math.floor(value);
    }
    case "CEIL":
    case "CEILING": {
      const value = toNumber(values[0]);
      return value === null ? null : Math.ceil(value);
    }
    case "COALESCE":
      return values.find((value) => value !== null) ?? null;
    case "NULLIF":
      return values[0] !== null &&
        values[1] !== null &&
        compareValues(values[0], values[1]) === 0
        ? null
        : values[0];
    case "CONCAT":
      return values.some((v) => v === null)
        ? null
        : values.map((v) => formatValue(v)).join("");
    case "SUBSTR":
    case "SUBSTRING": {
      if (values[0] === null) return null;
      const start = (toNumber(values[1]) ?? 1) - 1;
      const length = toNumber(values[2] ?? null);
      const text = String(values[0]);
      return length === null
        ? text.slice(start)
        : text.slice(start, start + length);
    }
    case "IFNULL":
      return values[0] ?? values[1] ?? null;
    default:
      throw new Error(`Unknown function ${name}()`);
  }
}

function evalAggregate(
  expr: Extract<Expr, { k: "agg" }>,
  rows: Env[],
  ctx: EvalCtx,
): SqlValue {
  if (expr.name === "COUNT" && (expr.arg === null || expr.arg.k === "star")) {
    return rows.length;
  }
  const arg = expr.arg;
  if (!arg) throw new Error(`${expr.name}() needs an argument`);

  let values = rows.map((env) =>
    evalExpr(arg, { ...ctx, env, groupRows: undefined }),
  );
  values = values.filter((value) => value !== null);
  if (expr.distinct) {
    const seen = new Set<string>();
    values = values.filter((value) => {
      const key = String(value);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  switch (expr.name) {
    case "COUNT":
      return values.length;
    case "SUM": {
      if (values.length === 0) return null;
      return values.reduce<number>((sum, v) => sum + (toNumber(v) ?? 0), 0);
    }
    case "AVG": {
      if (values.length === 0) return null;
      const total = values.reduce<number>(
        (sum, v) => sum + (toNumber(v) ?? 0),
        0,
      );
      return total / values.length;
    }
    case "MIN":
      if (values.length === 0) return null;
      return values.reduce((min, v) => (compareValues(v, min) < 0 ? v : min));
    case "MAX":
      if (values.length === 0) return null;
      return values.reduce((max, v) => (compareValues(v, max) > 0 ? v : max));
    case "STRING_AGG":
    case "GROUP_CONCAT":
      return values.map((v) => formatValue(v)).join(", ");
    default:
      throw new Error(`Unknown aggregate ${expr.name}()`);
  }
}

function runSubquery(ast: SelectAst, ctx: EvalCtx): SqlValue[][] {
  const result = executeSelect(ast, ctx.db, null, {
    env: ctx.env,
    db: ctx.db,
    outer: ctx.outer,
  });
  return result.rows;
}

/* ------------------------------------------------------------------ */
/* Window functions                                                    */
/* ------------------------------------------------------------------ */

function sortEnvs(envs: Env[], order: OrderItem[], ctx: EvalCtx): Env[] {
  if (order.length === 0) return envs;
  return [...envs].sort((a, b) => {
    for (const item of order) {
      const av = evalExpr(item.expr, { ...ctx, env: a });
      const bv = evalExpr(item.expr, { ...ctx, env: b });
      const cmp = compareValues(av, bv);
      if (cmp !== 0) return item.dir === "DESC" ? -cmp : cmp;
    }
    return 0;
  });
}

function computeWindow(
  win: Extract<Expr, { k: "window" }>,
  envs: Env[],
  ctx: EvalCtx,
): Map<Env, SqlValue> {
  const results = new Map<Env, SqlValue>();

  const partitions = new Map<string, Env[]>();
  for (const env of envs) {
    const key = JSON.stringify(
      win.partitionBy.map((expr) => evalExpr(expr, { ...ctx, env })),
    );
    const bucket = partitions.get(key);
    if (bucket) bucket.push(env);
    else partitions.set(key, [env]);
  }

  for (const bucket of partitions.values()) {
    const ordered = sortEnvs(bucket, win.orderBy, ctx);
    const orderKey = (env: Env) =>
      JSON.stringify(win.orderBy.map((o) => evalExpr(o.expr, { ...ctx, env })));

    ordered.forEach((env, index) => {
      const rowCtx: EvalCtx = { ...ctx, env };
      switch (win.name) {
        case "ROW_NUMBER":
          results.set(env, index + 1);
          return;
        case "RANK": {
          let rank = 1;
          for (let i = 0; i < index; i += 1) {
            if (orderKey(ordered[i]) !== orderKey(env)) rank = i + 2;
          }
          results.set(env, rank);
          return;
        }
        case "DENSE_RANK": {
          const seen = new Set<string>();
          for (let i = 0; i <= index; i += 1) seen.add(orderKey(ordered[i]));
          results.set(env, seen.size);
          return;
        }
        case "PERCENT_RANK": {
          let rank = 1;
          for (let i = 0; i < index; i += 1) {
            if (orderKey(ordered[i]) !== orderKey(env)) rank = i + 2;
          }
          results.set(
            env,
            ordered.length > 1 ? (rank - 1) / (ordered.length - 1) : 0,
          );
          return;
        }
        case "NTILE": {
          const buckets = toNumber(evalExpr(win.args[0], rowCtx)) ?? 1;
          results.set(
            env,
            Math.min(
              buckets,
              Math.floor((index * buckets) / ordered.length) + 1,
            ),
          );
          return;
        }
        case "LAG":
        case "LEAD": {
          const offset =
            toNumber(evalExpr(win.args[1] ?? { k: "num", v: 1 }, rowCtx)) ?? 1;
          const target = win.name === "LAG" ? index - offset : index + offset;
          if (target < 0 || target >= ordered.length) {
            results.set(
              env,
              win.args[2] ? evalExpr(win.args[2], rowCtx) : null,
            );
            return;
          }
          results.set(
            env,
            evalExpr(win.args[0], { ...ctx, env: ordered[target] }),
          );
          return;
        }
        case "FIRST_VALUE":
          results.set(env, evalExpr(win.args[0], { ...ctx, env: ordered[0] }));
          return;
        case "LAST_VALUE": {
          // Default frame stops at the current row's peer group.
          let end = index;
          while (
            end + 1 < ordered.length &&
            orderKey(ordered[end + 1]) === orderKey(env)
          ) {
            end += 1;
          }
          const frameEnd = win.orderBy.length === 0 ? ordered.length - 1 : end;
          results.set(
            env,
            evalExpr(win.args[0], { ...ctx, env: ordered[frameEnd] }),
          );
          return;
        }
        default: {
          // Aggregate used as a window function.
          let frame: Env[];
          if (win.orderBy.length === 0) {
            frame = ordered;
          } else {
            let end = index;
            while (
              end + 1 < ordered.length &&
              orderKey(ordered[end + 1]) === orderKey(env)
            ) {
              end += 1;
            }
            frame = ordered.slice(0, end + 1);
          }
          const aggregate: Extract<Expr, { k: "agg" }> = {
            k: "agg",
            name: win.name,
            arg: win.args[0] ?? null,
            distinct: false,
          };
          results.set(env, evalAggregate(aggregate, frame, ctx));
        }
      }
    });
  }

  return results;
}

/* ------------------------------------------------------------------ */
/* Execution                                                           */
/* ------------------------------------------------------------------ */

function lookupTable(db: SqlDatabase, name: string): SqlTable {
  const direct = db[name];
  if (direct) return direct;
  const key = Object.keys(db).find(
    (k) => k.toLowerCase() === name.toLowerCase(),
  );
  if (key) return db[key];
  throw new Error(
    `Unknown table "${name}". Available: ${Object.keys(db).join(", ")}`,
  );
}

function buildEnv(cols: ColumnRef[], values: SqlValue[]): Env {
  const env: Env = {};
  cols.forEach((col, index) => {
    env[col.key] = values[index] ?? null;
  });
  return env;
}

function loadFromItem(
  item: FromItem,
  db: SqlDatabase,
  outer: EvalCtx | undefined,
): IRowSet {
  if (item.kind === "sub") {
    const inner = executeSelect(item.sub, db, null, outer);
    const cols: ColumnRef[] = inner.columns.map((name) => ({
      key: `${item.alias}.${name}`,
      label: `${item.alias}.${name}`,
    }));
    return {
      cols,
      rows: inner.rows.map((values) => ({ env: buildEnv(cols, values) })),
    };
  }
  const table = lookupTable(db, item.name);
  const prefix = item.alias ?? table.name;
  const cols: ColumnRef[] = table.columns.map((name) => ({
    key: `${prefix}.${name}`,
    label: `${prefix}.${name}`,
  }));
  return {
    cols,
    rows: table.rows.map((values) => ({ env: buildEnv(cols, values) })),
  };
}

function nullEnv(cols: ColumnRef[]): Env {
  const env: Env = {};
  for (const col of cols) env[col.key] = null;
  return env;
}

function rowCells(cols: ColumnRef[], env: Env): SqlValue[] {
  return cols.map((col) => env[col.key] ?? null);
}

function stageFromRowSet(
  key: string,
  clause: string,
  title: string,
  detail: string,
  rowSet: IRowSet,
  summary: string,
  state: RowState = "neutral",
  notes?: Map<Env, { state: RowState; note?: string }>,
): TraceStage {
  return {
    key,
    clause,
    title,
    detail,
    columns: rowSet.cols.map((col) => col.label),
    rows: rowSet.rows.map((row) => {
      const override = notes?.get(row.env);
      return {
        cells: rowCells(rowSet.cols, row.env),
        state: override?.state ?? state,
        note: override?.note,
      };
    }),
    summary,
  };
}

function describeExpr(expr: Expr): string {
  switch (expr.k) {
    case "num":
      return String(expr.v);
    case "str":
      return `'${expr.v}'`;
    case "null":
      return "NULL";
    case "bool":
      return expr.v ? "TRUE" : "FALSE";
    case "col":
      return expr.table ? `${expr.table}.${expr.name}` : expr.name;
    case "star":
      return expr.table ? `${expr.table}.*` : "*";
    case "unary":
      return `${expr.op}${describeExpr(expr.e)}`;
    case "bin":
      return `${describeExpr(expr.l)} ${expr.op} ${describeExpr(expr.r)}`;
    case "logic":
      return `${describeExpr(expr.l)} ${expr.op} ${describeExpr(expr.r)}`;
    case "not":
      return `NOT ${describeExpr(expr.e)}`;
    case "func":
      return `${expr.name}(${expr.args.map(describeExpr).join(", ")})`;
    case "agg":
      return `${expr.name}(${expr.distinct ? "DISTINCT " : ""}${expr.arg ? describeExpr(expr.arg) : "*"})`;
    case "window": {
      const partition =
        expr.partitionBy.length > 0
          ? `PARTITION BY ${expr.partitionBy.map(describeExpr).join(", ")}`
          : "";
      const order =
        expr.orderBy.length > 0
          ? `ORDER BY ${expr.orderBy.map((o) => `${describeExpr(o.expr)} ${o.dir}`).join(", ")}`
          : "";
      return `${expr.name}(${expr.args.map(describeExpr).join(", ")}) OVER (${[partition, order].filter(Boolean).join(" ")})`;
    }
    case "case":
      return "CASE … END";
    case "in":
      return `${describeExpr(expr.e)} ${expr.negated ? "NOT IN" : "IN"} (${expr.sub ? "subquery" : (expr.list ?? []).map(describeExpr).join(", ")})`;
    case "exists":
      return `${expr.negated ? "NOT EXISTS" : "EXISTS"} (subquery)`;
    case "scalar":
      return "(subquery)";
    case "isnull":
      return `${describeExpr(expr.e)} IS ${expr.negated ? "NOT " : ""}NULL`;
    case "between":
      return `${describeExpr(expr.e)} ${expr.negated ? "NOT " : ""}BETWEEN ${describeExpr(expr.lo)} AND ${describeExpr(expr.hi)}`;
    case "like":
      return `${describeExpr(expr.e)} ${expr.negated ? "NOT " : ""}LIKE ${describeExpr(expr.pattern)}`;
    default:
      return "expression";
  }
}

function expandSelectColumns(
  ast: SelectAst,
  rowSet: IRowSet,
): { expr: Expr; label: string }[] {
  const output: { expr: Expr; label: string }[] = [];
  for (const column of ast.columns) {
    if (column.expr.k === "star") {
      const table = column.expr.table;
      for (const col of rowSet.cols) {
        if (
          table &&
          !col.key.toLowerCase().startsWith(`${table.toLowerCase()}.`)
        ) {
          continue;
        }
        output.push({
          expr: {
            k: "col",
            name: col.key.split(".").slice(1).join("."),
            table: col.key.split(".")[0],
          },
          label: col.key.split(".").slice(1).join("."),
        });
      }
      continue;
    }
    output.push({
      expr: column.expr,
      label: column.alias ?? describeExpr(column.expr),
    });
  }
  return output;
}

function executeSelect(
  ast: SelectAst,
  db: SqlDatabase,
  stages: TraceStage[] | null,
  outer?: EvalCtx,
): { columns: string[]; rows: SqlValue[][] } {
  const baseCtx: EvalCtx = { env: {}, db, outer };

  /* ---- FROM ---- */
  let rowSet: IRowSet = ast.from
    ? loadFromItem(ast.from, db, outer)
    : { cols: [], rows: [{ env: {} }] };

  if (stages && ast.from) {
    const name =
      ast.from.kind === "table"
        ? ast.from.alias
          ? `${ast.from.name} AS ${ast.from.alias}`
          : ast.from.name
        : `(subquery) AS ${ast.from.alias}`;
    stages.push(
      stageFromRowSet(
        "from",
        "FROM",
        `FROM ${name}`,
        "The engine starts by loading every row of the driving table. No filtering has happened yet.",
        rowSet,
        `${rowSet.rows.length} row(s) loaded`,
      ),
    );
  }

  /* ---- JOIN ---- */
  for (const join of ast.joins) {
    const right = loadFromItem(join.item, db, outer);
    const combinedCols = [...rowSet.cols, ...right.cols];
    const combinedRows: IRow[] = [];
    const notes = new Map<Env, { state: RowState; note?: string }>();
    const matchedRight = new Set<Env>();

    for (const leftRow of rowSet.rows) {
      let matched = false;
      for (const rightRow of right.rows) {
        const env: Env = { ...leftRow.env, ...rightRow.env };
        const keep =
          join.type === "CROSS" || !join.on
            ? true
            : isTrue(evalExpr(join.on, { ...baseCtx, env }));
        if (!keep) continue;
        matched = true;
        matchedRight.add(rightRow.env);
        const row: IRow = { env };
        combinedRows.push(row);
        notes.set(env, { state: "matched", note: "ON matched" });
      }
      if (!matched && (join.type === "LEFT" || join.type === "FULL")) {
        const env: Env = { ...leftRow.env, ...nullEnv(right.cols) };
        combinedRows.push({ env });
        notes.set(env, {
          state: "padded",
          note: "no match → right side NULL-padded",
        });
      }
    }

    if (join.type === "RIGHT" || join.type === "FULL") {
      for (const rightRow of right.rows) {
        if (matchedRight.has(rightRow.env)) continue;
        const env: Env = { ...nullEnv(rowSet.cols), ...rightRow.env };
        combinedRows.push({ env });
        notes.set(env, {
          state: "padded",
          note: "no match → left side NULL-padded",
        });
      }
    }

    rowSet = { cols: combinedCols, rows: combinedRows };

    if (stages) {
      const target =
        join.item.kind === "table"
          ? join.item.alias
            ? `${join.item.name} AS ${join.item.alias}`
            : join.item.name
          : `(subquery) AS ${join.item.alias}`;
      const padded = [...notes.values()].filter(
        (n) => n.state === "padded",
      ).length;
      stages.push(
        stageFromRowSet(
          `join-${stages.length}`,
          `${join.type} JOIN`,
          `${join.type} JOIN ${target}${join.on ? ` ON ${describeExpr(join.on)}` : ""}`,
          join.type === "CROSS"
            ? "Every left row is paired with every right row — no condition is checked."
            : "Each left row is tested against every right row. Outer joins keep the unmatched rows and fill the other side with NULL.",
          rowSet,
          `${rowSet.rows.length} row(s)${padded ? `, ${padded} NULL-padded` : ""}`,
          "matched",
          notes,
        ),
      );
    }
  }

  /* ---- WHERE ---- */
  if (ast.where) {
    const notes = new Map<Env, { state: RowState; note?: string }>();
    const kept: IRow[] = [];
    for (const row of rowSet.rows) {
      const value = evalExpr(ast.where, { ...baseCtx, env: row.env });
      if (isTrue(value)) {
        kept.push(row);
        notes.set(row.env, { state: "kept", note: "TRUE" });
      } else {
        notes.set(row.env, {
          state: "dropped",
          note: value === null ? "UNKNOWN (NULL)" : "FALSE",
        });
      }
    }
    if (stages) {
      stages.push(
        stageFromRowSet(
          "where",
          "WHERE",
          `WHERE ${describeExpr(ast.where)}`,
          "WHERE runs on individual rows, before any grouping. A NULL comparison is UNKNOWN, which is not TRUE, so the row is dropped.",
          rowSet,
          `${kept.length} kept, ${rowSet.rows.length - kept.length} dropped`,
          "kept",
          notes,
        ),
      );
    }
    rowSet = { cols: rowSet.cols, rows: kept };
  }

  /* ---- GROUP BY / aggregates ---- */
  const selectHasAggregate = ast.columns.some((col) => hasAggregate(col.expr));
  const havingHasAggregate = ast.having ? hasAggregate(ast.having) : false;
  const grouped =
    ast.groupBy.length > 0 || selectHasAggregate || havingHasAggregate;

  let groups: { key: SqlValue[]; rows: Env[] }[] = [];
  if (grouped) {
    const buckets = new Map<string, { key: SqlValue[]; rows: Env[] }>();
    if (ast.groupBy.length === 0) {
      buckets.set("__all__", {
        key: [],
        rows: rowSet.rows.map((row) => row.env),
      });
    } else {
      for (const row of rowSet.rows) {
        const key = ast.groupBy.map((expr) =>
          evalExpr(expr, { ...baseCtx, env: row.env }),
        );
        const hash = JSON.stringify(key);
        const bucket = buckets.get(hash);
        if (bucket) bucket.rows.push(row.env);
        else buckets.set(hash, { key, rows: [row.env] });
      }
    }
    groups = [...buckets.values()];

    if (stages && ast.groupBy.length > 0) {
      const labels = ast.groupBy.map(describeExpr);
      stages.push({
        key: "group",
        clause: "GROUP BY",
        title: `GROUP BY ${labels.join(", ")}`,
        detail:
          "Rows collapse into one row per distinct key. After this point you can only select the grouping keys or aggregates of the rest.",
        columns: [...labels, "rows in group"],
        rows: groups.map((group) => ({
          cells: [...group.key, group.rows.length],
          state: "group",
          note: `${group.rows.length} row(s) folded`,
        })),
        summary: `${rowSet.rows.length} row(s) → ${groups.length} group(s)`,
      });
    }
  }

  /* ---- HAVING ---- */
  if (ast.having) {
    const keptGroups: typeof groups = [];
    const traceRows: TraceRow[] = [];
    const labels =
      ast.groupBy.length > 0 ? ast.groupBy.map(describeExpr) : ["(all rows)"];
    for (const group of groups) {
      const env = group.rows[0] ?? {};
      const value = evalExpr(ast.having, {
        ...baseCtx,
        env,
        groupRows: group.rows,
      });
      const keep = isTrue(value);
      if (keep) keptGroups.push(group);
      traceRows.push({
        cells: [
          ...(ast.groupBy.length > 0 ? group.key : ["(all rows)"]),
          group.rows.length,
          formatValue(value),
        ],
        state: keep ? "kept" : "dropped",
        note: keep ? "TRUE" : "FALSE",
      });
    }
    if (stages) {
      stages.push({
        key: "having",
        clause: "HAVING",
        title: `HAVING ${describeExpr(ast.having)}`,
        detail:
          "HAVING filters groups, not rows. This is why an aggregate can appear here but never in WHERE.",
        columns: [...labels, "rows in group", "condition"],
        rows: traceRows,
        summary: `${keptGroups.length} of ${groups.length} group(s) survive`,
      });
    }
    groups = keptGroups;
  }

  /* ---- projection source rows ---- */
  const projectionSources: { env: Env; groupRows?: Env[] }[] = grouped
    ? groups.map((group) => ({
        env: group.rows[0] ?? {},
        groupRows: group.rows,
      }))
    : rowSet.rows.map((row) => ({ env: row.env }));

  /* ---- window functions ---- */
  const windowValues = new Map<Env, Map<number, SqlValue>>();
  for (const source of projectionSources) {
    windowValues.set(source.env, new Map());
  }
  if (ast.windows.length > 0) {
    const envs = projectionSources.map((source) => source.env);
    for (const win of ast.windows) {
      const computed = computeWindow(win, envs, baseCtx);
      for (const [env, value] of computed) {
        windowValues.get(env)?.set(win.id, value);
      }
    }
    if (stages) {
      const labels = ast.windows.map(describeExpr);
      stages.push({
        key: "window",
        clause: "WINDOW",
        title: `Window functions: ${ast.windows.length}`,
        detail:
          "Window functions run after WHERE/GROUP BY/HAVING but before ORDER BY. Unlike GROUP BY they keep every row — they just attach a value computed over a partition.",
        columns: ["row", ...labels],
        rows: projectionSources.map((source, index) => ({
          cells: [
            index + 1,
            ...ast.windows.map(
              (win) => windowValues.get(source.env)?.get(win.id) ?? null,
            ),
          ],
          state: "matched",
        })),
        summary: `${projectionSources.length} row(s) kept, ${ast.windows.length} window value(s) attached`,
      });
    }
  }

  /* ---- SELECT ---- */
  const outputs = expandSelectColumns(ast, rowSet);
  let resultRows: SqlValue[][] = projectionSources.map((source) =>
    outputs.map((output) =>
      evalExpr(output.expr, {
        ...baseCtx,
        env: source.env,
        groupRows: source.groupRows,
        windowValues: windowValues.get(source.env),
      }),
    ),
  );
  const columns = outputs.map((output) => output.label);

  if (stages) {
    stages.push({
      key: "select",
      clause: "SELECT",
      title: `SELECT ${columns.join(", ")}`,
      detail:
        "Only now are the output columns computed. That is why a SELECT alias cannot be used in WHERE — it does not exist yet.",
      columns,
      rows: resultRows.map((cells) => ({ cells, state: "neutral" })),
      summary: `${resultRows.length} row(s) projected onto ${columns.length} column(s)`,
    });
  }

  /* ---- DISTINCT ---- */
  if (ast.distinct) {
    const seen = new Set<string>();
    const deduped: SqlValue[][] = [];
    const traceRows: TraceRow[] = [];
    for (const row of resultRows) {
      const hash = JSON.stringify(row);
      if (seen.has(hash)) {
        traceRows.push({ cells: row, state: "dropped", note: "duplicate" });
        continue;
      }
      seen.add(hash);
      deduped.push(row);
      traceRows.push({ cells: row, state: "kept" });
    }
    if (stages) {
      stages.push({
        key: "distinct",
        clause: "DISTINCT",
        title: "SELECT DISTINCT",
        detail:
          "Duplicates are removed from the projected rows — after SELECT, so DISTINCT sees the output columns only.",
        columns,
        rows: traceRows,
        summary: `${deduped.length} unique of ${resultRows.length}`,
      });
    }
    resultRows = deduped;
  }

  /* ---- ORDER BY ---- */
  if (ast.orderBy.length > 0) {
    const indexed = resultRows.map((row, index) => ({
      row,
      source: projectionSources[index] ?? projectionSources[0],
    }));
    indexed.sort((a, b) => {
      for (const item of ast.orderBy) {
        const aliasIndex = columns.findIndex(
          (name) =>
            item.expr.k === "col" &&
            !item.expr.table &&
            name.toLowerCase() === item.expr.name.toLowerCase(),
        );
        let av: SqlValue;
        let bv: SqlValue;
        if (aliasIndex >= 0) {
          av = a.row[aliasIndex];
          bv = b.row[aliasIndex];
        } else {
          av = evalExpr(item.expr, {
            ...baseCtx,
            env: a.source?.env ?? {},
            groupRows: a.source?.groupRows,
            windowValues: windowValues.get(a.source?.env ?? {}),
          });
          bv = evalExpr(item.expr, {
            ...baseCtx,
            env: b.source?.env ?? {},
            groupRows: b.source?.groupRows,
            windowValues: windowValues.get(b.source?.env ?? {}),
          });
        }
        const cmp = compareValues(av, bv);
        if (cmp !== 0) return item.dir === "DESC" ? -cmp : cmp;
      }
      return 0;
    });
    resultRows = indexed.map((entry) => entry.row);
    if (stages) {
      stages.push({
        key: "order",
        clause: "ORDER BY",
        title: `ORDER BY ${ast.orderBy.map((o) => `${describeExpr(o.expr)} ${o.dir}`).join(", ")}`,
        detail:
          "Sorting is almost the last thing that happens, which is why ORDER BY is allowed to use SELECT aliases.",
        columns,
        rows: resultRows.map((cells) => ({ cells, state: "neutral" })),
        summary: `${resultRows.length} row(s) sorted`,
      });
    }
  }

  /* ---- LIMIT / OFFSET ---- */
  if (ast.limit !== undefined || ast.offset !== undefined) {
    const start = ast.offset ?? 0;
    const end = ast.limit === undefined ? undefined : start + ast.limit;
    const sliced = resultRows.slice(start, end);
    if (stages) {
      stages.push({
        key: "limit",
        clause: "LIMIT",
        title: `LIMIT ${ast.limit ?? "∞"}${ast.offset ? ` OFFSET ${ast.offset}` : ""}`,
        detail:
          "The very last step. The database still had to produce and sort the rows it is now throwing away.",
        columns,
        rows: resultRows.map((cells, index) => ({
          cells,
          state:
            index >= start && (end === undefined || index < end)
              ? "kept"
              : "dropped",
        })),
        summary: `${sliced.length} row(s) returned`,
      });
    }
    resultRows = sliced;
  }

  return { columns, rows: resultRows };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function runQuery(sql: string, db: SqlDatabase): QueryResult {
  const ast = new Parser(sql).parseQuery();
  const stages: TraceStage[] = [];
  const { columns, rows } = executeSelect(ast, db, stages);
  stages.push({
    key: "result",
    clause: "RESULT",
    title: "Final result set",
    detail: "This is exactly what the client receives.",
    columns,
    rows: rows.map((cells) => ({ cells, state: "kept" })),
    summary: `${rows.length} row(s) × ${columns.length} column(s)`,
  });
  return { columns, rows, stages };
}
