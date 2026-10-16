// Python WebAssembly Worker via Pyodide v0.27.2
// Runs entirely inside Web Worker without blocking main UI thread.

interface PyodideInterface {
  runPythonAsync(code: string): Promise<any>;
  globals: {
    get(key: string): any;
    set(key: string, val: any): void;
  };
}

let pyodideInstance: PyodideInterface | null = null;
let isInitializing = false;

async function getPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) return pyodideInstance;

  if (isInitializing) {
    while (isInitializing) {
      await new Promise((r) => setTimeout(r, 50));
    }
    if (pyodideInstance) return pyodideInstance;
  }

  isInitializing = true;
  try {
    // Dynamic import of Pyodide ES Module from official high-speed Cloudflare/jsDelivr CDN
    const importUrl = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs";
    const dynamicImport = new Function("url", "return import(url)");
    const { loadPyodide } = await dynamicImport(importUrl);

    const py = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/",
    });

    // Initialize core standard library helpers
    await py.runPythonAsync(`
import sys
import io
import traceback
`);

    pyodideInstance = py;
    return py;
  } finally {
    isInitializing = false;
  }
}

self.onmessage = async (event: MessageEvent) => {
  const { type, payload, id } = event.data;

  if (type === "init") {
    try {
      await getPyodide();
      self.postMessage({ type: "init_success", id });
    } catch (err: any) {
      self.postMessage({
        type: "init_error",
        id,
        error: err?.message || String(err),
      });
    }
    return;
  }

  if (type === "execute") {
    const startTime = performance.now();
    try {
      const py = await getPyodide();
      const { sourceCode, stdin = "" } = payload;

      // Provide standard input adapter and capture stdout/stderr
      py.globals.set("__raw_code__", sourceCode);
      py.globals.set("__raw_stdin__", stdin);

      const runnerScript = `
import sys
import io
import traceback

sys.stdin = io.StringIO(__raw_stdin__)
_out_stream = io.StringIO()
_err_stream = io.StringIO()
sys.stdout = _out_stream
sys.stderr = _err_stream

_exec_error = None
_exit_code = 0

try:
    _user_globals = {
        "__name__": "__main__",
        "__doc__": None,
        "__package__": None,
    }
    exec(compile(__raw_code__, "<user_code>", "exec"), _user_globals)
except SystemExit as se:
    _exit_code = se.code if isinstance(se.code, int) else (0 if se.code is None else 1)
except Exception as e:
    _exit_code = 1
    _exec_error = traceback.format_exc()

_captured_stdout = _out_stream.getvalue()
_captured_stderr = _err_stream.getvalue()
if _exec_error:
    _captured_stderr += ("\\n" if _captured_stderr else "") + _exec_error
`;

      await py.runPythonAsync(runnerScript);

      const stdout = String(py.globals.get("_captured_stdout") || "");
      const stderr = String(py.globals.get("_captured_stderr") || "");
      const exitCode = Number(py.globals.get("_exit_code") || 0);
      const executionTimeMs = Math.round(performance.now() - startTime);

      let status: "success" | "runtime_error" = "success";
      if (exitCode !== 0 || stderr.includes("Traceback (most recent call last):")) {
        status = "runtime_error";
      }

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
    } catch (err: any) {
      const executionTimeMs = Math.round(performance.now() - startTime);
      self.postMessage({
        type: "execute_result",
        id,
        result: {
          stdout: "",
          stderr: err?.message || String(err),
          exitCode: 1,
          executionTimeMs,
          status: "runtime_error",
        },
      });
    }
  }
};
