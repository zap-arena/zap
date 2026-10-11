import type {
  ExecutionRequest,
  ExecutionResult,
  Language,
  LanguageRuntime,
  RuntimeStatusState,
} from "./types";

export class CppRuntime implements LanguageRuntime {
  readonly language: Language = "cpp";
  private worker: Worker | null = null;
  private status: RuntimeStatusState = "uninitialized";
  private currentRequestId = 0;
  private pendingResolvers = new Map<
    number,
    {
      resolve: (result: ExecutionResult) => void;
      reject: (err: any) => void;
      timer: ReturnType<typeof setTimeout>;
    }
  >();

  private createWorker(): Worker {
    const worker = new Worker(
      new URL("../workers/cpp.worker.ts", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = (event: MessageEvent) => {
      const { type, id, result } = event.data;

      if (type === "init_success") {
        this.status = "ready";
      } else if (type === "execute_result") {
        const pending = this.pendingResolvers.get(id);
        if (pending) {
          clearTimeout(pending.timer);
          this.pendingResolvers.delete(id);
          this.status = "ready";
          pending.resolve(result);
        }
      }
    };

    worker.onerror = (err) => {
      console.error("C++ Worker error:", err);
      this.status = "error";
      this.pendingResolvers.forEach(({ resolve, timer }) => {
        clearTimeout(timer);
        resolve({
          stdout: "",
          stderr: "C++ Web Worker terminated unexpectedly or encountered an error.",
          exitCode: 1,
          executionTimeMs: 0,
          status: "runtime_error",
        });
      });
      this.pendingResolvers.clear();
    };

    return worker;
  }

  async initialize(): Promise<void> {
    if (this.status === "ready" && this.worker) {
      return;
    }

    if (this.status === "initializing") {
      while (this.status === "initializing") {
        await new Promise((r) => setTimeout(r, 50));
      }
      return;
    }

    this.status = "initializing";
    if (!this.worker) {
      this.worker = this.createWorker();
    }

    return new Promise((resolve, reject) => {
      const initId = ++this.currentRequestId;
      const timeout = setTimeout(() => {
        this.status = "error";
        reject(new Error("C++ runtime initialization timed out"));
      }, 5000);

      const handler = (e: MessageEvent) => {
        if (e.data.id === initId) {
          clearTimeout(timeout);
          this.worker?.removeEventListener("message", handler);
          if (e.data.type === "init_success") {
            this.status = "ready";
            resolve();
          } else {
            this.status = "error";
            reject(new Error("C++ initialization failed"));
          }
        }
      };

      this.worker?.addEventListener("message", handler);
      this.worker?.postMessage({ type: "init", id: initId });
    });
  }

  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    await this.initialize();

    if (!this.worker) {
      throw new Error("C++ Worker not initialized");
    }

    this.status = "running";
    const reqId = ++this.currentRequestId;
    const timeoutMs = request.timeoutMs || 5000;

    return new Promise<ExecutionResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        // Handle timeout by terminating and recreating worker
        this.terminate();
        this.worker = this.createWorker();
        this.status = "ready";
        this.pendingResolvers.delete(reqId);

        resolve({
          stdout: "",
          stderr: `Time Limit Exceeded: Execution timed out after ${timeoutMs}ms. The process was terminated.`,
          exitCode: 124,
          executionTimeMs: timeoutMs,
          status: "timeout",
        });
      }, timeoutMs);

      this.pendingResolvers.set(reqId, { resolve, reject, timer });

      this.worker?.postMessage({
        type: "execute",
        id: reqId,
        payload: {
          sourceCode: request.sourceCode,
          stdin: request.stdin,
        },
      });
    });
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.status = "uninitialized";
    this.pendingResolvers.forEach(({ timer }) => clearTimeout(timer));
    this.pendingResolvers.clear();
  }

  getStatus(): RuntimeStatusState {
    return this.status;
  }
}

