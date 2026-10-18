import { useState, useEffect, useMemo, useRef } from "react";
import { soundEffects } from "../../lib/soundEffects";

export interface CodeTutorStep {
  line: number;
  nextLine?: number;
  explanation: string;
  headline?: string;
  tag?: { label: string; tone: "info" | "success" | "danger" | "warning" };
  variables: Record<string, string | number | boolean>;
  changedVars?: string[];
  heapObjects?: {
    label: string;
    type: "dict" | "set" | "list";
    entries: { key: string | number; value: string | number; isNew?: boolean; isMatch?: boolean }[];
  }[];
  activeLookup?: {
    key: string | number;
    found: boolean;
  };
  returnValue?: string;
  isDone?: boolean;
}

interface CodeTutorVisualizerProps {
  title?: string;
  initialNums?: number[];
  initialTarget?: number;
}

export default function CodeTutorVisualizer({
  title = "Two Sum — One-Pass Hash Map",
  initialNums = [2, 7, 11, 15],
  initialTarget = 9,
}: CodeTutorVisualizerProps) {
  // Input parameters
  const [numsInput, setNumsInput] = useState<string>(initialNums.join(", "));
  const [targetInput, setTargetInput] = useState<number>(initialTarget);
  const [codeLanguage, setCodeLanguage] = useState<"python" | "java">("python");

  // Playback state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1 = 1500ms
  const timerRef = useRef<number | null>(null);

  // Parse input
  const parsedNums = useMemo(() => {
    return numsInput
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n));
  }, [numsInput]);

  // Generate Python Tutor execution trace steps dynamically based on inputs
  const steps: CodeTutorStep[] = useMemo(() => {
    const trace: CodeTutorStep[] = [];
    const nums = parsedNums.length > 0 ? parsedNums : [2, 7, 11, 15];
    const target = targetInput;

    // Step 0: Function call entry
    trace.push({
      line: codeLanguage === "python" ? 1 : 1,
      nextLine: codeLanguage === "python" ? 2 : 2,
      explanation: `Function two_sum called with nums = [${nums.join(", ")}] and target = ${target}. Stack frame initialized.`,
      headline: `two_sum(nums, target = ${target})`,
      tag: { label: "Function Call", tone: "info" },
      variables: {
        nums: `[${nums.join(", ")}]`,
        target,
      },
      changedVars: ["nums", "target"],
      heapObjects: [
        {
          label: codeLanguage === "python" ? "index_of (dict)" : "indexOf (HashMap)",
          type: "dict",
          entries: [],
        },
      ],
    });

    // Step 1: Initialize hash map
    const mapEntries: { key: number; value: number }[] = [];
    trace.push({
      line: codeLanguage === "python" ? 2 : 2,
      nextLine: codeLanguage === "python" ? 3 : 3,
      explanation: `Allocating an empty hash table ${codeLanguage === "python" ? "index_of" : "indexOf"} in heap memory to map values to their indices for O(1) instant lookups.`,
      headline: `${codeLanguage === "python" ? "index_of = {}" : "indexOf = new HashMap<>()"}`,
      tag: { label: "Allocate Map", tone: "info" },
      variables: {
        nums: `[${nums.join(", ")}]`,
        target,
        [codeLanguage === "python" ? "index_of" : "indexOf"]: "{}",
      },
      changedVars: [codeLanguage === "python" ? "index_of" : "indexOf"],
      heapObjects: [
        {
          label: codeLanguage === "python" ? "index_of (dict)" : "indexOf (HashMap)",
          type: "dict",
          entries: [],
        },
      ],
    });

    let foundSolution = false;

    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      const complement = target - num;

      // Iteration header step
      trace.push({
        line: codeLanguage === "python" ? 3 : 3,
        nextLine: codeLanguage === "python" ? 4 : 4,
        explanation: `Loop iteration i = ${i}: inspecting element nums[${i}] = ${num}.`,
        headline: `i = ${i}, num = ${num}`,
        tag: { label: "Loop Step", tone: "info" },
        variables: {
          i,
          num,
          target,
          nums: `[${nums.join(", ")}]`,
        },
        changedVars: ["i", "num"],
        heapObjects: [
          {
            label: codeLanguage === "python" ? "index_of (dict)" : "indexOf (HashMap)",
            type: "dict",
            entries: mapEntries.map((e) => ({ ...e })),
          },
        ],
      });

      // Complement calculation step
      trace.push({
        line: codeLanguage === "python" ? 4 : 4,
        nextLine: codeLanguage === "python" ? 5 : 5,
        explanation: `Calculate needed complement: target - num = ${target} - ${num} = ${complement}.`,
        headline: `complement = ${target} - ${num} = ${complement}`,
        tag: { label: "Compute Difference", tone: "info" },
        variables: {
          i,
          num,
          complement,
          target,
        },
        changedVars: ["complement"],
        heapObjects: [
          {
            label: codeLanguage === "python" ? "index_of (dict)" : "indexOf (HashMap)",
            type: "dict",
            entries: mapEntries.map((e) => ({ ...e })),
          },
        ],
      });

      // Hash lookup check step
      const existingEntry = mapEntries.find((e) => e.key === complement);

      if (existingEntry) {
        // MATCH FOUND!
        trace.push({
          line: codeLanguage === "python" ? 5 : 5,
          nextLine: codeLanguage === "python" ? 6 : 6,
          explanation: `Checking hash table: ${complement} is PRESENT in map at index ${existingEntry.value}! Complement found!`,
          headline: `FOUND! ${num} + ${complement} == ${target}`,
          tag: { label: "Hash Map Hit", tone: "success" },
          variables: {
            i,
            num,
            complement,
            "match index": existingEntry.value,
            target,
          },
          changedVars: ["match index"],
          activeLookup: { key: complement, found: true },
          heapObjects: [
            {
              label: codeLanguage === "python" ? "index_of (dict)" : "indexOf (HashMap)",
              type: "dict",
              entries: mapEntries.map((e) => ({
                ...e,
                isMatch: e.key === complement,
              })),
            },
          ],
        });

        // Return step
        trace.push({
          line: codeLanguage === "python" ? 6 : 6,
          explanation: `Returning pair indices [${existingEntry.value}, ${i}] satisfying nums[${existingEntry.value}] (${complement}) + nums[${i}] (${num}) = ${target}. Execution terminates in O(N) time!`,
          headline: `Return [${existingEntry.value}, ${i}]`,
          tag: { label: "Target Solved", tone: "success" },
          variables: {
            result: `[${existingEntry.value}, ${i}]`,
            sum: `${complement} + ${num} = ${target}`,
          },
          changedVars: ["result"],
          returnValue: `[${existingEntry.value}, ${i}]`,
          isDone: true,
          heapObjects: [
            {
              label: codeLanguage === "python" ? "index_of (dict)" : "indexOf (HashMap)",
              type: "dict",
              entries: mapEntries.map((e) => ({
                ...e,
                isMatch: e.key === complement,
              })),
            },
          ],
        });

        foundSolution = true;
        break;
      } else {
        // MISS — not seen yet
        trace.push({
          line: codeLanguage === "python" ? 5 : 5,
          nextLine: codeLanguage === codeLanguage ? 7 : 8,
          explanation: `Checking hash table: ${complement} is NOT in map yet. Condition is false.`,
          headline: `${complement} in map? NO (Miss)`,
          tag: { label: "Hash Map Miss", tone: "warning" },
          variables: {
            i,
            num,
            complement,
            target,
          },
          activeLookup: { key: complement, found: false },
          heapObjects: [
            {
              label: codeLanguage === "python" ? "index_of (dict)" : "indexOf (HashMap)",
              type: "dict",
              entries: mapEntries.map((e) => ({ ...e })),
            },
          ],
        });

        // Store into map
        mapEntries.push({ key: num, value: i });
        trace.push({
          line: codeLanguage === "python" ? 7 : 8,
          nextLine: codeLanguage === "python" ? 3 : 3,
          explanation: `Record current value: ${codeLanguage === "python" ? "index_of" : "indexOf"}[${num}] = ${i}. Any future number needing ${num} will find index ${i} in O(1).`,
          headline: `Store ${num} → index ${i}`,
          tag: { label: "Map Insertion", tone: "info" },
          variables: {
            i,
            num,
            complement,
            [`map[${num}]`]: i,
          },
          changedVars: [`map[${num}]`],
          heapObjects: [
            {
              label: codeLanguage === "python" ? "index_of (dict)" : "indexOf (HashMap)",
              type: "dict",
              entries: mapEntries.map((e) => ({
                ...e,
                isNew: e.key === num,
              })),
            },
          ],
        });
      }
    }

    if (!foundSolution) {
      trace.push({
        line: codeLanguage === "python" ? 8 : 10,
        explanation: `Array iteration complete. No two numbers sum up to target ${target}. Returning [-1, -1].`,
        headline: `No Solution Found: Return [-1, -1]`,
        tag: { label: "Not Found", tone: "danger" },
        variables: {
          result: "[-1, -1]",
        },
        changedVars: ["result"],
        returnValue: "[-1, -1]",
        isDone: true,
        heapObjects: [
          {
            label: codeLanguage === "python" ? "index_of (dict)" : "indexOf (HashMap)",
            type: "dict",
            entries: mapEntries.map((e) => ({ ...e })),
          },
        ],
      });
    }

    return trace;
  }, [parsedNums, targetInput, codeLanguage]);

  // Code snippets by language
  const pythonCodeLines = [
    "def two_sum(nums, target):",
    "    index_of = {}",
    "    for i, num in enumerate(nums):",
    "        complement = target - num",
    "        if complement in index_of:",
    "            return [index_of[complement], i]",
    "        index_of[num] = i",
    "    return [-1, -1]",
  ];

  const javaCodeLines = [
    "public int[] twoSum(int[] nums, int target) {",
    "    Map<Integer, Integer> indexOf = new HashMap<>();",
    "    for (int i = 0; i < nums.length; i++) {",
    "        int complement = target - nums[i];",
    "        if (indexOf.containsKey(complement)) {",
    "            return new int[]{indexOf.get(complement), i};",
    "        }",
    "        indexOf.put(nums[i], i);",
    "    }",
    "    return new int[]{-1, -1};",
    "}",
  ];

  const activeCodeLines = codeLanguage === "python" ? pythonCodeLines : javaCodeLines;

  // Bound index safely
  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      setCurrentStepIndex(Math.max(0, steps.length - 1));
    }
  }, [steps.length, currentStepIndex]);

  const currentStep = steps[currentStepIndex] || steps[0];

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setTimeout(() => {
        if (currentStepIndex + 1 < steps.length) {
          setCurrentStepIndex((prev) => prev + 1);
          soundEffects.playPop();
        } else {
          setIsPlaying(false);
          soundEffects.playSuccess();
        }
      }, 1500 / playbackSpeed);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed]);

  const handleStepChange = (newIndex: number) => {
    setIsPlaying(false);
    const clamped = Math.max(0, Math.min(steps.length - 1, newIndex));
    setCurrentStepIndex(clamped);
    soundEffects.playPop();
  };

  const togglePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
    soundEffects.playPop();
  };

  return (
    <div className="w-full my-6 bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden text-[#e6edf3]">
      {/* Keynote Animation Styles */}
      <style>{`
        @keyframes keynoteDissolve {
          0% {
            opacity: 0;
            filter: blur(8px);
            transform: translateY(6px) scale(0.97);
          }
          60% {
            opacity: 0.85;
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0) scale(1);
          }
        }

        @keyframes keynoteBadgePulse {
          0% {
            box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7);
            background-color: rgba(56, 189, 248, 0.25);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(56, 189, 248, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
            background-color: transparent;
          }
        }

        @keyframes lineArrowGlide {
          0% { transform: translateX(-4px); opacity: 0.6; }
          50% { transform: translateX(2px); opacity: 1; }
          100% { transform: translateX(-4px); opacity: 0.6; }
        }

        .animate-keynote-dissolve {
          animation: keynoteDissolve 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-badge-pulse {
          animation: keynoteBadgePulse 0.6s ease-out;
        }
      `}</style>

      {/* Top Bar: Python Tutor & Keynote Studio Header */}
      <div className="px-5 py-4 bg-[#161b22] border-b border-[#21262d] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xl">🐍</span>
          <h3 className="font-bold text-base text-white tracking-wide flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Python Tutor + Keynote Dissolve Mode
            </span>
          </h3>
        </div>

        {/* Language selector & Speed controls */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
            <button
              onClick={() => {
                setCodeLanguage("python");
                setCurrentStepIndex(0);
                soundEffects.playPop();
              }}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                codeLanguage === "python"
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-[#8b949e] hover:text-white"
              }`}
            >
              Python
            </button>
            <button
              onClick={() => {
                setCodeLanguage("java");
                setCurrentStepIndex(0);
                soundEffects.playPop();
              }}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                codeLanguage === "java"
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-[#8b949e] hover:text-white"
              }`}
            >
              Java
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0d1117] px-2.5 py-1 rounded-lg border border-[#30363d] text-[#8b949e]">
            <span>Speed:</span>
            {[1, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setPlaybackSpeed(s);
                  soundEffects.playPop();
                }}
                className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                  playbackSpeed === s ? "text-cyan-400 bg-cyan-950/60" : "hover:text-white"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Live Parameters */}
      <div className="px-5 py-3 bg-[#0d1117] border-b border-[#21262d] flex flex-wrap items-center gap-4 text-xs text-[#8b949e]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">Array (nums):</span>
          <input
            type="text"
            value={numsInput}
            onChange={(e) => {
              setNumsInput(e.target.value);
              setCurrentStepIndex(0);
            }}
            className="px-2.5 py-1 bg-[#161b22] border border-[#30363d] rounded-md text-white font-mono text-xs w-44 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">Target Sum:</span>
          <input
            type="number"
            value={targetInput}
            onChange={(e) => {
              setTargetInput(Number(e.target.value));
              setCurrentStepIndex(0);
            }}
            className="px-2.5 py-1 bg-[#161b22] border border-[#30363d] rounded-md text-white font-mono text-xs w-20 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="text-[11px] text-cyan-400/80 italic">
          Try typing numbers like &ldquo;2, 7, 11, 15&rdquo; or &ldquo;3, 2, 4&rdquo; to test dynamic execution traces.
        </div>
      </div>

      {/* Step Player Controls Bar (Python Tutor Style) */}
      <div className="px-5 py-3 bg-[#161b22] border-b border-[#21262d] flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleStepChange(0)}
            disabled={currentStepIndex === 0}
            className="px-2.5 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d] text-xs font-semibold hover:bg-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed text-white"
            title="First Step"
          >
            |◀ First
          </button>
          <button
            onClick={() => handleStepChange(currentStepIndex - 1)}
            disabled={currentStepIndex === 0}
            className="px-3 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d] text-xs font-semibold hover:bg-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed text-white"
            title="Previous Step"
          >
            ◀ Prev
          </button>
          <button
            onClick={togglePlay}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isPlaying
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 hover:bg-cyan-400"
            }`}
          >
            {isPlaying ? "⏸ Pause" : currentStepIndex >= steps.length - 1 ? "🔄 Replay" : "▶ Play"}
          </button>
          <button
            onClick={() => handleStepChange(currentStepIndex + 1)}
            disabled={currentStepIndex >= steps.length - 1}
            className="px-3 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d] text-xs font-semibold hover:bg-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed text-white"
            title="Next Step"
          >
            Next ▶
          </button>
          <button
            onClick={() => handleStepChange(steps.length - 1)}
            disabled={currentStepIndex >= steps.length - 1}
            className="px-2.5 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d] text-xs font-semibold hover:bg-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed text-white"
            title="Last Step"
          >
            Last ▶|
          </button>
        </div>

        {/* Step Progress Display */}
        <div className="flex items-center gap-3 text-xs">
          <span className="font-mono text-cyan-400 font-bold">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <div className="w-32 bg-[#21262d] rounded-full h-2 overflow-hidden">
            <div
              className="bg-cyan-500 h-full transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Python Tutor Stage: Split Code Execution vs Frames & Objects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#21262d]">
        {/* Left: Code Viewer with Active Execution Arrows */}
        <div className="lg:col-span-6 p-4 sm:p-5 bg-[#0d1117] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#21262d] text-xs">
              <span className="font-mono font-semibold text-[#8b949e]">
                {codeLanguage === "python" ? "solution.py" : "Solution.java"}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Line executed
                </span>
                {currentStep.nextLine && (
                  <span className="flex items-center gap-1.5 text-[11px] text-rose-400">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Next line
                  </span>
                )}
              </div>
            </div>

            {/* Code Lines Container */}
            <div className="font-mono text-xs sm:text-[13px] leading-7 space-y-1 relative py-1">
              {activeCodeLines.map((lineText, idx) => {
                const lineNum = idx + 1;
                const isCurrent = currentStep.line === lineNum;
                const isNext = currentStep.nextLine === lineNum;

                let rowBg = "transparent";
                let textCol = "#8b949e";
                let borderMarker = "border-transparent";

                if (isCurrent) {
                  rowBg = "bg-[#1f6feb]/20";
                  textCol = "#f0f6fc font-semibold";
                  borderMarker = "border-emerald-400 bg-emerald-500/10";
                } else if (isNext) {
                  rowBg = "bg-rose-500/10";
                  textCol = "#e6edf3";
                }

                return (
                  <div
                    key={lineNum}
                    className={`flex items-center gap-2.5 px-2 py-0.5 rounded-md border-l-2 transition-all duration-200 ${rowBg} ${borderMarker}`}
                  >
                    {/* Execution Arrow Column (Python Tutor iconic arrow) */}
                    <div className="w-6 flex items-center justify-center font-bold text-sm shrink-0">
                      {isCurrent ? (
                        <span
                          className="text-emerald-400 filter drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                          style={{ animation: "lineArrowGlide 1.2s infinite ease-in-out" }}
                        >
                          ➜
                        </span>
                      ) : isNext ? (
                        <span className="text-rose-400 text-xs">➔</span>
                      ) : (
                        <span className="opacity-0">·</span>
                      )}
                    </div>

                    {/* Line Number */}
                    <span className="w-5 text-right text-[11px] text-[#484f58] select-none font-mono shrink-0">
                      {lineNum}
                    </span>

                    {/* Code Syntax Line */}
                    <pre className={`overflow-x-auto flex-1 font-mono ${textCol}`}>
                      <code>{lineText}</code>
                    </pre>

                    {/* Active Line Status Chip */}
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider shrink-0 hidden sm:inline-block">
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Execution Step Summary Pill */}
          <div className="mt-4 pt-3 border-t border-[#21262d] flex items-center justify-between text-xs text-[#8b949e]">
            <span>Algorithm Pattern: <strong>One-Pass Hashing O(N)</strong></span>
            <span className="font-mono">Time: O(N) · Space: O(N)</span>
          </div>
        </div>

        {/* Right: Frames & Objects (Python Tutor Memory Model) */}
        <div className="lg:col-span-6 p-4 sm:p-5 bg-[#161b22] flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Frames &amp; Objects (Heap Memory)
              </span>
              <span className="text-[11px] text-[#8b949e]">Python Tutor Visualizer</span>
            </div>

            {/* Stack Frame (Local Variables) */}
            <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Stack Frame: <code className="text-cyan-300">two_sum</code>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#21262d] text-[#8b949e] font-mono">
                  Local Scope
                </span>
              </div>

              {/* Variables Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {Object.entries(currentStep.variables).map(([key, val]) => {
                  const isChanged = currentStep.changedVars?.includes(key);

                  return (
                    <div
                      key={`${key}-${val}`}
                      className={`p-2 rounded-lg border border-[#30363d] bg-[#161b22] flex flex-col justify-between ${
                        isChanged ? "animate-badge-pulse border-cyan-500/50" : ""
                      }`}
                    >
                      <span className="text-[11px] text-[#8b949e] font-mono">{key}</span>
                      {/* Keynote dissolve on variable value change */}
                      <span
                        key={String(val)}
                        className="text-xs font-mono font-bold text-cyan-200 truncate mt-0.5 animate-keynote-dissolve"
                      >
                        {String(val)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Heap Objects: Hash Map Inspector */}
            {currentStep.heapObjects?.map((obj) => (
              <div
                key={obj.label}
                className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    Heap Object: <code className="text-purple-300">{obj.label}</code>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#21262d] text-cyan-400 font-mono">
                    {obj.entries.length} {obj.entries.length === 1 ? "entry" : "entries"}
                  </span>
                </div>

                {obj.entries.length === 0 ? (
                  <div className="text-xs text-[#8b949e] italic py-2 text-center">
                    (empty hash map)
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {obj.entries.map((entry) => (
                      <div
                        key={`${entry.key}-${entry.value}`}
                        className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-2 transition-all ${
                          entry.isMatch
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold ring-2 ring-emerald-500/40 animate-keynote-dissolve"
                            : entry.isNew
                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 animate-keynote-dissolve"
                            : "bg-[#161b22] border-[#30363d] text-[#c9d1d9]"
                        }`}
                      >
                        <span className="text-purple-400 font-semibold">{entry.key}</span>
                        <span className="text-[#8b949e]">→</span>
                        <span className="text-cyan-300 font-bold">idx: {entry.value}</span>
                        {entry.isMatch && (
                          <span className="text-[10px] bg-emerald-500 text-black px-1.5 py-0.2 rounded font-sans font-bold">
                            HIT!
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Active lookup feedback banner */}
                {currentStep.activeLookup && (
                  <div
                    key={`lookup-${currentStep.activeLookup.key}-${currentStep.activeLookup.found}`}
                    className={`mt-2 p-2 rounded-lg text-xs font-mono flex items-center justify-between animate-keynote-dissolve border ${
                      currentStep.activeLookup.found
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                        : "bg-amber-950/30 border-amber-500/30 text-amber-300"
                    }`}
                  >
                    <span>Checking key: {currentStep.activeLookup.key}</span>
                    <span className="font-bold">
                      {currentStep.activeLookup.found ? "✓ KEY FOUND (O(1))" : "✗ KEY NOT FOUND"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Keynote Animation Presentation Box (Optical Text Dissolve) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-[#161b22] to-slate-900 border border-cyan-500/30 shadow-lg relative overflow-hidden">
            <div className="text-[11px] font-bold text-cyan-400 flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5">
                <span>✨ Keynote Dissolve Annotation</span>
              </span>
              {currentStep.tag && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    currentStep.tag.tone === "success"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : currentStep.tag.tone === "danger"
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      : currentStep.tag.tone === "warning"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  }`}
                >
                  {currentStep.tag.label}
                </span>
              )}
            </div>

            {/* Headline with Keynote Dissolve Animation */}
            {currentStep.headline && (
              <div
                key={`headline-${currentStepIndex}`}
                className="text-base sm:text-lg font-bold text-white mb-1 animate-keynote-dissolve"
              >
                {currentStep.headline}
              </div>
            )}

            {/* Description Text with Keynote Optical Blur & Dissolve */}
            <p
              key={`desc-${currentStepIndex}`}
              className="text-xs sm:text-sm text-[#c9d1d9] leading-relaxed animate-keynote-dissolve"
            >
              {currentStep.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
