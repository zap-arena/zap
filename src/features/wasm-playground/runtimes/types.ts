export type Language = "python" | "cpp" | "java";

export type ExecutionStatus =
  | "success"
  | "compile_error"
  | "runtime_error"
  | "timeout"
  | "unsupported";

export type ExecutionRequest = {
  language: Language;
  sourceCode: string;
  stdin: string;
  timeoutMs: number;
};

export type ExecutionResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTimeMs: number;
  status: ExecutionStatus;
  diagnosticDetails?: string;
};

export type TestCase = {
  id: string;
  name?: string;
  input: string;
  expectedOutput: string;
  hidden?: boolean;
};

export type TestCaseResult = {
  testCase: TestCase;
  passed: boolean;
  actualOutput: string;
  executionTimeMs: number;
  status: ExecutionStatus;
  errorMessage?: string;
};

export type RuntimeStatusState =
  | "uninitialized"
  | "initializing"
  | "ready"
  | "running"
  | "error";

export interface LanguageRuntime {
  readonly language: Language;
  initialize(): Promise<void>;
  execute(request: ExecutionRequest): Promise<ExecutionResult>;
  terminate(): void;
  getStatus(): RuntimeStatusState;
}
