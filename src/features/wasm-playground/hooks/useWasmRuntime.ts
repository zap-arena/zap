import { useCallback, useEffect, useRef, useState } from "react";
import { CppRuntime } from "../runtimes/CppRuntime";
import { JavaRuntime } from "../runtimes/JavaRuntime";
import { PythonRuntime } from "../runtimes/PythonRuntime";
import type {
  ExecutionRequest,
  ExecutionResult,
  Language,
  LanguageRuntime,
  RuntimeStatusState,
  TestCase,
  TestCaseResult,
} from "../runtimes/types";
import { compareOutputs } from "../utils/compareOutput";

export function useWasmRuntime(initialLanguage: Language = "python") {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [status, setStatus] = useState<RuntimeStatusState>("uninitialized");
  const [isRunning, setIsRunning] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [lastResult, setLastResult] = useState<ExecutionResult | null>(null);
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);

  // Runtime instances cache
  const runtimesRef = useRef<Record<Language, LanguageRuntime>>({
    python: new PythonRuntime(),
    cpp: new CppRuntime(),
    java: new JavaRuntime(),
  });

  const getRuntime = useCallback(
    (lang: Language): LanguageRuntime => {
      return runtimesRef.current[lang];
    },
    []
  );

  // Initialize runtime on language change or on-demand
  const initRuntime = useCallback(
    async (lang: Language) => {
      const rt = getRuntime(lang);
      setStatus("initializing");
      try {
        await rt.initialize();
        setStatus(rt.getStatus());
      } catch (err) {
        setStatus("error");
        console.error(`Failed to initialize ${lang} WASM runtime`, err);
      }
    },
    [getRuntime]
  );

  // Synchronize language state whenever initialLanguage prop changes
  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  // When language changes, update status
  useEffect(() => {
    const currentRt = getRuntime(language);
    setStatus(currentRt.getStatus());
    setLastResult(null);
    setTestResults(null);
  }, [language, getRuntime]);

  // Clean up runtimes on unmount
  useEffect(() => {
    const runtimes = runtimesRef.current;
    return () => {
      Object.values(runtimes).forEach((rt) => rt.terminate());
    };
  }, []);

  // Run single execution with custom stdin
  const executeCode = useCallback(
    async (
      sourceCode: string,
      stdin: string = "",
      timeoutMs: number = 6000,
      overrideLang?: Language
    ): Promise<ExecutionResult> => {
      const targetLang = overrideLang || language;
      const rt = getRuntime(targetLang);
      setIsRunning(true);
      setTestResults(null);

      try {
        const req: ExecutionRequest = {
          language: targetLang,
          sourceCode,
          stdin,
          timeoutMs,
        };
        const result = await rt.execute(req);
        setLastResult(result);
        setStatus(rt.getStatus());
        return result;
      } catch (err: any) {
        const errResult: ExecutionResult = {
          stdout: "",
          stderr: err?.message || String(err),
          exitCode: 1,
          executionTimeMs: 0,
          status: "runtime_error",
        };
        setLastResult(errResult);
        setStatus("error");
        return errResult;
      } finally {
        setIsRunning(false);
      }
    },
    [language, getRuntime]
  );

  // Run multiple test cases sequentially
  const runTests = useCallback(
    async (
      sourceCode: string,
      testCases: TestCase[],
      timeoutMs: number = 6000,
      overrideLang?: Language
    ): Promise<TestCaseResult[]> => {
      const targetLang = overrideLang || language;
      const rt = getRuntime(targetLang);
      setIsTesting(true);
      setIsRunning(true);
      setLastResult(null);

      const results: TestCaseResult[] = [];

      try {
        for (let i = 0; i < testCases.length; i++) {
          const tc = testCases[i];
          const execRes = await rt.execute({
            language: targetLang,
            sourceCode,
            stdin: tc.input,
            timeoutMs,
          });

          // If language is unsupported, stop immediately and report
          if (execRes.status === "unsupported") {
            results.push({
              testCase: tc,
              passed: false,
              actualOutput: "",
              executionTimeMs: 0,
              status: "unsupported",
              errorMessage: execRes.stderr,
            });
            break;
          }

          const isPassed =
            execRes.status === "success" &&
            compareOutputs(execRes.stdout, tc.expectedOutput);

          results.push({
            testCase: tc,
            passed: isPassed,
            actualOutput: execRes.stdout,
            executionTimeMs: execRes.executionTimeMs,
            status: execRes.status,
            errorMessage:
              execRes.status !== "success" ? execRes.stderr : undefined,
          });

          // If compilation or fatal error occurs, stop subsequent test cases
          if (execRes.status === "compile_error") {
            break;
          }
        }

        setTestResults(results);
        return results;
      } finally {
        setIsTesting(false);
        setIsRunning(false);
        setStatus(rt.getStatus());
      }
    },
    [language, getRuntime]
  );

  const terminate = useCallback(() => {
    const rt = getRuntime(language);
    rt.terminate();
    setIsRunning(false);
    setIsTesting(false);
    setStatus("uninitialized");
  }, [language, getRuntime]);

  const resetResults = useCallback(() => {
    setLastResult(null);
    setTestResults(null);
  }, []);

  return {
    language,
    setLanguage,
    status,
    isRunning,
    isTesting,
    lastResult,
    testResults,
    initRuntime,
    executeCode,
    runTests,
    runTestCases: runTests,
    resetResults,
    terminate,
  };
}
