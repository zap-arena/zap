// C++ Browser-Side Execution Worker
// Supports modern C++ (vector, algorithms, cin/cout, pair, queue, stack) in-browser
// Executes 100% locally with zero backend requirements.

// @ts-expect-error - JSCPP is a JS C++ interpreter package
import JSCPP from "JSCPP";

export function cppDefaultCompare(a: any, b: any): number {
  if (a === b) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  // CppPair comparison (lexicographical: first, then second)
  if (
    typeof a === "object" &&
    "first" in a &&
    "second" in a &&
    typeof b === "object" &&
    "first" in b &&
    "second" in b
  ) {
    if (a.first < b.first) return -1;
    if (a.first > b.first) return 1;
    if (a.second < b.second) return -1;
    if (a.second > b.second) return 1;
    return 0;
  }

  // Nested Array / Vector comparison (lexicographical)
  if (Array.isArray(a) && Array.isArray(b)) {
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const cmp = cppDefaultCompare(a[i], b[i]);
      if (cmp !== 0) return cmp;
    }
    return a.length - b.length;
  }

  // Standard numbers, strings, and types (C++ strict ASCII / numeric <)
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export class CppVector<T = any> extends Array<T> {
  constructor(sizeOrInit?: number | T[] | CppVector<T>, defaultVal?: T) {
    super();
    if (typeof sizeOrInit === "number") {
      for (let i = 0; i < sizeOrInit; i++) {
        if (defaultVal !== undefined) {
          if (defaultVal instanceof CppVector) {
            this.push(new CppVector(defaultVal) as any);
          } else {
            this.push(defaultVal);
          }
        } else {
          this.push(0 as any);
        }
      }
    } else if (Array.isArray(sizeOrInit)) {
      for (const item of sizeOrInit) {
        this.push(item);
      }
    }
  }

  push_back(val: T): void {
    this.push(val);
  }

  pop_back(): T | undefined {
    return this.pop();
  }

  size(): number {
    return this.length;
  }

  empty(): boolean {
    return this.length === 0;
  }

  clear(): void {
    this.length = 0;
  }

  front(): T {
    return this[0];
  }

  back(): T {
    return this[this.length - 1];
  }

  resize(n: number, val: T = 0 as any): void {
    while (this.length < n) this.push(val);
    if (this.length > n) this.length = n;
  }

  assign(n: number, val: T = 0 as any): void {
    this.length = 0;
    for (let i = 0; i < n; i++) {
      if (val instanceof CppVector) {
        this.push(new CppVector(val) as any);
      } else {
        this.push(val);
      }
    }
  }

  sort(comparator?: (a: any, b: any) => any): this {
    if (comparator) {
      super.sort((a, b) => {
        const res = comparator(a, b);
        if (typeof res === "boolean") {
          if (res) return -1;
          if (comparator(b, a)) return 1;
          return 0;
        }
        return res;
      });
    } else {
      super.sort(cppDefaultCompare);
    }
    return this;
  }

  reverse(): this {
    super.reverse();
    return this;
  }

  begin() {
    return 0;
  }

  end() {
    return this.length;
  }
}

class CppPair<T1 = any, T2 = any> {
  first: T1;
  second: T2;
  constructor(first: T1, second: T2) {
    this.first = first;
    this.second = second;
  }
}

function make_pair<T1, T2>(a: T1, b: T2) {
  return new CppPair(a, b);
}

class CppQueue<T = any> {
  private items: T[] = [];
  push(x: T) {
    this.items.push(x);
  }
  pop() {
    return this.items.shift();
  }
  front() {
    return this.items[0];
  }
  back() {
    return this.items[this.items.length - 1];
  }
  empty() {
    return this.items.length === 0;
  }
  size() {
    return this.items.length;
  }
}

class CppStack<T = any> {
  private items: T[] = [];
  push(x: T) {
    this.items.push(x);
  }
  pop() {
    return this.items.pop();
  }
  top() {
    return this.items[this.items.length - 1];
  }
  empty() {
    return this.items.length === 0;
  }
  size() {
    return this.items.length;
  }
}

class CppCin {
  private tokens: string[];
  private index = 0;

  constructor(input: string = "") {
    const trimmed = String(input).trim();
    this.tokens = trimmed.length > 0 ? trimmed.split(/\s+/) : [];
  }

  next(): any {
    if (this.index >= this.tokens.length) return 0;
    const tok = this.tokens[this.index++];
    const num = Number(tok);
    return !isNaN(num) && tok !== "" ? num : tok;
  }

  nextInt(): number {
    if (this.index >= this.tokens.length) return 0;
    return parseInt(this.tokens[this.index++], 10) || 0;
  }

  nextFloat(): number {
    if (this.index >= this.tokens.length) return 0;
    return parseFloat(this.tokens[this.index++]) || 0;
  }

  nextString(): string {
    if (this.index >= this.tokens.length) return "";
    return this.tokens[this.index++];
  }

  getline(): string {
    if (this.index >= this.tokens.length) return "";
    return this.tokens.slice(this.index++).join(" ");
  }

  eof(): boolean {
    return this.index >= this.tokens.length;
  }
}

function transpileCppToJs(cppCode: string): string {
  let code = cppCode;

  // 1. Strip includes & namespaces
  code = code.replace(/#include\s*<[^>]+>/g, "");
  code = code.replace(/#include\s*"[^"]+"/g, "");
  code = code.replace(/using\s+namespace\s+std\s*;/g, "");
  code = code.replace(/\bstd::/g, "");

  // Fast I/O statements
  code = code.replace(/ios_base::sync_with_stdio\s*\([^)]*\)\s*;/g, "");
  code = code.replace(/cin\.tie\s*\([^)]*\)\s*;/g, "");

  // 2. Convert lambdas: [](params) { ... } -> (params) => { ... }
  code = code.replace(
    /\[[^\]]*\]\s*\(([^)]*)\)\s*(?:->\s*[\w<>]+)?\s*\{/g,
    "($1) => {"
  );

  // 3. Main function: int main(...) { -> function __main__() {
  code = code.replace(
    /(?:int|void)\s+main\s*\([^)]*\)\s*\{/g,
    "function __main__() {"
  );

  // 4. Convert function declarations
  code = code.replace(
    /(?:void|int|long\s+long|long|double|float|bool|char|string|auto|vector\s*<[^;=]+?>)\s+(\w+)\s*\(([^)]*)\)\s*\{/g,
    (match, fnName, args) => {
      if (
        fnName === "__main__" ||
        fnName === "if" ||
        fnName === "while" ||
        fnName === "for" ||
        fnName === "switch"
      ) {
        return match;
      }
      const cleanArgs = args
        .split(",")
        .map((a: string) => {
          const parts = a.trim().split(/\s+/);
          const name = parts.pop() || "";
          return name.replace(/^[*&]+/, "");
        })
        .filter(Boolean)
        .join(", ");
      return `function ${fnName}(${cleanArgs}) {`;
    }
  );

  // 5. Range-based for: for (int x : v) or for (const auto& x : v)
  code = code.replace(
    /for\s*\(\s*(?:const\s+)?(?:[\w<>]+(?:\s*[*&]+)?)\s+(\w+)\s*:\s*([^)]+)\)/g,
    "for (let $1 of $2)"
  );

  // 6. Standard for loop: for (int i = 0; -> for (let i = 0;
  code = code.replace(
    /for\s*\(\s*(?:int|long\s+long|long|double|float|char|auto)\s+(\w+)\s*=/g,
    "for (let $1 ="
  );

  // 7. Vector initializers with braces: vector<int> v = {1, 2, 3}; -> let v = new CppVector([1, 2, 3]);
  code = code.replace(
    /vector\s*<[^>]+>\s+(\w+)\s*=\s*\{([^}]+)\};/g,
    "let $1 = new CppVector([$2]);"
  );

  // 8. Nested vector expressions: vector<int>() or vector<int>(n, 0)
  code = code.replace(/vector\s*<[^>]+>\s*\(([^)]*)\)/g, "new CppVector($1)");

  // 9. Vector declarations with constructor: vector<int> v(n, 0);
  code = code.replace(
    /vector\s*<.+?>\s+(\w+)\s*\(([^;]+)\);/g,
    "let $1 = new CppVector($2);"
  );

  // 10. Multiple vector declarations: vector<int> a, b;
  code = code.replace(
    /vector\s*<[^;=]+?>\s+([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*)\s*;/g,
    (_, vars) => {
      const varList = vars
        .split(",")
        .map((v: string) => v.trim())
        .filter(Boolean);
      return (
        "let " + varList.map((v: string) => `${v} = new CppVector()`).join(", ") + ";"
      );
    }
  );

  // 11. Vector assignment: vector<int> v = ...
  code = code.replace(/vector\s*<[^>]+>\s+(\w+)\s*=/g, "let $1 =");

  // 12. STL sort & reverse
  code = code.replace(
    /sort\s*\(\s*(\w+)\.begin\(\)\s*,\s*\1\.end\(\)\s*(?:,\s*([^)]+))?\)/g,
    (_, vName, cmp) => {
      return cmp ? `${vName}.sort(${cmp})` : `${vName}.sort()`;
    }
  );
  code = code.replace(
    /reverse\s*\(\s*(\w+)\.begin\(\)\s*,\s*\1\.end\(\)\s*\)/g,
    "$1.reverse()"
  );

  // 13. cin >> ...
  code = code.replace(/cin\s*>>\s*([^;]+);/g, (_, stream) => {
    const parts = stream
      .split(/>>/)
      .map((s: string) => s.trim())
      .filter(Boolean);
    return parts.map((p: string) => `${p} = cin.next()`).join("; ") + ";";
  });

  // 14. getline(cin, s);
  code = code.replace(
    /getline\s*\(\s*cin\s*,\s*(\w+)\s*\);/g,
    "$1 = cin.getline();"
  );

  // 15. cout << ... ;
  code = code.replace(/cout\s*<<\s*([^;]+);/g, (_, stream) => {
    const parts = stream
      .split(/<<(?=(?:[^"]*"[^"]*")*[^"]*$)/)
      .map((s: string) => s.trim())
      .filter(Boolean);
    return `cout.print(${parts.join(", ")});`;
  });

  // 16. String declaration without init: string s;
  code = code.replace(/\bstring\s+([a-zA-Z_]\w*)\s*;/g, 'let $1 = "";');

  // 17. Basic types variable declarations
  code = code.replace(
    /\b(?:int|long\s+long|long|double|float|bool|char|string|auto)\s+(\w+)\s*=/g,
    "let $1 ="
  );
  code = code.replace(
    /\b(?:int|long\s+long|long|double|float|bool|char|string|auto)\s+([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*)\s*;/g,
    "let $1;"
  );

  return code;
}

self.onmessage = (event: MessageEvent) => {
  const { type, id, payload } = event.data;

  if (type === "init") {
    self.postMessage({
      type: "init_success",
      id,
    });
    return;
  }

  if (type === "execute") {
    const { sourceCode = "", stdin = "" } = payload || {};
    const startTime = performance.now();
    let stdout = "";
    let stderr = "";
    let exitCode = 0;
    let status: "success" | "runtime_error" | "compile_error" = "success";

    const isModernCpp =
      /vector|pair|queue|stack|auto|sort|reverse|cout|cin|string|algorithm/i.test(
        sourceCode
      );

    let executed = false;

    // First attempt: if modern C++ (vector, cin, cout, etc.), execute via C++ in-browser engine
    if (isModernCpp) {
      try {
        const endl = "\n";
        const cin = new CppCin(stdin);
        const cout = {
          print: (...args: any[]) => {
            for (const a of args) {
              if (a === "\n" || a === endl) {
                stdout += "\n";
              } else if (typeof a === "object" && a !== null) {
                stdout += Array.isArray(a) ? a.join(" ") : JSON.stringify(a);
              } else {
                stdout += String(a);
              }
            }
          },
        };

        const min = (...args: any[]) => Math.min(...args);
        const max = (...args: any[]) => Math.max(...args);
        const abs = (x: any) => Math.abs(x);
        const sqrt = (x: any) => Math.sqrt(x);
        const pow = (x: any, y: any) => Math.pow(x, y);
        const to_string = (x: any) => String(x);
        const stoi = (s: any) => parseInt(String(s), 10) || 0;
        const stol = (s: any) => parseInt(String(s), 10) || 0;
        const stoll = (s: any) => parseInt(String(s), 10) || 0;
        const stod = (s: any) => parseFloat(String(s)) || 0;
        const swap = (a: any, b: any) => [b, a];

        const transpiled = transpileCppToJs(sourceCode);
        const executionScript = `
          ${transpiled}
          if (typeof __main__ === "function") {
            __main__();
          }
        `;

        const runFn = new Function(
          "CppVector",
          "CppPair",
          "make_pair",
          "CppQueue",
          "CppStack",
          "cin",
          "cout",
          "endl",
          "min",
          "max",
          "abs",
          "sqrt",
          "pow",
          "to_string",
          "stoi",
          "stol",
          "stoll",
          "stod",
          "swap",
          executionScript
        );

        runFn(
          CppVector,
          CppPair,
          make_pair,
          CppQueue,
          CppStack,
          cin,
          cout,
          endl,
          min,
          max,
          abs,
          sqrt,
          pow,
          to_string,
          stoi,
          stol,
          stoll,
          stod,
          swap
        );

        executed = true;
      } catch (err: any) {
        // If transpilation failed, fall back to trying JSCPP below
        const errorMsg = err?.message || String(err);
        stderr = errorMsg;
      }
    }

    // Fallback to JSCPP if not executed by modern C++ engine
    if (!executed) {
      try {
        if (JSCPP && JSCPP.includes) {
          const dummyHeader = { load: () => {} };
          const headers = [
            "string",
            "vector",
            "algorithm",
            "map",
            "set",
            "queue",
            "stack",
            "bits/stdc++.h",
          ];
          for (const h of headers) {
            if (!JSCPP.includes[h]) {
              JSCPP.includes[h] = dummyHeader;
            }
          }
        }

        const config = {
          stdio: {
            write: (s: string) => {
              stdout += s;
            },
          },
          maxTimeout: 4500,
        };

        const result = JSCPP.run(sourceCode || "", stdin || "", config);
        exitCode = typeof result === "number" ? result : 0;
        stderr = "";
      } catch (err: any) {
        exitCode = 1;
        const errorMsg = err?.message || String(err);
        if (
          errorMsg.includes("Parsing Failure") ||
          errorMsg.includes("type") ||
          errorMsg.includes("syntax")
        ) {
          status = "compile_error";
          stderr = `Compilation Error:\n${errorMsg}`;
        } else {
          status = "runtime_error";
          stderr = `Runtime Error:\n${errorMsg}`;
        }
      }
    }

    const executionTimeMs = Math.round(performance.now() - startTime);

    self.postMessage({
      type: "execute_result",
      id,
      result: {
        stdout,
        stderr,
        exitCode,
        executionTimeMs,
        status,
      },
    });
  }
};
