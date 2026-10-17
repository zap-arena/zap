// Java Browser-Side Execution Worker
// Executes 100% locally in the browser with zero backend requirements.

class JavaScanner {
  private tokens: string[];
  private index = 0;

  constructor(input: string = "") {
    const trimmed = String(input).trim();
    this.tokens = trimmed.length > 0 ? trimmed.split(/\s+/) : [];
  }

  hasNext(): boolean {
    return this.index < this.tokens.length;
  }

  hasNextInt(): boolean {
    if (!this.hasNext()) return false;
    return /^-?\d+$/.test(this.tokens[this.index]);
  }

  hasNextDouble(): boolean {
    if (!this.hasNext()) return false;
    return !isNaN(Number(this.tokens[this.index]));
  }

  next(): string {
    if (!this.hasNext()) {
      throw new Error("NoSuchElementException: No more tokens available in standard input.");
    }
    return this.tokens[this.index++];
  }

  nextInt(): number {
    const val = parseInt(this.next(), 10);
    if (isNaN(val)) {
      throw new Error("InputMismatchException: Expected integer input.");
    }
    return val;
  }

  nextLong(): number {
    return this.nextInt();
  }

  nextDouble(): number {
    const val = parseFloat(this.next());
    if (isNaN(val)) {
      throw new Error("InputMismatchException: Expected floating point input.");
    }
    return val;
  }

  hasNextLine(): boolean {
    return this.hasNext();
  }

  nextBoolean(): boolean {
    const s = this.next().toLowerCase();
    if (s === "true") return true;
    if (s === "false") return false;
    throw new Error("InputMismatchException: Expected boolean input.");
  }

  nextLine(): string {
    if (!this.hasNext()) return "";
    return this.tokens.slice(this.index++).join(" ");
  }

  close(): void {
    // Standard Java Scanner close method
  }

  reset(): this {
    return this;
  }
}

class JavaArrayList<T> {
  private items: T[] = [];

  constructor(initial?: T[]) {
    if (initial && Array.isArray(initial)) {
      this.items = [...initial];
    }
  }

  add(item: T): boolean {
    this.items.push(item);
    return true;
  }

  get(index: number): T {
    return this.items[index];
  }

  set(index: number, item: T): T {
    const old = this.items[index];
    this.items[index] = item;
    return old;
  }

  remove(index: number): T {
    const [removed] = this.items.splice(index, 1);
    return removed;
  }

  size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  contains(item: T): boolean {
    return this.items.includes(item);
  }

  clear(): void {
    this.items = [];
  }

  sort(comparator?: (a: T, b: T) => number): void {
    if (comparator) {
      this.items.sort(comparator);
    } else {
      this.items.sort();
    }
  }

  toArray(): T[] {
    return [...this.items];
  }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }
}

class JavaHashMap<K, V> {
  private map = new Map<K, V>();

  put(key: K, value: V): V | null {
    const old = this.map.get(key) ?? null;
    this.map.set(key, value);
    return old;
  }

  get(key: K): V | null {
    return this.map.get(key) ?? null;
  }

  getOrDefault(key: K, defaultValue: V): V {
    return this.map.has(key) ? (this.map.get(key) as V) : defaultValue;
  }

  containsKey(key: K): boolean {
    return this.map.has(key);
  }

  remove(key: K): V | null {
    const old = this.map.get(key) ?? null;
    this.map.delete(key);
    return old;
  }

  size(): number {
    return this.map.size;
  }

  isEmpty(): boolean {
    return this.map.size === 0;
  }

  keySet(): K[] {
    return Array.from(this.map.keys());
  }

  values(): V[] {
    return Array.from(this.map.values());
  }
}

class JavaHashSet<T> {
  private set = new Set<T>();

  add(item: T): boolean {
    const had = this.set.has(item);
    this.set.add(item);
    return !had;
  }

  contains(item: T): boolean {
    return this.set.has(item);
  }

  remove(item: T): boolean {
    return this.set.delete(item);
  }

  size(): number {
    return this.set.size;
  }

  isEmpty(): boolean {
    return this.set.size === 0;
  }

  [Symbol.iterator]() {
    return this.set[Symbol.iterator]();
  }
}

function transpileJavaToJs(sourceCode: string): string {
  let code = sourceCode;

  // 1. Strip package and import statements
  code = code.replace(/package\s+[\w.]+;/g, "");
  code = code.replace(/import\s+[\w.*]+;/g, "");

  // 1b. Support try-with-resources: try (Scanner sc = new Scanner(...)) { -> let sc = new Scanner(System.in); try {
  code = code.replace(
    /try\s*\(\s*(?:Scanner\s+)?(\w+)\s*=\s*new\s+Scanner\([^)]*\)\s*\)\s*\{/g,
    "let $1 = new Scanner(System.in); try {"
  );

  // 2. Convert Java lambdas: (a, b) -> expr ==> (a, b) => expr
  code = code.replace(/(\([^)]*\)|\w+)\s*->\s*/g, "$1 => ");

  // 3. Convert static method declarations first so 'static void foo()' becomes 'function foo()'
  code = code.replace(
    /(?:public|private|protected)?\s*static\s+(?:void|int|long|double|float|boolean|char|String|[\w\[\]<>]+)\s+(\w+)\s*\(([^)]*)\)\s*\{/g,
    (_, methodName, argsList) => {
      if (methodName === "main") {
        return "function __main__() {";
      }
      const cleanArgs = argsList
        .split(",")
        .map((a: string) => a.trim().split(/\s+/).pop())
        .filter(Boolean)
        .join(", ");
      return `function ${methodName}(${cleanArgs}) {`;
    }
  );

  // 4. Convert non-static method declarations: public void foo(...) {
  code = code.replace(
    /(?:public|private|protected)\s+(?:void|int|long|double|float|boolean|char|String|[\w\[\]<>]+)\s+(\w+)\s*\(([^)]*)\)\s*\{/g,
    (_, methodName, argsList) => {
      const cleanArgs = argsList
        .split(",")
        .map((a: string) => a.trim().split(/\s+/).pop())
        .filter(Boolean)
        .join(", ");
      return `function ${methodName}(${cleanArgs}) {`;
    }
  );

  // 5. Strip 'static' keyword from variable declarations: static int timer = 0; -> int timer = 0;
  code = code.replace(/\bstatic\s+/g, "");

  // 6. Convert new array initializers: new int[]{a, b} -> [a, b]
  code = code.replace(
    /new\s+(?:int|long|double|float|boolean|char|String)\s*\[\s*\]\s*\{([^}]+)\}/g,
    "[$1]"
  );

  // 7. Convert 2D array allocations: new int[r][c] -> Array.from({length: r}, () => new Array(c).fill(0))
  code = code.replace(
    /new\s+(?:int|long|double|float)\s*\[([^\]]+)\]\s*\[([^\]]+)\]/g,
    "Array.from({ length: $1 }, () => new Array($2).fill(0))"
  );

  // 8. Convert 1D array allocations: new int[n] -> new Array(n).fill(0)
  code = code.replace(
    /new\s+(?:int|long|double|float)\s*\[([^\]]+)\]/g,
    "new Array($1).fill(0)"
  );
  code = code.replace(
    /new\s+(?:boolean)\s*\[([^\]]+)\]/g,
    "new Array($1).fill(false)"
  );
  code = code.replace(
    /new\s+(?:char|String|Object|[\w<>]+)\s*\[([^\]]+)\]/g,
    "new Array($1).fill(null)"
  );

  // 9. Convert generic collection constructors: new ArrayList<>() / new HashMap<>()
  code = code.replace(/new\s+ArrayList(?:<[^>]*>)?\s*\(([^)]*)\)/g, "new ArrayList($1)");
  code = code.replace(/new\s+HashMap(?:<[^>]*>)?\s*\(([^)]*)\)/g, "new HashMap($1)");
  code = code.replace(/new\s+HashSet(?:<[^>]*>)?\s*\(([^)]*)\)/g, "new HashSet($1)");
  code = code.replace(/new\s+LinkedList(?:<[^>]*>)?\s*\(([^)]*)\)/g, "new LinkedList($1)");
  code = code.replace(/new\s+Stack(?:<[^>]*>)?\s*\(([^)]*)\)/g, "new Stack($1)");

  // 10. Convert enhanced for loop: for (int[] b : bridges) -> for (let b of bridges)
  code = code.replace(
    /for\s*\(\s*(?:[\w\[\]<>]+\s+)?(\w+)\s*:\s*([^)]+)\)/g,
    "for (let $1 of $2)"
  );

  // 11. Convert standard for loops: for (int i = 0; -> for (let i = 0;
  code = code.replace(
    /for\s*\(\s*(?:int|long|double|float|char|var)\s+(\w+)\s*=/g,
    "for (let $1 ="
  );

  // 12. Generic variable declarations (including nested like List<List<Integer>> adj;)
  code = code.replace(
    /\b(?:List|ArrayList|Map|HashMap|Set|HashSet|Queue|Deque|Stack)\s*<[^;=]+?>\s*(\[\])*\s+(\w+)\s*=/g,
    "let $2 ="
  );
  code = code.replace(
    /\b(?:List|ArrayList|Map|HashMap|Set|HashSet|Queue|Deque|Stack)\s*<[^;=]+?>\s*(\[\])*\s+([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*)\s*;/g,
    "let $2;"
  );

  // 13. Primitive and standard variable declarations
  code = code.replace(
    /\b(?:int|long|double|float|boolean|char|String|Scanner|var)\s*(\[\])*\s+(\w+)\s*=/g,
    "let $2 ="
  );
  code = code.replace(
    /\b(?:int|long|double|float|boolean|char|String)\s*(\[\])*\s+([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*)\s*;/g,
    "let $2;"
  );

  // 14. String length: .length() -> .length
  code = code.replace(/\.length\(\)/g, ".length");

  // 15. Strip class wrappers
  code = code.replace(/(?:public\s+|private\s+)?class\s+\w+\s*\{/g, "/* class start */");

  // Balance class closing braces
  const classMatches = (sourceCode.match(/class\s+\w+\s*\{/g) || []).length;
  for (let i = 0; i < classMatches; i++) {
    const lastBrace = code.lastIndexOf("}");
    if (lastBrace !== -1) {
      code = code.slice(0, lastBrace) + "/* class end */" + code.slice(lastBrace + 1);
    }
  }

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

    const System = {
      in: stdin,
      out: {
        print: (...args: any[]) => {
          stdout += args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" ");
        },
        println: (...args: any[]) => {
          if (args.length === 0) {
            stdout += "\n";
          } else {
            stdout +=
              args
                .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
                .join(" ") + "\n";
          }
        },
        printf: (format: string, ...args: any[]) => {
          let res = String(format);
          for (const arg of args) {
            res = res.replace(/%[dsf]/, String(arg));
          }
          stdout += res;
        },
      },
      err: {
        println: (...args: any[]) => {
          stderr += args.join(" ") + "\n";
        },
        print: (...args: any[]) => {
          stderr += args.join(" ");
        },
      },
    };

    const Arrays = {
      sort: (arr: any[], comparator?: any) => {
        if (Array.isArray(arr)) {
          if (comparator) {
            arr.sort(comparator);
          } else {
            arr.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
          }
        }
      },
      fill: (arr: any[], val: any) => {
        if (Array.isArray(arr)) {
          arr.fill(val);
        }
      },
      toString: (arr: any[]) => JSON.stringify(arr),
      equals: (a: any[], b: any[]) => JSON.stringify(a) === JSON.stringify(b),
    };

    const Collections = {
      sort: (list: any, comparator?: any) => {
        if (list && typeof list.sort === "function") {
          list.sort(comparator);
        }
      },
      reverse: (list: any) => {
        if (list && typeof list.toArray === "function") {
          const arr = list.toArray().reverse();
          list.clear();
          arr.forEach((x: any) => list.add(x));
        }
      },
      max: (list: any) => Math.max(...(list.toArray ? list.toArray() : list)),
      min: (list: any) => Math.min(...(list.toArray ? list.toArray() : list)),
    };

    const Integer = {
      parseInt: (s: string, radix: number = 10) => parseInt(s, radix),
      valueOf: (s: string) => parseInt(s, 10),
      compare: (a: number, b: number) => (a < b ? -1 : a > b ? 1 : 0),
      max: (a: number, b: number) => Math.max(a, b),
      min: (a: number, b: number) => Math.min(a, b),
      MAX_VALUE: 2147483647,
      MIN_VALUE: -2147483648,
    };

    const Long = {
      parseLong: (s: string, radix: number = 10) => parseInt(s, radix),
      valueOf: (s: string) => parseInt(s, 10),
      compare: (a: number, b: number) => (a < b ? -1 : a > b ? 1 : 0),
      max: (a: number, b: number) => Math.max(a, b),
      min: (a: number, b: number) => Math.min(a, b),
      MAX_VALUE: Number.MAX_SAFE_INTEGER,
      MIN_VALUE: Number.MIN_SAFE_INTEGER,
    };

    const Double = {
      parseDouble: (s: string) => parseFloat(s),
      valueOf: (s: string) => parseFloat(s),
      compare: (a: number, b: number) => (a < b ? -1 : a > b ? 1 : 0),
      max: (a: number, b: number) => Math.max(a, b),
      min: (a: number, b: number) => Math.min(a, b),
      MAX_VALUE: Number.MAX_VALUE,
      MIN_VALUE: Number.MIN_VALUE,
    };

    try {
      const transpiled = transpileJavaToJs(sourceCode);
      const executionScript = `
        ${transpiled}
        if (typeof __main__ === "function") {
          __main__();
        }
      `;

      const runFn = new Function(
        "System",
        "Scanner",
        "Arrays",
        "Collections",
        "ArrayList",
        "List",
        "HashMap",
        "Map",
        "HashSet",
        "Set",
        "Integer",
        "Long",
        "Double",
        "Math",
        executionScript
      );

      runFn(
        System,
        JavaScanner,
        Arrays,
        Collections,
        JavaArrayList,
        JavaArrayList,
        JavaHashMap,
        JavaHashMap,
        JavaHashSet,
        JavaHashSet,
        Integer,
        Long,
        Double,
        Math
      );
    } catch (err: any) {
      exitCode = 1;
      const errorMsg = err?.message || String(err);
      if (
        errorMsg.includes("Unexpected token") ||
        errorMsg.includes("SyntaxError") ||
        errorMsg.includes("is not defined")
      ) {
        status = "compile_error";
        stderr = `Compilation Error:\n${errorMsg}`;
      } else {
        status = "runtime_error";
        stderr = `Runtime Error:\n${errorMsg}`;
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
