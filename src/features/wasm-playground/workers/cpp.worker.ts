// C++ Browser-Side Execution Worker via JSCPP
// Executes 100% locally in the browser with zero backend requirements.

// @ts-expect-error - JSCPP is a JS C++ interpreter package
import JSCPP from "JSCPP";

// Ensure common standard headers don't cause fatal errors if included
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
    const { sourceCode, stdin = "" } = payload || {};
    const startTime = performance.now();
    let stdout = "";
    let stderr = "";
    let exitCode = 0;
    let status: "success" | "runtime_error" | "compile_error" = "success";

    try {
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

